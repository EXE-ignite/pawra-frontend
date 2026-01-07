import React from 'react';
import { DashboardPage } from '@/modules/pet-owner/pages/Dashboard';
import {
  fetchDashboardStats,
  fetchUserPets,
  fetchUpcomingAppointments
} from '@/modules/pet-owner/services/dashboard.service';

export default async function PetOwnerDashboard() {
  // Fetch data on the server
  const [stats, pets, appointments] = await Promise.all([
    fetchDashboardStats(),
    fetchUserPets(),
    fetchUpcomingAppointments()
  ]);

  return <DashboardPage stats={stats} pets={pets} appointments={appointments} />;
}
