import React from 'react';
import { TaskSidebarProps } from './TaskSidebar.types';
import { useTranslation } from '@/modules/shared/contexts';
import styles from './TaskSidebar.module.scss';

export function TaskSidebar({
  selectedDate,
  tasks,
  milestones,
  pets = [],
  selectedPetId,
  onPetFilterChange,
  onAddTask,
  onToggleTask,
  onDeleteTask,
  onEditTask,
  onClose,
}: TaskSidebarProps) {
  const { t, locale } = useTranslation();
  const dateLabel = (() => {
    if (!selectedDate) return null;
    const date = new Date(selectedDate + 'T00:00:00');
    const dayName = date.toLocaleDateString(locale === 'vi' ? 'vi-VN' : 'en-US', { weekday: 'long' });
    const dd = String(date.getDate()).padStart(2, '0');
    const mm = String(date.getMonth() + 1).padStart(2, '0');
    const yyyy = date.getFullYear();
    return `${dayName}, ${dd}/${mm}/${yyyy}`;
  })();

  const morningTasks = tasks.filter(t => {
    const hour = parseInt(t.time.split(':')[0]);
    return hour < 12;
  });

  const afternoonTasks = tasks.filter(t => {
    const hour = parseInt(t.time.split(':')[0]);
    return hour >= 12 && hour < 18;
  });

  const eveningTasks = tasks.filter(t => {
    const hour = parseInt(t.time.split(':')[0]);
    return hour >= 18;
  });

  function getTaskIcon(type: string) {
    switch (type) {
      case 'feeding':
        return '🍽️';
      case 'medication':
        return '💊';
      case 'grooming':
        return '✂️';
      default:
        return '📝';
    }
  }

  function getPriorityColor(priority: string) {
    switch (priority) {
      case 'high':
        return '#ef4444';
      case 'medium':
        return '#f59e0b';
      default:
        return '#10b981';
    }
  }

  function TaskItem({ task }: { task: typeof tasks[0] }) {
    return (
      <div className={styles.task}>
        <input
          type="checkbox"
          checked={task.completed}
          onChange={() => onToggleTask?.(task.id)}
          className={styles.checkbox}
        />
        <div className={styles.taskInfo}>
          <div className={styles.taskHeader}>
            <span className={styles.taskIcon}>{getTaskIcon(task.type)}</span>
            <span className={styles.taskTitle}>{task.title}</span>
          </div>
          <div className={styles.taskMeta}>
            <span className={styles.taskTime}>{task.time}</span>
            <span className={styles.taskPet}>
              <span className={styles.petIcon}>🐕</span>
              {task.petName}
            </span>
          </div>
        </div>
        <div className={styles.taskActions}>
          <button
            className={styles.editButton}
            onClick={() => onEditTask?.(task.id)}
            title={t('taskSidebar.editTask')}
            aria-label={t('taskSidebar.editTask')}
          >
            ✏️
          </button>
          <button
            className={styles.deleteButton}
            onClick={() => onDeleteTask?.(task.id)}
            title={t('taskSidebar.deleteTask')}
            aria-label={t('taskSidebar.deleteTask')}
          >
            🗑️
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div>
          <h2 className={styles.title}>
            {dateLabel ?? t('taskSidebar.allTasks')}
          </h2>
          <p className={styles.subtitle}>
            {tasks.length} {tasks.length !== 1 ? t('taskSidebar.tasks') : t('taskSidebar.task')} {t('taskSidebar.scheduled')}
          </p>
        </div>
        {onClose && (
          <button className={styles.closeButton} onClick={onClose}>
            ✕
          </button>
        )}
      </div>

      <button className={styles.addButton} onClick={onAddTask}>
        <span className={styles.addIcon}>+</span>
        {t('taskSidebar.addTask')}
      </button>

      {pets.length > 0 && (
        <div className={styles.filterBar}>
          <button
            className={`${styles.filterTag} ${!selectedPetId ? styles.filterTagActive : ''}`}
            onClick={() => onPetFilterChange?.(null)}
          >
            🐾 {t('taskSidebar.all')}
          </button>
          {pets.map(pet => (
            <button
              key={pet.id}
              className={`${styles.filterTag} ${selectedPetId === pet.id ? styles.filterTagActive : ''}`}
              onClick={() => onPetFilterChange?.(selectedPetId === pet.id ? null : pet.id)}
            >
              {pet.name}
            </button>
          ))}
        </div>
      )}

      <div className={styles.sections}>
        {morningTasks.length > 0 && (
          <div className={styles.section}>
            <h3 className={styles.sectionTitle}>{t('taskSidebar.morning')}</h3>
            <div className={styles.taskList}>
              {morningTasks.map(task => (
                <TaskItem key={task.id} task={task} />
              ))}
            </div>
          </div>
        )}

        {afternoonTasks.length > 0 && (
          <div className={styles.section}>
            <h3 className={styles.sectionTitle}>{t('taskSidebar.afternoon')}</h3>
            <div className={styles.taskList}>
              {afternoonTasks.map(task => (
                <TaskItem key={task.id} task={task} />
              ))}
            </div>
          </div>
        )}

        {eveningTasks.length > 0 && (
          <div className={styles.section}>
            <h3 className={styles.sectionTitle}>{t('taskSidebar.evening')}</h3>
            <div className={styles.taskList}>
              {eveningTasks.map(task => (
                <TaskItem key={task.id} task={task} />
              ))}
            </div>
          </div>
        )}

        {milestones.length > 0 && (
          <div className={styles.section}>
            <h3 className={styles.sectionTitle}>{t('taskSidebar.healthMilestones')}</h3>
            <div className={styles.milestoneList}>
              {milestones.map(milestone => (
                <div key={milestone.id} className={styles.milestone}>
                  <span className={styles.milestoneIcon}>💉</span>
                  <div className={styles.milestoneInfo}>
                    <p className={styles.milestoneTitle}>{milestone.title}</p>
                    <p className={styles.milestoneDue}>
                      {t('taskSidebar.inDays', { count: milestone.daysUntil })} • {milestone.dueDate.split('-').reverse().join('/')}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
