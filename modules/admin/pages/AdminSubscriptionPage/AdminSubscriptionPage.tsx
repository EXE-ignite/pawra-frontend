'use client';

import { useState, useEffect } from 'react';
import { subscriptionAdminService } from '../../services/subscription.service';
import { SubscriptionTable } from '../../components/SubscriptionTable';
import { SubscriptionSearchBar } from '../../components/SubscriptionSearchBar';
import { SubscriptionEditModal } from '../../components/SubscriptionEditModal';
import type {
  Subscription,
  SubscriptionPlan,
  SubscriptionStatus,
  SubscriptionStats,
} from '../../types/subscription.types';
import { AdminSubscriptionPageProps } from './AdminSubscriptionPage.types';
import styles from './AdminSubscriptionPage.module.scss';

const DEFAULT_STATS: SubscriptionStats = {
  totalSubscriptions: 0,
  activeSubscriptions: 0,
  expiredSubscriptions: 0,
  trialSubscriptions: 0,
  monthlyRevenue: 0,
};

export function AdminSubscriptionPage({ initialStats = DEFAULT_STATS }: AdminSubscriptionPageProps) {
  const [stats, setStats] = useState<SubscriptionStats>(initialStats);
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [totalSubscriptions, setTotalSubscriptions] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const [search, setSearch] = useState('');
  const [planFilter, setPlanFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editingSub, setEditingSub] = useState<Subscription | null>(null);

  const loadData = async (
    page = currentPage,
    q = search,
    plan = planFilter,
    status = statusFilter,
  ) => {
    try {
      setLoading(true);
      setError(null);
      const [fetchedStats, listData] = await Promise.all([
        page === 1 ? subscriptionAdminService.getStats() : Promise.resolve(stats),
        subscriptionAdminService.getSubscriptions(page, 10, q || undefined, plan || undefined, status || undefined),
      ]);
      if (page === 1) setStats(fetchedStats);
      setSubscriptions(listData.subscriptions);
      setTotalSubscriptions(listData.total);
      setTotalPages(listData.totalPages);
    } catch (err: unknown) {
      const apiErr = err as { message?: string; status?: number };
      const msg = apiErr?.message ?? (err instanceof Error ? err.message : String(err));
      console.error('[AdminSubscriptionPage] Failed to fetch subscriptions:', msg);
      setError(msg || 'Khong the tai danh sach subscription. Vui long thu lai.');
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
    loadData(1, query, planFilter, statusFilter);
  };

  const handlePlanChange = (plan: string) => {
    setPlanFilter(plan);
    setCurrentPage(1);
    loadData(1, search, plan, statusFilter);
  };

  const handleStatusChange = (status: string) => {
    setStatusFilter(status);
    setCurrentPage(1);
    loadData(1, search, planFilter, status);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    loadData(page, search, planFilter, statusFilter);
  };

  const handleSave = async (
    subscriptionId: string,
    plan: SubscriptionPlan,
    status: SubscriptionStatus,
    autoRenew: boolean,
  ) => {
    await subscriptionAdminService.updateSubscription(subscriptionId, { plan, status, autoRenew });
    await loadData(currentPage, search, planFilter, statusFilter);
  };

  const handleDelete = async (subscriptionId: string) => {
    await subscriptionAdminService.deleteSubscription(subscriptionId);
    await loadData(currentPage, search, planFilter, statusFilter);
  };

  const handleActivate = async (subscriptionId: string) => {
    await subscriptionAdminService.activateSubscription(subscriptionId);
    await loadData(currentPage, search, planFilter, statusFilter);
  };

  const formatRevenue = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(amount);
  };

  const statCards = [
    {
      key: 'total',
      label: 'Tong subscription',
      value: stats.totalSubscriptions.toLocaleString(),
      icon: '📋',
      color: styles.cardBlue,
    },
    {
      key: 'active',
      label: 'Dang hoat dong',
      value: stats.activeSubscriptions.toLocaleString(),
      icon: '✅',
      color: styles.cardGreen,
    },
    {
      key: 'expired',
      label: 'Het han',
      value: stats.expiredSubscriptions.toLocaleString(),
      icon: '⏰',
      color: styles.cardRed,
    },
    {
      key: 'trial',
      label: 'Dung thu',
      value: stats.trialSubscriptions.toLocaleString(),
      icon: '🆓',
      color: styles.cardPurple,
    },
    {
      key: 'revenue',
      label: 'Doanh thu thang',
      value: formatRevenue(stats.monthlyRevenue),
      icon: '💰',
      color: styles.cardYellow,
    },
  ];

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <div>
          <h1 className={styles.title}>Quan ly Subscription</h1>
          <p className={styles.subtitle}>Quan ly goi dang ky, trang thai va thanh toan cua nguoi dung</p>
        </div>
      </div>

      <div className={styles.statsGrid}>
        {statCards.map((card) => (
          <div key={card.key} className={`${styles.statCard} ${card.color}`}>
            <div className={styles.statIcon}>{card.icon}</div>
            <div className={styles.statContent}>
              <p className={styles.statLabel}>{card.label}</p>
              <h2 className={styles.statValue}>{card.value}</h2>
            </div>
          </div>
        ))}
      </div>

      {loading ? (
        <div className={styles.loadingState}>
          <div className={styles.spinner} />
          <p>Dang tai du lieu...</p>
        </div>
      ) : error ? (
        <div className={styles.errorState}>
          <p className={styles.errorMessage}>⚠️ {error}</p>
          <button className={styles.retryButton} onClick={() => loadData(1, '', '', '')}>
            Thu lai
          </button>
        </div>
      ) : (
        <div className={styles.tableSection}>
          <SubscriptionSearchBar
            value={search}
            planFilter={planFilter}
            statusFilter={statusFilter}
            onSearch={handleSearch}
            onPlanChange={handlePlanChange}
            onStatusChange={handleStatusChange}
          />
          <SubscriptionTable
            subscriptions={subscriptions}
            currentPage={currentPage}
            totalPages={totalPages}
            totalResults={totalSubscriptions}
            onPageChange={handlePageChange}
            onEdit={(sub) => setEditingSub(sub)}
            onDelete={handleDelete}
            onActivate={handleActivate}
          />
        </div>
      )}

      <SubscriptionEditModal
        subscription={editingSub}
        isOpen={!!editingSub}
        onClose={() => setEditingSub(null)}
        onSave={handleSave}
      />
    </div>
  );
}
