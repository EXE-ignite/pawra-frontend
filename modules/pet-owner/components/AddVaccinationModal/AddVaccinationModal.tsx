'use client';

import React, { useState, useEffect } from 'react';
import { vaccinationService, petService } from '../../services';
import type { VaccineDto } from '../../services';
import { Pet } from '../../types';
import styles from './AddVaccinationModal.module.scss';
import type { AddVaccinationModalProps, AddVaccinationFormData } from './AddVaccinationModal.types';

function getTodayString(): string {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

function buildInitialForm(petId?: string): AddVaccinationFormData {
  return {
    petId: petId || '',
    vaccineId: '',
    clinicId: '',
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
  const [form, setForm] = useState<AddVaccinationFormData>(() => buildInitialForm(propPetId));
  const [pets, setPets] = useState<Pet[]>(propsPets || []);
  const [vaccines, setVaccines] = useState<VaccineDto[]>([]);
  const [loading, setLoading] = useState(false);
  const [fetchingPets, setFetchingPets] = useState(false);
  const [fetchingVaccines, setFetchingVaccines] = useState(false);
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

  // Load vaccine list
  useEffect(() => {
    if (!isOpen) return;
    async function loadVaccines() {
      setFetchingVaccines(true);
      try {
        const list = await vaccinationService.getVaccines();
        setVaccines(list);
      } catch {
        // silently ignore
      } finally {
        setFetchingVaccines(false);
      }
    }
    loadVaccines();
  }, [isOpen]);

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
      setError('Vui lòng chọn thú cưng.');
      return;
    }
    if (!form.vaccineId) {
      setError('Vui lòng chọn loại vaccine.');
      return;
    }
    if (!form.clinicId.trim()) {
      setError('Vui lòng nhập tên / ID phòng khám.');
      return;
    }
    if (!form.vaccinationDate) {
      setError('Vui lòng chọn ngày tiêm.');
      return;
    }

    try {
      setLoading(true);
      await vaccinationService.createVaccinationRecord({
        petId: form.petId,
        vaccineId: form.vaccineId,
        clinicId: form.clinicId.trim(),
        vaccinationDate: form.vaccinationDate,
      });
      onSuccess?.();
      onClose();
    } catch (err: unknown) {
      const apiErr = err as { message?: string };
      setError(apiErr?.message || 'Không thể thêm lịch sử tiêm phòng. Vui lòng thử lại.');
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
            <h2 className={styles.title}>Add Vaccination</h2>
            <p className={styles.subtitle}>Record a new vaccination history</p>
          </div>
          <button className={styles.closeBtn} onClick={onClose} aria-label="Close">
            ×
          </button>
        </div>

        <form className={styles.form} onSubmit={handleSubmit}>
          {/* Pet selector – only when petId is not pre-set */}
          {showPetSelector && (
            <div className={styles.field}>
              <label className={styles.label}>
                Pet <span className={styles.required}>*</span>
              </label>
              <select
                className={styles.select}
                value={form.petId}
                onChange={e => handleField('petId', e.target.value)}
                disabled={fetchingPets}
              >
                <option value="">
                  {fetchingPets ? 'Loading...' : 'Select pet'}
                </option>
                {pets.map(pet => (
                  <option key={pet.id} value={pet.id}>
                    {pet.name}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Vaccine selector */}
          <div className={styles.field}>
            <label className={styles.label}>
              Vaccine <span className={styles.required}>*</span>
            </label>
            {fetchingVaccines ? (
              <p className={styles.hint}>Loading vaccines…</p>
            ) : vaccines.length > 0 ? (
              <div className={styles.vaccineGrid}>
                {vaccines.map(v => (
                  <button
                    key={v.id}
                    type="button"
                    className={`${styles.vaccineChip} ${form.vaccineId === v.id ? styles.active : ''}`}
                    onClick={() => handleField('vaccineId', v.id)}
                  >
                    <span className={styles.vaccineChipName}>{v.name}</span>
                    <span className={styles.vaccineChipMfr}>{v.manufacturer}</span>
                  </button>
                ))}
              </div>
            ) : (
              /* Fallback: manual text input when no vaccine list is available */
              <input
                className={styles.input}
                type="text"
                placeholder="Enter vaccine ID"
                value={form.vaccineId}
                onChange={e => handleField('vaccineId', e.target.value)}
              />
            )}
          </div>

          {/* Clinic + Date */}
          <div className={styles.row}>
            <div className={styles.field}>
              <label className={styles.label}>
                Clinic <span className={styles.required}>*</span>
              </label>
              <input
                className={styles.input}
                type="text"
                placeholder="Clinic name or ID"
                value={form.clinicId}
                onChange={e => handleField('clinicId', e.target.value)}
                maxLength={200}
              />
            </div>

            <div className={styles.field}>
              <label className={styles.label}>
                Date <span className={styles.required}>*</span>
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
              Cancel
            </button>
            <button type="submit" className={styles.submitBtn} disabled={loading}>
              {loading ? 'Saving...' : 'Add Vaccination'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
