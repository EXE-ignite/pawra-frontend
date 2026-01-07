import { Pet, Appointment, DashboardStats } from '../types';

// Mock data service - replace with actual API calls
export async function fetchDashboardStats(): Promise<DashboardStats> {
  // Simulate API call
  return {
    totalPets: 3,
    upcomingAppointments: 2,
    completedVisits: 12,
    pendingPayments: 1
  };
}

export async function fetchUserPets(): Promise<Pet[]> {
  // Simulate API call
  return [
    {
      id: '1',
      name: 'Max',
      species: 'Dog',
      breed: 'Golden Retriever',
      age: 4
    },
    {
      id: '2',
      name: 'Luna',
      species: 'Cat',
      breed: 'Persian',
      age: 2
    },
    {
      id: '3',
      name: 'Charlie',
      species: 'Dog',
      breed: 'Beagle',
      age: 3
    }
  ];
}

export async function fetchUpcomingAppointments(): Promise<Appointment[]> {
  // Simulate API call
  return [
    {
      id: '1',
      petId: '1',
      petName: 'Max',
      veterinarian: 'Dr. Sarah Johnson',
      date: '2026-01-15',
      time: '10:00 AM',
      type: 'checkup',
      status: 'scheduled'
    },
    {
      id: '2',
      petId: '2',
      petName: 'Luna',
      veterinarian: 'Dr. Michael Chen',
      date: '2026-01-18',
      time: '2:30 PM',
      type: 'vaccination',
      status: 'scheduled'
    }
  ];
}
