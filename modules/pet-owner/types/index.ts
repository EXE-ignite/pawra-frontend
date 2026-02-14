export interface Pet {
  id: string;
  name: string;
  species: string;
  breed: string;
  age: number;
  weight?: number;
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

// Pet Profile Types
export interface Vaccination {
  id: string;
  name: string;
  dueDate: string;
  status: 'soon' | 'ok' | 'overdue';
}

export interface Medication {
  id: string;
  name: string;
  dosage: string;
  frequency: string;
}

export interface WeightRecord {
  date: string;
  weight: number;
}

export interface RoutineActivity {
  id: string;
  time: string;
  title: string;
  description: string;
  completed: boolean;
}

export interface Document {
  id: string;
  name: string;
  type: 'pdf' | 'image' | 'other';
  uploadDate: string;
  size: string;
}

export interface PetProfile extends Pet {
  ageMonths: number;
  vaccinations: Vaccination[];
  medications: Medication[];
  weightHistory: WeightRecord[];
  routine: RoutineActivity[];
  documents: Document[];
}

// Reminders/Calendar Types
export interface CalendarEvent {
  id: string;
  date: string;
  title: string;
  color: string;
  petId?: string;
}

export interface Task {
  id: string;
  time: string;
  title: string;
  petName: string;
  petId: string;
  type: 'feeding' | 'medication' | 'grooming' | 'other';
  priority: 'low' | 'medium' | 'high';
  completed: boolean;
}

export interface HealthMilestone {
  id: string;
  title: string;
  dueDate: string;
  daysUntil: number;
}
