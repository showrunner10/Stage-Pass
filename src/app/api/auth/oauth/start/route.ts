import { NextRequest, NextResponse } from 'next/server';
import { createPkceChallenge, createPkceVerifier, normalizeNextPath, oauthCookieConfig } from '@/lib/auth/oauth';

const allowedProviders = new Set(['google', 'apple']);

export async function GET(req: NextRequest, context: { params: Promise<Record<string, string>> }) {
  void context;
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000';
  if (!url) {
    return NextResponse.json({ error: 'Supabase URL missing' }, { status: 500 });
  }

  const requestUrl = new URL(req.url);
  const provider = (requestUrl.searchParams.get('provider') ?? '').toLowerCase();
  const next = normalizeNextPath(requestUrl.searchParams.get('next'));

  if (!allowedProviders.has(provider)) {
    return NextResponse.json({ error: 'Unsupported provider' }, { status: 400 });
  }

  const codeVerifier = createPkceVerifier();
  const codeChallenge = createPkceChallenge(codeVerifier);

  const redirectTo = new URL('/api/auth/oauth/callback', appUrl);
  redirectTo.searchParams.set('next', next);

  const authUrl = new URL('/auth/v1/authorize', url);
  authUrl.searchParams.set('provider', provider);
  authUrl.searchParams.set('redirect_to', redirectTo.toString());
  authUrl.searchParams.set('code_challenge', codeChallenge);
  authUrl.searchParams.set('code_challenge_method', 's256');

  if (provider === 'google') {
    authUrl.searchParams.set('access_type', 'offline');
    authUrl.searchParams.set('prompt', 'select_account');
  }

  const response = NextResponse.redirect(authUrl.toString());
  response.cookies.set('sp_oauth_verifier', codeVerifier, oauthCookieConfig);
  response.cookies.set('sp_oauth_next', next, oauthCookieConfig);
  return response;
}
