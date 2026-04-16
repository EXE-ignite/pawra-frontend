'use client';

import { MainLayout } from '@/modules/shared';
import { AuthGuard, PendingSubscriptionBanner } from '@/modules/shared/components';

export default function VetLayout({ children }: { children: React.ReactNode }) {
  return (
    <MainLayout>
      <AuthGuard>
        <PendingSubscriptionBanner subscriptionHref="/vet/subscription" />
        {children}
      </AuthGuard>
    </MainLayout>
  );
}
