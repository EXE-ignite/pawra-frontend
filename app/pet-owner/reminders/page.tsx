'use client';

import { useState } from 'react';
import { RemindersPage } from '@/modules/pet-owner';
import { CalendarEvent, Task, HealthMilestone } from '@/modules/pet-owner/types';

// Mock data — dates relative to today (Feb 2026)
const TODAY = new Date();
function d(offsetDays: number): string {
  const dt = new Date(TODAY);
  dt.setDate(TODAY.getDate() + offsetDays);
  return `${dt.getFullYear()}-${String(dt.getMonth() + 1).padStart(2, '0')}-${String(dt.getDate()).padStart(2, '0')}`;
}

const mockEvents: CalendarEvent[] = [
  { id: 'e1', date: d(0),  title: 'Buddy Morning Feed',      color: '#3b82f6' },
  { id: 'e2', date: d(0),  title: 'Buddy Heartguard',        color: '#f59e0b' },
  { id: 'e3', date: d(0),  title: 'Luna Nail Trimming',      color: '#10b981' },
  { id: 'e4', date: d(1),  title: 'Max Vet Checkup',         color: '#8b5cf6' },
  { id: 'e5', date: d(1),  title: 'Luna Evening Feed',       color: '#3b82f6' },
  { id: 'e6', date: d(3),  title: 'Buddy Bath',              color: '#10b981' },
  { id: 'e7', date: d(5),  title: 'Luna Vaccination',        color: '#f59e0b' },
  { id: 'e8', date: d(5),  title: 'Max Heartworm Med',       color: '#ef4444' },
  { id: 'e9', date: d(7),  title: 'Buddy Grooming Appt',     color: '#10b981' },
  { id: 'e10', date: d(10), title: 'Max Annual Checkup',     color: '#8b5cf6' },
  { id: 'e11', date: d(-1), title: 'Luna Weight Check',      color: '#06b6d4' },
  { id: 'e12', date: d(-3), title: 'Buddy Flea Treatment',   color: '#f59e0b' },
];

const mockTasksBase: Task[] = [
  // Today
  { id: 't1',  date: d(0),  time: '08:00 AM', title: 'Morning Feeding',       petName: 'Buddy', petId: '1', type: 'feeding',    priority: 'high',   completed: true  },
  { id: 't2',  date: d(0),  time: '09:00 AM', title: 'Heartguard Medicine',   petName: 'Buddy', petId: '1', type: 'medication', priority: 'high',   completed: false },
  { id: 't3',  date: d(0),  time: '02:00 PM', title: 'Nail Trimming',         petName: 'Luna',  petId: '2', type: 'grooming',   priority: 'medium', completed: false },
  { id: 't4',  date: d(0),  time: '06:00 PM', title: 'Evening Feeding',       petName: 'Buddy', petId: '1', type: 'feeding',    priority: 'high',   completed: false },
  // Tomorrow
  { id: 't5',  date: d(1),  time: '10:00 AM', title: 'Vet Checkup',           petName: 'Max',   petId: '3', type: 'other',      priority: 'high',   completed: false },
  { id: 't6',  date: d(1),  time: '07:00 PM', title: 'Evening Feeding',       petName: 'Luna',  petId: '2', type: 'feeding',    priority: 'medium', completed: false },
  // In 3 days
  { id: 't7',  date: d(3),  time: '11:00 AM', title: 'Bath Time',             petName: 'Buddy', petId: '1', type: 'grooming',   priority: 'medium', completed: false },
  // In 5 days
  { id: 't8',  date: d(5),  time: '09:30 AM', title: 'Rabies Vaccination',    petName: 'Luna',  petId: '2', type: 'medication', priority: 'high',   completed: false },
  { id: 't9',  date: d(5),  time: '08:00 AM', title: 'Heartworm Medication',  petName: 'Max',   petId: '3', type: 'medication', priority: 'high',   completed: false },
  // In 7 days
  { id: 't10', date: d(7),  time: '03:00 PM', title: 'Grooming Appointment',  petName: 'Buddy', petId: '1', type: 'grooming',   priority: 'medium', completed: false },
  // Yesterday
  { id: 't11', date: d(-1), time: '10:00 AM', title: 'Monthly Weight Check',  petName: 'Luna',  petId: '2', type: 'other',      priority: 'low',    completed: true  },
  // 3 days ago
  { id: 't12', date: d(-3), time: '09:00 AM', title: 'Flea & Tick Treatment', petName: 'Buddy', petId: '1', type: 'medication', priority: 'high',   completed: true  },
];

const mockMilestones: HealthMilestone[] = [
  { id: 'm1', title: 'Rabies Vaccination Due',     dueDate: d(5),  daysUntil: 5  },
  { id: 'm2', title: 'Annual Vet Checkup (Max)',   dueDate: d(10), daysUntil: 10 },
  { id: 'm3', title: 'Heartworm Prevention Refill', dueDate: d(5),  daysUntil: 5  },
];

export default function RemindersPageRoute() {
  const [tasks, setTasks] = useState<Task[]>(mockTasksBase);

  function handleToggleTask(taskId: string) {
    setTasks(prev =>
      prev.map(t => (t.id === taskId ? { ...t, completed: !t.completed } : t))
    );
  }

  function handleAddTask() {
    console.log('Add task');
  }

  return (
    <RemindersPage
      events={mockEvents}
      tasks={tasks}
      milestones={mockMilestones}
      onAddTask={handleAddTask}
      onToggleTask={handleToggleTask}
    />
  );
}
