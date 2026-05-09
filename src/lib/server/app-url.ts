import { NextRequest } from 'next/server';

export function getAppUrl(req?: Request | NextRequest) {
  const configured = process.env.NEXT_PUBLIC_APP_URL?.trim();
  if (configured && !configured.includes('localhost')) {
    return configured.replace(/\/+$/, '');
  }

  if (req) {
    const url = new URL(req.url);
    const forwardedProto =
      req instanceof NextRequest ? req.headers.get('x-forwarded-proto') : null;
    const forwardedHost =
      req instanceof NextRequest ? req.headers.get('x-forwarded-host') : null;

    if (forwardedHost) {
      return `${forwardedProto ?? url.protocol.replace(':', '')}://${forwardedHost}`.replace(/\/+$/, '');
    }

    return `${url.protocol}//${url.host}`.replace(/\/+$/, '');
  }

  return configured?.replace(/\/+$/, '') ?? 'http://localhost:3000';
}
