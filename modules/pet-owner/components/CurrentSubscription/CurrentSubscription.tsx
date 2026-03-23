'use client';

import React from 'react';
import type { UserSubscription } from '../../types';
import { userSubscriptionService } from '../../services';
import styles from './CurrentSubscription.module.scss';

interface CurrentSubscriptionProps {
  subscription: UserSubscription | null;
  onUpgrade?: () => void;
  onCancel?: () => void;
  loading?: boolean;
}

export function CurrentSubscription({
  subscription,
  onUpgrade,
  onCancel,
  loading,
}: CurrentSubscriptionProps) {
  if (!subscription) {
    return (
      <div className={styles.card}>
        <div className={styles.empty}>
          <span className={styles.emptyIcon}>📦</span>
          <h3 className={styles.emptyTitle}>Chưa có gói đăng ký</h3>
          <p className={styles.emptyText}>
            Bạn đang sử dụng gói miễn phí. Nâng cấp để trải nghiệm đầy đủ tính năng!
          </p>
          <button className={styles.upgradeButton} onClick={onUpgrade}>
            Xem các gói
          </button>
        </div>
      </div>
    );
  }

  const statusLabels: Record<string, { label: string; className: string }> = {
    active: { label: 'Đang hoạt động', className: styles.statusActive },
    cancelled: { label: 'Đã hủy', className: styles.statusCancelled },
    expired: { label: 'Đã hết hạn', className: styles.statusExpired },
  };

  const status = statusLabels[subscription.status] || statusLabels.expired;

  return (
    <div className={styles.card}>
      <div className={styles.header}>
        <div className={styles.planInfo}>
          <h3 className={styles.planName}>{subscription.planName}</h3>
          <span className={`${styles.status} ${status.className}`}>{status.label}</span>
        </div>
        <div className={styles.price}>
          {userSubscriptionService.formatPrice(subscription.price, subscription.currency)}
          <span className={styles.period}>/ tháng</span>
        </div>
      </div>

      <div className={styles.details}>
        <div className={styles.detailItem}>
          <span className={styles.detailLabel}>Ngày bắt đầu</span>
          <span className={styles.detailValue}>
            {new Date(subscription.startDate).toLocaleDateString('vi-VN')}
          </span>
        </div>
        <div className={styles.detailItem}>
          <span className={styles.detailLabel}>Ngày hết hạn</span>
          <span className={styles.detailValue}>
            {new Date(subscription.endDate).toLocaleDateString('vi-VN')}
          </span>
        </div>
        <div className={styles.detailItem}>
          <span className={styles.detailLabel}>Còn lại</span>
          <span className={`${styles.detailValue} ${subscription.daysRemaining <= 7 ? styles.warning : ''}`}>
            {subscription.daysRemaining} ngày
          </span>
        </div>
      </div>

      {subscription.status === 'active' && (
        <div className={styles.actions}>
          <button
            className={styles.upgradeButton}
            onClick={onUpgrade}
            disabled={loading}
          >
            Đổi gói
          </button>
          <button
            className={styles.cancelButton}
            onClick={onCancel}
            disabled={loading}
          >
            Hủy gói
          </button>
        </div>
      )}

      {subscription.status === 'cancelled' && (
        <div className={styles.notice}>
          <span className={styles.noticeIcon}>ℹ️</span>
          Gói của bạn sẽ hết hiệu lực vào {new Date(subscription.endDate).toLocaleDateString('vi-VN')}
        </div>
      )}

      {subscription.status === 'expired' && (
        <div className={styles.actions}>
          <button className={styles.upgradeButton} onClick={onUpgrade}>
            Gia hạn ngay
          </button>
        </div>
      )}
    </div>
  );
}
