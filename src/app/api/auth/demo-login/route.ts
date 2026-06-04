import { NextResponse } from 'next/server';
import { z } from 'zod';
import { setAuthIdentityCookie } from '@/lib/auth/session';

const BodySchema = z.object({
  role: z.enum(['creator', 'promoter', 'admin']),
});

export async function POST(req: Request) {
  const nodeEnv: string | undefined = process.env.NODE_ENV;
  if (nodeEnv !== 'development' || process.env.STAGEPASS_DEV_AUTH_BYPASS !== '1') {
    return NextResponse.json({ error: 'Demo login is disabled' }, { status: 404 });
  }

  const body = await req.json().catch(() => null);
  const parsed = BodySchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: 'Invalid role' }, { status: 400 });
  }

  const res = NextResponse.json({ ok: true, role: parsed.data.role });
  res.cookies.set('sp_role', parsed.data.role, {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: 60 * 60 * 24 * 30,
  });
  setAuthIdentityCookie(
    res,
    parsed.data.role === 'promoter'
      ? 'admin@secretsounds.com'
      : parsed.data.role === 'admin'
        ? 'admin@stagepass.app'
        : 'maya@stagepass.app',
  );

  return res;
}
