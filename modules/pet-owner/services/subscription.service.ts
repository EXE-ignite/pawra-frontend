import { apiService } from '@/modules/shared/services';
import type {
  SubscriptionPlan,
  UserSubscription,
  SubscriptionStatus,
  SubscribePayload,
} from '../types';

const USE_MOCK = process.env.NEXT_PUBLIC_USE_MOCK === 'true';

// TODO: Tạm bật mock để test UI - set về false khi có API thực
const FORCE_MOCK = false;
const ENABLE_MOCK = USE_MOCK || FORCE_MOCK;

// ---------------------------------------------------------------------------
// Backend interfaces (matching BACKEND_API.md)
// ---------------------------------------------------------------------------
interface BackendSubscriptionPlan {
  id: string;
  name: string;
  price: number;
  durationInDays: number;
  description?: string;
  isActive?: boolean;
  createdDate?: string;
  updatedDate?: string;
}

interface BackendSubscriptionAccount {
  id: string;
  accountId: string;
  subscriptionPlanId: string;
  startDate: string;
  endDate: string;
  status: number; // 0=Active, 1=Cancelled, 2=Expired
  subscriptionPlan?: BackendSubscriptionPlan;
  createdDate?: string;
  updatedDate?: string;
}

interface CreateSubscriptionAccountDto {
  accountId: string;
  subscriptionPlanId: string;
  startDate: string;
  endDate: string;
  status: number;
}

// ---------------------------------------------------------------------------
// Mock data
// ---------------------------------------------------------------------------
const MOCK_PLANS: SubscriptionPlan[] = [
  {
    id: 'plan-free',
    name: 'Free',
    price: 0,
    currency: 'VND',
    durationInDays: 0,
    description: 'Gói miễn phí với các tính năng cơ bản',
    features: [
      'Theo dõi 1 thú cưng',
      'Lịch sử tiêm chủng',
      'Nhắc nhở cơ bản',
    ],
    isActive: true,
    isPopular: false,
  },
  {
    id: 'plan-basic',
    name: 'Basic',
    price: 99000,
    currency: 'VND',
    durationInDays: 30,
    description: 'Gói cơ bản cho người mới bắt đầu',
    features: [
      'Theo dõi 3 thú cưng',
      'Lịch sử tiêm chủng đầy đủ',
      'Nhắc nhở tự động',
      'Hỗ trợ email',
    ],
    isActive: true,
    isPopular: false,
  },
  {
    id: 'plan-premium',
    name: 'Premium',
    price: 299000,
    currency: 'VND',
    durationInDays: 30,
    description: 'Gói nâng cao với nhiều tính năng',
    features: [
      'Theo dõi 10 thú cưng',
      'Lịch sử tiêm chủng đầy đủ',
      'Nhắc nhở thông minh',
      'Hỗ trợ 24/7',
      'Báo cáo sức khỏe',
      'Đặt lịch hẹn ưu tiên',
    ],
    isActive: true,
    isPopular: true,
  },
  {
    id: 'plan-vip',
    name: 'VIP',
    price: 499000,
    currency: 'VND',
    durationInDays: 30,
    description: 'Gói cao cấp với đầy đủ tính năng',
    features: [
      'Theo dõi không giới hạn thú cưng',
      'Tất cả tính năng Premium',
      'Tư vấn bác sĩ trực tuyến',
      'Ưu đãi độc quyền',
      'Hỗ trợ VIP 24/7',
    ],
    isActive: true,
    isPopular: false,
  },
];

const MOCK_USER_SUBSCRIPTION: UserSubscription = {
  id: 'sub-1',
  planId: 'plan-basic',
  planName: 'Basic',
  status: 'active',
  startDate: '2025-01-01',
  endDate: '2025-02-01',
  daysRemaining: 15,
  price: 99000,
  currency: 'VND',
};

// ---------------------------------------------------------------------------
// Mapping functions
// ---------------------------------------------------------------------------
const STATUS_MAP: Record<number, SubscriptionStatus> = {
  0: 'active',
  1: 'cancelled',
  2: 'expired',
  3: 'pending',
};

