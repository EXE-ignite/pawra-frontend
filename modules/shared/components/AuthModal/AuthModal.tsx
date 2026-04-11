'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { AuthModalProps } from './AuthModal.types';
import { useAuth } from '../../contexts';
import { getRouteByRole } from '../../constants/routes';
import { SignInForm } from './SignInForm';
import { SignUpForm } from './SignUpForm';
import { WelcomePanel } from './WelcomePanel';
import styles from './AuthModal.module.scss';

export function AuthModal({ isOpen, onClose, initialMode = 'signin' }: AuthModalProps) {
  const [mode, setMode] = useState<'signin' | 'signup'>(initialMode);
  const { updateUser } = useAuth();
  const router = useRouter();

  if (!isOpen) return null;

  const toggleMode = () => {
    setMode(mode === 'signin' ? 'signup' : 'signin');
  };

  const handleAuthSuccess = (userData: {
    email: string;
    fullName: string;
    role: string;
    avatarUrl?: string;
    expiresAt: string;
  }) => {
    console.log('✅ [MODAL] Auth successful, updating context...');
    console.log('👤 [MODAL] User data:', userData);
    updateUser(userData);
    
    // Admin và Staff vào dashboard, còn lại về home
    const redirectRoute = userData.role === 'Admin' || userData.role === 'Staff' || userData.role === 'Vet' || userData.role === 'Receptionist'
      ? getRouteByRole(userData.role)
      : '/';
    console.log('🚀 [MODAL] Redirecting to:', redirectRoute);
    
    onClose();
    router.push(redirectRoute);
  };

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <button className={styles.closeButton} onClick={onClose}>
          ×
        </button>

        {mode === 'signin' ? (
          <>
            <div className={styles.formSection}>
              <SignInForm onSuccess={handleAuthSuccess} />
            </div>
            <WelcomePanel mode="signin" onToggle={toggleMode} />
          </>
        ) : (
          <>
            <WelcomePanel mode="signup" onToggle={toggleMode} />
            <div className={styles.formSection}>
              <SignUpForm onSuccess={handleAuthSuccess} />
            </div>
          </>
        )}
      </div>
    </div>
  );
}
