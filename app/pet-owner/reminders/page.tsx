'use client';

import { useEffect, useState } from 'react';
import { RemindersPage } from '@/modules/pet-owner';
import { AddReminderModal } from '@/modules/pet-owner/components';
import { CalendarEvent, Task, HealthMilestone, Pet } from '@/modules/pet-owner/types';
import { petService, reminderService } from '@/modules/pet-owner/services';

export default function RemindersPageRoute() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [milestones, setMilestones] = useState<HealthMilestone[]>([]);
  const [pets, setPets] = useState<Pet[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<string | undefined>(undefined);

  useEffect(() => {
    async function loadReminders() {
      try {
        setLoading(true);
        // 1. Lấy danh sách pet của user
        const fetchedPets = await petService.getUserPets();
        const petIds = fetchedPets.map(p => p.id);
        setPets(fetchedPets);

        if (petIds.length === 0) {
          setLoading(false);
          return;
        }

        // 2. Lấy tất cả reminders
        const data = await reminderService.getAllUserReminders(petIds);
        setTasks(data.tasks);
        setEvents(data.events);
        setMilestones(data.milestones);
      } catch (err) {
        console.error('Failed to load reminders:', err);
      } finally {
        setLoading(false);
      }
    }

    loadReminders();
  }, []);

  async function handleToggleTask(taskId: string) {
    const task = tasks.find(t => t.id === taskId);
    if (!task) return;

    const newCompleted = !task.completed;

    // Optimistic update
    setTasks(prev =>
      prev.map(t => (t.id === taskId ? { ...t, completed: newCompleted } : t))
    );

    try {
      await reminderService.toggleTask(taskId, task.date, newCompleted);
    } catch (err) {
      console.error('Failed to toggle task:', err);
      // Revert on error
      setTasks(prev =>
        prev.map(t => (t.id === taskId ? { ...t, completed: !newCompleted } : t))
      );
    }
  }

  function handleAddTask() {
    setModalOpen(true);
  }

  function handleDateSelect(date: string) {
    setSelectedDate(date);
  }

  async function handleReminderCreated() {
    setModalOpen(false);
    // Reload reminders after creation
    try {
      const petIds = pets.map(p => p.id);
      if (petIds.length > 0) {
        const data = await reminderService.getAllUserReminders(petIds);
        setTasks(data.tasks);
        setEvents(data.events);
        setMilestones(data.milestones);
      }
    } catch (err) {
      console.error('Failed to reload reminders:', err);
    }
  }

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '50vh' }}>
        <p>Đang tải...</p>
      </div>
    );
  }

  return (
    <>
      <RemindersPage
        events={events}
        tasks={tasks}
        milestones={milestones}
        onAddTask={handleAddTask}
        onToggleTask={handleToggleTask}
        onDateSelect={handleDateSelect}
      />

      <AddReminderModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onSuccess={handleReminderCreated}
        defaultDate={selectedDate}
        pets={pets}
      />
    </>
  );
}
