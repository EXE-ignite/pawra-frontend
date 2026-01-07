import React from 'react';
import Link from 'next/link';
import { MainLayoutProps } from './MainLayout.types';
import styles from './MainLayout.module.scss';

export function MainLayout({ children }: MainLayoutProps) {
  return (
    <div className={styles.layout}>
      <header className={styles.header}>
        <div className={styles.headerContent}>
          <Link href="/" className={styles.logo}>
            🐾 Pawra
          </Link>
          <nav className={styles.nav}>
            <Link href="/pet-owner" className={styles.navLink}>
              Pet Owners
            </Link>
            <Link href="/vet" className={styles.navLink}>
              Veterinarians
            </Link>
            <Link href="/admin" className={styles.navLink}>
              Admin
            </Link>
          </nav>
        </div>
      </header>

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
