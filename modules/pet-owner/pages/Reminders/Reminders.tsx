'use client';

import React, { useState, useRef, useEffect } from 'react';
import { RemindersPageProps } from './Reminders.types';
import { CalendarView, TaskSidebar } from '../../components';
import styles from './Reminders.module.scss';

export function RemindersPage({
  events,
  tasks,
  milestones,
  pets = [],
  onDateSelect,
  onAddTask,
  onToggleTask,
  onDeleteTask,
  onEditTask,
}: RemindersPageProps) {
  const today = new Date();
  const [currentMonth, setCurrentMonth] = useState(today.getMonth());
  const [currentYear, setCurrentYear] = useState(today.getFullYear());
  const [dateFilter, setDateFilter] = useState<string | null>(null);
  const [selectedPetId, setSelectedPetId] = useState<string | null>(null);
  const calendarRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleMouseDown(e: MouseEvent) {
      if (calendarRef.current && !calendarRef.current.contains(e.target as Node)) {
        setDateFilter(null);
      }
    }
    document.addEventListener('mousedown', handleMouseDown);
    return () => document.removeEventListener('mousedown', handleMouseDown);
  }, []);

  function handleDateSelect(date: string) {
    setDateFilter(prev => prev === date ? null : date);
    onDateSelect?.(date);
  }

  function handleMonthChange(month: number, year: number) {
    setCurrentMonth(month);
    setCurrentYear(year);
  }

  const filteredTasks = selectedPetId ? tasks.filter(t => t.petId === selectedPetId) : tasks;
  const filteredEvents = selectedPetId ? events.filter(e => e.petId === selectedPetId) : events;
  const tasksForSidebar = dateFilter
    ? filteredTasks.filter(task => task.date === dateFilter)
    : filteredTasks;

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
        <div className={styles.calendarSection} ref={calendarRef}>
          <CalendarView
            month={currentMonth}
            year={currentYear}
            events={filteredEvents}
            tasks={filteredTasks}
            selectedDate={dateFilter ?? undefined}
            onDateSelect={handleDateSelect}
            onMonthChange={handleMonthChange}
            onAddTask={onAddTask}
          />
        </div>

        <div className={styles.sidebarSection}>
          <TaskSidebar
            selectedDate={dateFilter}
            tasks={tasksForSidebar}
            milestones={milestones}
            pets={pets}
            selectedPetId={selectedPetId}
            onPetFilterChange={setSelectedPetId}
            onAddTask={onAddTask}
            onToggleTask={onToggleTask}
            onDeleteTask={onDeleteTask}
            onEditTask={onEditTask}
          />
        </div>
      </div>
    </div>
  );
}
