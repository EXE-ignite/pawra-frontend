'use client';

import { PlanTableProps } from './PlanTable.types';
import styles from './PlanTable.module.scss';

export function PlanTable({
  plans,
  currentPage,
  totalPages,
  totalResults,
  onPageChange,
  onEdit,
  onDelete,
  onToggleStatus,
}: PlanTableProps) {
  const safePlans = plans || [];

  const formatPrice = (price: number, currency: string) => {
    if (price === 0) return 'Mien phi';
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: currency || 'VND',
    }).format(price);
  };

  const formatDuration = (days: number) => {
    if (days === 30) return '1 thang';
    if (days === 90) return '3 thang';
    if (days === 180) return '6 thang';
    if (days === 365) return '1 nam';
    return `${days} ngay`;
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
              <th>Ten goi</th>
              <th>Gia</th>
              <th>Thoi han</th>
              <th>Mo ta</th>
              <th>Trang thai</th>
              <th>Thao tac</th>
            </tr>
          </thead>
          <tbody>
            {safePlans.length === 0 ? (
              <tr>
                <td colSpan={6} className={styles.emptyState}>
                  Khong co goi dang ky nao
                </td>
              </tr>
            ) : (
              safePlans.map((plan) => (
                <tr key={plan.id}>
                  <td>
                    <div className={styles.planName}>
                      <span className={`${styles.planIcon} ${styles[`plan${plan.name}`]}`}>
                        {plan.name.charAt(0)}
                      </span>
                      <span className={styles.planTitle}>{plan.name}</span>
                    </div>
                  </td>
                  <td className={styles.priceCell}>
                    {formatPrice(plan.price, plan.currency)}
                  </td>
                  <td className={styles.durationCell}>
                    {formatDuration(plan.durationInDays)}
                  </td>
                  <td className={styles.descCell}>
                    <span className={styles.description}>{plan.description}</span>
                  </td>
                  <td>
                    <button
                      className={`${styles.statusToggle} ${plan.isActive ? styles.active : styles.inactive}`}
                      onClick={() => onToggleStatus(plan.id)}
                    >
                      <span className={styles.statusDot} />
                      {plan.isActive ? 'Hoat dong' : 'Tam ngung'}
                    </button>
                  </td>
                  <td>
                    <div className={styles.actions}>
                      <button
                        className={styles.editButton}
                        onClick={() => onEdit(plan)}
                        title="Chinh sua"
                      >
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                          <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04a1 1 0 000-1.41l-2.34-2.34a1 1 0 00-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z" fill="currentColor"/>
                        </svg>
                      </button>
                      <button
                        className={styles.deleteButton}
                        onClick={() => {
                          if (confirm(`Xoa goi "${plan.name}"? Hanh dong nay khong the hoan tac.`)) {
                            onDelete(plan.id);
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
            Tong <strong>{totalResults}</strong> goi dang ky
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
