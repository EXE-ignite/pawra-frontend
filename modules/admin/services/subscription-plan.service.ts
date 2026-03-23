import { apiService } from '@/modules/shared/services';
import type {
  SubscriptionPlanItem,
  SubscriptionPlanListResponse,
  SubscriptionPlanStats,
  CreateSubscriptionPlanPayload,
  UpdateSubscriptionPlanPayload,
} from '../types/subscription-plan.types';

const USE_MOCK = process.env.NEXT_PUBLIC_USE_MOCK === 'true';

// TODO: Tạm bật mock để test UI - set về false khi có API thực
const FORCE_MOCK = true;
const ENABLE_MOCK = USE_MOCK || FORCE_MOCK;

// ---------------------------------------------------------------------------
// Backend response interface
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

// ---------------------------------------------------------------------------
// Mock data
// ---------------------------------------------------------------------------
const MOCK_PLANS: SubscriptionPlanItem[] = [
  {
    id: 'plan1',
    name: 'Basic',
    price: 99000,
    currency: 'VND',
    durationInDays: 30,
    description: 'Goi co ban cho nguoi moi bat dau',
    isActive: true,
    features: ['Theo doi 1 thu cung', 'Lich hen kham co ban', 'Ho tro email'],
    createdAt: '2025-01-01',
  },
  {
    id: 'plan2',
    name: 'Premium',
    price: 299000,
    currency: 'VND',
    durationInDays: 30,
    description: 'Goi nang cao voi nhieu tinh nang',
    isActive: true,
    features: ['Theo doi 5 thu cung', 'Lich hen kham uu tien', 'Ho tro 24/7', 'Bao cao suc khoe'],
    createdAt: '2025-01-01',
  },
  {
    id: 'plan3',
    name: 'VIP',
    price: 499000,
    currency: 'VND',
    durationInDays: 30,
    description: 'Goi cao cap voi day du tinh nang',
    isActive: true,
    features: ['Theo doi khong gioi han thu cung', 'Lich hen kham VIP', 'Ho tro 24/7 uu tien', 'Bao cao suc khoe chi tiet', 'Tu van bac si truc tuyen'],
    createdAt: '2025-01-01',
  },
  {
    id: 'plan4',
    name: 'Enterprise',
    price: 999000,
    currency: 'VND',
    durationInDays: 30,
    description: 'Goi doanh nghiep cho phong kham',
    isActive: false,
    features: ['Tat ca tinh nang VIP', 'Quan ly nhan vien', 'Bao cao doanh thu', 'API tich hop'],
    createdAt: '2025-02-01',
  },
];

// ---------------------------------------------------------------------------
// Mapping functions
// ---------------------------------------------------------------------------
function mapPlan(plan: BackendSubscriptionPlan): SubscriptionPlanItem {
  return {
    id: plan.id,
    name: plan.name,
    price: plan.price,
    currency: 'VND',
    durationInDays: plan.durationInDays,
    description: plan.description || '',
    isActive: plan.isActive ?? true,
    features: [], // Backend không có features, có thể parse từ description
    createdAt: plan.createdDate?.split('T')[0] || '',
    updatedAt: plan.updatedDate?.split('T')[0],
  };
}

// ---------------------------------------------------------------------------
// Service
// ---------------------------------------------------------------------------
class SubscriptionPlanAdminService {
  private readonly endpoint = '/SubscriptionPlan';
  private _cache: Promise<SubscriptionPlanItem[]> | null = null;

  private invalidate(): void {
    this._cache = null;
  }

  private fetchAll(): Promise<SubscriptionPlanItem[]> {
    if (!this._cache) {
      this._cache = apiService
        .get<BackendSubscriptionPlan[]>(`${this.endpoint}?pageSize=100&pageNumber=1`)
        .then((response) => {
          const wrapper = response as unknown as { success?: boolean; data?: BackendSubscriptionPlan[] };
          const list: BackendSubscriptionPlan[] = Array.isArray(wrapper.data)
            ? wrapper.data
            : Array.isArray(response) ? response : [];
          return list.map(mapPlan);
        })
        .catch((err) => {
          this._cache = null;
          throw err;
        });
      // Auto-expire cache after 30s
      this._cache.then(() => setTimeout(() => { this._cache = null; }, 30_000));
    }
    return this._cache;
  }

  async getStats(): Promise<SubscriptionPlanStats> {
    if (ENABLE_MOCK) {
      await new Promise((r) => setTimeout(r, 300));
      const active = MOCK_PLANS.filter((p) => p.isActive);
      return {
        totalPlans: MOCK_PLANS.length,
        activePlans: active.length,
        inactivePlans: MOCK_PLANS.length - active.length,
        totalSubscribers: 156, // Mock
      };
    }

    const all = await this.fetchAll();
    const active = all.filter((p) => p.isActive);
    return {
      totalPlans: all.length,
      activePlans: active.length,
      inactivePlans: all.length - active.length,
      totalSubscribers: 0, // Cần API riêng để lấy số subscribers
    };
  }

