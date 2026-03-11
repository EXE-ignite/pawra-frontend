export type UserRole = 'Admin' | 'Staff' | 'Vet' | 'Receptionist' | 'PetOwner' | 'Customer';

export type UserStatus = 'Active' | 'Inactive' | 'Banned';

export interface AdminUser {
  id: string;
  fullName: string;
  email: string;
  avatarUrl?: string;
  role: UserRole;
  status: UserStatus;
  joinedDate: string;
  lastLogin?: string;
}

export interface UserListResponse {
  users: AdminUser[];
  total: number;
  totalPages: number;
}

export interface UpdateUserPayload {
  role?: UserRole;
  status?: UserStatus;
}

export interface UserStats {
  totalUsers: number;
  activeUsers: number;
  bannedUsers: number;
  newThisMonth: number;
}