function mapPlan(plan: BackendSubscriptionPlan): SubscriptionPlan {
  // Parse features from description:
  //   Preferred format: "Feature1|Feature2|Feature3" (pipe-separated)
  //   Fallback format:  "Feature1. Feature2. Feature3." (sentence-separated)
  let features: string[];
  if (plan.description?.includes('|')) {
    features = plan.description.split('|').map((f) => f.trim()).filter(Boolean);
  } else if (plan.description) {
    features = plan.description
      .split(/\.\s+/)
      .map((f) => f.replace(/\.$/, '').trim())
      .filter(Boolean);
  } else {
    features = [];
  }

  return {
    id: plan.id,
    name: plan.name,
    price: plan.price,
    currency: 'VND',
    durationInDays: plan.durationInDays,
    description: plan.description || '',
    features,
    isActive: plan.isActive ?? true,
    isPopular: plan.name.toLowerCase().includes('premium'),
  };
}

function calculateDaysRemaining(endDate: string): number {
  const end = new Date(endDate);
  const now = new Date();
  const diff = end.getTime() - now.getTime();
  return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)));
}

function mapUserSubscription(
  sub: BackendSubscriptionAccount,
  plan?: BackendSubscriptionPlan,
): UserSubscription {
  return {
    id: sub.id,
    planId: sub.subscriptionPlanId,
    planName: plan?.name || sub.subscriptionPlan?.name || 'Unknown',
    status: STATUS_MAP[sub.status] || 'expired',
    startDate: sub.startDate.split('T')[0],
    endDate: sub.endDate.split('T')[0],
    daysRemaining: calculateDaysRemaining(sub.endDate),
    price: plan?.price || sub.subscriptionPlan?.price || 0,
    currency: 'VND',
  };
}

// ---------------------------------------------------------------------------
// Service
// ---------------------------------------------------------------------------
class UserSubscriptionService {
  private readonly planEndpoint = '/SubscriptionPlan';
  private readonly accountEndpoint = '/SubscriptionAccount';
  private _plansCache: Promise<SubscriptionPlan[]> | null = null;

  /**
   * Get all available subscription plans (for users to choose from)
   * Backend: GET /api/SubscriptionPlan?pageSize=100&pageNumber=1
   */
  async getAvailablePlans(): Promise<SubscriptionPlan[]> {
    if (ENABLE_MOCK) {
      await new Promise((r) => setTimeout(r, 300));
      return MOCK_PLANS.filter((p) => p.isActive);
    }

    if (!this._plansCache) {
      this._plansCache = apiService
        .get<BackendSubscriptionPlan[]>(`${this.planEndpoint}?pageSize=100&pageNumber=1`)
        .then((response) => {
          const wrapper = response as unknown as { success?: boolean; data?: BackendSubscriptionPlan[] };
          const list: BackendSubscriptionPlan[] = Array.isArray(wrapper.data)
            ? wrapper.data
            : Array.isArray(response) ? response : [];
          return list.filter((p) => p.isActive !== false).map(mapPlan);
        })
        .catch((err) => {
          this._plansCache = null;
          console.warn('[SUBSCRIPTION] Could not load plans, returning empty list:', err?.message || err);
          return [] as SubscriptionPlan[];
        });

      // Auto-expire cache after 60 seconds
      this._plansCache.then(() => setTimeout(() => { this._plansCache = null; }, 60_000));
    }

    return this._plansCache;
  }

  /**
   * Get plan by ID
   * Backend: GET /api/SubscriptionPlan/{id}
   */
  async getPlanById(planId: string): Promise<SubscriptionPlan | null> {
    if (ENABLE_MOCK) {
      await new Promise((r) => setTimeout(r, 200));
      return MOCK_PLANS.find((p) => p.id === planId) || null;
    }

    try {
      const response = await apiService.get<BackendSubscriptionPlan>(`${this.planEndpoint}/${planId}`);
      const data = (response.data ?? response) as BackendSubscriptionPlan;
      return mapPlan(data);
    } catch {
      return null;
    }
  }

