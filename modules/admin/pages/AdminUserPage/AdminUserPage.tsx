'use client';

import { useState, useEffect } from 'react';
import { userAdminService } from '../../services';
import { UserTable } from '../../components/UserTable';
import { UserSearchBar } from '../../components/UserSearchBar';
import { UserEditModal } from '../../components/UserEditModal';
import type { AdminUser, UserRole, UserStatus, UserStats } from '../../types';
import { AdminUserPageProps } from './AdminUserPage.types';
import styles from './AdminUserPage.module.scss';

const DEFAULT_STATS: UserStats = {
  totalUsers: 0,
  activeUsers: 0,
  bannedUsers: 0,
  newThisMonth: 0,
};

export function AdminUserPage({ initialStats = DEFAULT_STATS }: AdminUserPageProps) {
  const [stats, setStats] = useState<UserStats>(initialStats);
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [totalUsers, setTotalUsers] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editingUser, setEditingUser] = useState<AdminUser | null>(null);

  const loadData = async (
    page = currentPage,
    q = search,
    role = roleFilter,
    status = statusFilter,
  ) => {
    try {
      setLoading(true);
      setError(null);
      const [fetchedStats, listData] = await Promise.all([
        page === 1 ? userAdminService.getStats() : Promise.resolve(stats),
        userAdminService.getUsers(page, 10, q || undefined, role || undefined, status || undefined),
      ]);
      if (page === 1) setStats(fetchedStats);
      setUsers(listData.users);
      setTotalUsers(listData.total);
      setTotalPages(listData.totalPages);
    } catch (err: unknown) {
      const apiErr = err as { message?: string; status?: number };
      const msg = apiErr?.message ?? (err instanceof Error ? err.message : String(err));
      console.error('[AdminUserPage] Failed to fetch users — status:', apiErr?.status, '| message:', msg, '| raw:', err);
      setError(msg || 'Không thể tải danh sách người dùng. Vui lòng thử lại.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData(1, '', '', '');
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSearch = (query: string) => {
    setSearch(query);
    setCurrentPage(1);
    loadData(1, query, roleFilter, statusFilter);
  };

  const handleRoleChange = (role: string) => {
    setRoleFilter(role);
    setCurrentPage(1);
    loadData(1, search, role, statusFilter);
  };

  const handleStatusChange = (status: string) => {
    setStatusFilter(status);
    setCurrentPage(1);
    loadData(1, search, roleFilter, status);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    loadData(page, search, roleFilter, statusFilter);
  };

  const handleSave = async (userId: string, role: UserRole, status: UserStatus) => {
    await userAdminService.updateUser(userId, { role, status });
    // Refresh current page
    await loadData(currentPage, search, roleFilter, statusFilter);
  };

  const handleDelete = async (userId: string) => {
    await userAdminService.deleteUser(userId);
    await loadData(currentPage, search, roleFilter, statusFilter);
  };

  const statCards = [
    {
      key: 'total',
      label: 'Tổng người dùng',
      value: stats.totalUsers,
      icon: '👥',
      color: styles.cardBlue,
    },
    {
      key: 'active',
      label: 'Đang hoạt động',
      value: stats.activeUsers,
      icon: '✅',
      color: styles.cardGreen,
    },
    {
      key: 'banned',
      label: 'Bị khóa',
      value: stats.bannedUsers,
      icon: '🚫',
      color: styles.cardRed,
    },
    {
      key: 'new',
      label: 'Mới tháng này',
      value: stats.newThisMonth,
      icon: '🆕',
      color: styles.cardPurple,
    },
  ];

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <div>
          <h1 className={styles.title}>Quản lí người dùng</h1>
          <p className={styles.subtitle}>Quản lí tài khoản, vai trò và trạng thái người dùng</p>
        </div>
      </div>

      <div className={styles.statsGrid}>
        {statCards.map((card) => (
          <div key={card.key} className={`${styles.statCard} ${card.color}`}>
            <div className={styles.statIcon}>{card.icon}</div>
            <div className={styles.statContent}>
              <p className={styles.statLabel}>{card.label}</p>
              <h2 className={styles.statValue}>{card.value.toLocaleString()}</h2>
            </div>
          </div>
        ))}
      </div>

      {loading ? (
        <div className={styles.loadingState}>
          <div className={styles.spinner} />
          <p>Đang tải dữ liệu...</p>
        </div>
      ) : error ? (
        <div className={styles.errorState}>
          <p className={styles.errorMessage}>⚠️ {error}</p>
          <button className={styles.retryButton} onClick={() => loadData(1, '', '', '')}>
            Thử lại
          </button>
        </div>
      ) : (
        <div className={styles.tableSection}>
          <UserSearchBar
            value={search}
            roleFilter={roleFilter}
            statusFilter={statusFilter}
            onSearch={handleSearch}
            onRoleChange={handleRoleChange}
            onStatusChange={handleStatusChange}
          />
          <UserTable
            users={users}
            currentPage={currentPage}
            totalPages={totalPages}
            totalResults={totalUsers}
            onPageChange={handlePageChange}
            onEdit={(user) => setEditingUser(user)}
            onDelete={handleDelete}
          />
        </div>
      )}

      <UserEditModal
        user={editingUser}
        isOpen={!!editingUser}
        onClose={() => setEditingUser(null)}
        onSave={handleSave}
      />
    </div>
  );
}
