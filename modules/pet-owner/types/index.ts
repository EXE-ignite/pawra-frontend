export interface Pet {
  id: string;
  name: string;
  species: string;
  breed: string;
  age: number;
  imageUrl?: string;
}

export interface Appointment {
  id: string;
  petId: string;
  petName: string;
  veterinarian: string;
  date: string;
  time: string;
  type: 'checkup' | 'vaccination' | 'emergency' | 'surgery';
  status: 'scheduled' | 'completed' | 'cancelled';
}

export interface DashboardStats {
  totalPets: number;
  upcomingAppointments: number;
  completedVisits: number;
  pendingPayments: number;
}
