'use client';

import { MainLayout } from '@/modules/shared';
import { AuthGuard } from '@/modules/shared/components';

export default function VetLayout({ children }: { children: React.ReactNode }) {
  return (
    <MainLayout>
      <AuthGuard>{children}</AuthGuard>
    </MainLayout>
  );
}
