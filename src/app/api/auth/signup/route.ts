import { NextResponse } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';
import { accessTokenFromAuthPayload, setAuthCookies, setAuthIdentityCookie, supabaseSignIn, supabaseSignUp } from '@/lib/auth/session';
import { getAppUrl } from '@/lib/server/app-url';

const BodySchema = z
  .object({
    email: z.string().trim().email('Enter a valid email.'),
    password: z.string().min(6, 'Password must be at least 6 characters.'),
    displayName: z.string().trim().min(2, 'Display name must be at least 2 characters.').max(80),
    handle: z
      .string()
      .trim()
      .min(2, 'Handle must be at least 2 characters.')
      .max(40)
      .regex(/^[a-zA-Z0-9._-]+$/, 'Handle: use letters, numbers, dots, underscores or hyphens only.'),
    accountType: z.enum(['creator', 'promoter']).default('creator'),
    /** Client often sends ""; treat as missing for creators */
    orgName: z.string().max(120).optional(),
  })
  .transform((data) => ({
    ...data,
    orgName: data.orgName?.trim() ? data.orgName.trim() : undefined,
  }))
  .superRefine((data, ctx) => {
    if (data.accountType === 'promoter' && (!data.orgName || data.orgName.length < 2)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Organisation name is required for promoter accounts (min 2 characters).',
        path: ['orgName'],
      });
    }
  });

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
    const normalizedHandle = handle.toLowerCase();
    const appUrl = getAppUrl(req);

    const existingHandle = await prisma.creatorProfile.findUnique({
      where: { handle: normalizedHandle },
      select: { id: true },
    }).catch(() => null);
    if (existingHandle) {
      return NextResponse.json({ error: 'This handle is already taken. Try another one.' }, { status: 409 });
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
      const existing = await prisma.user.findUnique({ where: { email: normalizedEmail }, select: { id: true } });
      let userId = existing?.id;
      if (!userId) {
        const created = await prisma.user.create({
          data: {
            clerkId: auth.user?.id ?? `supabase_${normalizedHandle}_${Date.now()}`,
            email: normalizedEmail,
            role: 'CREATOR',
          },
          select: { id: true },
        });
        userId = created.id;
      }

      await prisma.creatorProfile.upsert({
        where: { handle: normalizedHandle },
        update: { displayName },
        create: {
          userId: userId!,
          handle: normalizedHandle,
          displayName,
          tier: 'DEFAULT',
        },
      });

      if (accountType === 'promoter') {
        await prisma.campaignDraft.upsert({
          where: { sessionKey: `promoter_request:${userId}` },
          create: {
            sessionKey: `promoter_request:${userId}`,
            creatorId: userId,
            data: {
              email: normalizedEmail,
              displayName,
              requestedRole: 'PROMOTER',
              orgName: orgName ?? `${displayName} Events`,
              status: 'PENDING',
              requestedAt: new Date().toISOString(),
            },
          },
          update: {
            data: {
              email: normalizedEmail,
              displayName,
              requestedRole: 'PROMOTER',
              orgName: orgName ?? `${displayName} Events`,
              status: 'PENDING',
              requestedAt: new Date().toISOString(),
            },
          },
        });
      }
    } catch {
      // ignore db errors for now
    }

    const sessionEstablished = Boolean(accessToken);
    const res = NextResponse.json({
      ok: true,
      role: 'creator' as const,
      sessionEstablished,
      ...(sessionEstablished
        ? {}
        : {
            message:
              'Account created. If email confirmation is on in Supabase, open the link in your email, then sign in below.',
          }),
    });
    if (accessToken) {
      setAuthCookies(res, { role: 'creator', accessToken });
      setAuthIdentityCookie(res, normalizedEmail);
    }
    return res;
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Signup failed';
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
