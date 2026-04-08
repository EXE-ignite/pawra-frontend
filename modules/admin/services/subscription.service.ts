import { apiService } from '@/modules/shared/services';
import type {
  Subscription,
  SubscriptionListResponse,
  SubscriptionStats,
  UpdateSubscriptionPayload,
  SubscriptionStatus,
  SubscriptionPlan,
  PaymentMethod,
} from '../types';

const USE_MOCK = process.env.NEXT_PUBLIC_USE_MOCK === 'true';

// TODO: Tạm bật mock để test UI - set về false khi có API thực
const FORCE_MOCK = false;
const ENABLE_MOCK = USE_MOCK || FORCE_MOCK;

// ---------------------------------------------------------------------------
// Backend response interfaces
// ---------------------------------------------------------------------------

// Subscription Status từ backend (enum number)
// 0 - Active, 1 - Cancelled, 2 - Expired
const BACKEND_STATUS_MAP: Record<number, SubscriptionStatus> = {
  0: 'Active',
  1: 'Cancelled',
  2: 'Expired',
};

const STATUS_TO_BACKEND: Record<SubscriptionStatus, number> = {
  Active: 0,
  Cancelled: 1,
  Expired: 2,
  Trial: 0, // Trial không có trong backend, map về Active
};

interface BackendSubscriptionAccount {
  id: string;
  accountId: string;
  subscriptionPlanId: string;
  startDate: string;
  endDate: string;
  status: number; // 0: Active, 1: Cancelled, 2: Expired
  createdDate?: string;
  updatedDate?: string;
  // Nếu backend trả về nested objects
  account?: BackendAccount;
  subscriptionPlan?: BackendSubscriptionPlan;
}

interface BackendAccount {
  id: string;
  email: string;
  fullName?: string;
  name?: string;
  avatarUrl?: string;
  avatar?: string;
}

interface BackendSubscriptionPlan {
  id: string;
  name: string;
  price: number;
  durationInDays: number;
  description?: string;
  isActive?: boolean;
}

