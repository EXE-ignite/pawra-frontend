'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { AuthModal } from '../../components';
import { useAuth } from '../../contexts';
import { authService } from '../../services';
import styles from './MainLayout.module.scss';

export function Header() {
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const { user, isAuthenticated, logout: contextLogout } = useAuth();
  
  console.log('🎨 [HEADER] Render - User:', user);
  console.log('🔐 [HEADER] Is Authenticated:', isAuthenticated);

  const openAuth = () => {
    setIsAuthModalOpen(true);
  };

  const handleLogout = async () => {
    await authService.logout();
    contextLogout();
  };

  return (
    <>
      <header className={styles.header}>
        <div className={styles.headerContent}>
          <Link href="/" className={styles.logo}>
            🐾 Pawra
          </Link>
          <nav className={styles.nav}>
            {isAuthenticated && user ? (
              <>
                <span className={styles.welcomeText}>
                  Welcome, {user.fullName}
                </span>
                <button onClick={handleLogout} className={styles.navButton}>
                  Đăng xuất
                </button>
              </>
            ) : (
              <button onClick={openAuth} className={styles.navButton}>
                Đăng nhập
              </button>
            )}
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
