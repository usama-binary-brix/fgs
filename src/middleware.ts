

// import { NextResponse } from 'next/server'
// import type { NextRequest } from 'next/server'

// export const PublicRoutes = [
//   '/signin',
//   '/forget-password',
//   '/reset-password',
//   '/'
// ]

// export const RoleBasedRoutes = {
//   super_admin: [
//     '/dashboard',
//     '/dashboard/leads',
//     '/dashboard/accounts',
//     '/dashboard/inventory',
//     '/dashboard/admin-notifications'
//   ],
//   admin: [
//     '/dashboard',
//     '/dashboard/leads',
//     '/dashboard/accounts',
//     '/dashboard/inventory',
//     '/dashboard/admin-notifications'
//   ],
//   investor: [
//     '/investor-dashboard',
//     '/investor-dashboard/investment-opportunities',
//     '/investor-dashboard/my-investment'
//   ],
//   salesperson: [
//     '/sales-dashboard',
//     '/sales-dashboard/leads'
//   ],
//   broker: [
//     '/broker-dashboard',
//     '/broker-dashboard/shipments-opportunities'
//   ],
//   employee: [
//     '/employee-dashboard',
//     '/employee-dashboard/inventory-tasks'
//   ]
// }

// const isRouteAllowed = (path: string, role: string) => {
//   const allowedRoutes = RoleBasedRoutes[role as keyof typeof RoleBasedRoutes] || []
//   return allowedRoutes.some(route => path === route || path.startsWith(route))
// }

// export function middleware(request: NextRequest) {
//   const { pathname } = request.nextUrl

//   if (PublicRoutes.includes(pathname)) {
//     return NextResponse.next()
//   }

//   const token = request.cookies.get('accessToken')?.value
//   const role = request.cookies.get('role')?.value 

//   if (!token || !role) {
//     return NextResponse.redirect(new URL('/', request.url))
//   }

//   if (!isRouteAllowed(pathname, role)) {
//     return NextResponse.redirect(new URL('/', request.url)) 
//   }

//   return NextResponse.next()
// }

// export const config = {
//   matcher: [
//     '/((?!_next/static|_next/image|favicon.ico|api|images).*)'
//   ]
// }


import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// Public routes
export const PublicRoutes = [
  '/signin',
  '/forget-password',
  '/reset-password',
  '/'
]

// Role-based route map
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

// Get default dashboard path by role
const getDashboardPath = (role: string): string => {
  const roleRoutes = RoleBasedRoutes[role as keyof typeof RoleBasedRoutes]
  return roleRoutes?.[0] || '/'
}

// Middleware
export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  const token = request.cookies.get('accessToken')?.value
  const role = request.cookies.get('role')?.value

  // Always allow public routes
  if (PublicRoutes.includes(pathname)) {
    return NextResponse.next()
  }

  // If no token or role, redirect to sign-in
  if (!token || !role) {
    return NextResponse.redirect(new URL('/', request.url))
  }

  // If token and role exist but route is not allowed
  if (!isRouteAllowed(pathname, role)) {
    const dashboardPath = getDashboardPath(role)
    return NextResponse.redirect(new URL(dashboardPath, request.url))
  }

  return NextResponse.next()
}

// Don't run middleware on static files or images
export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|api|images).*)'
  ]
}
