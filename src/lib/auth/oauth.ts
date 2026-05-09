import { createHash, randomBytes } from 'node:crypto';

const OAUTH_COOKIE_MAX_AGE_SECONDS = 60 * 10;

export const oauthCookieConfig = {
  httpOnly: true,
  sameSite: 'lax' as const,
  secure: process.env.NODE_ENV === 'production',
  path: '/',
  maxAge: OAUTH_COOKIE_MAX_AGE_SECONDS,
};

export function toBase64Url(input: Buffer | string) {
  const buffer = typeof input === 'string' ? Buffer.from(input) : input;
  return buffer
    .toString('base64')
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/g, '');
}

export function createPkceVerifier() {
  return toBase64Url(randomBytes(48));
}

export function createPkceChallenge(verifier: string) {
  return toBase64Url(createHash('sha256').update(verifier).digest());
}

export function normalizeNextPath(next: string | null | undefined) {
  if (!next || !next.startsWith('/')) return '/app/dashboard';
  if (next.startsWith('//')) return '/app/dashboard';
  return next;
}
