'use client';

import React, { useState } from 'react';
import { AuthModalProps } from './AuthModal.types';
import styles from './AuthModal.module.scss';

export function AuthModal({ isOpen, onClose, initialMode = 'signin' }: AuthModalProps) {
  const [mode, setMode] = useState<'signin' | 'signup'>(initialMode);

  if (!isOpen) return null;

  const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const toggleMode = () => {
    setMode(mode === 'signin' ? 'signup' : 'signin');
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
              <h2 className={styles.title}>Sign in</h2>

              <div className={styles.socialButtons}>
                <button className={styles.socialButton}>f</button>
                <button className={styles.socialButton}>G+</button>
              </div>

              <p className={styles.divider}>or use your account</p>

              <form className={styles.form}>
                <input
                  type="email"
                  placeholder="Email"
                  className={styles.input}
                />
                <input
                  type="password"
                  placeholder="Password"
                  className={styles.input}
                />

                <div className={styles.forgotPassword}>
                  <a href="#">Forgot your password?</a>
                </div>

                <button type="submit" className={styles.submitButton}>
                  Sign In
                </button>
              </form>
            </div>

            <div className={styles.welcomeSection}>
              <h2 className={styles.welcomeTitle}>Hello, Friend!</h2>
              <p className={styles.welcomeText}>
                Enter your personal details and start journey with us
              </p>
              <button className={styles.switchButton} onClick={toggleMode}>
                Sign Up
              </button>
            </div>
          </>
        ) : (
          <>
            <div className={styles.welcomeSection}>
              <h2 className={styles.welcomeTitle}>Welcome Back!</h2>
              <p className={styles.welcomeText}>
                To keep connected with us please login with your personal info
              </p>
              <button className={styles.switchButton} onClick={toggleMode}>
                Sign In
              </button>
            </div>

            <div className={styles.formSection}>
              <h2 className={styles.title}>Create Account</h2>

              <div className={styles.socialButtons}>
                <button className={styles.socialButton}>f</button>
                <button className={styles.socialButton}>G+</button>
              </div>

              <p className={styles.divider}>or use your email for registration</p>

              <form className={styles.form}>
                <input
                  type="text"
                  placeholder="Name"
                  className={styles.input}
                />
                <input
                  type="email"
                  placeholder="Email"
                  className={styles.input}
                />
                <input
                  type="password"
                  placeholder="Password"
                  className={styles.input}
                />

                <button type="submit" className={styles.submitButton}>
                  Sign Up
                </button>
              </form>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
