import { NextResponse } from 'next/server';
import { z } from 'zod';

const BodySchema = z.object({ email: z.string().email() });

export async function POST(req: Request) {
  const body = await req.json().catch(() => null);
  const parsed = BodySchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: 'Invalid email' }, { status: 400 });
  }

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
  if (!url || !key) {
    return NextResponse.json({ error: 'Supabase env missing' }, { status: 500 });
  }

  const redirectTo = `${process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000'}/login`;

  const res = await fetch(`${url}/auth/v1/recover`, {
    method: 'POST',
    headers: {
      apikey: key,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email: parsed.data.email, redirect_to: redirectTo }),
  });

  const json = await res.json().catch(() => ({}));
  if (!res.ok) {
    return NextResponse.json({ error: json?.error_description || json?.msg || 'Reset request failed' }, { status: 400 });
  }

  return NextResponse.json({ ok: true, message: 'Password reset email sent if account exists.' });
}
