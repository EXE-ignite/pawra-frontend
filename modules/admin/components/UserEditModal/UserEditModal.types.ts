import type { AdminUser, UserRole, UserStatus } from '../../types';

export interface UserEditModalProps {
  user: AdminUser | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (userId: string, role: UserRole, status: UserStatus) => Promise<void>;
}
