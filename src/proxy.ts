import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { decryptSession } from './lib/auth';

export async function proxy(req: NextRequest) {
  const path = req.nextUrl.pathname;

  // Define route rules
  const isProtectedRoute = 
    path.startsWith('/multisig') || 
    path.startsWith('/admin') || 
    path.startsWith('/dashboard') ||
    path.startsWith('/api/admin') ||
    path.startsWith('/api/profile');

  const isAuthPage = path.startsWith('/login');

  // Read URUN session cookie and decrypt it
  const token = req.cookies.get('urun_session')?.value;
  const session = token ? await decryptSession(token) : null;

  if (isProtectedRoute && !session) {
    console.log(`🔒 Middleware Blocked: Unauthenticated user tried to access ${path}`);
    const loginUrl = new URL('/login', req.url);
    loginUrl.searchParams.set('redirect', path);
    
    const response = NextResponse.redirect(loginUrl);
    // Delete forged/invalid cookie
    if (token) {
      response.cookies.delete('urun_session');
    }
    return response;
  }

  if (isAuthPage && session) {
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
