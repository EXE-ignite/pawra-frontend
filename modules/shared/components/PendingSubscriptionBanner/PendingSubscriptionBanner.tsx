'use client';

import Link from 'next/link';
import { useSubscription } from '../../contexts/SubscriptionContext';
import styles from './PendingSubscriptionBanner.module.scss';

/**
 * Shows a dismissible warning banner when the user's subscription is pending
 * admin activation. Renders nothing for any other subscription state.
 */
export function PendingSubscriptionBanner({ subscriptionHref = '/pet-owner/subscription' }: { subscriptionHref?: string }) {
  const { subscriptionStatus } = useSubscription();

  if (subscriptionStatus !== 'pending') return null;

  return (
    <div className={styles.banner} role="status">
      <span className={styles.icon}>⏳</span>
      <p className={styles.text}>
        Gói đăng ký của bạn đang <strong>chờ xác nhận thanh toán</strong>.
        Các tính năng sẽ được kích hoạt ngay sau khi admin xác nhận.
      </p>
      <Link href={subscriptionHref} className={styles.link}>
        Xem chi tiết
      </Link>
    </div>
  );
}
