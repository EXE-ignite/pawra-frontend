import { PetProfile, CalendarEvent, Task, HealthMilestone } from '../types';

// Pet Profile Mock Data
export const mockPetProfiles: PetProfile[] = [
  {
    id: 'PET-774291-8',
    name: 'Cooper',
    species: 'Dog',
    breed: 'Golden Retriever',
    age: 3,
    ageMonths: 2,
    weight: 32.4,
    vaccinations: [
      {
        id: '1',
        name: 'Rabies Booster',
        dateAdministered: '2024-01-15',
        expirationDate: '2025-01-15',
        batchNumber: 'RB-2024-001',
        status: 'due-soon',
        dueDate: 'Due in 12 days',
      },
      {
        id: '2',
        name: 'Distemper/Parvo',
        dateAdministered: '2023-10-01',
        expirationDate: '2025-10-01',
        batchNumber: 'DP-2023-042',
        status: 'valid',
        dueDate: 'Last: Oct 2023',
      },
    ],
    medications: [
      {
        id: '1',
        name: 'NexGard Spectra',
        dosage: '1 chewable monthly',
        frequency: 'Monthly',
      },
      {
        id: '2',
        name: 'Glucosamine',
        dosage: '500mg daily with breakfast',
        frequency: 'Daily',
      },
    ],
    weightHistory: [
      { date: '2024-01-01', weight: 30.4 },
      { date: '2024-03-01', weight: 31.2 },
      { date: '2024-05-01', weight: 31.8 },
      { date: '2024-07-01', weight: 32.4 },
    ],
    routine: [
      {
        id: '1',
        time: '07:30 AM',
        title: 'Breakfast',
        description: '1.5 cups dry kibble + topper',
        completed: true,
      },
      {
        id: '2',
        time: '08:30 AM',
        title: 'Morning Walk',
        description: '30 min park or trail walk',
        completed: false,
      },
      {
        id: '3',
        time: '06:00 PM',
        title: 'Dinner',
        description: '1.5 cups dry kibble',
        completed: false,
      },
    ],
    documents: [
      {
        id: '1',
        name: 'Vet_Visit_Oct23.pdf',
        type: 'pdf',
        uploadDate: 'Last edited 3 days',
        size: '2.3 MB',
      },
      {
        id: '2',
        name: 'Rabies_Cert_2024.pdf',
        type: 'pdf',
        uploadDate: 'Last edited 2 weeks',
        size: '1.1 MB',
      },
    ],
  },
];

// Calendar Events Mock Data
export const mockCalendarEvents: CalendarEvent[] = [
  { id: '1', date: '2023-10-02', title: 'Rex Feeding', color: '#3b82f6' },
  { id: '2', date: '2023-10-04', title: 'Luna Vaccination', color: '#f59e0b' },
  { id: '3', date: '2023-10-10', title: 'Rex Grooming', color: '#10b981' },
  { id: '4', date: '2023-10-12', title: '🔔🔔', color: '#8b5cf6' },
  { id: '5', date: '2023-10-15', title: 'Morning Feed', color: '#3b82f6' },
  { id: '6', date: '2023-10-15', title: 'Medication', color: '#f59e0b' },
];

// Tasks Mock Data
export const mockTasks: Task[] = [
  {
    id: '1',
    date: '2024-01-01',
    time: '09:00 AM',
    title: 'Morning Feeding',
    petName: 'Buddy',
    petId: '1',
    type: 'feeding',
    priority: 'high',
    completed: true,
  },
  {
    id: '2',
    date: '2024-01-01',
    time: '10:30 AM',
    title: 'Heartguard Medicine',
    petName: 'Buddy',
    petId: '1',
    type: 'medication',
    priority: 'high',
    completed: false,
  },
  {
    id: '3',
    date: '2024-01-01',
    time: '02:00 PM',
    title: 'Nail Trimming',
    petName: 'Luna',
    petId: '2',
    type: 'grooming',
    priority: 'medium',
    completed: false,
  },
];

// Health Milestones Mock Data
export const mockHealthMilestones: HealthMilestone[] = [
  {
    id: '1',
    title: 'Rabies Vaccination Due',
    dueDate: 'Nov 6, 2023',
    daysUntil: 12,
  },
];

// Service functions
export function getPetProfile(petId: string): PetProfile | undefined {
  return mockPetProfiles.find(pet => pet.id === petId);
}

export function getCalendarEvents(): CalendarEvent[] {
  return mockCalendarEvents;
}

export function getTasks(): Task[] {
  return mockTasks;
}

export function getHealthMilestones(): HealthMilestone[] {
  return mockHealthMilestones;
}
