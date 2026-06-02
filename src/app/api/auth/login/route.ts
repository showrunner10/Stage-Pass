import { NextResponse } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';
import { setAuthCookies, setAuthIdentityCookie, supabaseSignIn, type AppRole } from '@/lib/auth/session';

const BodySchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

function dbRoleToAppRole(role?: string | null): AppRole {
  if (role === 'ADMIN') return 'admin';
  if (role === 'PROMOTER') return 'promoter';
  return 'creator';
}

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => null);
    const parsed = BodySchema.safeParse(body);
    if (!parsed.success) return NextResponse.json({ error: 'Invalid payload' }, { status: 400 });

    const normalizedEmail = parsed.data.email.trim().toLowerCase();
    const auth = await supabaseSignIn(normalizedEmail, parsed.data.password);

    let role: AppRole = 'creator';
    try {
      const user = await prisma.user.findUnique({ where: { email: normalizedEmail }, select: { role: true } });
      role = dbRoleToAppRole(user?.role ?? null);
    } catch {
      role = 'creator';
    }

    const res = NextResponse.json({ ok: true, role });
    setAuthCookies(res, { role, accessToken: auth.access_token });
    setAuthIdentityCookie(res, normalizedEmail);
    return res;
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Login failed';
    return NextResponse.json({ error: message }, { status: 401 });
  }
}
