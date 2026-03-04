'use client';

import React, { useState, useRef } from 'react';
import { petService } from '../../services';
import { storageService } from '@/modules/shared/services';
import { ImageCropModal } from '@/modules/shared/components';
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
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [cropSource, setCropSource] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

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

  function handleImageChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      setError('Vui lòng chọn file ảnh hợp lệ.');
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setError('Ảnh phải nhỏ hơn 5MB.');
      return;
    }
    setError(null);
    // Open crop modal with the raw image
    setCropSource(URL.createObjectURL(file));
    // Reset input so same file can be re-selected
    if (fileInputRef.current) fileInputRef.current.value = '';
  }

  function handleCropDone(blob: Blob) {
    const croppedFile = new File([blob], 'pet-avatar.jpg', { type: 'image/jpeg' });
    setImageFile(croppedFile);
    setImagePreview(URL.createObjectURL(blob));
    setCropSource(null);
  }

  function handleCropCancel() {
    setCropSource(null);
  }

  function handleRemoveImage() {
    setImageFile(null);
    setImagePreview(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
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
      let imageUrl: string | undefined;
      if (imageFile) {
        const result = await storageService.uploadImage(imageFile, 'pet-images');
        imageUrl = result.url;
      }
      await petService.createPet({
        name: form.name.trim(),
        species: form.species,
        breed: form.breed.trim(),
        birthDate: isoDate!,
        customerId,
        ...(form.color?.trim() ? { color: form.color.trim() } : {}),
        ...(form.weight !== '' && form.weight !== undefined ? { weight: parseFloat(form.weight as string) } : {}),
        ...(form.description?.trim() ? { description: form.description.trim() } : {}),
        ...(imageUrl ? { imageUrl } : {}),
      });
      setForm(INITIAL_FORM);
      setImageFile(null);
      setImagePreview(null);
      onSuccess();
      onClose();
    } catch (err: any) {
      setError(err?.message || 'Thêm thú cưng thất bại. Vui lòng thử lại.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <ImageCropModal
        imageSrc={cropSource}
        onCropDone={handleCropDone}
        onCancel={handleCropCancel}
      />
      <div className={styles.overlay}>
      <div className={styles.modal}>
        <div className={styles.header}>
          <h2 className={styles.title}>Thêm thú cưng mới 🐾</h2>
          <button className={styles.closeBtn} onClick={onClose} type="button">✕</button>
        </div>

        <form className={styles.form} onSubmit={handleSubmit}>
          {/* Image Upload */}
          <div className={styles.imageUploadSection}>
            <label className={styles.label}>Ảnh thú cưng</label>
            <div
              className={styles.imageUploadArea}
              onClick={() => fileInputRef.current?.click()}
            >
              {imagePreview ? (
                <>
                  <img src={imagePreview} alt="Preview" className={styles.imagePreview} />
                  <button
                    type="button"
                    className={styles.removeImageBtn}
                    onClick={e => { e.stopPropagation(); handleRemoveImage(); }}
                  >
                    ✕
                  </button>
                </>
              ) : (
                <div className={styles.imagePlaceholder}>
                  <span className={styles.imagePlaceholderIcon}>📷</span>
                  <span className={styles.imagePlaceholderText}>Nhấn để chọn ảnh</span>
                  <span className={styles.imagePlaceholderHint}>PNG, JPG – tối đa 5MB</span>
                </div>
              )}
            </div>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className={styles.fileInput}
              onChange={handleImageChange}
            />
          </div>

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
    </>
  );
}
