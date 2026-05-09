import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { normalizeNextPath, oauthCookieConfig } from '@/lib/auth/oauth';
import { setAuthCookies, setAuthIdentityCookie, type AppRole } from '@/lib/auth/session';

function dbRoleToAppRole(role?: string | null): AppRole {
  if (role === 'ADMIN') return 'admin';
  if (role === 'PROMOTER') return 'promoter';
  return 'creator';
}

function deriveProfile(email: string, metadata: Record<string, unknown>) {
  const displayName =
    typeof metadata.full_name === 'string' && metadata.full_name.trim()
      ? metadata.full_name.trim()
      : typeof metadata.name === 'string' && metadata.name.trim()
        ? metadata.name.trim()
        : email.split('@')[0];

  const rawHandle =
    typeof metadata.user_name === 'string' && metadata.user_name.trim()
      ? metadata.user_name.trim()
      : typeof metadata.preferred_username === 'string' && metadata.preferred_username.trim()
        ? metadata.preferred_username.trim()
        : email.split('@')[0];

  const handle = rawHandle
    .toLowerCase()
    .replace(/[^a-z0-9._-]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 40) || `creator-${Date.now()}`;

  return { displayName, handle };
}

function redirectToLogin(appUrl: string, message: string) {
  const loginUrl = new URL('/login', appUrl);
  loginUrl.searchParams.set('error', message);
  return NextResponse.redirect(loginUrl);
}

export async function GET(req: NextRequest, context: { params: Promise<Record<string, string>> }) {
  void context;
  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000';
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const publishableKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

  if (!supabaseUrl || !publishableKey) {
    return redirectToLogin(appUrl, 'Supabase env missing');
  }

  const url = new URL(req.url);
  const authCode = url.searchParams.get('code');
  const oauthError = url.searchParams.get('error_description') ?? url.searchParams.get('error');
  const codeVerifier = req.cookies.get('sp_oauth_verifier')?.value;
  const next = normalizeNextPath(url.searchParams.get('next') ?? req.cookies.get('sp_oauth_next')?.value);

  if (oauthError) {
    return redirectToLogin(appUrl, oauthError);
  }

  if (!authCode || !codeVerifier) {
    return redirectToLogin(appUrl, 'Could not verify the sign-in request. Try again.');
  }

  const tokenRes = await fetch(`${supabaseUrl}/auth/v1/token?grant_type=pkce`, {
    method: 'POST',
    headers: {
      apikey: publishableKey,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      auth_code: authCode,
      code_verifier: codeVerifier,
    }),
  });

  const tokenJson = (await tokenRes.json().catch(() => ({}))) as Record<string, unknown>;
  if (!tokenRes.ok) {
    const message =
      (tokenJson.error_description as string) ||
      (tokenJson.msg as string) ||
      (tokenJson.error as string) ||
      'Could not complete the sign-in.';
    return redirectToLogin(appUrl, message);
  }

  const accessToken = typeof tokenJson.access_token === 'string' ? tokenJson.access_token : null;
  const userJson = (tokenJson.user as Record<string, unknown> | undefined) ?? {};
  const email = typeof userJson.email === 'string' ? userJson.email.toLowerCase() : null;
  const authUserId = typeof userJson.id === 'string' ? userJson.id : null;
  const metadata = (userJson.user_metadata as Record<string, unknown> | undefined) ?? {};

  if (!accessToken || !email || !authUserId) {
    return redirectToLogin(appUrl, 'Google or Apple did not return a complete user profile.');
  }

  let role: AppRole = 'creator';
  try {
    let user = await prisma.user.findUnique({ where: { email }, select: { id: true, role: true } });
    if (!user) {
      const profile = deriveProfile(email, metadata);
      let handle = profile.handle;
      let counter = 1;
      while (await prisma.creatorProfile.findUnique({ where: { handle }, select: { id: true } })) {
        counter += 1;
        handle = `${profile.handle.slice(0, Math.max(1, 40 - String(counter).length - 1))}-${counter}`;
      }

      const createdUser = await prisma.user.create({
        data: {
          clerkId: authUserId,
          email,
          role: 'CREATOR',
        },
        select: { id: true, role: true },
      });

      await prisma.creatorProfile.create({
        data: {
          userId: createdUser.id,
          handle,
          displayName: profile.displayName,
          tier: 'DEFAULT',
        },
      });

      user = createdUser;
    } else {
      await prisma.user.update({
        where: { email },
        data: { clerkId: authUserId },
      }).catch(() => null);

      if (user.role === 'CREATOR') {
        const existingProfile = await prisma.creatorProfile.findUnique({
          where: { userId: user.id },
          select: { id: true },
        });

        if (!existingProfile) {
          const profile = deriveProfile(email, metadata);
          let handle = profile.handle;
          let counter = 1;
          while (await prisma.creatorProfile.findUnique({ where: { handle }, select: { id: true } })) {
            counter += 1;
            handle = `${profile.handle.slice(0, Math.max(1, 40 - String(counter).length - 1))}-${counter}`;
          }

          await prisma.creatorProfile.create({
            data: {
              userId: user.id,
              handle,
              displayName: profile.displayName,
              tier: 'DEFAULT',
            },
          });
        }
      }
    }

    role = dbRoleToAppRole(user.role);
  } catch {
    role = 'creator';
  }

  const destination = role === 'creator' ? (next.startsWith('/admin') ? '/app/dashboard' : next) : (next.startsWith('/app') ? '/admin/dashboard' : next);
  const response = NextResponse.redirect(new URL(destination, appUrl));

  setAuthCookies(response, { role, accessToken });
  setAuthIdentityCookie(response, email);
  response.cookies.set('sp_oauth_verifier', '', { ...oauthCookieConfig, maxAge: 0 });
  response.cookies.set('sp_oauth_next', '', { ...oauthCookieConfig, maxAge: 0 });

  return response;
}
