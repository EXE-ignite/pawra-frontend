'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { AuthModal } from '../../components';
import styles from './MainLayout.module.scss';

export function Header() {
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  const openAuth = () => {
    setIsAuthModalOpen(true);
  };

  return (
    <>
      <header className={styles.header}>
        <div className={styles.headerContent}>
          <Link href="/" className={styles.logo}>
            🐾 Pawra
          </Link>
          <nav className={styles.nav}>
            <button onClick={openAuth} className={styles.navButton}>
              Đăng nhập
            </button>
          </nav>
        </div>
      </header>

      <AuthModal 
        isOpen={isAuthModalOpen} 
        onClose={() => setIsAuthModalOpen(false)}
        initialMode="signin"
      />
    </>
  );
}
