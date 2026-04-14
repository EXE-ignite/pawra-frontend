'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import type { SubscriptionPlan, SubscriptionStatus } from '../../types/subscription.types';
import { SubscriptionEditModalProps } from './SubscriptionEditModal.types';
import styles from './SubscriptionEditModal.module.scss';

const PLANS: { value: SubscriptionPlan; label: string }[] = [
  { value: 'Basic', label: 'Basic' },
  { value: 'Premium', label: 'Premium' },
  { value: 'VIP', label: 'VIP' },
];

const STATUSES: { value: SubscriptionStatus; label: string }[] = [
  { value: 'Active', label: 'Hoat dong' },
  { value: 'Expired', label: 'Het han' },
  { value: 'Cancelled', label: 'Da huy' },
  { value: 'Trial', label: 'Dung thu' },
  { value: 'Pending', label: 'Cho duyet' },
];

export function SubscriptionEditModal({
  subscription,
  isOpen,
  onClose,
  onSave,
}: SubscriptionEditModalProps) {
  const [plan, setPlan] = useState<SubscriptionPlan>('Basic');
  const [status, setStatus] = useState<SubscriptionStatus>('Active');
  const [autoRenew, setAutoRenew] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (subscription) {
      setPlan(subscription.plan);
      setStatus(subscription.status);
      setAutoRenew(subscription.autoRenew);
    }
  }, [subscription]);

  if (!isOpen || !subscription) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await onSave(subscription.id, plan, status, autoRenew);
      onClose();
    } finally {
      setSaving(false);
    }
  };

  const formatPrice = (price: number, currency: string) => {
    if (price === 0) return 'Mien phi';
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: currency || 'VND',
    }).format(price);
  };

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div className={styles.header}>
          <h2 className={styles.title}>Chinh sua Subscription</h2>
          <button className={styles.closeButton} onClick={onClose} type="button">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            </svg>
          </button>
        </div>

        <div className={styles.userPreview}>
          {subscription.userAvatarUrl ? (
            <div className={styles.avatar}>
              <Image src={subscription.userAvatarUrl} alt={subscription.userName} fill style={{ objectFit: 'cover' }} />
            </div>
          ) : (
            <div className={styles.avatarInitials}>
              {subscription.userName.charAt(0).toUpperCase()}
            </div>
          )}
          <div>
            <p className={styles.userName}>{subscription.userName}</p>
            <p className={styles.userEmail}>{subscription.userEmail}</p>
            <p className={styles.userPrice}>{formatPrice(subscription.price, subscription.currency)}</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.field}>
            <label className={styles.label}>Goi dang ky</label>
            <select
              className={styles.select}
              value={plan}
              onChange={(e) => setPlan(e.target.value as SubscriptionPlan)}
            >
              {PLANS.map((p) => (
                <option key={p.value} value={p.value}>
                  {p.label}
                </option>
              ))}
            </select>
          </div>

          <div className={styles.field}>
            <label className={styles.label}>Trang thai</label>
            <select
              className={styles.select}
              value={status}
              onChange={(e) => setStatus(e.target.value as SubscriptionStatus)}
            >
              {STATUSES.map((s) => (
                <option key={s.value} value={s.value}>
                  {s.label}
                </option>
              ))}
            </select>
          </div>

          <div className={styles.checkboxField}>
            <label className={styles.checkboxLabel}>
              <input
                type="checkbox"
                checked={autoRenew}
                onChange={(e) => setAutoRenew(e.target.checked)}
                className={styles.checkbox}
              />
              Tu dong gia han
            </label>
          </div>

          <div className={styles.footer}>
            <button type="button" className={styles.cancelButton} onClick={onClose}>
              Huy
            </button>
            <button type="submit" className={styles.saveButton} disabled={saving}>
              {saving ? 'Dang luu...' : 'Luu thay doi'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
