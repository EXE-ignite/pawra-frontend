export interface SubscriptionSearchBarProps {
  value: string;
  planFilter: string;
  statusFilter: string;
  onSearch: (query: string) => void;
  onPlanChange: (plan: string) => void;
  onStatusChange: (status: string) => void;
}
