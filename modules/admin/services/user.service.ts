import { apiService } from '@/modules/shared/services';
import type { AdminUser, UserListResponse, UserStats, UpdateUserPayload, UserRole, UserStatus } from '../types';

const USE_MOCK = process.env.NEXT_PUBLIC_USE_MOCK === 'true';

// ---------------------------------------------------------------------------
// Backend Account response shape
// ---------------------------------------------------------------------------
interface BackendAccount {
  id: string;
  email: string;
  fullName?: string;
  name?: string;
  // Backend dùng roleId (UUID) thay vì role string
  roleId?: string;
  roleName?: string | null;
  // Một số user có thể có role string trực tiếp
  role?: string;
  status?: string;
  avatarUrl?: string;
  avatar?: string;
  createdAt?: string;
  joinedDate?: string;
  lastLogin?: string;
  lastLoginAt?: string;
}

// AccountRole entity từ backend
interface BackendRole {
  id: string;
  name: string;
}

function resolveRole(a: BackendAccount, roleMap: Record<string, string>): UserRole {
  if (a.roleId && roleMap[a.roleId]) return roleMap[a.roleId] as UserRole;
  if (a.roleName) return a.roleName as UserRole;
  if (a.role) return a.role as UserRole;
  return 'Customer';
}

function mapAccount(a: BackendAccount, roleMap: Record<string, string>): AdminUser {
  return {
    id: a.id,
    fullName: a.fullName || a.name || '',
    email: a.email,
    avatarUrl: a.avatarUrl || a.avatar || undefined,
    role: resolveRole(a, roleMap),
    status: (a.status as UserStatus) || 'Active',
    joinedDate: a.createdAt || a.joinedDate || '',
    lastLogin: a.lastLogin || a.lastLoginAt || undefined,
  };
}

const ROLE_PRIORITY: Record<string, number> = {
  Admin: 0,
  Veterinarian: 1,
  ClinicManager: 2,
  Customer: 3,
};

function sortByRole(users: AdminUser[]): AdminUser[] {
  return [...users].sort(
    (a, b) => (ROLE_PRIORITY[a.role] ?? 99) - (ROLE_PRIORITY[b.role] ?? 99),
  );
}

// ---------------------------------------------------------------------------
// Mock data (còn lại để dùng khi dev offline)
// ---------------------------------------------------------------------------
const MOCK_USERS: AdminUser[] = [
  {
    id: 'u1',
    fullName: 'Nguyễn Văn An',
    email: 'an.nguyen@example.com',
    avatarUrl: 'https://i.pravatar.cc/150?u=u1',
    role: 'Admin',
    status: 'Active',
    joinedDate: '2024-01-15',
    lastLogin: '2026-03-09',
  },
  {
    id: 'u2',
    fullName: 'Trần Thị Bình',
    email: 'binh.tran@example.com',
    avatarUrl: 'https://i.pravatar.cc/150?u=u2',
    role: 'Veterinarian',
    status: 'Active',
    joinedDate: '2024-03-22',
    lastLogin: '2026-03-08',
  },
  {
    id: 'u3',
    fullName: 'Lê Minh Châu',
    email: 'chau.le@example.com',
    role: 'Customer',
    status: 'Active',
    joinedDate: '2024-06-10',
    lastLogin: '2026-03-07',
  },
  {
    id: 'u4',
    fullName: 'Phạm Thị Dung',
    email: 'dung.pham@example.com',
    avatarUrl: 'https://i.pravatar.cc/150?u=u4',
    role: 'ClinicManager',
    status: 'Inactive',
    joinedDate: '2024-08-05',
    lastLogin: '2025-12-01',
  },
  {
    id: 'u5',
    fullName: 'Hoàng Văn Em',
    email: 'em.hoang@example.com',
    role: 'Customer',
    status: 'Banned',
    joinedDate: '2024-09-18',
    lastLogin: '2025-11-20',
  },
  {
    id: 'u6',
    fullName: 'Vũ Thị Fương',
    email: 'fuong.vu@example.com',
    avatarUrl: 'https://i.pravatar.cc/150?u=u6',
    role: 'Veterinarian',
    status: 'Active',
    joinedDate: '2024-11-03',
    lastLogin: '2026-03-09',
  },
  {
    id: 'u7',
    fullName: 'Đặng Văn Giang',
    email: 'giang.dang@example.com',
    role: 'Customer',
    status: 'Active',
    joinedDate: '2025-01-20',
    lastLogin: '2026-03-05',
  },
  {
    id: 'u8',
    fullName: 'Bùi Thị Hoa',
    email: 'hoa.bui@example.com',
    avatarUrl: 'https://i.pravatar.cc/150?u=u8',
    role: 'Customer',
    status: 'Active',
    joinedDate: '2025-02-14',
    lastLogin: '2026-03-08',
  },
];

// ---------------------------------------------------------------------------
// Service
// ---------------------------------------------------------------------------
class UserAdminService {
  private readonly endpoint = '/Account';
  private readonly roleEndpoint = '/AccountRole';

  private _cache: Promise<AdminUser[]> | null = null;
  private _roleCache: Promise<Record<string, string>> | null = null;

