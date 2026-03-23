'use client';

import { useState, useEffect } from 'react';
import { PlanEditModalProps } from './PlanEditModal.types';
import styles from './PlanEditModal.module.scss';

const DURATION_OPTIONS = [
  { value: 7, label: '7 ngay' },
  { value: 30, label: '1 thang (30 ngay)' },
  { value: 90, label: '3 thang (90 ngay)' },
  { value: 180, label: '6 thang (180 ngay)' },
  { value: 365, label: '1 nam (365 ngay)' },
];

export function PlanEditModal({
  plan,
  isOpen,
  isCreateMode,
  onClose,
  onSave,
}: PlanEditModalProps) {
  const [name, setName] = useState('');
  const [price, setPrice] = useState(0);
  const [durationInDays, setDurationInDays] = useState(30);
  const [description, setDescription] = useState('');
  const [isActive, setIsActive] = useState(true);
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (plan && !isCreateMode) {
      setName(plan.name);
      setPrice(plan.price);
      setDurationInDays(plan.durationInDays);
      setDescription(plan.description);
      setIsActive(plan.isActive);
    } else if (isCreateMode) {
      setName('');
      setPrice(99000);
      setDurationInDays(30);
      setDescription('');
      setIsActive(true);
    }
    setErrors({});
  }, [plan, isCreateMode, isOpen]);

  if (!isOpen) return null;

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!name.trim()) {
      newErrors.name = 'Vui long nhap ten goi';
    }
    if (price < 0) {
      newErrors.price = 'Gia khong hop le';
    }
    if (durationInDays <= 0) {
      newErrors.durationInDays = 'Thoi han khong hop le';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setSaving(true);
    try {
      await onSave(isCreateMode ? null : plan?.id || null, {
        name: name.trim(),
        price,
        durationInDays,
        description: description.trim(),
        isActive,
      });
      onClose();
    } finally {
      setSaving(false);
    }
  };

  const formatPrice = (value: number) => {
    return new Intl.NumberFormat('vi-VN').format(value);
  };

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div className={styles.header}>
          <h2 className={styles.title}>
            {isCreateMode ? 'Tao goi dang ky moi' : 'Chinh sua goi dang ky'}
          </h2>
          <button className={styles.closeButton} onClick={onClose} type="button">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.field}>
            <label className={styles.label}>Ten goi *</label>
            <input
              type="text"
              className={`${styles.input} ${errors.name ? styles.inputError : ''}`}
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="VD: Basic, Premium, VIP..."
            />
            {errors.name && <span className={styles.errorText}>{errors.name}</span>}
          </div>

          <div className={styles.row}>
            <div className={styles.field}>
              <label className={styles.label}>Gia (VND) *</label>
              <input
                type="number"
                className={`${styles.input} ${errors.price ? styles.inputError : ''}`}
                value={price}
                onChange={(e) => setPrice(Number(e.target.value))}
                min={0}
                step={1000}
              />
              <span className={styles.pricePreview}>{formatPrice(price)} VND</span>
              {errors.price && <span className={styles.errorText}>{errors.price}</span>}
            </div>

            <div className={styles.field}>
              <label className={styles.label}>Thoi han *</label>
              <select
                className={`${styles.select} ${errors.durationInDays ? styles.inputError : ''}`}
                value={durationInDays}
                onChange={(e) => setDurationInDays(Number(e.target.value))}
              >
                {DURATION_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
              {errors.durationInDays && <span className={styles.errorText}>{errors.durationInDays}</span>}
            </div>
          </div>

          <div className={styles.field}>
            <label className={styles.label}>Mo ta</label>
            <textarea
              className={styles.textarea}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Mo ta ngan gon ve goi dang ky..."
              rows={3}
            />
          </div>

          <div className={styles.checkboxField}>
            <label className={styles.checkboxLabel}>
              <input
                type="checkbox"
                checked={isActive}
                onChange={(e) => setIsActive(e.target.checked)}
                className={styles.checkbox}
              />
              <span className={styles.checkboxText}>
                Kich hoat goi dang ky
                <span className={styles.checkboxHint}>
                  {isActive ? 'Nguoi dung co the dang ky goi nay' : 'Goi nay se khong hien thi cho nguoi dung'}
                </span>
              </span>
            </label>
          </div>

          <div className={styles.footer}>
            <button type="button" className={styles.cancelButton} onClick={onClose}>
              Huy
            </button>
            <button type="submit" className={styles.saveButton} disabled={saving}>
              {saving ? 'Dang luu...' : isCreateMode ? 'Tao goi' : 'Luu thay doi'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