// ---------------------------------------------------------------------------
// Mock data (giữ lại để dev offline)
// ---------------------------------------------------------------------------
const MOCK_SUBSCRIPTIONS: Subscription[] = [
  {
    id: 'sub1',
    userId: 'u1',
    userName: 'Nguyen Van An',
    userEmail: 'an.nguyen@example.com',
    userAvatarUrl: 'https://i.pravatar.cc/150?u=u1',
    plan: 'VIP',
    status: 'Active',
    price: 499000,
    currency: 'VND',
    startDate: '2026-01-15',
    endDate: '2026-07-15',
    autoRenew: true,
    paymentMethod: 'CreditCard',
    createdAt: '2026-01-15',
  },
  {
    id: 'sub2',
    userId: 'u2',
    userName: 'Tran Thi Binh',
    userEmail: 'binh.tran@example.com',
    userAvatarUrl: 'https://i.pravatar.cc/150?u=u2',
    plan: 'Premium',
    status: 'Active',
    price: 299000,
    currency: 'VND',
    startDate: '2026-02-01',
    endDate: '2026-08-01',
    autoRenew: true,
    paymentMethod: 'Momo',
    createdAt: '2026-02-01',
  },
  {
    id: 'sub3',
    userId: 'u3',
    userName: 'Le Minh Chau',
    userEmail: 'chau.le@example.com',
    plan: 'Basic',
    status: 'Active',
    price: 99000,
    currency: 'VND',
    startDate: '2026-02-10',
    endDate: '2026-05-10',
    autoRenew: false,
    paymentMethod: 'BankTransfer',
    createdAt: '2026-02-10',
  },
  {
    id: 'sub4',
    userId: 'u4',
    userName: 'Pham Thi Dung',
    userEmail: 'dung.pham@example.com',
    userAvatarUrl: 'https://i.pravatar.cc/150?u=u4',
    plan: 'Premium',
    status: 'Expired',
    price: 299000,
    currency: 'VND',
    startDate: '2025-06-01',
    endDate: '2025-12-01',
    autoRenew: false,
    paymentMethod: 'ZaloPay',
    createdAt: '2025-06-01',
  },
  {
    id: 'sub5',
    userId: 'u5',
    userName: 'Hoang Van Em',
    userEmail: 'em.hoang@example.com',
    plan: 'Basic',
    status: 'Cancelled',
    price: 99000,
    currency: 'VND',
    startDate: '2025-09-01',
    endDate: '2025-12-01',
    autoRenew: false,
    paymentMethod: 'Momo',
    createdAt: '2025-09-01',
  },
  {
    id: 'sub6',
    userId: 'u6',
    userName: 'Vu Thi Fuong',
    userEmail: 'fuong.vu@example.com',
    userAvatarUrl: 'https://i.pravatar.cc/150?u=u6',
    plan: 'VIP',
    status: 'Active',
    price: 499000,
    currency: 'VND',
    startDate: '2026-03-01',
    endDate: '2026-09-01',
    autoRenew: true,
    paymentMethod: 'CreditCard',
    createdAt: '2026-03-01',
  },
  {
    id: 'sub7',
    userId: 'u7',
    userName: 'Dang Van Giang',
    userEmail: 'giang.dang@example.com',
    plan: 'Basic',
    status: 'Trial',
    price: 0,
    currency: 'VND',
    startDate: '2026-03-10',
    endDate: '2026-03-24',
    autoRenew: false,
    paymentMethod: 'BankTransfer',
    createdAt: '2026-03-10',
  },
  {
    id: 'sub8',
    userId: 'u8',
    userName: 'Bui Thi Hoa',
    userEmail: 'hoa.bui@example.com',
    userAvatarUrl: 'https://i.pravatar.cc/150?u=u8',
    plan: 'Premium',
    status: 'Active',
    price: 299000,
    currency: 'VND',
    startDate: '2026-01-20',
    endDate: '2026-07-20',
    autoRenew: true,
    paymentMethod: 'Momo',
    createdAt: '2026-01-20',
  },
  {
    id: 'sub9',
    userId: 'u9',
    userName: 'Nguyen Thi Lan',
    userEmail: 'lan.nguyen@example.com',
    plan: 'VIP',
    status: 'Expired',
    price: 499000,
    currency: 'VND',
    startDate: '2025-05-01',
    endDate: '2025-11-01',
    autoRenew: false,
    paymentMethod: 'BankTransfer',
    createdAt: '2025-05-01',
  },
  {
    id: 'sub10',
    userId: 'u10',
    userName: 'Tran Van Khanh',
    userEmail: 'khanh.tran@example.com',
    userAvatarUrl: 'https://i.pravatar.cc/150?u=u10',
    plan: 'Premium',
    status: 'Trial',
    price: 0,
    currency: 'VND',
    startDate: '2026-03-12',
    endDate: '2026-03-26',
    autoRenew: false,
    paymentMethod: 'ZaloPay',
    createdAt: '2026-03-12',
  },
  {
    id: 'sub11',
    userId: 'u11',
    userName: 'Le Thi Mai',
    userEmail: 'mai.le@example.com',
    plan: 'Basic',
    status: 'Active',
    price: 99000,
    currency: 'VND',
    startDate: '2026-02-28',
    endDate: '2026-05-28',
    autoRenew: true,
    paymentMethod: 'Momo',
    createdAt: '2026-02-28',
  },
  {
    id: 'sub12',
    userId: 'u12',
    userName: 'Pham Van Nam',
    userEmail: 'nam.pham@example.com',
    plan: 'VIP',
    status: 'Cancelled',
    price: 499000,
    currency: 'VND',
    startDate: '2025-10-01',
    endDate: '2026-04-01',
    autoRenew: false,
    paymentMethod: 'CreditCard',
    createdAt: '2025-10-01',
  },
];

// ---------------------------------------------------------------------------
// Plan priority for sorting
// ---------------------------------------------------------------------------
const PLAN_PRIORITY: Record<string, number> = {
  VIP: 0,
  Premium: 1,
  Basic: 2,
};

function sortByPlan(subs: Subscription[]): Subscription[] {
  return [...subs].sort(
    (a, b) => (PLAN_PRIORITY[a.plan] ?? 99) - (PLAN_PRIORITY[b.plan] ?? 99),
  );
}

// ---------------------------------------------------------------------------
// Mapping functions
// ---------------------------------------------------------------------------
function mapPlanName(planName: string): SubscriptionPlan {
  const normalized = planName.toLowerCase();
  if (normalized.includes('vip')) return 'VIP';
  if (normalized.includes('premium')) return 'Premium';
  return 'Basic';
}

