'use client';

import React from 'react';
import { MainLayoutProps } from './MainLayout.types';
import { Header } from './Header';
import styles from './MainLayout.module.scss';

export function MainLayout({ children }: MainLayoutProps) {
  return (
    <div className={styles.layout} suppressHydrationWarning>
      <Header />

      <main className={styles.main}>
        {children}
      </main>

      <footer className={styles.footer}>
        <div className={styles.footerContent}>
          <p className={styles.footerText}>
            © 2026 Pawra. All rights reserved.
          </p>
          <p className={styles.footerText}>
            Built with Next.js & ❤️
          </p>
        </div>
      </footer>
    </div>
  );
}
