export interface PlanSearchBarProps {
  value: string;
  statusFilter: string;
  onSearch: (query: string) => void;
  onStatusChange: (status: string) => void;
  onAddNew: () => void;
}
