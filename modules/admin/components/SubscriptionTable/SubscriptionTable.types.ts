import type { Subscription } from '../../types/subscription.types';

export interface SubscriptionTableProps {
  subscriptions: Subscription[];
  currentPage: number;
  totalPages: number;
  totalResults: number;
  onPageChange: (page: number) => void;
  onEdit: (subscription: Subscription) => void;
  onDelete: (subscriptionId: string) => void;
  onActivate?: (subscriptionId: string) => void;
}
