'use client';

import React, { useState, useEffect, useRef } from 'react';
import { petService } from '../../services';
import { storageService } from '@/modules/shared/services';
import { ImageCropModal } from '@/modules/shared/components';
import { useTranslation } from '@/modules/shared/contexts';
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
  const { t } = useTranslation();
  const [form, setForm] = useState<EditPetFormData>({
    name: '',
    species: 'Dog',
    breed: '',
    birthDate: '',
    color: '',
    weight: '',
  });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [cropSource, setCropSource] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

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
      });
      setImageFile(null);
      setImagePreview(initialData.imageUrl ?? null);
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

  function handleImageChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      setError(t('addPetModal.errorInvalidImage'));
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setError(t('addPetModal.errorImageSize'));
      return;
    }
    setError(null);
    setCropSource(URL.createObjectURL(file));
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

    if (!form.name.trim() || !form.breed.trim()) {
      setError(t('editPetModal.errorRequiredFields'));
      return;
    }

    // birthDate is optional – only validate if user entered something
    let isoDate: string | undefined;
    if (form.birthDate) {
      const parsed = parseDateInput(form.birthDate);
      if (!parsed) {
        setError(t('addPetModal.errorInvalidDate'));
        return;
      }
      isoDate = parsed;
    }

    try {
      setLoading(true);
      let imageUrl: string | undefined;
      if (imageFile) {
        const result = await storageService.uploadImage(imageFile, 'pet-images');
        imageUrl = result.url;
      }
      await petService.updatePet(petId, {
        name: form.name.trim(),
        species: form.species,
        breed: form.breed.trim(),
        ...(isoDate ? { birthDate: isoDate } : {}),
        ...(form.color?.trim() ? { color: form.color.trim() } : { color: '' }),
        ...(form.weight !== '' && form.weight !== undefined ? { weight: parseFloat(form.weight as string) } : {}),
        ...(imageUrl !== undefined ? { imageUrl } : {}),
      });
      onSuccess();
      onClose();
    } catch (err: unknown) {
      setError((err as any)?.message || t('editPetModal.errorFailed'));
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
        {/* Header */}
        <div className={styles.header}>
          <h2 className={styles.title}>{t('editPetModal.title')}</h2>
          <button className={styles.closeBtn} onClick={onClose} type="button" aria-label={t('common.close')}>
            ✕
          </button>
        </div>

        <form className={styles.form} onSubmit={handleSubmit}>
          {/* Image Upload */}
          <div className={styles.imageUploadSection}>
            <label className={styles.label}>{t('addPetModal.petPhoto')}</label>
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
                  <span className={styles.imagePlaceholderText}>{t('addPetModal.clickToSelect')}</span>
                  <span className={styles.imagePlaceholderHint}>{t('addPetModal.photoHint')}</span>
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
                {t('addPetModal.petName')} <span className={styles.required}>*</span>
              </label>
              <input
                className={styles.input}
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder={t('addPetModal.petNamePlaceholder')}
                required
              />
            </div>

            <div className={styles.field}>
              <label className={styles.label}>
                {t('addPetModal.species')} <span className={styles.required}>*</span>
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
                {t('addPetModal.breed')} <span className={styles.required}>*</span>
              </label>
              <input
                className={styles.input}
                name="breed"
                value={form.breed}
                onChange={handleChange}
                placeholder={t('addPetModal.breedPlaceholder')}
                required
              />
            </div>

            <div className={styles.field}>
              <label className={styles.label}>{t('addPetModal.dateOfBirth')}</label>
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
              <label className={styles.label}>{t('addPetModal.furColor')}</label>
              <input
                className={styles.input}
                name="color"
                value={form.color}
                onChange={handleChange}
                placeholder={t('addPetModal.furColorPlaceholder')}
              />
            </div>

            <div className={styles.field}>
              <label className={styles.label}>{t('addPetModal.weight')}</label>
              <input
                className={styles.input}
                type="number"
                name="weight"
                value={form.weight}
                onChange={handleChange}
                placeholder={t('addPetModal.weightPlaceholder')}
                min="0"
                step="0.1"
              />
            </div>
          </div>

          {error && <p className={styles.error}>{error}</p>}

          <div className={styles.footer}>
            <button
              type="button"
              className={styles.cancelBtn}
              onClick={onClose}
              disabled={loading}
            >
              {t('common.cancel')}
            </button>
            <button type="submit" className={styles.submitBtn} disabled={loading}>
              {loading ? t('editPetModal.saving') : t('editPetModal.saveChanges')}
            </button>
          </div>
        </form>
      </div>
    </div>
    </>
  );
}
