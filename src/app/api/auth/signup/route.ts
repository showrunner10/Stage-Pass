import { NextResponse } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';
import { accessTokenFromAuthPayload, setAuthCookies, setAuthIdentityCookie, supabaseSignIn, supabaseSignUp, type AppRole } from '@/lib/auth/session';
import { getAppUrl } from '@/lib/server/app-url';
import { isStrongPassword, passwordPolicyMessage } from '@/lib/auth/password-policy';

const BodySchema = z
  .object({
    email: z.string().trim().email('Enter a valid email.'),
    password: z.string().refine(isStrongPassword, passwordPolicyMessage()),
    displayName: z.string().trim().min(2, 'Display name must be at least 2 characters.').max(80),
    handle: z
      .string()
      .trim()
      .min(2, 'Handle must be at least 2 characters.')
      .max(40)
      .regex(/^[a-zA-Z0-9._-]+$/, 'Handle: use letters, numbers, dots, underscores or hyphens only.')
      .optional(),
    accountType: z.enum(['creator', 'promoter']).default('creator'),
    /** Client often sends ""; treat as missing for creators */
    orgName: z.string().max(120).optional(),
  })
  .transform((data) => ({
    ...data,
    orgName: data.orgName?.trim() ? data.orgName.trim() : undefined,
  }))
  .superRefine((data, ctx) => {
    if (data.accountType === 'creator' && (!data.handle || data.handle.length < 2)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Handle is required for creator accounts (min 2 characters).',
        path: ['handle'],
      });
    }
    if (data.accountType === 'promoter' && (!data.orgName || data.orgName.length < 2)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Organisation name is required for promoter accounts (min 2 characters).',
        path: ['orgName'],
      });
    }
  });

function slugify(input: string) {
  return (
    input
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '')
      .slice(0, 60) || `org-${Date.now()}`
  );
}

async function buildUniqueOrgSlug(name: string) {
  const base = slugify(name);
  let slug = base;
  let counter = 1;
  while (await prisma.promoterOrg.findUnique({ where: { slug }, select: { id: true } }).catch(() => null)) {
    counter += 1;
    slug = `${base.slice(0, Math.max(1, 60 - String(counter).length - 1))}-${counter}`;
  }
  return slug;
}

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => null);
    const parsed = BodySchema.safeParse(body);
    if (!parsed.success) {
      const first = parsed.error.issues[0]?.message ?? 'Check the form and try again.';
      return NextResponse.json({ error: first }, { status: 400 });
    }

    const { email, password, displayName, handle, accountType, orgName } = parsed.data;
    const normalizedEmail = email.toLowerCase();
    const normalizedHandle = handle ? handle.toLowerCase() : undefined;
    const appUrl = getAppUrl(req);

    if (accountType === 'creator') {
      const existingHandle = await prisma.creatorProfile.findUnique({
        where: { handle: normalizedHandle! },
        select: { id: true },
      }).catch(() => null);
      if (existingHandle) {
        return NextResponse.json({ error: 'This handle is already taken. Try another one.' }, { status: 409 });
      }
    }

    const auth = await supabaseSignUp(normalizedEmail, password, {
      emailRedirectTo: `${appUrl}/login?mode=signin`,
      data: {
        display_name: displayName,
        handle: normalizedHandle,
        account_type: accountType,
      },
    });
    let accessToken = accessTokenFromAuthPayload(auth as Record<string, unknown>);
    if (!accessToken) {
      try {
        const signedIn = await supabaseSignIn(normalizedEmail, password);
        accessToken = signedIn.access_token;
      } catch {
        /* e.g. email confirmation required before first sign-in */
      }
    }

    // Best-effort app DB registration. If DB isn't ready, auth login still works.
    try {
      const targetRole = accountType === 'promoter' ? 'PROMOTER' : 'CREATOR';
      const existing = await prisma.user.findUnique({ where: { email: normalizedEmail }, select: { id: true, role: true } });
      if (existing && existing.role !== targetRole) {
        return NextResponse.json(
          { error: `This email already belongs to a ${existing.role.toLowerCase()} account. Sign in with that account instead.` },
          { status: 409 }
        );
      }

      let userId = existing?.id;
      if (!userId) {
        const created = await prisma.user.create({
          data: {
            clerkId: auth.user?.id ?? `supabase_${normalizedHandle ?? slugify(displayName)}_${Date.now()}`,
            email: normalizedEmail,
            role: targetRole,
          },
          select: { id: true },
        });
        userId = created.id;
      }

      if (accountType === 'creator') {
        await prisma.creatorProfile.upsert({
          where: { handle: normalizedHandle! },
          update: { displayName },
          create: {
            userId: userId!,
            handle: normalizedHandle!,
            displayName,
            tier: 'DEFAULT',
          },
        });
      } else {
        const orgDisplayName = orgName ?? `${displayName} Events`;
        const org = await prisma.promoterOrg.create({
          data: {
            name: orgDisplayName,
            slug: await buildUniqueOrgSlug(orgDisplayName),
            createdById: userId!,
          },
          select: { id: true },
        });

        await prisma.promoterOrgMember.upsert({
          where: { orgId_userId: { orgId: org.id, userId: userId! } },
          create: { orgId: org.id, userId: userId!, role: 'OWNER' },
          update: { role: 'OWNER' },
        });

        await prisma.campaignDraft.upsert({
          where: { sessionKey: `promoter_onboarding:${userId}` },
          create: {
            sessionKey: `promoter_onboarding:${userId}`,
            creatorId: userId!,
            data: {
              email: normalizedEmail,
              displayName,
              orgName: orgDisplayName,
              status: 'CREATED',
              createdAt: new Date().toISOString(),
            },
          },
          update: {
            data: {
              email: normalizedEmail,
              displayName,
              orgName: orgDisplayName,
              status: 'CREATED',
              createdAt: new Date().toISOString(),
            },
          },
        });
      }
    } catch {
      // ignore db errors for now
    }

    const sessionEstablished = Boolean(accessToken);
    const responseRole = accountType as AppRole;
    const res = NextResponse.json({
      ok: true,
      role: responseRole,
      sessionEstablished,
      ...(sessionEstablished
        ? {}
        : {
            message:
              'Account created. Check your email for a confirmation link, then sign in below.',
          }),
    });
    if (accessToken) {
      setAuthCookies(res, { role: responseRole, accessToken });
      setAuthIdentityCookie(res, normalizedEmail);
    }
    return res;
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Signup failed';
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
