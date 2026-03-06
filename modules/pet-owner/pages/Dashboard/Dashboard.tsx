'use client';

import React, { useState } from 'react';
import { Button, useTranslation } from '@/modules/shared';
import { StatCard, PetCard, AppointmentCard, AddPetModal } from '../../components';
import { Pet, Appointment, DashboardStats } from '../../types';
import styles from './Dashboard.module.scss';

interface DashboardPageProps {
  stats: DashboardStats;
  pets: Pet[];
  appointments: Appointment[];
  onRefresh?: () => void;
}

export function DashboardPage({ stats, pets, appointments, onRefresh }: DashboardPageProps) {
  const [showAddPet, setShowAddPet] = useState(false);
  const { t } = useTranslation();

  function handleAddPet() {
    setShowAddPet(true);
  }

  function handlePetAdded() {
    onRefresh?.();
  }

  function handleBookAppointment() {
    console.log('Book new appointment');
  }

  return (
    <div className={styles.dashboard}>
      <div className={styles.header}>
        <h1 className={styles.title}>{t('dashboard.welcomeBack')}</h1>
        <p className={styles.subtitle}>
          {t('dashboard.subtitle')}
        </p>
      </div>

      {/* Stats Overview */}
      <div className={styles.statsGrid}>
        <StatCard
          icon="🐾"
          label={t('dashboard.totalPets')}
          value={stats.totalPets}
        />
        <StatCard
          icon="📅"
          label={t('dashboard.upcomingAppointments')}
          value={stats.upcomingAppointments}
        />
        <StatCard
          icon="✅"
          label={t('dashboard.completedVisits')}
          value={stats.completedVisits}
        />
        <StatCard
          icon="💳"
          label={t('dashboard.pendingPayments')}
          value={stats.pendingPayments}
        />
      </div>

      {/* My Pets Section */}
      <section className={styles.section}>
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>{t('dashboard.myPets')}</h2>
          <Button variant="primary" onClick={handleAddPet}>
            {t('dashboard.addPet')}
          </Button>
        </div>

        {pets.length > 0 ? (
          <div className={styles.petsGrid}>
            {pets.map((pet) => (
              <PetCard key={pet.id} pet={pet} />
            ))}
          </div>
        ) : (
          <div className={styles.emptyState}>
            <div className={styles.emptyStateIcon}>🐾</div>
            <h3 className={styles.emptyStateTitle}>{t('dashboard.noPets')}</h3>
            <p className={styles.emptyStateText}>
              {t('dashboard.noPetsDesc')}
            </p>
            <Button variant="primary" onClick={handleAddPet}>
              {t('dashboard.addFirstPet')}
            </Button>
          </div>
        )}
      </section>

      {/* Upcoming Appointments Section */}
      <section className={styles.section}>
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>{t('dashboard.upcomingAppointmentsTitle')}</h2>
          <Button variant="secondary" onClick={handleBookAppointment}>
            {t('dashboard.bookAppointment')}
          </Button>
        </div>

        {appointments.length > 0 ? (
          <div className={styles.appointmentsList}>
            {appointments.map((appointment) => (
              <AppointmentCard key={appointment.id} appointment={appointment} />
            ))}
          </div>
        ) : (
          <div className={styles.emptyState}>
            <div className={styles.emptyStateIcon}>📅</div>
            <h3 className={styles.emptyStateTitle}>{t('dashboard.noAppointments')}</h3>
            <p className={styles.emptyStateText}>
              {t('dashboard.noAppointmentsDesc')}
            </p>
            <Button variant="primary" onClick={handleBookAppointment}>
              {t('dashboard.bookAppointment')}
            </Button>
          </div>
        )}
      </section>
      <AddPetModal
        isOpen={showAddPet}
        onClose={() => setShowAddPet(false)}
        onSuccess={handlePetAdded}
      />
    </div>
  );
}
