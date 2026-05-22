import { NextResponse } from 'next/server';

import { requireSupabaseAuthEnv } from '@/lib/server/supabase-env';

export type AppRole = 'creator' | 'promoter' | 'admin';

/** Supabase Auth may return access_token at root or under `session`. */
export function accessTokenFromAuthPayload(auth: Record<string, unknown>): string | undefined {
  const top = auth.access_token;
  if (typeof top === 'string' && top.length > 0) return top;
  const session = auth.session as { access_token?: string } | undefined;
  if (typeof session?.access_token === 'string' && session.access_token.length > 0) {
    return session.access_token;
  }
  return undefined;
}

export function setAuthCookies(res: NextResponse, params: { role: AppRole; accessToken: string }) {
  const base = {
    httpOnly: true,
    sameSite: 'lax' as const,
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: 60 * 60 * 24 * 7,
  };

  res.cookies.set('sp_role', params.role, base);
  res.cookies.set('sp_access_token', params.accessToken, base);
}

export function setAuthIdentityCookie(res: NextResponse, email: string) {
  const normalizedEmail = email.trim().toLowerCase();
  if (!normalizedEmail) return;

  res.cookies.set('sp_email', normalizedEmail, {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: 60 * 60 * 24 * 7,
  });
}

export function clearAuthCookies(res: NextResponse) {
  const base = {
    httpOnly: true,
    sameSite: 'lax' as const,
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: 0,
  };
  res.cookies.set('sp_role', '', base);
  res.cookies.set('sp_access_token', '', base);
  res.cookies.set('sp_email', '', base);
}

export async function supabaseSignIn(email: string, password: string) {
  const { url, key } = requireSupabaseAuthEnv();

  const res = await fetch(`${url}/auth/v1/token?grant_type=password`, {
    method: 'POST',
    headers: {
      apikey: key,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email, password }),
  });

  const json = (await res.json().catch(() => ({}))) as Record<string, unknown>;
  if (!res.ok) {
    throw new Error(
      (json.error_description as string) || (json.msg as string) || (json.error as string) || 'Invalid credentials',
    );
  }

  const access_token = accessTokenFromAuthPayload(json);
  if (!access_token) throw new Error('No access token returned');

  return { access_token, user: json.user as { email?: string } | undefined };
}

export async function supabaseSignUp(
  email: string,
  password: string,
  options?: {
    emailRedirectTo?: string;
    data?: Record<string, unknown>;
  },
) {
  const { url, key } = requireSupabaseAuthEnv();

  const res = await fetch(`${url}/auth/v1/signup`, {
    method: 'POST',
    headers: {
      apikey: key,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      email,
      password,
      ...(options?.emailRedirectTo ? { email_redirect_to: options.emailRedirectTo } : {}),
      ...(options?.data ? { data: options.data } : {}),
    }),
  });

  const json = (await res.json().catch(() => ({}))) as Record<string, unknown>;
  if (!res.ok) {
    throw new Error(
      (json.error_description as string) || (json.msg as string) || (json.error as string) || 'Signup failed',
    );
  }

  return json as { access_token?: string; user?: { email?: string; id?: string }; session?: { access_token?: string } };
}
