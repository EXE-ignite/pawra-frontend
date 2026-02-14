'use client';

import { MainLayout } from '@/modules/shared';

export default function PetOwnerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <MainLayout>{children}</MainLayout>;
}
