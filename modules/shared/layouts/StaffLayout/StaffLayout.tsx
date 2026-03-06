'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { useAuth, useTheme } from '../../contexts';
import { authService } from '../../services';
import { ThemeToggle } from '../../components';
import styles from './StaffLayout.module.scss';

interface StaffLayoutProps {
  children: React.ReactNode;
}

export function StaffLayout({ children }: StaffLayoutProps) {
  const { user, updateUser } = useAuth();
  const { theme } = useTheme();
  const router = useRouter();

  const handleLogout = async () => {
    await authService.logout();
    updateUser(null);
    router.push('/');
  };

  return (
    <div className={styles.layout}>
      <aside className={styles.sidebar}>
        <div className={styles.sidebarHeader}>
          <div className={styles.logoContainer}>
            <Image 
              src={theme === 'dark' ? '/darklogo.svg' : '/logo.png'}
              alt="Pawra Admin Logo" 
              width={63} 
              height={83.344}
              priority
              style={{ objectFit: 'contain' }}
            />
          </div>
          <ThemeToggle />
        </div>
        
        <nav className={styles.nav}>
          <a href="/admin/dashboard" className={styles.navItem}>
            📊 Dashboard
          </a>
          <a href="/admin/blog" className={styles.navItem}>
            📝 Blog Posts
          </a>
        </nav>

        <div className={styles.sidebarFooter}>
          <div className={styles.userCard}>
            <div className={styles.userAvatar}>
              {user?.fullName?.charAt(0).toUpperCase() || 'A'}
            </div>
            <div className={styles.userDetails}>
              <p className={styles.userName}>{user?.fullName || 'Admin User'}</p>
              <p className={styles.userRole}>{user?.role || 'Admin'}</p>
            </div>
          </div>
          <button onClick={handleLogout} className={styles.logoutButton}>
            🚪 Đăng xuất
          </button>
        </div>
      </aside>
      
      <main className={styles.main}>
        <div className={styles.content}>
          {children}
        </div>
      </main>
    </div>
  );
}
