// import { NextResponse } from 'next/server'
// import type { NextRequest } from 'next/server'

// // List of protected routes
// const protectedRoutes = ['/dashboard', '/profile', '/admin']

// export function middleware(request: NextRequest) {
//   const { pathname } = request.nextUrl

//   // If the route is protected
//   if (protectedRoutes.includes(pathname)) {
//     const token = request.cookies.get('token')?.value

//     // If no token, redirect to login
//     if (!token) {
//       const loginUrl = new URL('/dashboard', request.url)
//       return NextResponse.redirect(loginUrl)
//     }
//   }

//   // Continue to the requested route
//   return NextResponse.next()
// }

import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// ---- Your Config ----

export const PublicRoutes = [
  '/signin',
  '/forget-password',
  '/reset-password',
  '/'
]

export const RoleBasedRoutes = {
  super_admin: [
    '/dashboard',
    '/dashboard/leads',
    '/dashboard/accounts',
    '/dashboard/inventory',
    '/dashboard/admin-notifications'
  ],
  admin: [
    '/dashboard',
    '/dashboard/leads',
    '/dashboard/accounts',
    '/dashboard/inventory',
    '/dashboard/admin-notifications'
  ],
  investor: [
    '/investor-dashboard',
    '/investor-dashboard/investment-opportunities',
    '/investor-dashboard/my-investment'
  ],
  salesperson: [
    '/sales-dashboard',
    '/sales-dashboard/leads'
  ],
  broker: [
    '/broker-dashboard',
    '/broker-dashboard/shipments-opportunities'
  ],
  employee: [
    '/employee-dashboard',
    '/employee-dashboard/inventory-tasks'
  ]
}

const isRouteAllowed = (path: string, role: string) => {
  const allowedRoutes = RoleBasedRoutes[role as keyof typeof RoleBasedRoutes] || []
  return allowedRoutes.some(route => path === route || path.startsWith(route))
}

// ---- Middleware Logic ----

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Allow public routes
  if (PublicRoutes.includes(pathname)) {
    return NextResponse.next()
  }

  const token = request.cookies.get('accessToken')?.value
  const role = request.cookies.get('role')?.value // Assume role is stored in cookies

  // If no token or role => redirect to sign-in
  if (!token || !role) {
    return NextResponse.redirect(new URL('/signin', request.url))
  }

  // Check if user is allowed on this route
  if (!isRouteAllowed(pathname, role)) {
    return NextResponse.redirect(new URL('/', request.url)) // Create this page if not already
  }

  return NextResponse.next()
}

// ---- Optional: Matcher ----

export const config = {
  matcher: [
    /*
      Apply middleware to all routes except _next, static assets, and APIs
    */
    '/((?!_next/static|_next/image|favicon.ico|api).*)'
  ]
}
