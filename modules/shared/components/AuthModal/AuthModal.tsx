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

  const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const toggleMode = () => {
    setMode(mode === 'signin' ? 'signup' : 'signin');
  };

  const handleAuthSuccess = (userData: {
    email: string;
    fullName: string;
    role: string;
    expiresAt: string;
  }) => {
    console.log('✅ [MODAL] Auth successful, updating context...');
    console.log('👤 [MODAL] User data:', userData);
    updateUser(userData);
    
    const redirectRoute = getRouteByRole(userData.role);
    console.log('🚀 [MODAL] Redirecting to:', redirectRoute);
    
    onClose();
    router.push(redirectRoute);
  };

  return (
    <div className={styles.overlay} onClick={handleOverlayClick}>
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
