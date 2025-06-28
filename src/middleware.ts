
import { NextResponse, type NextRequest } from 'next/server';
import { AUTH_COOKIE_NAME, CORS_ALLOWED_ORIGINS } from '@/lib/constants';

export function middleware(request: NextRequest) {
  const token = request.cookies.get(AUTH_COOKIE_NAME);
  const { pathname } = request.nextUrl;

  const isAuthPage = pathname === '/login' || pathname === '/signup';
  const isAppPage = pathname.startsWith('/chat') || pathname === '/';

  if (token) {
    // If logged in, redirect away from auth pages to chat, unless it's a guest
    if (isAuthPage) {
      if (token.value === 'mock_token_guest') {
        return NextResponse.next();
      }
      return NextResponse.redirect(new URL('/chat', request.url));
    }
    // If at root, go to chat
    if (pathname === '/') {
      return NextResponse.redirect(new URL('/chat', request.url));
    }
  } else {
    // Not logged in
    // If trying to access an app page, automatically log in as guest
    if (isAppPage) {
      const response = NextResponse.redirect(new URL('/chat', request.url));
      response.cookies.set(AUTH_COOKIE_NAME, "mock_token_guest", {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          maxAge: 60 * 60 * 24 * 7, // 1 week
          path: "/",
      });
      return response;
    }
    // If on an auth page without a token, allow access.
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/', '/login', '/signup', '/chat/:path*', '/api/:path*'],
};
