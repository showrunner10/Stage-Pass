import { NextResponse } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';
import { accessTokenFromAuthPayload, setAuthCookies, supabaseSignIn, supabaseSignUp } from '@/lib/auth/session';

const BodySchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  displayName: z.string().min(2).max(80),
  handle: z.string().min(2).max(40).regex(/^[a-zA-Z0-9._-]+$/),
  accountType: z.enum(['creator', 'promoter']).default('creator'),
  orgName: z.string().min(2).max(120).optional(),
});

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => null);
    const parsed = BodySchema.safeParse(body);
    if (!parsed.success) return NextResponse.json({ error: 'Invalid payload' }, { status: 400 });

    const { email, password, displayName, handle, accountType, orgName } = parsed.data;
    const auth = await supabaseSignUp(email, password);
    let accessToken = accessTokenFromAuthPayload(auth as Record<string, unknown>);
    if (!accessToken) {
      try {
        const signedIn = await supabaseSignIn(email, password);
        accessToken = signedIn.access_token;
      } catch {
        /* e.g. email confirmation required before first sign-in */
      }
    }

    // Best-effort app DB registration. If DB isn't ready, auth login still works.
    try {
      const existing = await prisma.user.findUnique({ where: { email }, select: { id: true } });
      let userId = existing?.id;
      if (!userId) {
        const created = await prisma.user.create({
          data: {
            clerkId: `supabase_${auth.user?.id ?? handle}_${Date.now()}`,
            email,
            role: 'CREATOR',
          },
          select: { id: true },
        });
        userId = created.id;
      }

      await prisma.creatorProfile.upsert({
        where: { handle },
        update: { displayName },
        create: {
          userId: userId!,
          handle,
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
              email,
              displayName,
              requestedRole: 'PROMOTER',
              orgName: orgName ?? `${displayName} Events`,
              status: 'PENDING',
              requestedAt: new Date().toISOString(),
            },
          },
          update: {
            data: {
              email,
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
    if (accessToken) setAuthCookies(res, { role: 'creator', accessToken });
    return res;
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Signup failed';
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
