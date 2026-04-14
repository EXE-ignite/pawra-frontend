export type SubscriptionPlan = 'Basic' | 'Premium' | 'VIP';

export type SubscriptionStatus = 'Active' | 'Expired' | 'Cancelled' | 'Trial' | 'Pending';

export type PaymentMethod = 'CreditCard' | 'BankTransfer' | 'Momo' | 'ZaloPay';

export interface Subscription {
  id: string;
  userId: string;
  userName: string;
  userEmail: string;
  userAvatarUrl?: string;
  plan: SubscriptionPlan;
  status: SubscriptionStatus;
  price: number;
  currency: string;
  startDate: string;
  endDate: string;
  autoRenew: boolean;
  paymentMethod: PaymentMethod;
  createdAt: string;
}

export interface SubscriptionListResponse {
  subscriptions: Subscription[];
  total: number;
  totalPages: number;
}

export interface UpdateSubscriptionPayload {
  plan?: SubscriptionPlan;
  status?: SubscriptionStatus;
  autoRenew?: boolean;
  endDate?: string;
}

export interface SubscriptionStats {
  totalSubscriptions: number;
  activeSubscriptions: number;
  expiredSubscriptions: number;
  trialSubscriptions: number;
  monthlyRevenue: number;
}
