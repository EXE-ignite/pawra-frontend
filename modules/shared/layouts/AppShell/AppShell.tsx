'use client';

import React from 'react';
import { MainLayout } from '../MainLayout';

export function AppShell({ children }: { children: React.ReactNode }) {
  return <MainLayout>{children}</MainLayout>;
}

