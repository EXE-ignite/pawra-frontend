'use client';

import { MainLayout } from '@/modules/shared';
import { AddPetFab } from '@/modules/pet-owner/components';

export default function PetOwnerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <MainLayout>
      {children}
      <AddPetFab />
    </MainLayout>
  );
}
