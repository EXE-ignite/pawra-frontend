'use client';

import { useState, useEffect } from 'react';
import { PlanSearchBarProps } from './PlanSearchBar.types';
import styles from './PlanSearchBar.module.scss';

export function PlanSearchBar({
  value,
  statusFilter,
  onSearch,
  onStatusChange,
  onAddNew,
}: PlanSearchBarProps) {
  const [localValue, setLocalValue] = useState(value);

  useEffect(() => {
    setLocalValue(value);
  }, [value]);

  useEffect(() => {
    const handler = setTimeout(() => {
      if (localValue !== value) {
        onSearch(localValue);
      }
    }, 300);
    return () => clearTimeout(handler);
  }, [localValue, value, onSearch]);

  return (
    <div className={styles.searchBar}>
      <div className={styles.searchInputWrapper}>
        <svg className={styles.searchIcon} width="18" height="18" viewBox="0 0 24 24" fill="none">
          <path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
        </svg>
        <input
          type="text"
          className={styles.searchInput}
          placeholder="Tim kiem goi dang ky..."
          value={localValue}
          onChange={(e) => setLocalValue(e.target.value)}
        />
        {localValue && (
          <button
            className={styles.clearButton}
            onClick={() => {
              setLocalValue('');
              onSearch('');
            }}
            type="button"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
              <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            </svg>
          </button>
        )}
      </div>

      <div className={styles.filters}>
        <select
          className={styles.select}
          value={statusFilter}
          onChange={(e) => onStatusChange(e.target.value)}
        >
          <option value="">Tat ca trang thai</option>
          <option value="active">Hoat dong</option>
          <option value="inactive">Tam ngung</option>
        </select>

        <button className={styles.addButton} onClick={onAddNew}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
            <path d="M12 5v14m-7-7h14" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
          </svg>
          Them goi moi
        </button>
      </div>
    </div>
  );
}
