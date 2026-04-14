'use client';

import { useEffect, useState } from 'react';
import { RemindersPage } from '@/modules/pet-owner';
import { AddReminderModal, BookingModal, TaskTypePicker } from '@/modules/pet-owner/components';
import { CalendarEvent, Task, HealthMilestone, Pet } from '@/modules/pet-owner/types';
import { petService, reminderService, appointmentService } from '@/modules/pet-owner/services';
import { useTranslation } from '@/modules/shared/contexts';
import { useSubscription } from '@/modules/shared/contexts';

export default function RemindersPageRoute() {
  const { t } = useTranslation();
  const { hasAccess } = useSubscription();
  const canBook = hasAccess('booking.standard');
  const [tasks, setTasks] = useState<Task[]>([]);
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [milestones, setMilestones] = useState<HealthMilestone[]>([]);
  const [pets, setPets] = useState<Pet[]>([]);
  const [loading, setLoading] = useState(true);

  // Reminder modal
  const [modalOpen, setModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [selectedDate, setSelectedDate] = useState<string | undefined>(undefined);

  // Picker + Booking modal
  const [pickerOpen, setPickerOpen] = useState(false);
  const [bookingOpen, setBookingOpen] = useState(false);

  useEffect(() => {
    loadAllData();
  }, []);

  async function loadAllData() {
    try {
      setLoading(true);
      const fetchedPets = await petService.getUserPets();
      const petIds = fetchedPets.map(p => p.id);
      setPets(fetchedPets);

      if (petIds.length === 0) {
        setLoading(false);
        return;
      }

      // Fetch reminders + appointments in parallel
      const [reminderData, appointments] = await Promise.allSettled([
        reminderService.getAllUserReminders(),
        appointmentService.getAllAppointments(),
      ]);

      if (reminderData.status === 'fulfilled') {
        setTasks(reminderData.value.tasks);
        setMilestones(reminderData.value.milestones);

        // Merge appointment events (purple) with reminder events
        const apptEvents: CalendarEvent[] = appointments.status === 'fulfilled'
          ? appointments.value.map(a => ({
              id: `appt-${a.id}`,
              date: a.date,
              title: `🏥 ${a.petName}`,
              color: '#8b5cf6',
              petId: a.petId,
            }))
          : [];

        setEvents([...reminderData.value.events, ...apptEvents]);
      }
    } catch (err) {
      console.error('Failed to load reminders:', err);
    } finally {
      setLoading(false);
    }
  }

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

  async function handleDeleteTask(taskId: string) {
    // Optimistic update
    setTasks(prev => prev.filter(t => t.id !== taskId));
    setEvents(prev => prev.filter(e => e.id !== taskId));

    try {
      await reminderService.deleteReminder(taskId);
    } catch (err) {
      console.error('Failed to delete task:', err);
      // Reload on error
      try {
        const data = await reminderService.getAllUserReminders();
          setTasks(data.tasks);
          setEvents(data.events);
          setMilestones(data.milestones);
      } catch {
        // ignore secondary error
      }
    }
  }

  function handleAddTask() {
    setEditingTask(null);
    setPickerOpen(true);
  }

  function handlePickerSelectTask() {
    setPickerOpen(false);
    setModalOpen(true);
  }

  function handlePickerSelectBooking() {
    setPickerOpen(false);
    setBookingOpen(true);
  }

  function handleEditTask(taskId: string) {
    const task = tasks.find(t => t.id === taskId);
    if (!task) return;
    setEditingTask(task);
    setModalOpen(true);
  }

  function handleDateSelect(date: string) {
    setSelectedDate(date);
  }

  async function handleReminderSaved() {
    setModalOpen(false);
    setEditingTask(null);
    await loadAllData();
  }

  async function handleBookingSuccess() {
    await loadAllData();
  }

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '50vh' }}>
        <p>{t('common.loading')}</p>
      </div>
    );
  }

  return (
    <>
      <RemindersPage
        events={events}
        tasks={tasks}
        milestones={milestones}
        pets={pets}
        onAddTask={handleAddTask}
        onToggleTask={handleToggleTask}
        onDeleteTask={handleDeleteTask}
        onEditTask={handleEditTask}
        onDateSelect={handleDateSelect}
      />

      <AddReminderModal
        isOpen={modalOpen}
        onClose={() => { setModalOpen(false); setEditingTask(null); }}
        onSuccess={handleReminderSaved}
        defaultDate={selectedDate}
        pets={pets}
        editTask={editingTask ?? undefined}
      />

      <TaskTypePicker
        isOpen={pickerOpen}
        onClose={() => setPickerOpen(false)}
        onSelectTask={handlePickerSelectTask}
        onSelectBooking={handlePickerSelectBooking}
        canBook={canBook}
      />

      <BookingModal
        isOpen={bookingOpen}
        onClose={() => setBookingOpen(false)}
        onSuccess={handleBookingSuccess}
        defaultDate={selectedDate}
      />
    </>
  );
}
