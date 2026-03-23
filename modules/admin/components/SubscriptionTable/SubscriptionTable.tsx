'use client';

import Image from 'next/image';
import { SubscriptionTableProps } from './SubscriptionTable.types';
import styles from './SubscriptionTable.module.scss';

const PLAN_LABELS: Record<string, string> = {
  Basic: 'Basic',
  Premium: 'Premium',
  VIP: 'VIP',
};

const STATUS_LABELS: Record<string, string> = {
  Active: 'Hoat dong',
  Expired: 'Het han',
  Cancelled: 'Da huy',
  Trial: 'Dung thu',
};

const PAYMENT_LABELS: Record<string, string> = {
  CreditCard: 'The tin dung',
  BankTransfer: 'Chuyen khoan',
  Momo: 'MoMo',
  ZaloPay: 'ZaloPay',
};

export function SubscriptionTable({
  subscriptions,
  currentPage,
  totalPages,
  totalResults,
  onPageChange,
  onEdit,
  onDelete,
}: SubscriptionTableProps) {
  const safeSubs = subscriptions || [];

  const getStatusClass = (status: string) => {
    switch (status) {
      case 'Active':
        return styles.statusActive;
      case 'Expired':
        return styles.statusExpired;
      case 'Cancelled':
        return styles.statusCancelled;
      case 'Trial':
        return styles.statusTrial;
      default:
        return '';
    }
  };

  const getPlanClass = (plan: string) => {
    switch (plan) {
      case 'VIP':
        return styles.planVip;
      case 'Premium':
        return styles.planPremium;
      case 'Basic':
        return styles.planBasic;
      default:
        return styles.planDefault;
    }
  };

  const formatDate = (dateStr: string) => {
    try {
      return new Date(dateStr).toLocaleDateString('vi-VN', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
      });
    } catch {
      return dateStr;
    }
  };

  const formatPrice = (price: number, currency: string) => {
    if (price === 0) return 'Mien phi';
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: currency || 'VND',
    }).format(price);
  };

  const renderPagination = () => {
    const pages = [];
    const maxVisible = 5;
    let startPage = Math.max(1, currentPage - Math.floor(maxVisible / 2));
    let endPage = Math.min(totalPages, startPage + maxVisible - 1);
    if (endPage - startPage < maxVisible - 1) {
      startPage = Math.max(1, endPage - maxVisible + 1);
    }
    for (let i = startPage; i <= endPage; i++) {
      pages.push(
        <button
          key={i}
          className={`${styles.pageButton} ${i === currentPage ? styles.active : ''}`}
          onClick={() => onPageChange(i)}
        >
          {i}
        </button>,
      );
    }
    if (startPage > 1) {
      pages.unshift(<span key="ellipsis-start" className={styles.ellipsis}>...</span>);
    }
    if (endPage < totalPages) {
      pages.push(<span key="ellipsis-end" className={styles.ellipsis}>...</span>);
    }
    return pages;
  };

  return (
    <div className={styles.tableContainer}>
      <div className={styles.tableWrapper}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Nguoi dung</th>
              <th>Goi</th>
              <th>Trang thai</th>
              <th>Gia</th>
              <th>Thanh toan</th>
              <th>Thoi han</th>
              <th>Tu gia han</th>
              <th>Thao tac</th>
            </tr>
          </thead>
          <tbody>
            {safeSubs.length === 0 ? (
              <tr>
                <td colSpan={8} className={styles.emptyState}>
                  Khong co subscription nao
                </td>
              </tr>
            ) : (
              safeSubs.map((sub) => (
                <tr key={sub.id}>
                  <td>
                    <div className={styles.userCell}>
                      {sub.userAvatarUrl ? (
                        <div className={styles.avatar}>
                          <Image
                            src={sub.userAvatarUrl}
                            alt={sub.userName}
                            fill
                            style={{ objectFit: 'cover' }}
                          />
                        </div>
                      ) : (
                        <div className={styles.avatarInitials}>
                          {sub.userName.charAt(0).toUpperCase()}
                        </div>
                      )}
                      <div className={styles.userInfo}>
                        <p className={styles.userName}>{sub.userName}</p>
                        <p className={styles.userEmail}>{sub.userEmail}</p>
                      </div>
                    </div>
                  </td>
                  <td>
                    <span className={`${styles.planBadge} ${getPlanClass(sub.plan)}`}>
                      {PLAN_LABELS[sub.plan] ?? sub.plan}
                    </span>
                  </td>
                  <td>
                    <span className={`${styles.status} ${getStatusClass(sub.status)}`}>
                      <span className={styles.statusDot} />
                      {STATUS_LABELS[sub.status] ?? sub.status}
                    </span>
                  </td>
                  <td className={styles.priceCell}>
                    {formatPrice(sub.price, sub.currency)}
                  </td>
                  <td className={styles.dateCell}>
                    {PAYMENT_LABELS[sub.paymentMethod] ?? sub.paymentMethod}
                  </td>
                  <td className={styles.dateCell}>
                    {formatDate(sub.startDate)} - {formatDate(sub.endDate)}
                  </td>
                  <td>
                    <span className={sub.autoRenew ? styles.renewYes : styles.renewNo}>
                      {sub.autoRenew ? 'Co' : 'Khong'}
                    </span>
                  </td>
                  <td>
                    <div className={styles.actions}>
                      <button
                        className={styles.editButton}
                        onClick={() => onEdit(sub)}
                        title="Chinh sua"
                      >
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                          <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04a1 1 0 000-1.41l-2.34-2.34a1 1 0 00-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z" fill="currentColor"/>
                        </svg>
                      </button>
                      <button
                        className={styles.deleteButton}
                        onClick={() => {
                          if (confirm(`Xoa subscription cua "${sub.userName}"?`)) {
                            onDelete(sub.id);
                          }
                        }}
                        title="Xoa"
                      >
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                          <path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z" fill="currentColor"/>
                        </svg>
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <div className={styles.pagination}>
          <p className={styles.paginationInfo}>
            Tong <strong>{totalResults}</strong> subscription
          </p>
          <div className={styles.paginationButtons}>
            <button
              className={styles.pageButton}
              onClick={() => onPageChange(currentPage - 1)}
              disabled={currentPage <= 1}
            >
              &lsaquo;
            </button>
            {renderPagination()}
            <button
              className={styles.pageButton}
              onClick={() => onPageChange(currentPage + 1)}
              disabled={currentPage >= totalPages}
            >
              &rsaquo;
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
