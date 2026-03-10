'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import type { UserRole, UserStatus } from '../../types';
import { UserEditModalProps } from './UserEditModal.types';
import styles from './UserEditModal.module.scss';

const ROLES: { value: UserRole; label: string }[] = [
  { value: 'Admin', label: 'Admin' },
  { value: 'Staff', label: 'Nhân viên' },
  { value: 'Vet', label: 'Bác sĩ thú y' },
  { value: 'Receptionist', label: 'Lễ tân' },
  { value: 'PetOwner', label: 'Chủ thú cưng' },
  { value: 'Customer', label: 'Khách hàng' },
];

const STATUSES: { value: UserStatus; label: string }[] = [
  { value: 'Active', label: 'Hoạt động' },
  { value: 'Inactive', label: 'Không hoạt động' },
  { value: 'Banned', label: 'Bị khóa' },
];

export function UserEditModal({ user, isOpen, onClose, onSave }: UserEditModalProps) {
  const [role, setRole] = useState<UserRole>('Customer');
  const [status, setStatus] = useState<UserStatus>('Active');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (user) {
      setRole(user.role);
      setStatus(user.status);
    }
  }, [user]);

  if (!isOpen || !user) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await onSave(user.id, role, status);
      onClose();
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div className={styles.header}>
          <h2 className={styles.title}>Chỉnh sửa người dùng</h2>
          <button className={styles.closeButton} onClick={onClose} type="button">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            </svg>
          </button>
        </div>

        <div className={styles.userPreview}>
          {user.avatarUrl ? (
            <div className={styles.avatar}>
              <Image src={user.avatarUrl} alt={user.fullName} fill style={{ objectFit: 'cover' }} />
            </div>
          ) : (
            <div className={styles.avatarInitials}>
              {user.fullName.charAt(0).toUpperCase()}
            </div>
          )}
          <div>
            <p className={styles.userName}>{user.fullName}</p>
            <p className={styles.userEmail}>{user.email}</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.field}>
            <label className={styles.label}>Vai trò</label>
            <select
              className={styles.select}
              value={role}
              onChange={(e) => setRole(e.target.value as UserRole)}
            >
              {ROLES.map((r) => (
                <option key={r.value} value={r.value}>
                  {r.label}
                </option>
              ))}
            </select>
          </div>

          <div className={styles.field}>
            <label className={styles.label}>Trạng thái</label>
            <select
              className={styles.select}
              value={status}
              onChange={(e) => setStatus(e.target.value as UserStatus)}
            >
              {STATUSES.map((s) => (
                <option key={s.value} value={s.value}>
                  {s.label}
                </option>
              ))}
            </select>
          </div>

          <div className={styles.footer}>
            <button type="button" className={styles.cancelButton} onClick={onClose}>
              Hủy
            </button>
            <button type="submit" className={styles.saveButton} disabled={saving}>
              {saving ? 'Đang lưu...' : 'Lưu thay đổi'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
