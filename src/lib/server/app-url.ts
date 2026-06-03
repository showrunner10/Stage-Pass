import { NextRequest } from 'next/server';

function normalizeUrl(value: string) {
  return value.trim().replace(/\/+$/, '');
}

function isLocalUrl(value: string) {
  return /(^|\/\/)(localhost|127\.0\.0\.1)(:|\/|$)/i.test(value);
}

function getConfiguredAppUrl() {
  return [
    process.env.NEXT_PUBLIC_APP_URL,
    process.env.NEXT_PUBLIC_SITE_URL,
    process.env.APP_URL,
    process.env.SITE_URL,
  ].find((value) => value?.trim());
}

function getVercelAppUrl() {
  const vercelHost = process.env.VERCEL_PROJECT_PRODUCTION_URL ?? process.env.VERCEL_URL;
  return vercelHost?.trim() ? `https://${vercelHost}` : null;
}

export function getAppUrl(req?: Request | NextRequest) {
  const configured = getConfiguredAppUrl();
  const vercelAppUrl = getVercelAppUrl();

  if (req) {
    const url = new URL(req.url);
    const forwardedProto = req.headers.get('x-forwarded-proto');
    const forwardedHost = req.headers.get('x-forwarded-host') ?? req.headers.get('host');

    if (forwardedHost && !isLocalUrl(forwardedHost)) {
      return normalizeUrl(`${forwardedProto ?? url.protocol.replace(':', '')}://${forwardedHost}`);
    }

    if (isLocalUrl(url.host) && vercelAppUrl) {
      return normalizeUrl(vercelAppUrl);
    }

    return normalizeUrl(`${url.protocol}//${url.host}`);
  }

  if (configured && !isLocalUrl(configured)) {
    return normalizeUrl(configured);
  }

  if (vercelAppUrl) {
    return normalizeUrl(vercelAppUrl);
  }

  return configured ? normalizeUrl(configured) : 'http://localhost:3000';
}
