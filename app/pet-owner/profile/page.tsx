'use client';

import { PetProfilePage } from '@/modules/pet-owner';
import { PetProfile } from '@/modules/pet-owner/types';

const mockPetProfile: PetProfile = {
  id: '00812-G',
  name: 'Cooper',
  species: 'Dog',
  breed: 'Golden Retriever',
  age: 3,
  ageMonths: 2,
  weight: 32.4,
  imageUrl: '/images/cooper.jpg',
  status: 'active',
  color: 'Cream / Honey Gold',
  microchipId: '985112009456122',
  lastVisit: 'Oct 14, 2023',
  insurance: 'PetGuard Platinum',
  summary:
    'Cooper is a gentle, highly energetic Golden Retriever who loves outdoor adventures. He is microchipped and fully socialized with other dogs and children. Known for his "smiling" face and love for tennis balls.',
  hobbies: [
    { label: 'Swimming',  color: 'blue'   },
    { label: 'Frisbee',   color: 'blue'   },
    { label: 'Hiking',    color: 'orange' },
    { label: 'Napping',   color: 'green'  },
  ],
  favoriteThings: [
    { label: 'Peanut Butter', color: 'yellow' },
    { label: 'Tennis Balls',  color: 'green'  },
    { label: 'Squeaky Duck',  color: 'orange' },
    { label: 'Belly Rubs',    color: 'pink'   },
  ],
  vaccinationAlert:
    'The Bordetella vaccine is required for daycare and grooming appointments. Please schedule a booster before April.',
  vaccinations: [
    {
      id: '1',
      name: 'Rabies (3-Year)',
      dateAdministered: 'Oct 12, 2023',
      expirationDate: 'Oct 11, 2026',
      batchNumber: 'RB-99281',
      status: 'valid',
    },
    {
      id: '2',
      name: 'Distemper/Parvo',
      dateAdministered: 'Oct 12, 2023',
      expirationDate: 'Oct 11, 2024',
      batchNumber: 'DPV-4431',
      status: 'valid',
    },
    {
      id: '3',
      name: 'Bordetella',
      dateAdministered: 'Apr 05, 2023',
      expirationDate: 'Apr 04, 2024',
      batchNumber: 'BD-2289',
      status: 'due-soon',
    },
    {
      id: '4',
      name: 'Leptospirosis',
      dateAdministered: 'Oct 12, 2023',
      expirationDate: 'Oct 11, 2024',
      batchNumber: 'LEP-1811',
      status: 'valid',
    },
    {
      id: '5',
      name: 'Lyme Disease',
      dateAdministered: 'Oct 12, 2023',
      expirationDate: 'Oct 11, 2024',
      batchNumber: 'LY-8827',
      status: 'valid',
    },
  ],
  medications: [
    {
      id: '1',
      name: 'NexGard Spectra',
      dosage: '1 chewable monthly',
      frequency: 'Monthly',
    },
  ],
  weightHistory: [
    { date: '2024-01-01', weight: 30.4 },
    { date: '2024-07-01', weight: 32.4 },
  ],
  routine: [],
  documents: [],
};

export default function PetProfilePageRoute() {
  function handleEditProfile() {
    console.log('Edit profile');
  }

  function handleExportPdf() {
    console.log('Export PDF');
  }

  function handleAddRecord() {
    console.log('Add vaccination record');
  }

  return (
    <PetProfilePage
      petProfile={mockPetProfile}
      onEditProfile={handleEditProfile}
      onExportPdf={handleExportPdf}
      onAddRecord={handleAddRecord}
    />
  );
}

