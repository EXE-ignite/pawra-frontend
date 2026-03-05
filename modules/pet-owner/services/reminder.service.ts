import { apiService } from '@/modules/shared/services';
import type { Task, CalendarEvent, HealthMilestone } from '../types';

// Flag để chuyển đổi giữa mock data và real API
const USE_MOCK = process.env.NEXT_PUBLIC_USE_MOCK === 'true';

/**
 * Reminder Service
 * Handles all reminder/task operations
 * 
 * Backend endpoints:
 * - GET /api/reminder - Get all reminders (Admin)
 * - GET /api/reminder/{id} - Get reminder by ID
 * - GET /api/reminder/pet/{petId} - Get reminders by pet
 * - POST /api/reminder/create - Create new reminder
 * - PUT /api/reminder/update/{id} - Update reminder
 * - DELETE /api/reminder/{id} - Delete reminder (soft delete)
 * - GET /api/reminder/{reminderId}/logs - Get reminder logs
 * - POST /api/reminder/logs/add - Add reminder log (mark completed)
 */

// Backend Enums
export enum ReminderType {
  Vaccine = 'Vaccine',
  Medication = 'Medication',
  Grooming = 'Grooming',
  Vet = 'Vet',
  Custom = 'Custom',
}

export enum RecurringType {
  None = 'None',
  Monthly = 'Monthly',
  Yearly = 'Yearly',
}

export enum ReminderLogStatus {
  Completed = 'Completed',
}

// Types matching backend DTOs
export interface CreateReminderDto {
  petId: string;
  title: string;
  description: string;
  type: string;
  startDate: string; // YYYY-MM-DD
  time: string;      // HH:mm
  isRecurring: boolean;
  recurringType: string;
  endDate?: string;  // YYYY-MM-DD, required when isRecurring is true
}

export interface UpdateReminderDto {
  title?: string;
  type?: ReminderType;
  startDate?: string;
  description?: string;
  isRecurring?: boolean;
  recurringType?: RecurringType;
}

export interface CreateReminderLogDto {
  reminderId: string;
  occurrenceDate: string; // ISO date
  status: ReminderLogStatus;
  completedAt?: string; // ISO datetime
}

export interface ReminderLogDto {
  id: string;
  reminderId: string;
  occurrenceDate: string;
  status: ReminderLogStatus;
  completedAt?: string;
}

export interface ReminderDto {
  id: string;
  petId: string;
  pet?: {
    id: string;
    name: string;
  };
  title: string;
  type: ReminderType;
  startDate: string; // YYYY-MM-DD
  time?: string;     // HH:mm
  description?: string;
  isRecurring: boolean;
  recurringType: RecurringType;
  endDate?: string;  // YYYY-MM-DD
  logs?: ReminderLogDto[];
  createdAt?: string;
  updatedAt?: string;
}

// Mock data generator
function generateMockDate(offsetDays: number): string {
  const dt = new Date();
  dt.setDate(dt.getDate() + offsetDays);
  return `${dt.getFullYear()}-${String(dt.getMonth() + 1).padStart(2, '0')}-${String(dt.getDate()).padStart(2, '0')}`;
}

// Mock data
const mockTasks: Task[] = [
  { id: 't1', date: generateMockDate(0), time: '08:00 AM', title: 'Morning Feeding', petName: 'Buddy', petId: '1', type: 'feeding', priority: 'high', completed: true },
  { id: 't2', date: generateMockDate(0), time: '09:00 AM', title: 'Heartguard Medicine', petName: 'Buddy', petId: '1', type: 'medication', priority: 'high', completed: false },
  { id: 't3', date: generateMockDate(0), time: '02:00 PM', title: 'Nail Trimming', petName: 'Luna', petId: '2', type: 'grooming', priority: 'medium', completed: false },
  { id: 't4', date: generateMockDate(1), time: '10:00 AM', title: 'Vet Checkup', petName: 'Max', petId: '3', type: 'other', priority: 'high', completed: false },
  { id: 't5', date: generateMockDate(3), time: '11:00 AM', title: 'Bath Time', petName: 'Buddy', petId: '1', type: 'grooming', priority: 'medium', completed: false },
];

