'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { useAuth, useTheme } from '../../contexts';
import { authService } from '../../services';
import { ThemeToggle, AuthModal } from '../../components';
import styles from './StaffLayout.module.scss';

const STAFF_ROLES = ['Admin', 'Staff', 'Vet', 'Receptionist'];

interface StaffLayoutProps {
  children: React.ReactNode;
}

export function StaffLayout({ children }: StaffLayoutProps) {
  const { user, updateUser, isAuthenticated, isLoading } = useAuth();
  const { theme } = useTheme();
  const router = useRouter();
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  const handleLogout = async () => {
    await authService.logout();
    updateUser(null);
    router.push('/');
  };

  if (isLoading) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh' }}>
        <div style={{ width: 40, height: 40, border: '3px solid #B1B2FF', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 0.7s linear infinite' }} />
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', gap: '1rem', textAlign: 'center', padding: '2rem' }}>
        <AuthModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} initialMode="signin" />
        <div style={{ fontSize: '3rem' }}>🔒</div>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 700 }}>Bạn chưa đăng nhập</h2>
        <p style={{ color: '#6b7280' }}>Vui lòng đăng nhập để truy cập trang quản trị.</p>
        <button
          onClick={() => setIsAuthModalOpen(true)}
          style={{ padding: '0.75rem 2rem', backgroundColor: '#B1B2FF', border: 'none', borderRadius: 8, fontWeight: 600, cursor: 'pointer' }}
        >
          Đăng nhập ngay
        </button>
      </div>
    );
  }

  if (!STAFF_ROLES.includes(user?.role || '')) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', gap: '1rem', textAlign: 'center', padding: '2rem' }}>
        <div style={{ fontSize: '3rem' }}>🚫</div>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 700 }}>Không có quyền truy cập</h2>
        <p style={{ color: '#6b7280' }}>Tài khoản của bạn không có quyền truy cập trang quản trị.</p>
        <button
          onClick={() => router.push('/')}
          style={{ padding: '0.75rem 2rem', backgroundColor: '#B1B2FF', border: 'none', borderRadius: 8, fontWeight: 600, cursor: 'pointer' }}
        >
          Về trang chủ
        </button>
      </div>
    );
  }

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
