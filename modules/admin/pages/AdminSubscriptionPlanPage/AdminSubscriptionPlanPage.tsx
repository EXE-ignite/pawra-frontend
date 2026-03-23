'use client';

import { useState, useEffect } from 'react';
import { subscriptionPlanAdminService } from '../../services/subscription-plan.service';
import { PlanTable } from '../../components/PlanTable';
import { PlanSearchBar } from '../../components/PlanSearchBar';
import { PlanEditModal } from '../../components/PlanEditModal';
import type {
  SubscriptionPlanItem,
  SubscriptionPlanStats,
} from '../../types/subscription-plan.types';
import { AdminSubscriptionPlanPageProps } from './AdminSubscriptionPlanPage.types';
import styles from './AdminSubscriptionPlanPage.module.scss';

const DEFAULT_STATS: SubscriptionPlanStats = {
  totalPlans: 0,
  activePlans: 0,
  inactivePlans: 0,
  totalSubscribers: 0,
};

export function AdminSubscriptionPlanPage({ initialStats = DEFAULT_STATS }: AdminSubscriptionPlanPageProps) {
  const [stats, setStats] = useState<SubscriptionPlanStats>(initialStats);
  const [plans, setPlans] = useState<SubscriptionPlanItem[]>([]);
  const [totalPlans, setTotalPlans] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editingPlan, setEditingPlan] = useState<SubscriptionPlanItem | null>(null);
  const [isCreateMode, setIsCreateMode] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);

  const loadData = async (
    page = currentPage,
    q = search,
    status = statusFilter,
  ) => {
    try {
      setLoading(true);
      setError(null);
      const [fetchedStats, listData] = await Promise.all([
        page === 1 ? subscriptionPlanAdminService.getStats() : Promise.resolve(stats),
        subscriptionPlanAdminService.getPlans(page, 10, q || undefined, status || undefined),
      ]);
      if (page === 1) setStats(fetchedStats);
      setPlans(listData.plans);
      setTotalPlans(listData.total);
      setTotalPages(listData.totalPages);
    } catch (err: unknown) {
      const apiErr = err as { message?: string; status?: number };
      const msg = apiErr?.message ?? (err instanceof Error ? err.message : String(err));
      console.error('[AdminSubscriptionPlanPage] Failed to fetch plans:', msg);
      setError(msg || 'Khong the tai danh sach goi dang ky. Vui long thu lai.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData(1, '', '');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSearch = (query: string) => {
    setSearch(query);
    setCurrentPage(1);
    loadData(1, query, statusFilter);
  };

  const handleStatusChange = (status: string) => {
    setStatusFilter(status);
    setCurrentPage(1);
    loadData(1, search, status);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    loadData(page, search, statusFilter);
  };

  const handleAddNew = () => {
    setEditingPlan(null);
    setIsCreateMode(true);
    setModalOpen(true);
  };

  const handleEdit = (plan: SubscriptionPlanItem) => {
    setEditingPlan(plan);
    setIsCreateMode(false);
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setEditingPlan(null);
    setIsCreateMode(false);
  };

  const handleSave = async (
    planId: string | null,
    data: {
      name: string;
      price: number;
      durationInDays: number;
      description: string;
      isActive: boolean;
    },
  ) => {
    if (planId) {
      await subscriptionPlanAdminService.updatePlan(planId, data);
    } else {
      await subscriptionPlanAdminService.createPlan(data);
    }
    await loadData(currentPage, search, statusFilter);
  };

  const handleDelete = async (planId: string) => {
    await subscriptionPlanAdminService.deletePlan(planId);
    await loadData(currentPage, search, statusFilter);
  };

  const handleToggleStatus = async (planId: string) => {
    await subscriptionPlanAdminService.togglePlanStatus(planId);
    await loadData(currentPage, search, statusFilter);
  };

  const statCards = [
    {
      key: 'total',
      label: 'Tong goi',
      value: stats.totalPlans.toLocaleString(),
      icon: '📦',
      color: styles.cardBlue,
    },
    {
      key: 'active',
      label: 'Dang hoat dong',
      value: stats.activePlans.toLocaleString(),
      icon: '✅',
      color: styles.cardGreen,
    },
    {
      key: 'inactive',
      label: 'Tam ngung',
      value: stats.inactivePlans.toLocaleString(),
      icon: '⏸️',
      color: styles.cardRed,
    },
    {
      key: 'subscribers',
      label: 'Tong nguoi dang ky',
      value: stats.totalSubscribers.toLocaleString(),
      icon: '👥',
      color: styles.cardPurple,
    },
  ];

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <div>
          <h1 className={styles.title}>Quan ly Goi dang ky</h1>
          <p className={styles.subtitle}>Tao va quan ly cac goi subscription cho nguoi dung</p>
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
          <button className={styles.retryButton} onClick={() => loadData(1, '', '')}>
            Thu lai
          </button>
        </div>
      ) : (
        <div className={styles.tableSection}>
          <PlanSearchBar
            value={search}
            statusFilter={statusFilter}
            onSearch={handleSearch}
            onStatusChange={handleStatusChange}
            onAddNew={handleAddNew}
          />
          <PlanTable
            plans={plans}
            currentPage={currentPage}
            totalPages={totalPages}
            totalResults={totalPlans}
            onPageChange={handlePageChange}
            onEdit={handleEdit}
            onDelete={handleDelete}
            onToggleStatus={handleToggleStatus}
          />
        </div>
      )}

      <PlanEditModal
        plan={editingPlan}
        isOpen={modalOpen}
        isCreateMode={isCreateMode}
        onClose={handleCloseModal}
        onSave={handleSave}
      />
    </div>
  );
}
