export const ROUTES = {
  HOME: '/',
  LOGIN: '/',
  
  // Customer routes
  CUSTOMER_DASHBOARD: '/customer/dashboard',
  CUSTOMER_PETS: '/customer/pets',
  CUSTOMER_APPOINTMENTS: '/customer/appointments',
  
  // Pet Owner routes
  PET_OWNER_DASHBOARD: '/pet-owner/page',
  PET_OWNER_PROFILE: '/pet-owner/profile',
  PET_OWNER_BOOKING: '/pet-owner/booking',
  PET_OWNER_REMINDERS: '/pet-owner/reminders',
  
  // Admin routes
  ADMIN_DASHBOARD: '/admin/dashboard',
  ADMIN_USERS: '/admin/users',
  ADMIN_APPOINTMENTS: '/admin/appointments',

  // Vet / Clinic Manager routes
  VET_DASHBOARD: '/vet',
  CLINIC_MANAGER_DASHBOARD: '/clinic-manager',

  // Staff routes (vet, receptionist, etc)
  STAFF_DASHBOARD: '/staff/dashboard',
} as const;

export const ROLE_ROUTES = {
  Admin: ROUTES.ADMIN_DASHBOARD,
  Customer: ROUTES.CUSTOMER_DASHBOARD,
  Staff: ROUTES.STAFF_DASHBOARD,
  Vet: ROUTES.VET_DASHBOARD,
  Veterinarian: ROUTES.VET_DASHBOARD,
  ClinicManager: ROUTES.CLINIC_MANAGER_DASHBOARD,
  Receptionist: ROUTES.STAFF_DASHBOARD,
} as const;

export type UserRole = keyof typeof ROLE_ROUTES;

export function getRouteByRole(role: string): string {
  return ROLE_ROUTES[role as UserRole] || ROUTES.CUSTOMER_DASHBOARD;
}
