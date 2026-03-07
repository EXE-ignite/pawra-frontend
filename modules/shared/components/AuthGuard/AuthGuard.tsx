'use client';

import React, { useState } from 'react';
import { useAuth } from '../../contexts';
import { AuthModal } from '../AuthModal';
import styles from './AuthGuard.module.scss';

interface AuthGuardProps {
  children: React.ReactNode;
}

export function AuthGuard({ children }: AuthGuardProps) {
  const { isAuthenticated, isLoading } = useAuth();
  const [isModalOpen, setIsModalOpen] = useState(false);

  if (isLoading) {
    return (
      <div className={styles.loadingWrapper}>
        <div className={styles.spinner} />
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className={styles.gateWrapper}>
        <AuthModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          initialMode="signin"
        />
        <div className={styles.gate}>
          <div className={styles.icon}>🔒</div>
          <h2 className={styles.title}>Bạn chưa đăng nhập</h2>
          <p className={styles.description}>
            Vui lòng đăng nhập để truy cập tính năng này.
          </p>
          <button
            className={styles.loginBtn}
            onClick={() => setIsModalOpen(true)}
          >
            Đăng nhập ngay
          </button>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
