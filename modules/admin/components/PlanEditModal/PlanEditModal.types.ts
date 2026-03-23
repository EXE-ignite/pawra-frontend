import type { SubscriptionPlanItem } from '../../types/subscription-plan.types';

export interface PlanEditModalProps {
  plan: SubscriptionPlanItem | null;
  isOpen: boolean;
  isCreateMode: boolean;
  onClose: () => void;
  onSave: (
    planId: string | null,
    data: {
      name: string;
      price: number;
      durationInDays: number;
      description: string;
      isActive: boolean;
    },
  ) => Promise<void>;
}