  async getPlans(
    page = 1,
    limit = 10,
    search?: string,
    status?: string,
  ): Promise<SubscriptionPlanListResponse> {
    if (ENABLE_MOCK) {
      await new Promise((r) => setTimeout(r, 300));

      let filtered = [...MOCK_PLANS];

      if (search) {
        const q = search.toLowerCase();
        filtered = filtered.filter(
          (p) =>
            p.name.toLowerCase().includes(q) ||
            p.description.toLowerCase().includes(q),
        );
      }
      if (status === 'active') filtered = filtered.filter((p) => p.isActive);
      if (status === 'inactive') filtered = filtered.filter((p) => !p.isActive);

      const total = filtered.length;
      const totalPages = Math.max(1, Math.ceil(total / limit));
      const start = (page - 1) * limit;

      return {
        plans: filtered.slice(start, start + limit),
        total,
        totalPages,
      };
    }

    let all = await this.fetchAll();

    if (search) {
      const q = search.toLowerCase();
      all = all.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q),
      );
    }
    if (status === 'active') all = all.filter((p) => p.isActive);
    if (status === 'inactive') all = all.filter((p) => !p.isActive);

    const total = all.length;
    const totalPages = Math.max(1, Math.ceil(total / limit));
    const start = (page - 1) * limit;

    return {
      plans: all.slice(start, start + limit),
      total,
      totalPages,
    };
  }

  async getPlanById(planId: string): Promise<SubscriptionPlanItem | null> {
    if (ENABLE_MOCK) {
      await new Promise((r) => setTimeout(r, 200));
      return MOCK_PLANS.find((p) => p.id === planId) || null;
    }

    try {
      const response = await apiService.get<BackendSubscriptionPlan>(`${this.endpoint}/${planId}`);
      const data = (response.data ?? response) as BackendSubscriptionPlan;
      return mapPlan(data);
    } catch {
      return null;
    }
  }

  async createPlan(payload: CreateSubscriptionPlanPayload): Promise<SubscriptionPlanItem> {
    if (ENABLE_MOCK) {
      await new Promise((r) => setTimeout(r, 300));
      const newPlan: SubscriptionPlanItem = {
        id: `plan${Date.now()}`,
        name: payload.name,
        price: payload.price,
        currency: 'VND',
        durationInDays: payload.durationInDays,
        description: payload.description || '',
        isActive: payload.isActive ?? true,
        features: [],
        createdAt: new Date().toISOString().split('T')[0],
      };
      MOCK_PLANS.push(newPlan);
      return newPlan;
    }

    const response = await apiService.post<BackendSubscriptionPlan>(
      `${this.endpoint}/create`,
      payload,
    );
    this.invalidate();
    const data = (response.data ?? response) as BackendSubscriptionPlan;
    return mapPlan(data);
  }

  async updatePlan(
    planId: string,
    payload: UpdateSubscriptionPlanPayload,
  ): Promise<SubscriptionPlanItem> {
    if (ENABLE_MOCK) {
      await new Promise((r) => setTimeout(r, 300));
      const plan = MOCK_PLANS.find((p) => p.id === planId);
      if (!plan) throw new Error('Plan not found');
      Object.assign(plan, payload);
      return { ...plan };
    }

    const response = await apiService.put<BackendSubscriptionPlan>(
      `${this.endpoint}/update/${planId}`,
      payload,
    );
    this.invalidate();
    const data = (response.data ?? response) as BackendSubscriptionPlan;
    return mapPlan(data);
  }

  async deletePlan(planId: string): Promise<void> {
    if (ENABLE_MOCK) {
      await new Promise((r) => setTimeout(r, 300));
      const idx = MOCK_PLANS.findIndex((p) => p.id === planId);
      if (idx !== -1) MOCK_PLANS.splice(idx, 1);
      return;
    }

    await apiService.delete(`${this.endpoint}/${planId}`);
    this.invalidate();
  }

  async togglePlanStatus(planId: string): Promise<SubscriptionPlanItem> {
    if (ENABLE_MOCK) {
      await new Promise((r) => setTimeout(r, 300));
      const plan = MOCK_PLANS.find((p) => p.id === planId);
      if (!plan) throw new Error('Plan not found');
      plan.isActive = !plan.isActive;
      return { ...plan };
    }

    const plan = await this.getPlanById(planId);
    if (!plan) throw new Error('Plan not found');
    return this.updatePlan(planId, { isActive: !plan.isActive });
  }
}

export const subscriptionPlanAdminService = new SubscriptionPlanAdminService();
