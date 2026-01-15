'use client';

import React, { useState } from 'react';
import { AuthModalProps } from './AuthModal.types';
import { authService } from '../../services';
import { useAuth } from '../../contexts';
import styles from './AuthModal.module.scss';

export function AuthModal({ isOpen, onClose, initialMode = 'signin' }: AuthModalProps) {
  const [mode, setMode] = useState<'signin' | 'signup'>(initialMode);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { updateUser } = useAuth();

  if (!isOpen) return null;

  const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const toggleMode = () => {
    setMode(mode === 'signin' ? 'signup' : 'signin');
    setError('');
  };

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log('🚀 [MODAL] Form submitted');
    console.log('📧 Email:', email);
    setError('');
    setLoading(true);

    try {
      const result = await authService.login({ email, password });
      console.log('📬 [MODAL] Login result:', result);
      
      if (result.success && result.data) {
        console.log('✅ [MODAL] Login successful, updating context...');
        const userData = {
          email: result.data.email,
          fullName: result.data.fullName,
          role: result.data.role,
          expiresAt: result.data.expiresAt,
        };
        console.log('👤 [MODAL] User data to update:', userData);
        updateUser(userData);
        console.log('🎉 [MODAL] Context updated, closing modal...');
        alert(`Welcome ${result.data.fullName}!`);
        onClose();
      } else {
        console.warn('⚠️ [MODAL] Login failed:', result.message);
        setError(result.message);
      }
    } catch (err: any) {
      console.error('❌ [MODAL] Exception:', err);
      setError(err.message || 'Đã có lỗi xảy ra');
    } finally {
      setLoading(false);
    }
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

              {error && <div className={styles.error}>{error}</div>}

              <form className={styles.form} onSubmit={handleSignIn}>
                <input
                  type="email"
                  placeholder="Email"
                  className={styles.input}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
                <input
                  type="password"
                  placeholder="Password"
                  className={styles.input}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />

                <div className={styles.forgotPassword}>
                  <a href="#">Forgot your password?</a>
                </div>

                <button 
                  type="submit" 
                  className={styles.submitButton}
                  disabled={loading}
                >
                  {loading ? 'Signing In...' : 'Sign In'}
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
