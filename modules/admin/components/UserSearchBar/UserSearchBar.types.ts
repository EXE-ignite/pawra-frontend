export interface UserSearchBarProps {
  value: string;
  roleFilter: string;
  statusFilter: string;
  onSearch: (query: string) => void;
  onRoleChange: (role: string) => void;
  onStatusChange: (status: string) => void;
}
