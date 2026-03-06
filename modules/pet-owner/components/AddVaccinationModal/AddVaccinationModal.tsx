'use client';

import React, { useState, useEffect } from 'react';
import { vaccinationService, petService } from '../../services';
import { Pet } from '../../types';
import { useTranslation } from '@/modules/shared/contexts';
import styles from './AddVaccinationModal.module.scss';
import type { AddVaccinationModalProps, AddVaccinationFormData } from './AddVaccinationModal.types';

function getTodayString(): string {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

function buildInitialForm(petId?: string): AddVaccinationFormData {
  return {
    petId: petId || '',
    vaccineName: '',
    clinicName: '',
    vaccinationDate: getTodayString(),
  };
}

export function AddVaccinationModal({
  isOpen,
  onClose,
  onSuccess,
  petId: propPetId,
  pets: propsPets,
}: AddVaccinationModalProps) {
  const { t } = useTranslation();
  const [form, setForm] = useState<AddVaccinationFormData>(() => buildInitialForm(propPetId));
  const [pets, setPets] = useState<Pet[]>(propsPets || []);
  const [loading, setLoading] = useState(false);
  const [fetchingPets, setFetchingPets] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Reset form on open
  useEffect(() => {
    if (isOpen) {
      setForm(buildInitialForm(propPetId));
      setError(null);
    }
  }, [isOpen, propPetId]);

  // Load pets if not provided via props
  useEffect(() => {
    if (!isOpen) return;
    if (propsPets && propsPets.length > 0) {
      setPets(propsPets);
      return;
    }
    async function loadPets() {
      setFetchingPets(true);
      try {
        const list = await petService.getUserPets();
        setPets(list);
        if (!propPetId && list.length > 0) {
          setForm(prev => ({ ...prev, petId: list[0].id }));
        }
      } catch {
        // silently ignore
      } finally {
        setFetchingPets(false);
      }
    }
    loadPets();
  }, [isOpen, propsPets, propPetId]);

  if (!isOpen) return null;

  function handleField<K extends keyof AddVaccinationFormData>(
    key: K,
    value: AddVaccinationFormData[K],
  ) {
    setForm(prev => ({ ...prev, [key]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (!form.petId) {
      setError(t('addVaccinationModal.errorPet'));
      return;
    }
    if (!form.vaccineName.trim()) {
      setError(t('addVaccinationModal.errorVaccine'));
      return;
    }
    if (!form.clinicName.trim()) {
      setError(t('addVaccinationModal.errorClinic'));
      return;
    }
    if (!form.vaccinationDate) {
      setError(t('addVaccinationModal.errorDate'));
      return;
    }

    try {
      setLoading(true);
      await vaccinationService.createVaccinationRecord({
        petId: form.petId,
        vaccineName: form.vaccineName.trim(),
        clinicName: form.clinicName.trim(),
        vaccinationDate: form.vaccinationDate,
      });
      onSuccess?.();
      onClose();
    } catch (err: unknown) {
      const apiErr = err as { message?: string };
      setError(apiErr?.message || t('addVaccinationModal.errorFailed'));
    } finally {
      setLoading(false);
    }
  }

  const showPetSelector = !propPetId;

  return (
    <div
      className={styles.overlay}
      onClick={e => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className={styles.modal}>
        {/* Header */}
        <div className={styles.header}>
          <div className={styles.headerLeft}>
            <span className={styles.headerIcon}>💉</span>
            <h2 className={styles.title}>{t('addVaccinationModal.title')}</h2>
            <p className={styles.subtitle}>{t('addVaccinationModal.subtitle')}</p>
          </div>
          <button className={styles.closeBtn} onClick={onClose} aria-label={t('common.close')}>
            ×
          </button>
        </div>

        <form className={styles.form} onSubmit={handleSubmit}>
          {/* Pet selector – only when petId is not pre-set */}
          {showPetSelector && (
            <div className={styles.field}>
              <label className={styles.label}>
                {t('addVaccinationModal.pet')} <span className={styles.required}>*</span>
              </label>
              <select
                className={styles.select}
                value={form.petId}
                onChange={e => handleField('petId', e.target.value)}
                disabled={fetchingPets}
              >
                <option value="">
                  {fetchingPets ? t('common.loading') : t('addVaccinationModal.selectPet')}
                </option>
                {pets.map(pet => (
                  <option key={pet.id} value={pet.id}>
                    {pet.name}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Vaccine name */}
          <div className={styles.field}>
            <label className={styles.label}>
              {t('addVaccinationModal.vaccine')} <span className={styles.required}>*</span>
            </label>
            <input
              className={styles.input}
              type="text"
              placeholder={t('addVaccinationModal.vaccinePlaceholder')}
              value={form.vaccineName}
              onChange={e => handleField('vaccineName', e.target.value)}
              maxLength={255}
            />
          </div>

          {/* Clinic name + Date */}
          <div className={styles.row}>
            <div className={styles.field}>
              <label className={styles.label}>
                {t('addVaccinationModal.clinic')} <span className={styles.required}>*</span>
              </label>
              <input
                className={styles.input}
                type="text"
                placeholder={t('addVaccinationModal.clinicPlaceholder')}
                value={form.clinicName}
                onChange={e => handleField('clinicName', e.target.value)}
                maxLength={255}
              />
            </div>

            <div className={styles.field}>
              <label className={styles.label}>
                {t('addVaccinationModal.date')} <span className={styles.required}>*</span>
              </label>
              <input
                className={styles.input}
                type="date"
                value={form.vaccinationDate}
                max={getTodayString()}
                onChange={e => handleField('vaccinationDate', e.target.value)}
              />
            </div>
          </div>

          {/* Error */}
          {error && <p className={styles.error}>{error}</p>}

          {/* Footer */}
          <div className={styles.footer}>
            <button type="button" className={styles.cancelBtn} onClick={onClose}>
              {t('common.cancel')}
            </button>
            <button type="submit" className={styles.submitBtn} disabled={loading}>
              {loading ? t('addVaccinationModal.saving') : t('addVaccinationModal.addVaccination')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
