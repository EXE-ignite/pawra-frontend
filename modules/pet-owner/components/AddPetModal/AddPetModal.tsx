'use client';

import React, { useState } from 'react';
import { petService } from '../../services';
import { tokenService } from '@/modules/shared/services/api/token.service';
import styles from './AddPetModal.module.scss';
import type { AddPetModalProps, AddPetFormData } from './AddPetModal.types';

const SPECIES_OPTIONS = ['Dog', 'Cat', 'Rabbit', 'Bird', 'Hamster', 'Other'];

/** Parse "dd/mm/yyyy" → "yyyy-mm-dd" for API. Returns null if invalid. */
function parseDateInput(raw: string): string | null {
  const match = raw.match(/^(\d{2})\/(\d{2})\/(\d{4})$/);
  if (!match) return null;
  const [, dd, mm, yyyy] = match;
  const d = new Date(`${yyyy}-${mm}-${dd}`);
  if (isNaN(d.getTime())) return null;
  if (d > new Date()) return null;
  return `${yyyy}-${mm}-${dd}`;
}

const INITIAL_FORM: AddPetFormData = {
  name: '',
  species: 'Dog',
  breed: '',
  birthDate: '',
  color: '',
  weight: '',
  description: '',
};

export function AddPetModal({ isOpen, onClose, onSuccess }: AddPetModalProps) {
  const [form, setForm] = useState<AddPetFormData>(INITIAL_FORM);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) {
    const { name, value } = e.target;

    if (name === 'birthDate') {
      // Auto-insert slashes: dd/mm/yyyy
      const digits = value.replace(/\D/g, '').slice(0, 8);
      let formatted = digits;
      if (digits.length > 2) formatted = digits.slice(0, 2) + '/' + digits.slice(2);
      if (digits.length > 4) formatted = digits.slice(0, 2) + '/' + digits.slice(2, 4) + '/' + digits.slice(4);
      setForm(prev => ({ ...prev, birthDate: formatted }));
      return;
    }

    setForm(prev => ({ ...prev, [name]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (!form.name.trim() || !form.breed.trim() || !form.birthDate) {
      setError('Vui lòng điền đầy đủ thông tin bắt buộc.');
      return;
    }

    const isoDate = parseDateInput(form.birthDate);
    if (!isoDate) {
      setError('Ngày sinh không hợp lệ. Vui lòng nhập theo định dạng dd/mm/yyyy.');
      return;
    }

    const customerId = tokenService.getCustomerIdFromToken();
    if (!customerId) {
      setError('Không lấy được thông tin tài khoản. Vui lòng đăng nhập lại.');
      return;
    }

    try {
      setLoading(true);
      await petService.createPet({
        name: form.name.trim(),
        species: form.species,
        breed: form.breed.trim(),
        birthDate: isoDate!,
        customerId,
      });
      setForm(INITIAL_FORM);
      onSuccess();
      onClose();
    } catch (err: any) {
      setError(err?.message || 'Thêm thú cưng thất bại. Vui lòng thử lại.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <div className={styles.header}>
          <h2 className={styles.title}>Thêm thú cưng mới 🐾</h2>
          <button className={styles.closeBtn} onClick={onClose} type="button">✕</button>
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
                  <option key={s} value={s}>{s}</option>
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
              <label className={styles.label}>
                Ngày sinh <span className={styles.required}>*</span>
              </label>
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
            <button
              type="submit"
              className={styles.submitBtn}
              disabled={loading}
            >
              {loading ? 'Đang thêm...' : 'Thêm thú cưng'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
