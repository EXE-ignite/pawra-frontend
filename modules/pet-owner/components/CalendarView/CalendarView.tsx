'use client';

import React, { useState } from 'react';
import { CalendarViewProps } from './CalendarView.types';
import styles from './CalendarView.module.scss';

type ViewMode = 'month' | 'week' | 'day';

function formatDateStr(date: Date): string {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
}

const MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];
const DAY_NAMES = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
const DAY_ABBR = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];
const HOURS = Array.from({ length: 16 }, (_, i) => i + 6); // 6am – 9pm

export function CalendarView({
  month,
  year,
  events,
  tasks = [],
  selectedDate,
  onDateSelect,
  onMonthChange,
  onAddTask,
}: CalendarViewProps) {
  const [view, setView] = useState<ViewMode>('month');

  const today = new Date();
  const todayStr = formatDateStr(today);
  const currentSelectedDate = selectedDate ? new Date(selectedDate + 'T00:00:00') : today;

  // ----- helpers -----
  function getEventsForDateStr(dateStr: string) {
    return events.filter(e => e.date === dateStr);
  }

  function getWeekDays(): Date[] {
    const dayOfWeek = currentSelectedDate.getDay();
    return Array.from({ length: 7 }, (_, i) => {
      const d = new Date(currentSelectedDate);
      d.setDate(currentSelectedDate.getDate() - dayOfWeek + i);
      return d;
    });
  }

  const weekDays = getWeekDays();

  function getHeaderTitle(): string {
    if (view === 'month') return `${MONTH_NAMES[month]} ${year}`;
    if (view === 'week') {
      const first = weekDays[0];
      const last = weekDays[6];
      if (first.getMonth() === last.getMonth()) {
        return `${MONTH_NAMES[first.getMonth()]} ${first.getDate()} – ${last.getDate()}, ${first.getFullYear()}`;
      }
      return `${MONTH_NAMES[first.getMonth()]} ${first.getDate()} – ${MONTH_NAMES[last.getMonth()]} ${last.getDate()}, ${first.getFullYear()}`;
    }
    return `${DAY_NAMES[currentSelectedDate.getDay()]}, ${MONTH_NAMES[currentSelectedDate.getMonth()]} ${currentSelectedDate.getDate()}, ${currentSelectedDate.getFullYear()}`;
  }

  // ----- navigation -----
  function handlePrev() {
    if (view === 'month') {
      if (month === 0) onMonthChange?.(11, year - 1);
      else onMonthChange?.(month - 1, year);
    } else if (view === 'week') {
      const d = new Date(currentSelectedDate);
      d.setDate(d.getDate() - 7);
      onDateSelect?.(formatDateStr(d));
      onMonthChange?.(d.getMonth(), d.getFullYear());
    } else {
      const d = new Date(currentSelectedDate);
      d.setDate(d.getDate() - 1);
      onDateSelect?.(formatDateStr(d));
      onMonthChange?.(d.getMonth(), d.getFullYear());
    }
  }

  function handleNext() {
    if (view === 'month') {
      if (month === 11) onMonthChange?.(0, year + 1);
      else onMonthChange?.(month + 1, year);
    } else if (view === 'week') {
      const d = new Date(currentSelectedDate);
      d.setDate(d.getDate() + 7);
      onDateSelect?.(formatDateStr(d));
      onMonthChange?.(d.getMonth(), d.getFullYear());
    } else {
      const d = new Date(currentSelectedDate);
      d.setDate(d.getDate() + 1);
      onDateSelect?.(formatDateStr(d));
      onMonthChange?.(d.getMonth(), d.getFullYear());
    }
  }

  function handleToday() {
    const now = new Date();
    onMonthChange?.(now.getMonth(), now.getFullYear());
    onDateSelect?.(todayStr);
  }

  // ----- month view helpers -----
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDayOfMonth = new Date(year, month, 1).getDay();

  function isToday(day: number) {
    return day === today.getDate() && month === today.getMonth() && year === today.getFullYear();
  }

  function getEventsForDay(day: number) {
    const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    return events.filter(e => e.date === dateStr);
  }

  // ----- shared header -----
  function renderHeader() {
    return (
      <div className={styles.header}>
        <h2 className={styles.monthYear}>{getHeaderTitle()}</h2>
        <div className={styles.controls}>
          <button className={styles.todayButton} onClick={handleToday}>Today</button>
          <button className={styles.navButton} onClick={handlePrev}>←</button>
          <button className={styles.navButton} onClick={handleNext}>→</button>
        </div>
      </div>
    );
  }

  function renderViewToggle() {
    return (
      <div className={styles.viewToggle}>
        {(['month', 'week', 'day'] as ViewMode[]).map(v => (
          <button
            key={v}
            className={`${styles.toggleButton} ${view === v ? styles.active : ''}`}
            onClick={() => setView(v)}
          >
            {v.charAt(0).toUpperCase() + v.slice(1)}
          </button>
        ))}
      </div>
    );
  }

  // ----- month view -----
  function renderMonthView() {
    return (
      <div className={styles.calendar}>
        <div className={styles.weekdays}>
          {DAY_ABBR.map(d => (
            <div key={d} className={styles.weekday}>{d}</div>
          ))}
        </div>
        <div className={styles.days}>
          {Array.from({ length: firstDayOfMonth }).map((_, i) => (
            <div key={`empty-${i}`} className={styles.emptyDay} />
          ))}
          {Array.from({ length: daysInMonth }).map((_, index) => {
            const day = index + 1;
            const dayEvents = getEventsForDay(day);
            const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
            return (
              <div
                key={day}
                className={`${styles.day} ${isToday(day) ? styles.today : ''} ${selectedDate === dateStr ? styles.selected : ''}`}
                onClick={() => onDateSelect?.(dateStr)}
              >
                <span className={styles.dayNumber}>{day}</span>
                <div className={styles.events}>
                  {dayEvents.slice(0, 2).map(event => (
                    <div key={event.id} className={styles.event} style={{ backgroundColor: event.color }}>
                      {event.title}
                    </div>
                  ))}
                  {dayEvents.length > 2 && (
                    <span className={styles.moreEvents}>+{dayEvents.length - 2} more</span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  // ----- week view -----
  function renderWeekView() {
    return (
      <div className={styles.weekGrid}>
        {weekDays.map(date => {
          const dateStr = formatDateStr(date);
          const dayEvents = getEventsForDateStr(dateStr);
          const isSelected = selectedDate === dateStr;
          const isTodayDay = dateStr === todayStr;
          return (
            <div
              key={dateStr}
              className={`${styles.weekDayColumn} ${isSelected ? styles.weekDaySelected : ''}`}
              onClick={() => onDateSelect?.(dateStr)}
            >
              <div className={`${styles.weekDayHeader} ${isTodayDay ? styles.weekDayToday : ''}`}>
                <span className={styles.weekDayAbbr}>{DAY_ABBR[date.getDay()]}</span>
                <span className={`${styles.weekDayNum} ${isTodayDay ? styles.weekDayNumToday : ''}`}>
                  {date.getDate()}
                </span>
              </div>
              <div className={styles.weekDayEvents}>
                {dayEvents.length === 0 ? (
                  <span className={styles.noEvents}>No events</span>
                ) : (
                  dayEvents.map(event => (
                    <div key={event.id} className={styles.weekEvent} style={{ backgroundColor: event.color }}>
                      {event.title}
                    </div>
                  ))
                )}
              </div>
            </div>
          );
        })}
      </div>
    );
  }

  // ----- day view -----
  function parseHour(time: string): number {
    const [rawHour, period] = time.split(':');
    let h = parseInt(rawHour, 10);
    const suffix = time.toUpperCase().includes('PM') ? 'PM' : 'AM';
    if (suffix === 'PM' && h !== 12) h += 12;
    if (suffix === 'AM' && h === 12) h = 0;
    return h;
  }

  function getTaskIcon(type: string) {
    switch (type) {
      case 'feeding':    return '🍽️';
      case 'medication': return '💊';
      case 'grooming':   return '✂️';
      default:           return '📝';
    }
  }

  function renderDayView() {
    const dateStr = selectedDate || todayStr;
    const dayEvents = getEventsForDateStr(dateStr);
    const dayTasks = tasks.filter(t => t.date === dateStr);

    return (
      <div className={styles.dayView}>
        {dayEvents.length > 0 && (
          <div className={styles.allDayRow}>
            <span className={styles.allDayLabel}>Events</span>
            <div className={styles.allDayEvents}>
              {dayEvents.map(event => (
                <div key={event.id} className={styles.allDayEvent} style={{ backgroundColor: event.color }}>
                  {event.title}
                </div>
              ))}
            </div>
          </div>
        )}
        <div className={styles.timeSlots}>
          {HOURS.map(hour => {
            const label = hour === 12 ? '12 PM' : hour < 12 ? `${hour} AM` : `${hour - 12} PM`;
            const slotTasks = dayTasks.filter(t => parseHour(t.time) === hour);
            return (
              <div key={hour} className={styles.timeSlot}>
                <span className={styles.timeLabel}>{label}</span>
                <div className={styles.timeSlotContent}>
                  {slotTasks.map(task => (
                    <div
                      key={task.id}
                      className={`${styles.slotTask} ${task.completed ? styles.slotTaskDone : ''}`}
                    >
                      <span className={styles.slotTaskIcon}>{getTaskIcon(task.type)}</span>
                      <span className={styles.slotTaskTitle}>{task.title}</span>
                      <span className={styles.slotTaskPet}>· {task.petName}</span>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
        {dayEvents.length === 0 && dayTasks.length === 0 && (
          <p className={styles.noEventsDay}>No events or tasks scheduled for this day.</p>
        )}
      </div>
    );
  }

  return (
    <div className={styles.container}>
      {renderHeader()}
      {renderViewToggle()}
      {view === 'month' && renderMonthView()}
      {view === 'week' && renderWeekView()}
      {view === 'day' && renderDayView()}
    </div>
  );
}
