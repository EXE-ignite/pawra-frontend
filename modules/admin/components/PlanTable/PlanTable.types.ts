import type { SubscriptionPlanItem } from '../../types/subscription-plan.types';

export interface PlanTableProps {
  plans: SubscriptionPlanItem[];
  currentPage: number;
  totalPages: number;
  totalResults: number;
  onPageChange: (page: number) => void;
  onEdit: (plan: SubscriptionPlanItem) => void;
  onDelete: (planId: string) => void;
  onToggleStatus: (planId: string) => void;
}
