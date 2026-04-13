'use client';

import React, { useState, useEffect } from 'react';
import { reminderService, petService } from '../../services';
import { Pet } from '../../types';
import { useTranslation } from '@/modules/shared/contexts';
import { useSubscription } from '@/modules/shared/contexts';
import styles from './AddReminderModal.module.scss';
import type {
  AddReminderModalProps,
  AddReminderFormData,
  ReminderFormType,
  ReminderPriority,
  RecurringType,
} from './AddReminderModal.types';

const TYPE_VALUES = ['feeding', 'medication', 'grooming', 'other'] as const;
const TYPE_ICONS: Record<string, string> = {
  feeding: '🍖', medication: '💊', grooming: '✂️', other: '📋',
};
const TYPE_LABEL_KEYS: Record<string, string> = {
  feeding: 'addReminderModal.feeding', medication: 'addReminderModal.medicine',
  grooming: 'addReminderModal.grooming', other: 'addReminderModal.other',
};

const PRIORITY_VALUES = ['low', 'medium', 'high'] as const;
const PRIORITY_LABEL_KEYS: Record<string, string> = {
  low: 'addReminderModal.low', medium: 'addReminderModal.medium', high: 'addReminderModal.high',
};

const RECURRING_VALUES = ['none', 'monthly', 'yearly'] as const;
const RECURRING_LABEL_KEYS: Record<string, string> = {
  none: 'addReminderModal.none', monthly: 'addReminderModal.monthly', yearly: 'addReminderModal.yearly',
};

