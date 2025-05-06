export const PublicRoutes = [
    '/sign-in',
    '/forget-password',
    '/reset-password',
    '/'
  ];
  
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
  };
  
  export const isRouteAllowed = (path: string, role: string) => {
    console.log('first')
    const allowedRoutes = RoleBasedRoutes[role as keyof typeof RoleBasedRoutes] || [];
    return allowedRoutes.some(route => path === route || path.startsWith(route));
  };