'use client';

import { MainLayout } from '@/modules/shared';
import { AuthGuard, PendingSubscriptionBanner } from '@/modules/shared/components';
import { AddPetFab } from '@/modules/pet-owner/components';

export default function PetOwnerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <MainLayout>
      <AuthGuard>
        <PendingSubscriptionBanner subscriptionHref="/pet-owner/subscription" />
        {children}
        <AddPetFab />
      </AuthGuard>
    </MainLayout>
  );
}
