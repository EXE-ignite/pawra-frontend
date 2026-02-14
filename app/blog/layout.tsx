'use client';

import { MainLayout } from '@/modules/shared';

export default function BlogLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <MainLayout>{children}</MainLayout>;
}
