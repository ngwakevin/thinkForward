import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { isEnabled } from './lib/flags';

// Minimal auth gate scaffold. Will be extended once MSAL integration is active.
const PROTECTED_PREFIXES = ['/protected'];

export function middleware(req: NextRequest) {
  if (!isEnabled('authMsal')) return NextResponse.next();

  const { pathname } = req.nextUrl;
  if (PROTECTED_PREFIXES.some(p => pathname.startsWith(p))) {
    // Placeholder: in future verify ID token / session cookie.
    const hasSessionCookie = req.cookies.has('id_token');
    if (!hasSessionCookie) {
      const login = new URL('/auth/signin', req.url);
      login.searchParams.set('redirect', pathname);
      return NextResponse.redirect(login);
    }
  }
  return NextResponse.next();
}

// Route matcher – extend as additional protected surfaces emerge.
export const config = { matcher: ['/protected/:path*'] };
