import React from 'react';
import styles from './StatCard.module.scss';

interface StatCardProps {
  icon: string;
  label: string;
  value: number;
  change?: string;
}

export function StatCard({ icon, label, value, change }: StatCardProps) {
  return (
    <div className={styles.card}>
      <div className={styles.cardHeader}>
        <span className={styles.cardIcon}>{icon}</span>
      </div>
      <p className={styles.cardLabel}>{label}</p>
      <h3 className={styles.cardValue}>{value}</h3>
      {change && (
        <p className={styles.cardChange}>{change}</p>
      )}
    </div>
  );
}
