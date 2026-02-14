import React from 'react';
import { CalendarViewProps } from './CalendarView.types';
import styles from './CalendarView.module.scss';

export function CalendarView({
  month,
  year,
  events,
  selectedDate,
  onDateSelect,
  onMonthChange,
  onAddTask,
}: CalendarViewProps) {
  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDayOfMonth = new Date(year, month, 1).getDay();

  const today = new Date();
  const isToday = (day: number) => {
    return day === today.getDate() && month === today.getMonth() && year === today.getFullYear();
  };

  const getEventsForDate = (day: number) => {
    const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    return events.filter(event => event.date === dateStr);
  };

  function handlePrevMonth() {
    if (month === 0) {
      onMonthChange?.(11, year - 1);
    } else {
      onMonthChange?.(month - 1, year);
    }
  }

  function handleNextMonth() {
    if (month === 11) {
      onMonthChange?.(0, year + 1);
    } else {
      onMonthChange?.(month + 1, year);
    }
  }

  function handleToday() {
    const now = new Date();
    onMonthChange?.(now.getMonth(), now.getFullYear());
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h2 className={styles.monthYear}>
          {monthNames[month]} {year}
        </h2>
        <div className={styles.controls}>
          <button className={styles.todayButton} onClick={handleToday}>
            Today
          </button>
          <button className={styles.navButton} onClick={handlePrevMonth}>
            ←
          </button>
          <button className={styles.navButton} onClick={handleNextMonth}>
            →
          </button>
        </div>
      </div>

      <div className={styles.viewToggle}>
        <button className={`${styles.toggleButton} ${styles.active}`}>Month</button>
        <button className={styles.toggleButton}>Week</button>
        <button className={styles.toggleButton}>Day</button>
      </div>

      <div className={styles.calendar}>
        <div className={styles.weekdays}>
          {['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'].map(day => (
            <div key={day} className={styles.weekday}>{day}</div>
          ))}
        </div>

        <div className={styles.days}>
          {/* Empty cells for days before the first of the month */}
          {Array.from({ length: firstDayOfMonth }).map((_, index) => (
            <div key={`empty-${index}`} className={styles.emptyDay}></div>
          ))}

          {/* Days of the month */}
          {Array.from({ length: daysInMonth }).map((_, index) => {
            const day = index + 1;
            const dayEvents = getEventsForDate(day);
            const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
            
            return (
              <div
                key={day}
                className={`${styles.day} ${isToday(day) ? styles.today : ''} ${
                  selectedDate === dateStr ? styles.selected : ''
                }`}
                onClick={() => onDateSelect?.(dateStr)}
              >
                <span className={styles.dayNumber}>{day}</span>
                <div className={styles.events}>
                  {dayEvents.slice(0, 2).map(event => (
                    <div
                      key={event.id}
                      className={styles.event}
                      style={{ backgroundColor: event.color }}
                    >
                      {event.title}
                    </div>
                  ))}
                  {dayEvents.length > 2 && (
                    <span className={styles.moreEvents}>
                      +{dayEvents.length - 2} more
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