  /**
   * Get current user's subscription
   * Backend: GET /api/SubscriptionAccount/{id}
   * Note: Need to get the subscription ID from user profile or a list endpoint
   */
  async getCurrentSubscription(accountId: string): Promise<UserSubscription | null> {
    if (ENABLE_MOCK) {
      await new Promise((r) => setTimeout(r, 300));
      return MOCK_USER_SUBSCRIPTION;
    }

    try {
      const response = await apiService.get<BackendSubscriptionAccount[]>(
        `${this.accountEndpoint}/account/${accountId}`,
      );

      const wrapper = response as unknown as { success?: boolean; data?: BackendSubscriptionAccount[] };
      const list: BackendSubscriptionAccount[] = Array.isArray(wrapper.data)
        ? wrapper.data
        : Array.isArray(response) ? response as BackendSubscriptionAccount[] : [];

      if (list.length === 0) return null;

      // Take the most recent active subscription, or just the first
      const sub = list.find((s) => s.status === 0) ?? list[0];

      // Get plan details if not included
      let plan: BackendSubscriptionPlan | undefined = sub.subscriptionPlan;
      if (!plan) {
        try {
          const planResponse = await apiService.get<BackendSubscriptionPlan>(
            `${this.planEndpoint}/${sub.subscriptionPlanId}`,
          );
          plan = (planResponse.data ?? planResponse) as BackendSubscriptionPlan;
        } catch {
          // Ignore plan fetch error
        }
      }

      return mapUserSubscription(sub, plan);
    } catch (error) {
      console.warn('[SUBSCRIPTION] Could not fetch current subscription (user may have none):', (error as any)?.status ?? error);
      return null;
    }
  }

  /**
   * Subscribe to a plan
   * Backend: POST /api/SubscriptionAccount/create
   */
  async subscribe(accountId: string, payload: SubscribePayload): Promise<UserSubscription> {
    if (ENABLE_MOCK) {
      await new Promise((r) => setTimeout(r, 500));
      const plan = MOCK_PLANS.find((p) => p.id === payload.subscriptionPlanId);
      if (!plan) throw new Error('Plan not found');

      const startDate = new Date();
      const endDate = new Date();
      endDate.setDate(endDate.getDate() + plan.durationInDays);

      return {
        id: `sub-${Date.now()}`,
        planId: plan.id,
        planName: plan.name,
        status: 'active',
        startDate: startDate.toISOString().split('T')[0],
        endDate: endDate.toISOString().split('T')[0],
        daysRemaining: plan.durationInDays,
        price: plan.price,
        currency: 'VND',
      };
    }

    // Get plan duration — use provided value if available to skip an extra API round-trip
    let durationInDays = payload.durationInDays;
    if (!durationInDays) {
      const plan = await this.getPlanById(payload.subscriptionPlanId);
      if (!plan) throw new Error('Không tìm thấy gói đăng ký. Vui lòng thử lại.');
      durationInDays = plan.durationInDays;
    }

    const startDate = new Date();
    const endDate = new Date();
    endDate.setDate(endDate.getDate() + durationInDays);

    const createDto: CreateSubscriptionAccountDto = {
      accountId,
      subscriptionPlanId: payload.subscriptionPlanId,
      startDate: startDate.toISOString(),
      endDate: endDate.toISOString(),
      status: 3, // Pending — admin sẽ kích hoạt sau khi xác nhận thanh toán
    };

    const response = await apiService.post<BackendSubscriptionAccount>(
      `${this.accountEndpoint}/create`,
      createDto,
    );

    const data = (response.data ?? response) as BackendSubscriptionAccount;
    return mapUserSubscription(data);
  }

  /**
   * Cancel subscription
   * Backend: PUT /api/SubscriptionAccount/update/{id}
   */
  async cancelSubscription(subscriptionId: string): Promise<void> {
    if (ENABLE_MOCK) {
      await new Promise((r) => setTimeout(r, 300));
      return;
    }

    await apiService.put(`${this.accountEndpoint}/update/${subscriptionId}`, {
      status: 1, // Cancelled
    });
  }

  /**
   * Format price for display
   */
  formatPrice(price: number, currency = 'VND'): string {
    if (price === 0) return 'Miễn phí';
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency,
    }).format(price);
  }

  /**
   * Format duration for display
   */
  formatDuration(days: number): string {
    if (days === 0) return 'Vĩnh viễn';
    if (days === 30) return '/ tháng';
    if (days === 365) return '/ năm';
    return `/ ${days} ngày`;
  }
}

export const userSubscriptionService = new UserSubscriptionService();
export default userSubscriptionService;
