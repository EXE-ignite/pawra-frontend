'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../contexts';
import { authService } from '../../services';
import { ThemeToggle } from '../../components';
import styles from './StaffLayout.module.scss';

interface StaffLayoutProps {
  children: React.ReactNode;
}

export function StaffLayout({ children }: StaffLayoutProps) {
  const { user, updateUser } = useAuth();
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
          <h1 className={styles.logo}>🐾 Pawra Admin</h1>
          <ThemeToggle />
        </div>
        
        <nav className={styles.nav}>
          <a href="/admin/dashboard" className={styles.navItem}>
            📊 Dashboard
          </a>
          <a href="/admin/users" className={styles.navItem}>
            👥 Users
          </a>
          <a href="/admin/appointments" className={styles.navItem}>
            📅 Appointments
          </a>
          <a href="/admin/pets" className={styles.navItem}>
            🐕 Pets
          </a>
          <a href="/admin/blog" className={styles.navItem}>
            📝 Blog Posts
          </a>
          <a href="/admin/reports" className={styles.navItem}>
            📈 Reports
          </a>
          <a href="/admin/settings" className={styles.navItem}>
            ⚙️ Settings
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
