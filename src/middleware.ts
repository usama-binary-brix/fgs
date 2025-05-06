

import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

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

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  if (PublicRoutes.includes(pathname)) {
    return NextResponse.next()
  }

  const token = request.cookies.get('accessToken')?.value
  const role = request.cookies.get('role')?.value 

  if (!token || !role) {
    return NextResponse.redirect(new URL('/', request.url))
  }

  if (!isRouteAllowed(pathname, role)) {
    return NextResponse.redirect(new URL('/', request.url)) 
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|api|images).*)'
  ]
}

