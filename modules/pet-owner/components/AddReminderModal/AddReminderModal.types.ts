import { Pet } from '../../types';

export type ReminderFormType = 'feeding' | 'medication' | 'grooming' | 'other';
export type ReminderPriority = 'low' | 'medium' | 'high';
export type RecurringType = 'none' | 'monthly' | 'yearly';

export interface AddReminderFormData {
  title: string;
  petId: string;
  type: ReminderFormType;
  priority: ReminderPriority;
  date: string;
  time: string;
  description: string;
  isRecurring: boolean;
  recurringType: RecurringType;
}

export interface AddReminderModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
  /** Pre-selected date (YYYY-MM-DD) from calendar click */
  defaultDate?: string;
  /** List of pets available to select */
  pets?: Pet[];
}
