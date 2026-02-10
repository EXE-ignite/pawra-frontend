import { StatCardProps } from './StatCard.types';
import styles from './StatCard.module.scss';

export function StatCard({ icon, label, value, badge }: StatCardProps) {
  const renderIcon = () => {
    switch (icon) {
      case 'views':
        return (
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path d="M12 5C7 5 2.73 8.11 1 12.5 2.73 16.89 7 20 12 20s9.27-3.11 11-7.5C21.27 8.11 17 5 12 5zm0 12.5c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z" fill="currentColor"/>
          </svg>
        );
      case 'posts':
        return (
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-5 14H7v-2h7v2zm3-4H7v-2h10v2zm0-4H7V7h10v2z" fill="currentColor"/>
          </svg>
        );
      case 'comments':
        return (
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm0 14H6l-2 2V4h16v12z" fill="currentColor"/>
          </svg>
        );
    }
  };

  return (
    <div className={styles.statCard}>
      <div className={styles.iconWrapper}>
        <div className={styles.icon}>{renderIcon()}</div>
        {badge && (
          <span className={`${styles.badge} ${styles[badge.variant]}`}>
            {badge.text}
          </span>
        )}
      </div>
      <div className={styles.content}>
        <p className={styles.label}>{label}</p>
        <h2 className={styles.value}>{value.toLocaleString()}</h2>
      </div>
    </div>
  );
}
