export const ROUTES = {
  HOME: '/',
  LOGIN: '/auth?mode=signin',
  SIGNUP: '/auth?mode=signup',
  AUTH: '/auth',
  FORGOT_PASSWORD: '/auth/forgot-password',
  
  // Customer routes
  CUSTOMER_DASHBOARD: '/customer/dashboard',
  CUSTOMER_PETS: '/customer/pets',
  CUSTOMER_APPOINTMENTS: '/customer/appointments',
  
  // Admin routes
  ADMIN_DASHBOARD: '/admin/dashboard',
  ADMIN_USERS: '/admin/users',
  ADMIN_APPOINTMENTS: '/admin/appointments',
  
  // Staff routes (vet, receptionist, etc)
  STAFF_DASHBOARD: '/staff/dashboard',

  // Clinic manager routes
  CLINIC_MANAGER_DASHBOARD: '/clinic-manager/dashboard',
} as const;

export const ROLE_ROUTES = {
  Admin: ROUTES.ADMIN_DASHBOARD,
  Customer: ROUTES.CUSTOMER_DASHBOARD,
  Staff: ROUTES.STAFF_DASHBOARD,
  Vet: ROUTES.STAFF_DASHBOARD,
  Receptionist: ROUTES.STAFF_DASHBOARD,
  ClinicManager: ROUTES.CLINIC_MANAGER_DASHBOARD,
} as const;

export type UserRole = keyof typeof ROLE_ROUTES;

export function getRouteByRole(role: string): string {
  return ROLE_ROUTES[role as UserRole] || ROUTES.CUSTOMER_DASHBOARD;
}
