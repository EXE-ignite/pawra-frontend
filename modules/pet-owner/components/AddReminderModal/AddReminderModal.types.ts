import { Pet, Task } from '../../types';

export type ReminderFormType = 'feeding' | 'medication' | 'grooming' | 'other';
export type ReminderPriority = 'low' | 'medium' | 'high';
export type RecurringType = 'none' | 'monthly' | 'yearly';

export interface AddReminderFormData {
  title: string;
  petId: string;
  type: ReminderFormType;
  priority: ReminderPriority;
  startDate: string;
  time: string;
  description: string;
  isRecurring: boolean;
  recurringType: RecurringType;
  endDate: string;
}

export interface AddReminderModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
  /** Pre-selected date (YYYY-MM-DD) from calendar click */
  defaultDate?: string;
  /** List of pets available to select */
  pets?: Pet[];
  /** When provided, the modal operates in edit mode */
  editTask?: Task;
}
