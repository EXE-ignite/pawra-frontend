'use client';

import React, { useEffect, useState, useCallback } from 'react';
import { DashboardPage } from '@/modules/pet-owner/pages/Dashboard';
import {
  fetchDashboardStats,
  fetchUserPets,
  fetchUpcomingAppointments,
} from '@/modules/pet-owner/services/dashboard.service';
import type { Pet, Appointment, DashboardStats } from '@/modules/pet-owner/types';

const DEFAULT_STATS: DashboardStats = {
  totalPets: 0,
  upcomingAppointments: 0,
  completedVisits: 0,
  pendingPayments: 0,
};

export default function PetOwnerDashboard() {
  const [stats, setStats] = useState<DashboardStats>(DEFAULT_STATS);
  const [pets, setPets] = useState<Pet[]>([]);
  const [appointments, setAppointments] = useState<Appointment[]>([]);

  const loadData = useCallback(async () => {
    const [s, p, a] = await Promise.all([
      fetchDashboardStats(),
      fetchUserPets(),
      fetchUpcomingAppointments(),
    ]);
    setStats(s);
    setPets(p);
    setAppointments(a);
  }, []);

  useEffect(() => {
    loadData();

    window.addEventListener('pet-added', loadData);
    return () => window.removeEventListener('pet-added', loadData);
  }, [loadData]);

  return (
    <DashboardPage
      stats={stats}
      pets={pets}
      appointments={appointments}
      onRefresh={loadData}
    />
  );
}
