'use client';

import React from 'react';
import type { SubscriptionPlan } from '../../types';
import { userSubscriptionService } from '../../services';
import styles from './PlanCard.module.scss';

interface PlanCardProps {
  plan: SubscriptionPlan;
  isCurrentPlan?: boolean;
  onSelect?: (plan: SubscriptionPlan) => void;
  loading?: boolean;
}

export function PlanCard({ plan, isCurrentPlan, onSelect, loading }: PlanCardProps) {
  const formattedPrice = userSubscriptionService.formatPrice(plan.price, plan.currency);
  const duration = userSubscriptionService.formatDuration(plan.durationInDays);

  return (
    <div
      className={`${styles.card} ${plan.isPopular ? styles.popular : ''} ${isCurrentPlan ? styles.current : ''}`}
    >
      {plan.isPopular && (
        <div className={styles.popularBadge}>Phổ biến nhất</div>
      )}
      {isCurrentPlan && (
        <div className={styles.currentBadge}>Gói hiện tại</div>
      )}

      <div className={styles.header}>
        <h3 className={styles.planName}>{plan.name}</h3>
        <p className={styles.description}>{plan.description}</p>
      </div>

      <div className={styles.pricing}>
        <span className={styles.price}>{formattedPrice}</span>
        {plan.price > 0 && <span className={styles.duration}>{duration}</span>}
      </div>

      <ul className={styles.features}>
        {plan.features.map((feature, index) => (
          <li key={index} className={styles.feature}>
            <span className={styles.checkIcon}>✓</span>
            {feature}
          </li>
        ))}
      </ul>

      <button
        className={`${styles.selectButton} ${isCurrentPlan ? styles.disabled : ''}`}
        onClick={() => !isCurrentPlan && onSelect?.(plan)}
        disabled={isCurrentPlan || loading}
      >
        {loading ? (
          <span className={styles.spinner} />
        ) : isCurrentPlan ? (
          'Đang sử dụng'
        ) : plan.price === 0 ? (
          'Bắt đầu miễn phí'
        ) : (
          'Chọn gói này'
        )}
      </button>
    </div>
  );
}
