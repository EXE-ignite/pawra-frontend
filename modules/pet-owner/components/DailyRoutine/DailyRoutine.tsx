import React from 'react';
import { DailyRoutineProps } from './DailyRoutine.types';
import styles from './DailyRoutine.module.scss';

export function DailyRoutine({ activities, onToggle, onEdit }: DailyRoutineProps) {
  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h2 className={styles.title}>
          <span className={styles.icon}>⏰</span>
          Daily Routine
        </h2>
        {onEdit && (
          <button className={styles.editButton} onClick={onEdit}>
            ✏️
          </button>
        )}
      </div>

      <div className={styles.list}>
        {activities.map((activity) => (
          <div key={activity.id} className={styles.item}>
            <div className={styles.itemLeft}>
              <input
                type="checkbox"
                checked={activity.completed}
                onChange={() => onToggle?.(activity.id)}
                className={styles.checkbox}
              />
              <div className={styles.itemInfo}>
                <p className={styles.itemTime}>{activity.time}</p>
                <p className={styles.itemTitle}>{activity.title}</p>
                <p className={styles.itemDescription}>{activity.description}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
