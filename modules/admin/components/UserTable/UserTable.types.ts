import type { AdminUser, UserRole, UserStatus } from '../../types';

export interface UserTableProps {
  users: AdminUser[];
  currentPage: number;
  totalPages: number;
  totalResults: number;
  onPageChange: (page: number) => void;
  onEdit: (user: AdminUser) => void;
  onDelete: (userId: string) => void;
}

export type { AdminUser, UserRole, UserStatus };