const mockEvents: CalendarEvent[] = [
  { id: 'e1', date: generateMockDate(0), title: 'Buddy Morning Feed', color: '#3b82f6', petId: '1' },
  { id: 'e2', date: generateMockDate(0), title: 'Buddy Heartguard', color: '#f59e0b', petId: '1' },
  { id: 'e3', date: generateMockDate(1), title: 'Max Vet Checkup', color: '#8b5cf6', petId: '3' },
  { id: 'e4', date: generateMockDate(3), title: 'Buddy Bath', color: '#10b981', petId: '1' },
  { id: 'e5', date: generateMockDate(5), title: 'Luna Vaccination', color: '#f59e0b', petId: '2' },
];

const mockMilestones: HealthMilestone[] = [
  { id: 'm1', title: 'Rabies Vaccination Due', dueDate: generateMockDate(5), daysUntil: 5 },
  { id: 'm2', title: 'Annual Vet Checkup (Max)', dueDate: generateMockDate(10), daysUntil: 10 },
  { id: 'm3', title: 'Heartworm Prevention Refill', dueDate: generateMockDate(5), daysUntil: 5 },
];

/**
 * Map backend ReminderType to frontend task type
 */
function mapReminderTypeToTaskType(type: ReminderType): Task['type'] {
  const typeMap: Record<ReminderType, Task['type']> = {
    [ReminderType.Vaccine]: 'medication',
    [ReminderType.Medication]: 'medication',
    [ReminderType.Grooming]: 'grooming',
    [ReminderType.Vet]: 'other',
    [ReminderType.Custom]: 'other',
  };
  return typeMap[type] || 'other';
}

/**
 * Map frontend task type to backend ReminderType
 */
function mapTaskTypeToReminderType(type: Task['type']): ReminderType {
  const typeMap: Record<Task['type'], ReminderType> = {
    'feeding': ReminderType.Custom,
    'medication': ReminderType.Medication,
    'grooming': ReminderType.Grooming,
    'other': ReminderType.Custom,
  };
  return typeMap[type] || ReminderType.Custom;
}

/**
 * Get color for reminder type
 */
function getColorForType(type: ReminderType): string {
  const colorMap: Record<ReminderType, string> = {
    [ReminderType.Vaccine]: '#f59e0b',
    [ReminderType.Medication]: '#ef4444',
    [ReminderType.Grooming]: '#10b981',
    [ReminderType.Vet]: '#8b5cf6',
    [ReminderType.Custom]: '#3b82f6',
  };
  return colorMap[type] || '#3b82f6';
}

/**
 * Format HH:mm to 12h display (e.g. "09:30" → "9:30 AM")
 */
function formatTime12h(time?: string): string {
  if (!time || !/^\d{1,2}:\d{2}$/.test(time)) return '12:00 AM';
  const [h, m] = time.split(':').map(Number);
  const period = h < 12 ? 'AM' : 'PM';
  const hour12 = h % 12 || 12;
  return `${hour12}:${String(m).padStart(2, '0')} ${period}`;
}

/**
 * Transform backend ReminderDto to frontend Task
 */
function transformReminderToTask(reminder: ReminderDto): Task {
  if (!reminder) return null as unknown as Task;
  const isCompleted = reminder.logs?.some(log =>
    log.status === ReminderLogStatus.Completed &&
    log.occurrenceDate === reminder.startDate
  ) || false;

  return {
    id: reminder.id,
    date: reminder.startDate?.split('T')[0] ?? '',
    time: formatTime12h(reminder.time),
    title: reminder.title,
    petName: reminder.pet?.name || 'Unknown',
    petId: reminder.petId,
    type: mapReminderTypeToTaskType(reminder.type),
    priority: reminder.type === ReminderType.Vaccine || reminder.type === ReminderType.Medication ? 'high' : 'medium',
    completed: isCompleted,
  };
}

/**
 * Transform backend ReminderDto to frontend CalendarEvent
 */
function transformReminderToEvent(reminder: ReminderDto): CalendarEvent {
  if (!reminder) return null as unknown as CalendarEvent;
  return {
    id: reminder.id,
    date: reminder.startDate?.split('T')[0] ?? '',
    title: `${reminder.pet?.name || ''} ${reminder.title}`.trim(),
    color: getColorForType(reminder.type),
    petId: reminder.petId,
  };
}

class ReminderService {
  private readonly endpoint = '/reminder';

