'use client';

import { useState } from 'react';
import { SubscriptionSearchBarProps } from './SubscriptionSearchBar.types';
import styles from './SubscriptionSearchBar.module.scss';

const PLANS = [
  { value: '', label: 'Tat ca goi' },
  { value: 'Basic', label: 'Basic' },
  { value: 'Premium', label: 'Premium' },
  { value: 'VIP', label: 'VIP' },
];

const STATUSES = [
  { value: '', label: 'Tat ca trang thai' },
  { value: 'Active', label: 'Hoat dong' },
  { value: 'Expired', label: 'Het han' },
  { value: 'Cancelled', label: 'Da huy' },
  { value: 'Trial', label: 'Dung thu' },
];

export function SubscriptionSearchBar({
  value,
  planFilter,
  statusFilter,
  onSearch,
  onPlanChange,
  onStatusChange,
}: SubscriptionSearchBarProps) {
  const [searchValue, setSearchValue] = useState(value);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchValue(e.target.value);
    onSearch(e.target.value);
  };

  return (
    <div className={styles.searchBar}>
      <div className={styles.searchWrapper}>
        <svg className={styles.searchIcon} width="18" height="18" viewBox="0 0 24 24" fill="none">
          <path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z" fill="currentColor"/>
        </svg>
        <input
          type="text"
          className={styles.searchInput}
          placeholder="Tim kiem theo ten hoac email..."
          value={searchValue}
          onChange={handleChange}
        />
      </div>
      <div className={styles.filters}>
        <select
          className={styles.select}
          value={planFilter}
          onChange={(e) => onPlanChange(e.target.value)}
        >
          {PLANS.map((p) => (
            <option key={p.value} value={p.value}>
              {p.label}
            </option>
          ))}
        </select>
        <select
          className={styles.select}
          value={statusFilter}
          onChange={(e) => onStatusChange(e.target.value)}
        >
          {STATUSES.map((s) => (
            <option key={s.value} value={s.value}>
              {s.label}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}
