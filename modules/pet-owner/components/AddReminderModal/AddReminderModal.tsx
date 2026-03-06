'use client';

import React, { useState, useEffect } from 'react';
import { reminderService, petService } from '../../services';
import { Pet } from '../../types';
import styles from './AddReminderModal.module.scss';
import type {
  AddReminderModalProps,
  AddReminderFormData,
  ReminderFormType,
  ReminderPriority,
  RecurringType,
} from './AddReminderModal.types';

const TYPE_OPTIONS: { value: ReminderFormType; label: string; icon: string }[] = [
  { value: 'feeding', label: 'Feeding', icon: '🍖' },
  { value: 'medication', label: 'Medicine', icon: '💊' },
  { value: 'grooming', label: 'Grooming', icon: '✂️' },
  { value: 'other', label: 'Other', icon: '📋' },
];

const PRIORITY_OPTIONS: { value: ReminderPriority; label: string }[] = [
  { value: 'low', label: 'Low' },
  { value: 'medium', label: 'Medium' },
  { value: 'high', label: 'High' },
];

const RECURRING_OPTIONS: { value: RecurringType; label: string }[] = [
  { value: 'none', label: 'None' },
  { value: 'monthly', label: 'Monthly' },
  { value: 'yearly', label: 'Yearly' },
];

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
      setError('Vui lòng nhập tiêu đề reminder.');
      return;
    }
    if (!form.petId) {
      setError('Vui lòng chọn thú cưng.');
      return;
    }
    if (!form.startDate) {
      setError('Vui lòng chọn ngày.');
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
      setError(apiErr?.message || (isEditMode ? 'Không thể cập nhật reminder. Vui lòng thử lại.' : 'Không thể tạo reminder. Vui lòng thử lại.'));
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
            <h2 className={styles.title}>{isEditMode ? 'Edit Reminder' : 'Add Reminder'}</h2>
            <p className={styles.subtitle}>{isEditMode ? 'Update your pet care task' : 'Schedule a new pet care task'}</p>
          </div>
          <button className={styles.closeBtn} onClick={onClose} aria-label="Close">
            ×
          </button>
        </div>

        <form className={styles.form} onSubmit={handleSubmit}>
          {/* Title */}
          <div className={styles.field}>
            <label className={styles.label}>
              Title <span className={styles.required}>*</span>
            </label>
            <input
              className={styles.input}
              type="text"
              placeholder="e.g. Morning Feeding, Heartguard Medicine..."
              value={form.title}
              onChange={e => handleField('title', e.target.value)}
              maxLength={100}
            />
          </div>

          {/* Pet + Type */}
          <div className={styles.row}>
            <div className={styles.field}>
              <label className={styles.label}>
                Pet <span className={styles.required}>*</span>
              </label>
              <select
                className={styles.select}
                value={form.petId}
                onChange={e => handleField('petId', e.target.value)}
                disabled={fetchingPets || isEditMode}
              >
                <option value="">
                  {fetchingPets ? 'Loading...' : 'Select pet'}
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
              <label className={styles.label}>Priority</label>
              <div className={styles.priorityRow}>
                {PRIORITY_OPTIONS.map(opt => (
                  <button
                    key={opt.value}
                    type="button"
                    className={`${styles.priorityChip} ${styles[opt.value]} ${form.priority === opt.value ? styles.active : ''}`}
                    onClick={() => handleField('priority', opt.value)}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Type chips */}
          <div className={styles.field}>
            <label className={styles.label}>Type</label>
            <div className={styles.typeGrid}>
              {TYPE_OPTIONS.map(opt => (
                <button
                  key={opt.value}
                  type="button"
                  className={`${styles.typeChip} ${form.type === opt.value ? styles.active : ''}`}
                  onClick={() => handleField('type', opt.value)}
                >
                  <span className={styles.typeIcon}>{opt.icon}</span>
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          {/* Date + Time */}
          <div className={styles.row}>
            <div className={styles.field}>
              <label className={styles.label}>
                Start Date <span className={styles.required}>*</span>
              </label>
              <input
                className={styles.input}
                type="date"
                value={form.startDate}
                onChange={e => handleField('startDate', e.target.value)}
              />
            </div>

            <div className={styles.field}>
              <label className={styles.label}>Time</label>
              <input
                className={styles.input}
                type="time"
                value={form.time}
                onChange={e => handleField('time', e.target.value)}
              />
            </div>
          </div>

          {/* Recurring toggle */}
          <div className={styles.field}>
            <div className={styles.toggleRow}>
              <div className={styles.toggleLabel}>
                <span className={styles.toggleTitle}>Recurring reminder</span>
                <span className={styles.toggleHint}>Repeat this reminder automatically</span>
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

          {/* Recurring type + End Date (only when toggled on) */}
          {form.isRecurring && (
            <>
              <div className={styles.field}>
                <label className={styles.label}>Repeat every</label>
                <select
                  className={styles.select}
                  value={form.recurringType}
                  onChange={e => handleField('recurringType', e.target.value as RecurringType)}
                >
                  {RECURRING_OPTIONS.map(opt => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              </div>
              <div className={styles.field}>
                <label className={styles.label}>End Date</label>
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
            <label className={styles.label}>Notes (optional)</label>
            <textarea
              className={styles.textarea}
              placeholder="Any additional notes..."
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
              Cancel
            </button>
            <button type="submit" className={styles.submitBtn} disabled={loading}>
              {loading ? 'Saving...' : isEditMode ? 'Save Changes' : 'Add Reminder'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