  private fetchRoleMap(): Promise<Record<string, string>> {
    if (!this._roleCache) {
      this._roleCache = apiService
        .get<BackendRole[]>(`${this.roleEndpoint}?pageSize=100&pageNumber=1`)
        .then((response) => {
          // response IS the backend body: { success, data: [...roles] }
          const wrapper = response as unknown as { success?: boolean; data?: BackendRole[] };
          const list: BackendRole[] = Array.isArray(wrapper.data) ? wrapper.data : [];
          return Object.fromEntries(list.map((r) => [r.id, r.name]));
        })
        .catch((err: unknown) => {
          // Graceful fallback: if AccountRole endpoint fails, continue without role names
          this._roleCache = null;
          const msg = (err as { message?: string })?.message ?? String(err);
          console.warn('[UserAdminService] fetchRoleMap failed (status:', (err as { status?: number })?.status, '):', msg);
          return {} as Record<string, string>;
        });
    }
    return this._roleCache;
  }

  private fetchAll(): Promise<AdminUser[]> {
    if (!this._cache) {
      this._cache = Promise.all([
        apiService.get<BackendAccount[]>(this.endpoint),
        this.fetchRoleMap(),
      ])
        .then(([response, roleMap]) => {
          const wrapper = response as unknown as { success?: boolean; data?: BackendAccount[] };
          const list: BackendAccount[] = Array.isArray(wrapper.data) ? wrapper.data : [];
          return list.map((a) => mapAccount(a, roleMap));
        })
        .catch((err) => {
          this._cache = null;
          throw err;
        });
      // Auto-expire cache after 30 s
      this._cache.then(() => setTimeout(() => { this._cache = null; }, 30_000));
    }
    return this._cache;
  }

  private invalidate(): void {
    this._cache = null;
  }

  async getStats(): Promise<UserStats> {
    if (USE_MOCK) {
      return {
        totalUsers: 1284,
        activeUsers: 1102,
        bannedUsers: 47,
        newThisMonth: 135,
      };
    }

    const all = await this.fetchAll();
    const now = new Date();
    return {
      totalUsers: all.length,
      activeUsers: all.filter((u) => u.status === 'Active').length,
      bannedUsers: all.filter((u) => u.status === 'Banned').length,
      newThisMonth: all.filter((u) => {
        try {
          const d = new Date(u.joinedDate);
          return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
        } catch {
          return false;
        }
      }).length,
    };
  }

  async getUsers(
    page = 1,
    limit = 10,
    search?: string,
    role?: string,
    status?: string,
  ): Promise<UserListResponse> {
    if (USE_MOCK) {
      let filtered = [...MOCK_USERS];
      if (search) {
        const q = search.toLowerCase();
        filtered = filtered.filter(
          (u) => u.fullName.toLowerCase().includes(q) || u.email.toLowerCase().includes(q),
        );
      }
      if (role) filtered = filtered.filter((u) => u.role === role);
      if (status) filtered = filtered.filter((u) => u.status === status);
      const sorted = sortByRole(filtered);
      const total = sorted.length;
      const totalPages = Math.max(1, Math.ceil(total / limit));
      const start = (page - 1) * limit;
      return { users: sorted.slice(start, start + limit), total, totalPages };
    }

    let all = await this.fetchAll();
    if (search) {
      const q = search.toLowerCase();
      all = all.filter(
        (u) => u.fullName.toLowerCase().includes(q) || u.email.toLowerCase().includes(q),
      );
    }
    if (role) all = all.filter((u) => u.role === role);
    if (status) all = all.filter((u) => u.status === status);

    const sorted = sortByRole(all);
    const total = sorted.length;
    const totalPages = Math.max(1, Math.ceil(total / limit));
    const start = (page - 1) * limit;
    return { users: sorted.slice(start, start + limit), total, totalPages };
  }

  async updateUser(userId: string, payload: UpdateUserPayload): Promise<AdminUser> {
    if (USE_MOCK) {
      const user = MOCK_USERS.find((u) => u.id === userId);
      if (!user) throw new Error('User not found');
      Object.assign(user, payload);
      return { ...user };
    }
    // Backend dùng roleId (UUID), cần map ngược role name → roleId
    let backendPayload: Record<string, unknown> = { ...payload };
    if (payload.role) {
      const roleMap = await this.fetchRoleMap();
      const roleId = Object.entries(roleMap).find(([, name]) => name === payload.role)?.[0];
      if (roleId) {
        const { role: _, ...rest } = backendPayload;
        backendPayload = { ...rest, roleId };
      }
    }
    const response = await apiService.put<BackendAccount>(
      `${this.endpoint}/${userId}`,
      backendPayload,
    );
    this.invalidate();
    const roleMap = await this.fetchRoleMap();
    const data = (response.data ?? response) as BackendAccount;
    return mapAccount(data, roleMap);
  }

  async deleteUser(userId: string): Promise<void> {
    if (USE_MOCK) {
      const idx = MOCK_USERS.findIndex((u) => u.id === userId);
      if (idx !== -1) MOCK_USERS.splice(idx, 1);
      return;
    }
    await apiService.delete(`${this.endpoint}/${userId}`);
    this.invalidate();
  }
}

export const userAdminService = new UserAdminService();