function mapSubscription(
  sub: BackendSubscriptionAccount,
  accountMap: Record<string, BackendAccount>,
  planMap: Record<string, BackendSubscriptionPlan>,
): Subscription {
  const account = sub.account || accountMap[sub.accountId];
  const plan = sub.subscriptionPlan || planMap[sub.subscriptionPlanId];

  return {
    id: sub.id,
    userId: sub.accountId,
    userName: account?.fullName || account?.name || 'Unknown User',
    userEmail: account?.email || '',
    userAvatarUrl: account?.avatarUrl || account?.avatar || undefined,
    plan: plan ? mapPlanName(plan.name) : 'Basic',
    status: BACKEND_STATUS_MAP[sub.status] ?? 'Active',
    price: plan?.price ?? 0,
    currency: 'VND',
    startDate: sub.startDate?.split('T')[0] || '',
    endDate: sub.endDate?.split('T')[0] || '',
    autoRenew: false, // Backend không có field này, mặc định false
    paymentMethod: 'BankTransfer', // Backend không có field này
    createdAt: sub.createdDate?.split('T')[0] || sub.startDate?.split('T')[0] || '',
  };
}

// ---------------------------------------------------------------------------
// Service
// ---------------------------------------------------------------------------
class SubscriptionAdminService {
  private readonly subscriptionEndpoint = '/SubscriptionAccount';
  private readonly accountEndpoint = '/Account';
  private readonly planEndpoint = '/SubscriptionPlan';

  // Cache
  private _subscriptionCache: Promise<Subscription[]> | null = null;
  private _planCache: Promise<Record<string, BackendSubscriptionPlan>> | null = null;
  private _accountCache: Promise<Record<string, BackendAccount>> | null = null;

  private invalidate(): void {
    this._subscriptionCache = null;
  }

  // ---------------------------------------------------------------------------
  // Fetch helpers
  // ---------------------------------------------------------------------------
  private fetchPlans(): Promise<Record<string, BackendSubscriptionPlan>> {
    if (!this._planCache) {
      this._planCache = apiService
        .get<BackendSubscriptionPlan[]>(`${this.planEndpoint}?pageSize=100&pageNumber=1`)
        .then((response) => {
          const wrapper = response as unknown as { success?: boolean; data?: BackendSubscriptionPlan[] };
          const list: BackendSubscriptionPlan[] = Array.isArray(wrapper.data)
            ? wrapper.data
            : Array.isArray(response) ? response : [];
          return Object.fromEntries(list.map((p) => [p.id, p]));
        })
        .catch((err: unknown) => {
          this._planCache = null;
          console.warn('[SubscriptionAdminService] fetchPlans failed:', err);
          return {} as Record<string, BackendSubscriptionPlan>;
        });
      // Auto-expire cache after 60s
      this._planCache.then(() => setTimeout(() => { this._planCache = null; }, 60_000));
    }
    return this._planCache;
  }

  private fetchAccounts(): Promise<Record<string, BackendAccount>> {
    if (!this._accountCache) {
      this._accountCache = apiService
        .get<BackendAccount[]>(`${this.accountEndpoint}?pageSize=1000&pageNumber=1`)
        .then((response) => {
          const wrapper = response as unknown as { success?: boolean; data?: BackendAccount[] };
          const list: BackendAccount[] = Array.isArray(wrapper.data)
            ? wrapper.data
            : Array.isArray(response) ? response : [];
          return Object.fromEntries(list.map((a) => [a.id, a]));
        })
        .catch((err: unknown) => {
          this._accountCache = null;
          console.warn('[SubscriptionAdminService] fetchAccounts failed:', err);
          return {} as Record<string, BackendAccount>;
        });
      // Auto-expire cache after 30s
      this._accountCache.then(() => setTimeout(() => { this._accountCache = null; }, 30_000));
    }
    return this._accountCache;
  }

  private fetchAll(): Promise<Subscription[]> {
    if (!this._subscriptionCache) {
      this._subscriptionCache = Promise.all([
        apiService.get<BackendSubscriptionAccount[]>(`${this.subscriptionEndpoint}?pageSize=1000&pageNumber=1`),
        this.fetchPlans(),
        this.fetchAccounts(),
      ])
        .then(([response, planMap, accountMap]) => {
          const wrapper = response as unknown as { success?: boolean; data?: BackendSubscriptionAccount[] };
          const list: BackendSubscriptionAccount[] = Array.isArray(wrapper.data)
            ? wrapper.data
            : Array.isArray(response) ? response : [];
          return list.map((sub) => mapSubscription(sub, accountMap, planMap));
        })
        .catch((err) => {
          this._subscriptionCache = null;
          throw err;
        });
      // Auto-expire cache after 30s
      this._subscriptionCache.then(() => setTimeout(() => { this._subscriptionCache = null; }, 30_000));
    }
    return this._subscriptionCache;
  }