function getTodayString(): string {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

function buildInitialForm(defaultDate?: string): AddReminderFormData {
  return {
    title: '',
    petId: '',
    type: 'other',
    priority: 'medium',
    startDate: defaultDate || getTodayString(),
    time: '09:00',
    description: '',
    isRecurring: false,
    recurringType: 'none',
    endDate: '',
  };
}

function parse12hTo24h(time12?: string): string {
  if (!time12) return '09:00';
  const match = time12.match(/^(\d{1,2}):(\d{2})\s*(AM|PM)$/i);
  if (!match) return time12;
  let hour = parseInt(match[1]);
  const minutes = match[2];
  const period = match[3].toUpperCase();
  if (period === 'AM') {
    if (hour === 12) hour = 0;
  } else {
    if (hour !== 12) hour += 12;
  }
  return `${String(hour).padStart(2, '0')}:${minutes}`;
}

export function AddReminderModal({
  isOpen,
  onClose,
  onSuccess,
  defaultDate,
  pets: propsPets,
  editTask,
}: AddReminderModalProps) {
  const { t } = useTranslation();
  const { hasAccess, currentPlan } = useSubscription();
  const canUseSmartReminders = hasAccess('reminder.smart');
  const isEditMode = !!editTask;
  const [form, setForm] = useState<AddReminderFormData>(() => buildInitialForm(defaultDate));
  const [pets, setPets] = useState<Pet[]>(propsPets || []);
  const [loading, setLoading] = useState(false);
  const [fetchingPets, setFetchingPets] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Sync form when modal opens
  useEffect(() => {
    if (isOpen) {
      if (editTask) {
        setForm({
          title: editTask.title,
          petId: editTask.petId,
          type: editTask.type as AddReminderFormData['type'],
          priority: (editTask.priority ?? 'medium') as AddReminderFormData['priority'],
          startDate: editTask.date,
          time: parse12hTo24h(editTask.time),
          description: '',
          isRecurring: false,
          recurringType: 'none',
          endDate: '',
        });
      } else {
        setForm(buildInitialForm(defaultDate));
      }
      setError(null);
    }
  }, [isOpen, defaultDate, editTask]);

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
        if (list.length > 0) {
          setForm(prev => ({ ...prev, petId: list[0].id }));
        }
      } catch {
        // silently ignore – user can still type
      } finally {
        setFetchingPets(false);
      }
    }
    loadPets();
  }, [isOpen, propsPets]);

  if (!isOpen) return null;

  function handleField<K extends keyof AddReminderFormData>(key: K, value: AddReminderFormData[K]) {
    setForm(prev => ({ ...prev, [key]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (!form.title.trim()) {
      setError(t('addReminderModal.errorTitle'));
      return;
    }
    if (!form.petId) {
      setError(t('addReminderModal.errorPet'));
      return;
    }
    if (!form.startDate) {
      setError(t('addReminderModal.errorDate'));
      return;
    }

    try {
      setLoading(true);

      if (isEditMode && editTask) {
        await reminderService.updateReminder(editTask.id, {
          title: form.title.trim(),
          type: form.type,
          date: form.startDate,
          time: form.time,
          description: form.description.trim() || undefined,
          isRecurring: form.isRecurring,
          recurringType: form.recurringType,
        });
      } else {
        await reminderService.createReminder({
          petId: form.petId,
          title: form.title.trim(),
          description: form.description.trim() || undefined,
          type: form.type,
          startDate: form.startDate,
          time: form.time,
          isRecurring: form.isRecurring,
          recurringType: form.recurringType,
          endDate: form.isRecurring && form.endDate ? form.endDate : undefined,
        });
      }

      onSuccess?.();
      onClose();
    } catch (err: unknown) {
      // ApiError plain object returned by the response interceptor
      const apiErr = err as { message?: string };
      setError(apiErr?.message || (isEditMode ? t('addReminderModal.errorUpdate') : t('addReminderModal.errorCreate')));
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className={styles.overlay} onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      <div className={styles.modal}>
        {/* Header */}
        <div className={styles.header}>
          <div className={styles.headerLeft}>
            <h2 className={styles.title}>{isEditMode ? t('addReminderModal.editTitle') : t('addReminderModal.addTitle')}</h2>
            <p className={styles.subtitle}>{isEditMode ? t('addReminderModal.editSubtitle') : t('addReminderModal.addSubtitle')}</p>
          </div>
          <button className={styles.closeBtn} onClick={onClose} aria-label={t('common.close')}>
            ×
          </button>
        </div>

        <form className={styles.form} onSubmit={handleSubmit}>
          {/* Title */}
          <div className={styles.field}>
            <label className={styles.label}>
              {t('addReminderModal.titleLabel')} <span className={styles.required}>*</span>
            </label>
            <input
              className={styles.input}
              type="text"
              placeholder={t('addReminderModal.titlePlaceholder')}
              value={form.title}
              onChange={e => handleField('title', e.target.value)}
              maxLength={100}
            />
          </div>

          {/* Pet + Type */}
          <div className={styles.row}>
            <div className={styles.field}>
              <label className={styles.label}>
                {t('addReminderModal.pet')} <span className={styles.required}>*</span>
              </label>
              <select
                className={styles.select}
                value={form.petId}
                onChange={e => handleField('petId', e.target.value)}
                disabled={fetchingPets || isEditMode}
              >
                <option value="">
                  {fetchingPets ? t('common.loading') : t('addReminderModal.selectPet')}
                </option>
                {pets.map(pet => (
                  <option key={pet.id} value={pet.id}>
                    {pet.name}
                  </option>
                ))}
                {/* Fallback when pet not in list (edit mode) */}
                {isEditMode && editTask && !pets.find(p => p.id === editTask.petId) && (
                  <option value={editTask.petId}>{editTask.petName}</option>
                )}
              </select>
            </div>

            <div className={styles.field}>
              <label className={styles.label}>{t('addReminderModal.priority')}</label>
              <div className={styles.priorityRow}>
                {PRIORITY_VALUES.map(val => (
                  <button
                    key={val}
                    type="button"
                    className={`${styles.priorityChip} ${styles[val]} ${form.priority === val ? styles.active : ''}`}
                    onClick={() => handleField('priority', val)}
                  >
                    {t(PRIORITY_LABEL_KEYS[val])}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Type chips */}
          <div className={styles.field}>
            <label className={styles.label}>{t('addReminderModal.type')}</label>
            <div className={styles.typeGrid}>
              {TYPE_VALUES.map(val => (
                <button
                  key={val}
                  type="button"
                  className={`${styles.typeChip} ${form.type === val ? styles.active : ''}`}
                  onClick={() => handleField('type', val)}
                >
                  <span className={styles.typeIcon}>{TYPE_ICONS[val]}</span>
                  {t(TYPE_LABEL_KEYS[val])}
                </button>
              ))}
            </div>
          </div>

          {/* Date + Time */}
          <div className={styles.row}>
            <div className={styles.field}>
              <label className={styles.label}>
                {t('addReminderModal.startDate')} <span className={styles.required}>*</span>
              </label>
              <input
                className={styles.input}
                type="date"
                value={form.startDate}
                onChange={e => handleField('startDate', e.target.value)}
              />
            </div>

            <div className={styles.field}>
              <label className={styles.label}>{t('addReminderModal.time')}</label>
              <input
                className={styles.input}
                type="time"
                value={form.time}
                onChange={e => handleField('time', e.target.value)}
              />
            </div>
          </div>

          {/* Recurring toggle */}
          {canUseSmartReminders ? (
            <div className={styles.field}>
              <div className={styles.toggleRow}>
                <div className={styles.toggleLabel}>
                  <span className={styles.toggleTitle}>{t('addReminderModal.recurringReminder')}</span>
                  <span className={styles.toggleHint}>{t('addReminderModal.recurringHint')}</span>
                </div>
                <label className={styles.toggle}>
                  <input
                    type="checkbox"
                    checked={form.isRecurring}
                    onChange={e => handleField('isRecurring', e.target.checked)}
                  />
                  <span className={styles.toggleSlider} />
                </label>
              </div>
            </div>
          ) : (
            <div className={styles.field}>
              <div className={styles.lockedFeature}>
                <span className={styles.lockIcon}>🔒</span>
                <span>
                  Nhắc nhở lặp lại yêu cầu gói <strong>Basic</strong> trở lên (hiện tại: {currentPlan}){' '}
                  <a href="/pet-owner/subscription" className={styles.upgradeLink}>Nâng cấp</a>
                </span>
              </div>
            </div>
          )}

          {/* Recurring type + End Date (only when toggled on) */}
          {form.isRecurring && (
            <>
              <div className={styles.field}>
                <label className={styles.label}>{t('addReminderModal.repeatEvery')}</label>
                <select
                  className={styles.select}
                  value={form.recurringType}
                  onChange={e => handleField('recurringType', e.target.value as RecurringType)}
                >
                  {RECURRING_VALUES.map(val => (
                    <option key={val} value={val}>
                      {t(RECURRING_LABEL_KEYS[val])}
                    </option>
                  ))}
                </select>
              </div>
              <div className={styles.field}>
                <label className={styles.label}>{t('addReminderModal.endDate')}</label>
                <input
                  className={styles.input}
                  type="date"
                  value={form.endDate}
                  min={form.startDate}
                  onChange={e => handleField('endDate', e.target.value)}
                />
              </div>
            </>
          )}

          {/* Description */}
          <div className={styles.field}>
            <label className={styles.label}>{t('addReminderModal.notes')}</label>
            <textarea
              className={styles.textarea}
              placeholder={t('addReminderModal.notesPlaceholder')}
              value={form.description}
              onChange={e => handleField('description', e.target.value)}
              rows={3}
              maxLength={500}
            />
          </div>

          {/* Error */}
          {error && <p className={styles.error}>{error}</p>}

          {/* Footer */}
          <div className={styles.footer}>
            <button type="button" className={styles.cancelBtn} onClick={onClose}>
              {t('common.cancel')}
            </button>
            <button type="submit" className={styles.submitBtn} disabled={loading}>
              {loading ? t('addReminderModal.saving') : isEditMode ? t('addReminderModal.saveChanges') : t('addReminderModal.addReminder')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
