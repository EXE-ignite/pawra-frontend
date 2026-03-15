import type {
  Subscription,
  SubscriptionListResponse,
  SubscriptionStats,
  UpdateSubscriptionPayload,
  SubscriptionStatus,
  SubscriptionPlan,
} from '../types';

// ---------------------------------------------------------------------------
// Mock data
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
// Service
// ---------------------------------------------------------------------------
class SubscriptionAdminService {
  async getStats(): Promise<SubscriptionStats> {
    // Simulate API delay
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

  async getSubscriptions(
    page = 1,
    limit = 10,
    search?: string,
    plan?: string,
    status?: string,
  ): Promise<SubscriptionListResponse> {
    // Simulate API delay
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

  async updateSubscription(
    subscriptionId: string,
    payload: UpdateSubscriptionPayload,
  ): Promise<Subscription> {
    // Simulate API delay
    await new Promise((r) => setTimeout(r, 300));

    const sub = MOCK_SUBSCRIPTIONS.find((s) => s.id === subscriptionId);
    if (!sub) throw new Error('Subscription not found');
    Object.assign(sub, payload);
    return { ...sub };
  }

  async deleteSubscription(subscriptionId: string): Promise<void> {
    // Simulate API delay
    await new Promise((r) => setTimeout(r, 300));

    const idx = MOCK_SUBSCRIPTIONS.findIndex((s) => s.id === subscriptionId);
    if (idx !== -1) MOCK_SUBSCRIPTIONS.splice(idx, 1);
  }
}

export const subscriptionAdminService = new SubscriptionAdminService();