  /**
   * Get all reminders for a pet
   * Backend: GET /api/reminder/pet/{petId}
   */
  async getRemindersByPet(petId: string): Promise<{ tasks: Task[], events: CalendarEvent[] }> {
    if (USE_MOCK) {
      return {
        tasks: mockTasks.filter(t => t.petId === petId),
        events: mockEvents.filter(e => e.petId === petId),
      };
    }

    try {
      const response = await apiService.get<ReminderDto[]>(`${this.endpoint}/pet/${petId}`);
      const reminders = (Array.isArray(response.data) ? response.data : []).filter(Boolean);
      
      return {
        tasks: reminders.map(transformReminderToTask),
        events: reminders.map(transformReminderToEvent),
      };
    } catch (error) {
      console.error('Error fetching reminders by pet:', error);
      throw error;
    }
  }

  /**
   * Get all reminders for user (combining all pets)
   * Backend: Multiple calls to GET /api/reminder/pet/{petId}
   * Or GET /api/reminder if admin
   */
  async getAllUserReminders(petIds: string[]): Promise<{ tasks: Task[], events: CalendarEvent[], milestones: HealthMilestone[] }> {
    if (USE_MOCK) {
      return {
        tasks: mockTasks,
        events: mockEvents,
        milestones: mockMilestones,
      };
    }

    try {
      const allReminders: ReminderDto[] = [];
      
      // Fetch reminders for each pet
      for (const petId of petIds) {
        const response = await apiService.get<ReminderDto[]>(`${this.endpoint}/pet/${petId}`);
        const reminders = (Array.isArray(response.data) ? response.data : []).filter(Boolean);
        allReminders.push(...reminders);
      }
      
      const tasks = allReminders.map(transformReminderToTask);
      const events = allReminders.map(transformReminderToEvent);
      
      // Generate milestones from upcoming vaccine/vet reminders
      const milestones = allReminders
        .filter(r => r.type === ReminderType.Vaccine || r.type === ReminderType.Vet)
        .filter(r => new Date(r.startDate) >= new Date())
        .slice(0, 5)
        .map(r => {
          const daysUntil = Math.ceil((new Date(r.startDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
          return {
            id: r.id,
            title: r.title,
            dueDate: r.startDate.split('T')[0],
            daysUntil,
          };
        });

      return { tasks, events, milestones };
    } catch (error) {
      console.error('Error fetching all user reminders:', error);
      throw error;
    }
  }

  /**
   * Get reminder by ID
   * Backend: GET /api/reminder/{id}
   */
  async getReminderById(id: string): Promise<Task> {
    if (USE_MOCK) {
      const task = mockTasks.find(t => t.id === id);
      if (!task) throw new Error('Reminder not found');
      return task;
    }

    try {
      const response = await apiService.get<ReminderDto>(`${this.endpoint}/${id}`);
      return transformReminderToTask(response.data);
    } catch (error) {
      console.error('Error fetching reminder by ID:', error);
      throw error;
    }
  }

  /**
   * Create a new reminder
   * Backend: POST /api/reminder/create
   */
  async createReminder(data: {
    petId: string;
    title: string;
    description?: string;
    type: Task['type'];
    startDate: string;
    time?: string;
    isRecurring?: boolean;
    recurringType?: 'none' | 'monthly' | 'yearly';
    endDate?: string;
  }): Promise<Task> {
    if (USE_MOCK) {
      const newTask: Task = {
        id: String(Date.now()),
        date: data.startDate,
        time: data.time || '09:00 AM',
        title: data.title,
        petName: 'Pet',
        petId: data.petId,
        type: data.type,
        priority: data.type === 'medication' ? 'high' : 'medium',
        completed: false,
      };
      mockTasks.push(newTask);
      return newTask;
    }

    try {
      const timeStr = data.time && /^\d{2}:\d{2}$/.test(data.time) ? data.time : '09:00';

      const createDto: CreateReminderDto = {
        petId: data.petId,
        title: data.title,
        description: data.description ?? '',
        type: mapTaskTypeToReminderType(data.type),
        startDate: data.startDate,
        time: timeStr,
        isRecurring: data.isRecurring ?? false,
        recurringType: data.recurringType === 'monthly'
          ? RecurringType.Monthly
          : data.recurringType === 'yearly'
            ? RecurringType.Yearly
            : RecurringType.None,
        endDate: data.endDate,
      };

      console.log('[ReminderService] createDto payload:', JSON.stringify(createDto, null, 2));
      const response = await apiService.post<ReminderDto>(`${this.endpoint}/create`, createDto);
      return transformReminderToTask(response.data);
    } catch (error) {
      console.error('Error creating reminder:', error);
      throw error;
    }
  }

  /**
   * Update a reminder
   * Backend: PUT /api/reminder/update/{id}
   */
  async updateReminder(id: string, data: Partial<{
    title: string;
    type: Task['type'];
    date: string;
    description: string;
    isRecurring: boolean;
    recurringType: 'none' | 'monthly' | 'yearly';
  }>): Promise<Task> {
    if (USE_MOCK) {
      const index = mockTasks.findIndex(t => t.id === id);
      if (index === -1) throw new Error('Reminder not found');
      
      if (data.title) mockTasks[index].title = data.title;
      if (data.type) mockTasks[index].type = data.type;
      if (data.date) mockTasks[index].date = data.date;
      
      return mockTasks[index];
    }

    try {
      const updateDto: UpdateReminderDto = {};
      
      if (data.title) updateDto.title = data.title;
      if (data.type) updateDto.type = mapTaskTypeToReminderType(data.type);
      if (data.date) updateDto.startDate = data.date;
      if (data.description) updateDto.description = data.description;
      if (data.isRecurring !== undefined) updateDto.isRecurring = data.isRecurring;
      if (data.recurringType) {
        updateDto.recurringType = data.recurringType === 'monthly' 
          ? RecurringType.Monthly 
          : data.recurringType === 'yearly' 
            ? RecurringType.Yearly 
            : RecurringType.None;
      }

      const response = await apiService.put<ReminderDto>(`${this.endpoint}/update/${id}`, updateDto);
      return transformReminderToTask(response.data);
    } catch (error) {
      console.error('Error updating reminder:', error);
      throw error;
    }
  }

  /**
   * Delete a reminder
   * Backend: DELETE /api/reminder/{id}
   */
  async deleteReminder(id: string): Promise<void> {
    if (USE_MOCK) {
      const index = mockTasks.findIndex(t => t.id === id);
      if (index !== -1) {
        mockTasks.splice(index, 1);
      }
      return;
    }

    try {
      await apiService.delete(`${this.endpoint}/${id}`);
    } catch (error) {
      console.error('Error deleting reminder:', error);
      throw error;
    }
  }

  /**
   * Mark a task/reminder as completed
   * Backend: POST /api/reminder/logs/add
   */
  async completeTask(taskId: string, occurrenceDate: string): Promise<void> {
    if (USE_MOCK) {
      const task = mockTasks.find(t => t.id === taskId);
      if (task) {
        task.completed = true;
      }
      return;
    }

    try {
      const logDto: CreateReminderLogDto = {
        reminderId: taskId,
        occurrenceDate,
        status: ReminderLogStatus.Completed,
        completedAt: new Date().toISOString(),
      };

      await apiService.post(`${this.endpoint}/logs/add`, logDto);
    } catch (error) {
      console.error('Error marking task as completed:', error);
      throw error;
    }
  }

  /**
   * Toggle task completion status
   */
  async toggleTask(taskId: string, occurrenceDate: string, completed: boolean): Promise<void> {
    if (USE_MOCK) {
      const task = mockTasks.find(t => t.id === taskId);
      if (task) {
        task.completed = completed;
      }
      return;
    }

    if (completed) {
      await this.completeTask(taskId, occurrenceDate);
    }
    // Note: Backend may not support "un-completing" a task
    // Would need DELETE endpoint for reminder logs
  }

  /**
   * Get reminder logs
   * Backend: GET /api/reminder/{reminderId}/logs
   */
  async getReminderLogs(reminderId: string): Promise<ReminderLogDto[]> {
    if (USE_MOCK) {
      return [];
    }

    try {
      const response = await apiService.get<ReminderLogDto[]>(`${this.endpoint}/${reminderId}/logs`);
      return Array.isArray(response.data) ? response.data : [];
    } catch (error) {
      console.error('Error fetching reminder logs:', error);
      throw error;
    }
  }
}

export const reminderService = new ReminderService();
export default reminderService;
