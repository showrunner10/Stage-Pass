import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

function isAllowedForApp(role: string | undefined) {
  return role === 'creator' || role === 'admin' || role === 'promoter';
}

function isAllowedForAdmin(role: string | undefined) {
  return role === 'promoter' || role === 'admin';
}

export function middleware(req: NextRequest) {
  const { pathname, search } = req.nextUrl;
  const devAuthBypass =
    process.env.STAGEPASS_DEV_AUTH_BYPASS === '1' && process.env.NODE_ENV === 'development';

  const roleCookie = req.cookies.get('sp_role')?.value;
  const token = req.cookies.get('sp_access_token')?.value;
  const effectiveRole = roleCookie ?? (devAuthBypass ? 'creator' : undefined);
  const isAuthed = devAuthBypass ? Boolean(effectiveRole) : Boolean(roleCookie && token);

  if (pathname.startsWith('/app')) {
    if (!isAuthed || !isAllowedForApp(effectiveRole)) {
      const url = new URL(`/login?next=${encodeURIComponent(pathname + search)}`, req.url);
      return NextResponse.redirect(url);
    }
  }

  if (pathname.startsWith('/admin')) {
    if (!isAuthed || !isAllowedForAdmin(effectiveRole)) {
      const url = new URL(`/login?next=${encodeURIComponent(pathname + search)}`, req.url);
      return NextResponse.redirect(url);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/app/:path*', '/admin/:path*'],
};
