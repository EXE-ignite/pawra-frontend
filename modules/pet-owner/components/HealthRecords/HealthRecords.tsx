import React from 'react';
import { HealthRecordsProps } from './HealthRecords.types';
import styles from './HealthRecords.module.scss';

export function HealthRecords({ vaccinations, medications, onEdit }: HealthRecordsProps) {
  function getStatusClass(status: string) {
    return status === 'soon' ? styles.soon : status === 'ok' ? styles.ok : styles.overdue;
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h2 className={styles.title}>
          <span className={styles.icon}>📋</span>
          Health Records
        </h2>
        {onEdit && (
          <button className={styles.editButton} onClick={onEdit}>
            ✏️
          </button>
        )}
      </div>

      <div className={styles.content}>
        <div className={styles.section}>
          <h3 className={styles.sectionTitle}>Upcoming Vaccinations</h3>
          <div className={styles.list}>
            {vaccinations.map((vaccination) => (
              <div key={vaccination.id} className={styles.item}>
                <div className={styles.itemInfo}>
                  <p className={styles.itemName}>{vaccination.name}</p>
                  <p className={styles.itemDetail}>{vaccination.dueDate}</p>
                </div>
                <span className={`${styles.badge} ${getStatusClass(vaccination.status)}`}>
                  {vaccination.status === 'soon' ? 'SOON' : vaccination.status === 'ok' ? 'OK' : 'OVERDUE'}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className={styles.section}>
          <h3 className={styles.sectionTitle}>Current Medications</h3>
          <div className={styles.list}>
            {medications.map((medication) => (
              <div key={medication.id} className={styles.item}>
                <div className={styles.itemInfo}>
                  <p className={styles.itemName}>
                    <span className={styles.pillIcon}>💊</span>
                    {medication.name}
                  </p>
                  <p className={styles.itemDetail}>{medication.dosage}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
