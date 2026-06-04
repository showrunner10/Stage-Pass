import { NextResponse } from 'next/server';
import { z } from 'zod';
import { setAuthCookies, setAuthIdentityCookie } from '@/lib/auth/session';

const BodySchema = z.object({
  role: z.enum(['creator', 'promoter', 'admin']),
});

export async function POST(req: Request) {
  if (process.env.STAGEPASS_DISABLE_DEMO_LOGIN === '1') {
    return NextResponse.json({ error: 'Demo login is disabled' }, { status: 404 });
  }

  const body = await req.json().catch(() => null);
  const parsed = BodySchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: 'Invalid role' }, { status: 400 });
  }

  const res = NextResponse.json({ ok: true, role: parsed.data.role });
  setAuthCookies(res, {
    role: parsed.data.role,
    accessToken: `demo_${parsed.data.role}_${Date.now()}`,
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
