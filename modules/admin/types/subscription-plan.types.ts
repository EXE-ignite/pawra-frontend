// ---------------------------------------------------------------------------
// Subscription Plan Types for Admin Management
// ---------------------------------------------------------------------------

export interface SubscriptionPlanItem {
  id: string;
  name: string;
  price: number;
  currency: string;
  durationInDays: number;
  description: string;
  isActive: boolean;
  features: string[];
  createdAt: string;
  updatedAt?: string;
}

export interface SubscriptionPlanListResponse {
  plans: SubscriptionPlanItem[];
  total: number;
  totalPages: number;
}

export interface SubscriptionPlanStats {
  totalPlans: number;
  activePlans: number;
  inactivePlans: number;
  totalSubscribers: number;
}

export interface CreateSubscriptionPlanPayload {
  name: string;
  price: number;
  durationInDays: number;
  description?: string;
  isActive?: boolean;
}

export interface UpdateSubscriptionPlanPayload {
  name?: string;
  price?: number;
  durationInDays?: number;
  description?: string;
  isActive?: boolean;
}
