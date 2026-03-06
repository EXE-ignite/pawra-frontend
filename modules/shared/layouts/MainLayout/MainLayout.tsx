'use client';

import React from 'react';
import { MainLayoutProps } from './MainLayout.types';
import { Header } from './Header';
import { useTranslation } from '../../contexts';
import styles from './MainLayout.module.scss';

export function MainLayout({ children }: MainLayoutProps) {
  const { t } = useTranslation();

  return (
    <div className={styles.layout} suppressHydrationWarning>
      <Header />

      <main className={styles.main}>
        {children}
      </main>

      <footer className={styles.footer}>
        <div className={styles.footerContent}>
          <p className={styles.footerText}>
            {t('footer.copyright')}
          </p>
          <p className={styles.footerText}>
            {t('footer.builtWith')}
          </p>
        </div>
      </footer>
    </div>
  );
}
