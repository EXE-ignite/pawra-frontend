import { apiService } from '@/modules/shared/services';
import type { AdminUser, UserListResponse, UserStats, UpdateUserPayload } from '../types';

const USE_MOCK = true;

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
    role: 'Vet',
    status: 'Active',
    joinedDate: '2024-03-22',
    lastLogin: '2026-03-08',
  },
  {
    id: 'u3',
    fullName: 'Lê Minh Châu',
    email: 'chau.le@example.com',
    role: 'PetOwner',
    status: 'Active',
    joinedDate: '2024-06-10',
    lastLogin: '2026-03-07',
  },
  {
    id: 'u4',
    fullName: 'Phạm Thị Dung',
    email: 'dung.pham@example.com',
    avatarUrl: 'https://i.pravatar.cc/150?u=u4',
    role: 'Staff',
    status: 'Inactive',
    joinedDate: '2024-08-05',
    lastLogin: '2025-12-01',
  },
  {
    id: 'u5',
    fullName: 'Hoàng Văn Em',
    email: 'em.hoang@example.com',
    role: 'PetOwner',
    status: 'Banned',
    joinedDate: '2024-09-18',
    lastLogin: '2025-11-20',
  },
  {
    id: 'u6',
    fullName: 'Vũ Thị Fương',
    email: 'fuong.vu@example.com',
    avatarUrl: 'https://i.pravatar.cc/150?u=u6',
    role: 'Receptionist',
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
    role: 'PetOwner',
    status: 'Active',
    joinedDate: '2025-02-14',
    lastLogin: '2026-03-08',
  },
];

class UserAdminService {
  private readonly endpoint = '/admin/users';

  async getStats(): Promise<UserStats> {
    if (USE_MOCK) {
      return {
        totalUsers: 1284,
        activeUsers: 1102,
        bannedUsers: 47,
        newThisMonth: 135,
      };
    }
    const response = await apiService.get<UserStats>(`${this.endpoint}/stats`);
    return response.data;
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
          (u) =>
            u.fullName.toLowerCase().includes(q) ||
            u.email.toLowerCase().includes(q),
        );
      }
      if (role) {
        filtered = filtered.filter((u) => u.role === role);
      }
      if (status) {
        filtered = filtered.filter((u) => u.status === status);
      }

      const total = filtered.length;
      const totalPages = Math.max(1, Math.ceil(total / limit));
      const start = (page - 1) * limit;
      const users = filtered.slice(start, start + limit);

      return { users, total, totalPages };
    }

    const params = new URLSearchParams({
      page: String(page),
      limit: String(limit),
      ...(search ? { search } : {}),
      ...(role ? { role } : {}),
      ...(status ? { status } : {}),
    });

    const response = await apiService.get<UserListResponse>(
      `${this.endpoint}?${params.toString()}`,
    );
    return response.data;
  }

  async updateUser(userId: string, payload: UpdateUserPayload): Promise<AdminUser> {
    if (USE_MOCK) {
      const user = MOCK_USERS.find((u) => u.id === userId);
      if (!user) throw new Error('User not found');
      Object.assign(user, payload);
      return { ...user };
    }
    const response = await apiService.patch<AdminUser>(
      `${this.endpoint}/${userId}`,
      payload,
    );
    return response.data;
  }

  async deleteUser(userId: string): Promise<void> {
    if (USE_MOCK) {
      const idx = MOCK_USERS.findIndex((u) => u.id === userId);
      if (idx !== -1) MOCK_USERS.splice(idx, 1);
      return;
    }
    await apiService.delete(`${this.endpoint}/${userId}`);
  }
}

export const userAdminService = new UserAdminService();