  // ---------------------------------------------------------------------------
  // Public API methods
  // ---------------------------------------------------------------------------
  async getStats(): Promise<SubscriptionStats> {
    if (ENABLE_MOCK) {
      await new Promise((r) => setTimeout(r, 300));
      const all = MOCK_SUBSCRIPTIONS;
      const active = all.filter((s) => s.status === 'Active');
      return {
        totalSubscriptions: all.length,
        activeSubscriptions: active.length,
        expiredSubscriptions: all.filter((s) => s.status === 'Expired').length,
        trialSubscriptions: all.filter((s) => s.status === 'Trial').length,
        monthlyRevenue: active.reduce((sum, s) => sum + s.price, 0),
      };
    }

    const all = await this.fetchAll();
    const active = all.filter((s) => s.status === 'Active');
    return {
      totalSubscriptions: all.length,
      activeSubscriptions: active.length,
      expiredSubscriptions: all.filter((s) => s.status === 'Expired').length,
      trialSubscriptions: all.filter((s) => s.status === 'Trial').length,
      monthlyRevenue: active.reduce((sum, s) => sum + s.price, 0),
    };
  }

  async getSubscriptions(
    page = 1,
    limit = 10,
    search?: string,
    plan?: string,
    status?: string,
  ): Promise<SubscriptionListResponse> {
    if (ENABLE_MOCK) {
      await new Promise((r) => setTimeout(r, 300));

      let filtered = [...MOCK_SUBSCRIPTIONS];

      if (search) {
        const q = search.toLowerCase();
        filtered = filtered.filter(
          (s) =>
            s.userName.toLowerCase().includes(q) ||
            s.userEmail.toLowerCase().includes(q),
        );
      }
      if (plan) filtered = filtered.filter((s) => s.plan === plan);
      if (status) filtered = filtered.filter((s) => s.status === status);

      const sorted = sortByPlan(filtered);
      const total = sorted.length;
      const totalPages = Math.max(1, Math.ceil(total / limit));
      const start = (page - 1) * limit;

      return {
        subscriptions: sorted.slice(start, start + limit),
        total,
        totalPages,
      };
    }

    let all = await this.fetchAll();

    if (search) {
      const q = search.toLowerCase();
      all = all.filter(
        (s) =>
          s.userName.toLowerCase().includes(q) ||
          s.userEmail.toLowerCase().includes(q),
      );
    }
    if (plan) all = all.filter((s) => s.plan === plan);
    if (status) all = all.filter((s) => s.status === status);

    const sorted = sortByPlan(all);
    const total = sorted.length;
    const totalPages = Math.max(1, Math.ceil(total / limit));
    const start = (page - 1) * limit;

    return {
      subscriptions: sorted.slice(start, start + limit),
      total,
      totalPages,
    };
  }

  async updateSubscription(
    subscriptionId: string,
    payload: UpdateSubscriptionPayload,
  ): Promise<Subscription> {
    if (ENABLE_MOCK) {
      await new Promise((r) => setTimeout(r, 300));

      const sub = MOCK_SUBSCRIPTIONS.find((s) => s.id === subscriptionId);
      if (!sub) throw new Error('Subscription not found');
      Object.assign(sub, payload);
      return { ...sub };
    }

    // Build backend payload
    const backendPayload: Record<string, unknown> = {};
    if (payload.status) {
      backendPayload.status = STATUS_TO_BACKEND[payload.status];
    }
    if (payload.endDate) {
      backendPayload.endDate = payload.endDate;
    }
    // Note: plan và autoRenew không có trong UpdateSubscriptionAccountDto của backend
    // Nếu cần thay đổi plan, cần tạo subscription mới

    const response = await apiService.put<BackendSubscriptionAccount>(
      `${this.subscriptionEndpoint}/update/${subscriptionId}`,
      backendPayload,
    );

    this.invalidate();

    // Fetch updated data
    const [planMap, accountMap] = await Promise.all([
      this.fetchPlans(),
      this.fetchAccounts(),
    ]);

    const data = (response.data ?? response) as BackendSubscriptionAccount;
    return mapSubscription(data, accountMap, planMap);
  }

  async deleteSubscription(subscriptionId: string): Promise<void> {
    if (ENABLE_MOCK) {
      await new Promise((r) => setTimeout(r, 300));

      const idx = MOCK_SUBSCRIPTIONS.findIndex((s) => s.id === subscriptionId);
      if (idx !== -1) MOCK_SUBSCRIPTIONS.splice(idx, 1);
      return;
    }

    await apiService.delete(`${this.subscriptionEndpoint}/${subscriptionId}`);
    this.invalidate();
  }
}

export const subscriptionAdminService = new SubscriptionAdminService();
