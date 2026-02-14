'use client';

import { RemindersPage } from '@/modules/pet-owner';
import { CalendarEvent, Task, HealthMilestone } from '@/modules/pet-owner/types';

// Mock data for demonstration
const mockEvents: CalendarEvent[] = [
  { id: '1', date: '2023-10-02', title: 'Rex Feeding', color: '#3b82f6' },
  { id: '2', date: '2023-10-04', title: 'Luna Vaccination', color: '#f59e0b' },
  { id: '3', date: '2023-10-10', title: 'Rex Grooming', color: '#10b981' },
  { id: '4', date: '2023-10-12', title: '🔔🔔', color: '#8b5cf6' },
  { id: '5', date: '2023-10-15', title: 'Morning Feed', color: '#3b82f6' },
  { id: '6', date: '2023-10-15', title: 'Medication', color: '#f59e0b' },
];

const mockTasks: Task[] = [
  {
    id: '1',
    time: '09:00 AM',
    title: 'Morning Feeding',
    petName: 'Buddy',
    petId: '1',
    type: 'feeding',
    priority: 'high',
    completed: true,
  },
  {
    id: '2',
    time: '10:30 AM',
    title: 'Heartguard Medicine',
    petName: 'Buddy',
    petId: '1',
    type: 'medication',
    priority: 'high',
    completed: false,
  },
  {
    id: '3',
    time: '02:00 PM',
    title: 'Nail Trimming',
    petName: 'Luna',
    petId: '2',
    type: 'grooming',
    priority: 'medium',
    completed: false,
  },
];

const mockMilestones: HealthMilestone[] = [
  {
    id: '1',
    title: 'Rabies Vaccination Due',
    dueDate: 'Nov 6, 2023',
    daysUntil: 12,
  },
];

export default function RemindersPageRoute() {
  function handleDateSelect(date: string) {
    console.log('Date selected:', date);
  }

  function handleAddTask() {
    console.log('Add task');
  }

  function handleToggleTask(taskId: string) {
    console.log('Toggle task:', taskId);
  }

  return (
    <RemindersPage
      events={mockEvents}
      tasks={mockTasks}
      milestones={mockMilestones}
      onDateSelect={handleDateSelect}
      onAddTask={handleAddTask}
      onToggleTask={handleToggleTask}
    />
  );
}
