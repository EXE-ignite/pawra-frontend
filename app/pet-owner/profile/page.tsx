'use client';

import { PetProfilePage } from '@/modules/pet-owner';
import { PetProfile } from '@/modules/pet-owner/types';

// Mock data for demonstration
const mockPetProfile: PetProfile = {
  id: 'PET-774291-8',
  name: 'Cooper',
  species: 'Dog',
  breed: 'Golden Retriever',
  age: 3,
  ageMonths: 2,
  weight: 32.4,
  imageUrl: '/images/cooper.jpg',
  vaccinations: [
    {
      id: '1',
      name: 'Rabies Booster',
      dueDate: 'Due in 12 days',
      status: 'soon',
    },
    {
      id: '2',
      name: 'Distemper/Parvo',
      dueDate: 'Last: Oct 2023',
      status: 'ok',
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
};

export default function PetProfilePageRoute() {
  function handleShareProfile() {
    console.log('Share profile');
  }

  function handleLogEntry() {
    console.log('Log entry');
  }

  function handleToggleActivity(activityId: string) {
    console.log('Toggle activity:', activityId);
  }

  return (
    <PetProfilePage
      petProfile={mockPetProfile}
      onShareProfile={handleShareProfile}
      onLogEntry={handleLogEntry}
      onToggleActivity={handleToggleActivity}
    />
  );
}
