export interface UserDropdownProps {
  userName: string;
  userEmail: string;
  avatarUrl?: string;
  onLogout: () => void;
}
