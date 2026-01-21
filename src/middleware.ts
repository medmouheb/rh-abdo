import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Public routes that don't require authentication
  const publicRoutes = ['/auth/sign-in', '/auth/sign-up'];
  const isPublicRoute = publicRoutes.some(route => pathname.startsWith(route));

  // Check for accessToken cookie (set by backend)
  const accessToken = request.cookies.get('accessToken');

  // If trying to access protected route without token, redirect to sign-in
  if (!isPublicRoute && !accessToken) {
    const signInUrl = new URL('/auth/sign-in', request.url);
    return NextResponse.redirect(signInUrl);
  }

  // If authenticated and trying to access sign-in, redirect to dashboard
  if (isPublicRoute && accessToken && pathname === '/auth/sign-in') {
    const dashboardUrl = new URL('/', request.url);
    return NextResponse.redirect(dashboardUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
};
