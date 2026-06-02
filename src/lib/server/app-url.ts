import { NextRequest } from 'next/server';

function normalizeUrl(value: string) {
  return value.trim().replace(/\/+$/, '');
}

function isLocalUrl(value: string) {
  return /(^|\/\/)(localhost|127\.0\.0\.1)(:|\/|$)/i.test(value);
}

export function getAppUrl(req?: Request | NextRequest) {
  if (req) {
    const url = new URL(req.url);
    const forwardedProto = req.headers.get('x-forwarded-proto');
    const forwardedHost = req.headers.get('x-forwarded-host') ?? req.headers.get('host');

    if (forwardedHost && !isLocalUrl(forwardedHost)) {
      return normalizeUrl(`${forwardedProto ?? url.protocol.replace(':', '')}://${forwardedHost}`);
    }

    return normalizeUrl(`${url.protocol}//${url.host}`);
  }

  const configured = [
    process.env.NEXT_PUBLIC_APP_URL,
    process.env.NEXT_PUBLIC_SITE_URL,
    process.env.APP_URL,
    process.env.SITE_URL,
  ].find((value) => value?.trim());

  if (configured && !isLocalUrl(configured)) {
    return normalizeUrl(configured);
  }

  if (process.env.VERCEL_URL?.trim()) {
    return normalizeUrl(`https://${process.env.VERCEL_URL}`);
  }

  return configured ? normalizeUrl(configured) : 'http://localhost:3000';
}
