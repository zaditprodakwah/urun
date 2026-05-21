import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function proxy(req: NextRequest) {
  const path = req.nextUrl.pathname;

  // Define route rules
  const isProtectedRoute = 
    path.startsWith('/multisig') || 
    path.startsWith('/admin') || 
    path.startsWith('/dashboard') ||
    path.startsWith('/api/admin') ||
    path.startsWith('/api/profile');

  const isAuthPage = path.startsWith('/login');

  // Read URUN session cookie
  const token = req.cookies.get('urun_session')?.value;

  if (isProtectedRoute && !token) {
    console.log(`🔒 Middleware Blocked: Unauthenticated user tried to access ${path}`);
    const loginUrl = new URL('/login', req.url);
    loginUrl.searchParams.set('redirect', path);
    return NextResponse.redirect(loginUrl);
  }

  if (isAuthPage && token) {
    console.log(`🔓 Middleware Redirect: Already logged in, redirecting to dashboard`);
    return NextResponse.redirect(new URL('/dashboard', req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/multisig/:path*',
    '/admin/:path*',
    '/dashboard/:path*',
    '/login',
    '/api/admin/:path*',
    '/api/profile/:path*',
  ],
};
