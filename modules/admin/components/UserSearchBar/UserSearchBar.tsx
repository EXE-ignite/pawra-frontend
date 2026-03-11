'use client';

import { useState } from 'react';
import { UserSearchBarProps } from './UserSearchBar.types';
import styles from './UserSearchBar.module.scss';

const ROLES = [
  { value: '', label: 'Tất cả vai trò' },
  { value: 'Admin', label: 'Admin' },
  { value: 'Staff', label: 'Nhân viên' },
  { value: 'Vet', label: 'Bác sĩ thú y' },
  { value: 'Receptionist', label: 'Lễ tân' },
  { value: 'PetOwner', label: 'Chủ thú cưng' },
  { value: 'Customer', label: 'Khách hàng' },
];

const STATUSES = [
  { value: '', label: 'Tất cả trạng thái' },
  { value: 'Active', label: 'Hoạt động' },
  { value: 'Inactive', label: 'Không hoạt động' },
  { value: 'Banned', label: 'Bị khóa' },
];

export function UserSearchBar({
  value,
  roleFilter,
  statusFilter,
  onSearch,
  onRoleChange,
  onStatusChange,
}: UserSearchBarProps) {
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
          placeholder="Tìm kiếm theo tên hoặc email..."
          value={searchValue}
          onChange={handleChange}
        />
      </div>
      <div className={styles.filters}>
        <select
          className={styles.select}
          value={roleFilter}
          onChange={(e) => onRoleChange(e.target.value)}
        >
          {ROLES.map((r) => (
            <option key={r.value} value={r.value}>
              {r.label}
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
