import React from 'react';
import { Appointment } from '../../types';
import { Button } from '@/modules/shared';
import styles from './AppointmentCard.module.scss';

interface AppointmentCardProps {
  appointment: Appointment;
}

export function AppointmentCard({ appointment }: AppointmentCardProps) {
  function handleReschedule() {
    console.log('Reschedule appointment:', appointment.id);
  }

  function handleCancel() {
    console.log('Cancel appointment:', appointment.id);
  }

  return (
    <div className={styles.card}>
      <div className={styles.appointmentInfo}>
        <div className={styles.appointmentHeader}>
          <h3 className={styles.petName}>{appointment.petName}</h3>
          <span className={`${styles.appointmentType} ${styles[appointment.type]}`}>
            {appointment.type}
          </span>
        </div>

        <div className={styles.appointmentDetails}>
          <p className={styles.detail}>
            <span className={styles.detailIcon}>👨‍⚕️</span>
            {appointment.veterinarian}
          </p>
          <p className={styles.detail}>
            <span className={styles.detailIcon}>📅</span>
            {new Date(appointment.date).toLocaleDateString('en-US', {
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            })}
          </p>
          <p className={styles.detail}>
            <span className={styles.detailIcon}>🕐</span>
            {appointment.time}
          </p>
        </div>
      </div>

      <div className={styles.appointmentActions}>
        <Button variant="secondary" size="sm" onClick={handleReschedule}>
          Reschedule
        </Button>
        <Button variant="outline" size="sm" onClick={handleCancel}>
          Cancel
        </Button>
      </div>
    </div>
  );
}
