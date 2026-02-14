import React from 'react';
import { TaskSidebarProps } from './TaskSidebar.types';
import styles from './TaskSidebar.module.scss';

export function TaskSidebar({
  selectedDate,
  tasks,
  milestones,
  onAddTask,
  onToggleTask,
  onClose,
}: TaskSidebarProps) {
  const date = new Date(selectedDate);
  const dayName = date.toLocaleDateString('en-US', { weekday: 'long' });
  const monthDay = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });

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
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div>
          <h2 className={styles.title}>{dayName}, {monthDay}</h2>
          <p className={styles.subtitle}>
            {tasks.length} Task{tasks.length !== 1 ? 's' : ''} scheduled
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
        Add Task
      </button>

      <div className={styles.sections}>
        {morningTasks.length > 0 && (
          <div className={styles.section}>
            <h3 className={styles.sectionTitle}>Morning</h3>
            <div className={styles.taskList}>
              {morningTasks.map(task => (
                <TaskItem key={task.id} task={task} />
              ))}
            </div>
          </div>
        )}

        {afternoonTasks.length > 0 && (
          <div className={styles.section}>
            <h3 className={styles.sectionTitle}>Afternoon</h3>
            <div className={styles.taskList}>
              {afternoonTasks.map(task => (
                <TaskItem key={task.id} task={task} />
              ))}
            </div>
          </div>
        )}

        {eveningTasks.length > 0 && (
          <div className={styles.section}>
            <h3 className={styles.sectionTitle}>Evening</h3>
            <div className={styles.taskList}>
              {eveningTasks.map(task => (
                <TaskItem key={task.id} task={task} />
              ))}
            </div>
          </div>
        )}

        {milestones.length > 0 && (
          <div className={styles.section}>
            <h3 className={styles.sectionTitle}>Health Milestones</h3>
            <div className={styles.milestoneList}>
              {milestones.map(milestone => (
                <div key={milestone.id} className={styles.milestone}>
                  <span className={styles.milestoneIcon}>💉</span>
                  <div className={styles.milestoneInfo}>
                    <p className={styles.milestoneTitle}>{milestone.title}</p>
                    <p className={styles.milestoneDue}>
                      In {milestone.daysUntil} days • {milestone.dueDate}
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
