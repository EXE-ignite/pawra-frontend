import type { Subscription, SubscriptionPlan, SubscriptionStatus } from '../../types/subscription.types';

export interface SubscriptionEditModalProps {
  subscription: Subscription | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (
    subscriptionId: string,
    plan: SubscriptionPlan,
    status: SubscriptionStatus,
    autoRenew: boolean,
  ) => Promise<void>;
}
