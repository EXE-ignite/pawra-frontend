'use client';

import React, { useState, useEffect } from 'react';
import { petService } from '../../services';
import styles from './EditPetModal.module.scss';
import type { EditPetModalProps, EditPetFormData } from './EditPetModal.types';

const SPECIES_OPTIONS = ['Dog', 'Cat', 'Rabbit', 'Bird', 'Hamster', 'Other'];

/** Parse "dd/mm/yyyy" → "yyyy-mm-dd". Returns null if invalid. */
function parseDateInput(raw: string): string | null {
  const match = raw.match(/^(\d{2})\/(\d{2})\/(\d{4})$/);
  if (!match) return null;
  const [, dd, mm, yyyy] = match;
  const d = new Date(`${yyyy}-${mm}-${dd}`);
  if (isNaN(d.getTime())) return null;
  if (d > new Date()) return null;
  return `${yyyy}-${mm}-${dd}`;
}

/** Format "yyyy-mm-dd" → "dd/mm/yyyy" for display */
function formatDateForDisplay(isoDate?: string): string {
  if (!isoDate) return '';
  const match = isoDate.match(/^(\d{4})-(\d{2})-(\d{2})/);
  if (!match) return '';
  return `${match[3]}/${match[2]}/${match[1]}`;
}

export function EditPetModal({ isOpen, petId, initialData, onClose, onSuccess }: EditPetModalProps) {
  const [form, setForm] = useState<EditPetFormData>({
    name: '',
    species: 'Dog',
    breed: '',
    birthDate: '',
    color: '',
    weight: '',
    description: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Sync initial data whenever the modal opens
  useEffect(() => {
    if (isOpen) {
      setForm({
        name: initialData.name ?? '',
        species: initialData.species ?? 'Dog',
        breed: initialData.breed ?? '',
        birthDate: formatDateForDisplay(initialData.birthDate),
        color: initialData.color ?? '',
        weight: initialData.weight != null ? String(initialData.weight) : '',
        description: initialData.description ?? '',
      });
      setError(null);
    }
  }, [isOpen, initialData]);

  if (!isOpen) return null;

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) {
    const { name, value } = e.target;

    if (name === 'birthDate') {
      const digits = value.replace(/\D/g, '').slice(0, 8);
      let formatted = digits;
      if (digits.length > 2) formatted = digits.slice(0, 2) + '/' + digits.slice(2);
      if (digits.length > 4)
        formatted = digits.slice(0, 2) + '/' + digits.slice(2, 4) + '/' + digits.slice(4);
      setForm(prev => ({ ...prev, birthDate: formatted }));
      return;
    }

    setForm(prev => ({ ...prev, [name]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (!form.name.trim() || !form.breed.trim()) {
      setError('Vui lòng điền đầy đủ tên và giống thú cưng.');
      return;
    }

    // birthDate is optional – only validate if user entered something
    let isoDate: string | undefined;
    if (form.birthDate) {
      const parsed = parseDateInput(form.birthDate);
      if (!parsed) {
        setError('Ngày sinh không hợp lệ. Vui lòng nhập theo định dạng dd/mm/yyyy.');
        return;
      }
      isoDate = parsed;
    }

    try {
      setLoading(true);
      await petService.updatePet(petId, {
        name: form.name.trim(),
        species: form.species,
        breed: form.breed.trim(),
        ...(isoDate ? { birthDate: isoDate } : {}),
      });
      onSuccess();
      onClose();
    } catch (err: unknown) {
      setError((err as any)?.message || 'Cập nhật thất bại. Vui lòng thử lại.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={e => e.stopPropagation()}>
        {/* Header */}
        <div className={styles.header}>
          <h2 className={styles.title}>Chỉnh sửa thú cưng ✏️</h2>
          <button className={styles.closeBtn} onClick={onClose} type="button" aria-label="Đóng">
            ✕
          </button>
        </div>

        <form className={styles.form} onSubmit={handleSubmit}>
          {/* Name + Species */}
          <div className={styles.row}>
            <div className={styles.field}>
              <label className={styles.label}>
                Tên thú cưng <span className={styles.required}>*</span>
              </label>
              <input
                className={styles.input}
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="VD: Mochi"
                required
              />
            </div>

            <div className={styles.field}>
              <label className={styles.label}>
                Loài <span className={styles.required}>*</span>
              </label>
              <select
                className={styles.select}
                name="species"
                value={form.species}
                onChange={handleChange}
              >
                {SPECIES_OPTIONS.map(s => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Breed + BirthDate */}
          <div className={styles.row}>
            <div className={styles.field}>
              <label className={styles.label}>
                Giống <span className={styles.required}>*</span>
              </label>
              <input
                className={styles.input}
                name="breed"
                value={form.breed}
                onChange={handleChange}
                placeholder="VD: Poodle"
                required
              />
            </div>

            <div className={styles.field}>
              <label className={styles.label}>Ngày sinh</label>
              <input
                className={styles.input}
                type="text"
                name="birthDate"
                value={form.birthDate}
                onChange={handleChange}
                placeholder="dd/mm/yyyy"
                maxLength={10}
              />
            </div>
          </div>

          {/* Color + Weight */}
          <div className={styles.row}>
            <div className={styles.field}>
              <label className={styles.label}>Màu lông</label>
              <input
                className={styles.input}
                name="color"
                value={form.color}
                onChange={handleChange}
                placeholder="VD: Nâu trắng"
              />
            </div>

            <div className={styles.field}>
              <label className={styles.label}>Cân nặng (kg)</label>
              <input
                className={styles.input}
                type="number"
                name="weight"
                value={form.weight}
                onChange={handleChange}
                placeholder="VD: 3.5"
                min="0"
                step="0.1"
              />
            </div>
          </div>

          {/* Description */}
          <div className={styles.field}>
            <label className={styles.label}>Mô tả</label>
            <textarea
              className={styles.textarea}
              name="description"
              value={form.description}
              onChange={handleChange}
              placeholder="Đặc điểm, tính cách..."
            />
          </div>

          {error && <p className={styles.error}>{error}</p>}

          <div className={styles.footer}>
            <button
              type="button"
              className={styles.cancelBtn}
              onClick={onClose}
              disabled={loading}
            >
              Hủy
            </button>
            <button type="submit" className={styles.submitBtn} disabled={loading}>
              {loading ? 'Đang lưu...' : 'Lưu thay đổi'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
