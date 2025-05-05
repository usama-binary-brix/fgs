// middleware.ts
import { NextRequest, NextResponse } from 'next/server';
import { RoleBasedRoutes, PublicRoutes } from '@/lib/routes';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Check if the current route is public
  const isPublicRoute = PublicRoutes.some(route =>     
    pathname === route || pathname.startsWith(route)
  );

  // Allow public routes
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api') ||
    pathname.startsWith('/_vercel') ||
    pathname.startsWith('/static') ||
    isPublicRoute
  ) {
    return NextResponse.next();
  }

  // Get auth tokens
  const token = request.cookies.get('token')?.value;
  const role = request.cookies.get('role')?.value;

  // Redirect to login if no token or role
  if (!token || !role) {
    const loginUrl = new URL('/sign-in', request.url);
    loginUrl.searchParams.set('redirect', pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Check if route is allowed for the user's role
  const allowedRoutes = RoleBasedRoutes[role as keyof typeof RoleBasedRoutes] || [];
  
  const isAllowed = allowedRoutes.some(route => 
    pathname === route || pathname.startsWith(route)
  );

  // Redirect to unauthorized if not allowed
  if (!isAllowed) {
    return NextResponse.redirect(new URL('/unauthorized', request.url));
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
     * - public folder
     * - sign-in page
     */
    '/((?!api|_next/static|_next/image|favicon.ico|sign-in|unauthorized).*)',
  ],
};