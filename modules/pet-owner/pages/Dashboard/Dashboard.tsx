'use client';

import React from 'react';
import { Button } from '@/modules/shared';
import { StatCard, PetCard, AppointmentCard } from '../../components';
import { Pet, Appointment, DashboardStats } from '../../types';
import styles from './Dashboard.module.scss';

interface DashboardPageProps {
  stats: DashboardStats;
  pets: Pet[];
  appointments: Appointment[];
  onAddPet?: () => void;
  onEditPet?: (pet: Pet) => void;
  loading?: boolean;
}

export function DashboardPage({ stats, pets, appointments, onAddPet, onEditPet, loading }: DashboardPageProps) {
  function handleBookAppointment() {
    console.log('Book new appointment');
  }

  return (
    <div className={styles.dashboard}>
      <div className={styles.header}>
        <h1 className={styles.title}>Welcome back! 👋</h1>
        <p className={styles.subtitle}>
          Here's what's happening with your pets today.
        </p>
      </div>

      {/* Stats Overview */}
      <div className={styles.statsGrid}>
        <StatCard
          icon="🐾"
          label="Total Pets"
          value={stats.totalPets}
        />
        <StatCard
          icon="📅"
          label="Upcoming Appointments"
          value={stats.upcomingAppointments}
        />
        <StatCard
          icon="✅"
          label="Completed Visits"
          value={stats.completedVisits}
        />
        <StatCard
          icon="💳"
          label="Pending Payments"
          value={stats.pendingPayments}
        />
      </div>

      {/* My Pets Section */}
      <section className={styles.section}>
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>My Pets</h2>
          <Button variant="primary" onClick={onAddPet}>
            + Add Pet
          </Button>
        </div>

        {loading ? (
          <div className={styles.emptyState}>
            <div className={styles.emptyStateIcon}>⏳</div>
            <h3 className={styles.emptyStateTitle}>Loading...</h3>
            <p className={styles.emptyStateText}>Fetching your pets and appointments.</p>
          </div>
        ) : pets.length > 0 ? (
          <div className={styles.petsGrid}>
            {pets.map((pet) => (
              <PetCard key={pet.id} pet={pet} onClick={() => onEditPet?.(pet)} />
            ))}
          </div>
        ) : (
          <div className={styles.emptyState}>
            <div className={styles.emptyStateIcon}>🐾</div>
            <h3 className={styles.emptyStateTitle}>No pets yet</h3>
            <p className={styles.emptyStateText}>
              Start by adding your first pet to track their health and appointments.
            </p>
            <Button variant="primary" onClick={onAddPet}>
              Add Your First Pet
            </Button>
          </div>
        )}
      </section>

      {/* Upcoming Appointments Section */}
      <section className={styles.section}>
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>Upcoming Appointments</h2>
          <Button variant="secondary" onClick={handleBookAppointment}>
            + Book Appointment
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
            <h3 className={styles.emptyStateTitle}>No upcoming appointments</h3>
            <p className={styles.emptyStateText}>
              Book an appointment with a veterinarian for your pet's health checkup.
            </p>
            <Button variant="primary" onClick={handleBookAppointment}>
              Book Appointment
            </Button>
          </div>
        )}
      </section>
    </div>
  );
}
