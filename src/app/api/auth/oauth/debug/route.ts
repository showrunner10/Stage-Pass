import { NextRequest, NextResponse } from 'next/server';
import { getAppUrl } from '@/lib/server/app-url';

export function GET(req: NextRequest) {
  const appUrl = getAppUrl(req);
  const callbackUrl = new URL('/api/auth/oauth/callback', appUrl);
  callbackUrl.searchParams.set('next', '/app/dashboard');

  return NextResponse.json({
    appUrl,
    callbackUrl: callbackUrl.toString(),
    requestUrl: req.url,
    forwardedHost: req.headers.get('x-forwarded-host'),
    host: req.headers.get('host'),
    vercelUrl: process.env.VERCEL_URL ?? null,
    vercelProjectProductionUrl: process.env.VERCEL_PROJECT_PRODUCTION_URL ?? null,
  });
}
