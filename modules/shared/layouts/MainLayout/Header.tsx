'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { AuthModal } from '../../components';
import { useAuth } from '../../contexts';
import { authService } from '../../services';
import styles from './MainLayout.module.scss';

export function Header() {
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const { user, isAuthenticated, logout: contextLogout } = useAuth();
  const pathname = usePathname();
  
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
          {/* Logo */}
          <Link href="/" className={styles.logo}>
            🐾 PetCare
          </Link>

          {/* Right Side: Nav Links + Notification + Avatar */}
          <div className={styles.rightNav}>
            <Link 
              href="/pet-profiles" 
              className={`${styles.navLink} ${pathname === '/pet-profiles' ? styles.active : ''}`}
            >
              Pet Profiles
            </Link>
            <Link 
              href="/blog" 
              className={`${styles.navLink} ${pathname === '/blog' ? styles.active : ''}`}
            >
              Blog
            </Link>
            <Link 
              href="/community" 
              className={`${styles.navLink} ${pathname === '/community' ? styles.active : ''}`}
            >
              Community
            </Link>

            {isAuthenticated && user ? (
              <>
                <button className={styles.notificationBtn} aria-label="Notifications">
                  🔔
                </button>
                <div className={styles.userMenu}>
                  <div className={styles.userAvatar}>
                    {user.fullName.charAt(0).toUpperCase()}
                  </div>
                </div>
              </>
            ) : (
              <button onClick={openAuth} className={styles.authButton}>
                Đăng nhập
              </button>
            )}
          </div>
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
