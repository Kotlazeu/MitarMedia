
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const isAuthenticated = request.cookies.get('admin-auth')?.value === 'true';

  // Allow access to the login page regardless of authentication status
  if (pathname.startsWith('/admin/login')) {
    return NextResponse.next();
  }

  // If trying to access any other admin page
  if (pathname.startsWith('/admin')) {
    if (!isAuthenticated) {
      // Not authenticated, redirect to login
      return NextResponse.redirect(new URL('/admin/login', request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: '/admin/:path*',
}
