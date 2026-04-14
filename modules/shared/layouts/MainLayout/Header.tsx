'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { AuthModal, UserDropdown, ThemeToggle, LanguageSwitcher } from '../../components';
import { useAuth, useTheme, useTranslation } from '../../contexts';
import { authService } from '../../services';
import styles from './MainLayout.module.scss';

export function Header() {
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const { user, isAuthenticated, logout: contextLogout } = useAuth();
  const { theme } = useTheme();
  const { t } = useTranslation();
  const pathname = usePathname();

  const isClinicRole = user?.role === 'ClinicManager' || user?.role === 'Veterinarian' || user?.role === 'Vet';
  const isAdmin = user?.role === 'Admin';

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
            {isClinicRole ? (
              // ── Clinic Manager / Veterinarian nav ──────────────────────
              <>
                <Link
                  href={user?.role === 'ClinicManager' ? '/clinic-manager' : '/vet'}
                  className={`${styles.navLink} ${pathname === (user?.role === 'ClinicManager' ? '/clinic-manager' : '/vet') ? styles.active : ''}`}
                >
                  {user?.role === 'ClinicManager' ? 'Quản lý phòng khám' : 'Bác sĩ thú y'}
                </Link>
                <Link
                  href="/blog"
                  className={`${styles.navLink} ${pathname === '/blog' ? styles.active : ''}`}
                >
                  {t('nav.blog')}
                </Link>
                <Link
                  href="/vet/subscription"
                  className={`${styles.navLink} ${pathname === '/vet/subscription' ? styles.active : ''}`}
                >
                  {t('nav.subscription')}
                </Link>
              </>
            ) : isAdmin ? (
              // ── Admin nav ──────────────────────────────────────────────
              <>
                <Link
                  href="/admin/dashboard"
                  className={`${styles.navLink} ${pathname.startsWith('/admin') ? styles.active : ''}`}
                >
                  Dashboard
                </Link>
                <Link
                  href="/blog"
                  className={`${styles.navLink} ${pathname === '/blog' ? styles.active : ''}`}
                >
                  {t('nav.blog')}
                </Link>
              </>
            ) : (
              // ── Default: Pet Owner / Customer nav ─────────────────────
              <>
                <Link
                  href="/pet-owner/profile"
                  className={`${styles.navLink} ${pathname === '/pet-owner/profile' ? styles.active : ''}`}
                >
                  {t('nav.petProfile')}
                </Link>
                <Link
                  href="/blog"
                  className={`${styles.navLink} ${pathname === '/blog' ? styles.active : ''}`}
                >
                  {t('nav.blog')}
                </Link>
                <Link
                  href="/pet-owner/reminders"
                  className={`${styles.navLink} ${pathname === '/pet-owner/reminders' ? styles.active : ''}`}
                >
                  {t('nav.calendar')}
                </Link>
                <Link
                  href="/pet-owner/subscription"
                  className={`${styles.navLink} ${pathname === '/pet-owner/subscription' ? styles.active : ''}`}
                >
                  {t('nav.subscription')}
                </Link>
              </>
            )}

            <LanguageSwitcher />
            <ThemeToggle />

            {isAuthenticated && user ? (
              <>
                <button className={styles.notificationBtn} aria-label={t('nav.notifications')}>
                  🔔
                </button>
                <UserDropdown
                  userName={user.fullName}
                  userEmail={user.email}
                  avatarUrl={user.avatarUrl}
                  onLogout={handleLogout}
                />
              </>
            ) : (
              <button onClick={openAuth} className={styles.authButton}>
                {t('nav.login')}
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
