'use client';

import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { DashboardPage } from '@/modules/pet-owner/pages/Dashboard';
import {
  fetchDashboardStats,
  fetchUserPets,
  fetchUpcomingAppointments,
} from '@/modules/pet-owner/services/dashboard.service';
import { Pet, Appointment, DashboardStats } from '@/modules/pet-owner/types';
import { tokenService } from '@/modules/shared/services';

export default function PetOwnerDashboard() {
  const router = useRouter();
  const [stats, setStats] = useState<DashboardStats>({
    totalPets: 0,
    upcomingAppointments: 0,
    completedVisits: 0,
    pendingPayments: 0,
  });
  const [pets, setPets] = useState<Pet[]>([]);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);


  const refresh = useCallback(async () => {
    if (!tokenService.hasToken()) {
      router.push('/auth');
      return;
    }

    setLoading(true);
    try {
      const [nextStats, nextPets, nextAppointments] = await Promise.all([
        fetchDashboardStats().catch(() => ({
          totalPets: 0,
          upcomingAppointments: 0,
          completedVisits: 0,
          pendingPayments: 0,
        })),
        fetchUserPets().catch(() => []),
        fetchUpcomingAppointments().catch(() => []),
      ]);
      
      setStats(nextStats);
      setPets(nextPets);
      setAppointments(nextAppointments);
    } catch (error) {
      console.error('❌ [DASHBOARD] Failed to load data:', error);
    } finally {
      setLoading(false);
    }
  }, [router]);

  useEffect(() => {
    refresh();
  }, [refresh]);


  return (
    <>
      <DashboardPage
        stats={stats}
        pets={pets}
        appointments={appointments}
        loading={loading}
      />


    </>
  );
}
