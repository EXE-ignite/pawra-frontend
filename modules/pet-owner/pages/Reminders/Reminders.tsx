'use client';

import React, { useState } from 'react';
import { RemindersPageProps } from './Reminders.types';
import { CalendarView, TaskSidebar } from '../../components';
import styles from './Reminders.module.scss';

export function RemindersPage({
  events,
  tasks,
  milestones,
  onDateSelect,
  onAddTask,
  onToggleTask,
}: RemindersPageProps) {
  const today = new Date();
  const [currentMonth, setCurrentMonth] = useState(today.getMonth());
  const [currentYear, setCurrentYear] = useState(today.getFullYear());
  const [selectedDate, setSelectedDate] = useState(
    `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`
  );

  function handleDateSelect(date: string) {
    setSelectedDate(date);
    onDateSelect?.(date);
  }

  function handleMonthChange(month: number, year: number) {
    setCurrentMonth(month);
    setCurrentYear(year);
  }

  const tasksForSelectedDate = tasks.filter(task => task.date === selectedDate);

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div>
          <h1 className={styles.title}>Reminders</h1>
          <p className={styles.subtitle}>
            Manage your pet care schedule and upcoming tasks
          </p>
        </div>
      </div>

      <div className={styles.content}>
        <div className={styles.calendarSection}>
          <CalendarView
            month={currentMonth}
            year={currentYear}
            events={events}
            tasks={tasks}
            selectedDate={selectedDate}
            onDateSelect={handleDateSelect}
            onMonthChange={handleMonthChange}
            onAddTask={onAddTask}
          />
        </div>

        <div className={styles.sidebarSection}>
          <TaskSidebar
            selectedDate={selectedDate}
            tasks={tasksForSelectedDate}
            milestones={milestones}
            onAddTask={onAddTask}
            onToggleTask={onToggleTask}
          />
        </div>
      </div>
    </div>
  );
}
