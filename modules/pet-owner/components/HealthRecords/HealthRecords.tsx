import React from 'react';
import { HealthRecordsProps } from './HealthRecords.types';
import { useTranslation } from '@/modules/shared/contexts';
import styles from './HealthRecords.module.scss';

export function HealthRecords({ vaccinations, medications, onEdit }: HealthRecordsProps) {
  const { t } = useTranslation();
  function getStatusClass(status: string) {
    return status === 'due-soon' ? styles.soon : status === 'valid' ? styles.ok : styles.overdue;
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h2 className={styles.title}>
          <span className={styles.icon}>📋</span>
          {t('healthRecords.title')}
        </h2>
        {onEdit && (
          <button className={styles.editButton} onClick={onEdit}>
            ✏️
          </button>
        )}
      </div>

      <div className={styles.content}>
        <div className={styles.section}>
          <h3 className={styles.sectionTitle}>{t('healthRecords.upcomingVaccinations')}</h3>
          <div className={styles.list}>
            {vaccinations.map((vaccination) => (
              <div key={vaccination.id} className={styles.item}>
                <div className={styles.itemInfo}>
                  <p className={styles.itemName}>{vaccination.name}</p>
                  <p className={styles.itemDetail}>{vaccination.dueDate}</p>
                </div>
                <span className={`${styles.badge} ${getStatusClass(vaccination.status)}`}>
                  {vaccination.status === 'due-soon' ? t('healthRecords.soon') : vaccination.status === 'valid' ? t('healthRecords.ok') : t('healthRecords.overdue')}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className={styles.section}>
          <h3 className={styles.sectionTitle}>{t('healthRecords.currentMedications')}</h3>
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
