'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { AuthModal, UserDropdown, ThemeToggle } from '../../components';
import { useAuth, useTheme } from '../../contexts';
import { authService } from '../../services';
import styles from './MainLayout.module.scss';

export function Header() {
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const { user, isAuthenticated, logout: contextLogout } = useAuth();
  const { theme } = useTheme();
  const pathname = usePathname();

  const openAuth = () => {
    setIsAuthModalOpen(true);
  };

  const handleLogout = async () => {
    await authService.logout();
    contextLogout();
  };

  return (
    <>
      <header className={styles.header} suppressHydrationWarning>
        <div className={styles.headerContent}>
          {/* Logo */}
          <Link href="/" className={styles.logo}>
            <Image 
              src={theme === 'dark' ? '/darklogo.svg' : '/logo.png'}
              alt="Pawra Logo" 
              width={60} 
              height={20}
              priority
            />
          </Link>

          {/* Right Side: Nav Links + Notification + Avatar */}
          <div className={styles.rightNav}>
            <Link 
              href="/pet-owner/profile" 
              className={`${styles.navLink} ${pathname === '/pet-owner/profile' ? styles.active : ''}`}
            >
              Pet Profile
            </Link>
            <Link 
              href="/blog" 
              className={`${styles.navLink} ${pathname === '/blog' ? styles.active : ''}`}
            >
              Blog
            </Link>
            <Link 
              href="/pet-owner/reminders" 
              className={`${styles.navLink} ${pathname === '/pet-owner/reminders' ? styles.active : ''}`}
            >
              Calendar
            </Link>

            <ThemeToggle />

            {isAuthenticated && user ? (
              <>
                <button className={styles.notificationBtn} aria-label="Notifications">
                  🔔
                </button>
                <UserDropdown
                  userName={user.fullName}
                  userEmail={user.email}
                  onLogout={handleLogout}
                />
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
