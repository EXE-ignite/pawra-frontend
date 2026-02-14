'use client';

import { MainLayout } from '@/modules/shared';

export default function CustomerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <MainLayout>{children}</MainLayout>;
}
