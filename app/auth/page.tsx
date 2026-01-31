'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/modules/shared/contexts';
import { getRouteByRole } from '@/modules/shared/constants/routes';
import { SignInForm } from '@/modules/shared/components/AuthModal/SignInForm';
import { SignUpForm } from '@/modules/shared/components/AuthModal/SignUpForm';
import { Illustration } from '@/modules/shared/components/AuthModal/Illustration';
import styles from './page.module.scss';

export default function AuthPage() {
  const [mode, setMode] = useState<'signin' | 'signup'>('signin');
  const { updateUser, isAuthenticated, user } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    // Check if user is already authenticated
    if (isAuthenticated && user) {
      const redirectRoute = getRouteByRole(user.role);
      router.push(redirectRoute);
      return;
    }

    // Check URL params for mode
    const modeParam = searchParams.get('mode');
    if (modeParam === 'signup' || modeParam === 'signin') {
      setMode(modeParam);
    }
  }, [isAuthenticated, user, router, searchParams]);

  const toggleMode = () => {
    const newMode = mode === 'signin' ? 'signup' : 'signin';
    setMode(newMode);
    router.push(`/auth?mode=${newMode}`, { scroll: false });
  };

  const handleAuthSuccess = (userData: {
    email: string;
    fullName: string;
    role: string;
    expiresAt: string;
  }) => {
    console.log('✅ [AUTH PAGE] Auth successful, updating context...');
    console.log('👤 [AUTH PAGE] User data:', userData);
    updateUser(userData);
    
    const redirectRoute = getRouteByRole(userData.role);
    console.log('🚀 [AUTH PAGE] Redirecting to:', redirectRoute);
    
    router.push(redirectRoute);
  };

  return (
    <div className={styles.authPage}>
      <div className={styles.container}>
        <div className={styles.formSection}>
          {mode === 'signin' ? (
            <SignInForm onSuccess={handleAuthSuccess} onToggleMode={toggleMode} />
          ) : (
            <SignUpForm onSuccess={handleAuthSuccess} onToggleMode={toggleMode} />
          )}
        </div>
        <div className={styles.illustrationSection}>
          <Illustration mode={mode} />
        </div>
      </div>
    </div>
  );
}
