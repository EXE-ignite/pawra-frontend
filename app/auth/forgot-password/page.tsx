'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { ForgotPasswordForm } from '@/modules/shared/components/AuthModal/ForgotPasswordForm';
import { ForgotPasswordIllustration } from '@/modules/shared/components/AuthModal/ForgotPasswordIllustration';
import styles from './page.module.scss';

export default function ForgotPasswordPage() {
  const router = useRouter();

  const handleBack = () => {
    router.push('/auth?mode=signin');
  };

  return (
    <div className={styles.forgotPasswordPage}>
      <div className={styles.container}>
        <div className={styles.formSection}>
          <ForgotPasswordForm onBack={handleBack} />
        </div>
        <div className={styles.illustrationSection}>
          <ForgotPasswordIllustration />
        </div>
      </div>
    </div>
  );
}
