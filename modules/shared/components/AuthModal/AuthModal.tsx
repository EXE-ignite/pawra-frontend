'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useGoogleLogin } from '@react-oauth/google';
import { AuthModalProps } from './AuthModal.types';
import { authService } from '../../services';
import { useAuth } from '../../contexts';
import { getRouteByRole } from '../../constants/routes';
import { Toast } from '../Toast';
import styles from './AuthModal.module.scss';

export function AuthModal({ isOpen, onClose, initialMode = 'signin' }: AuthModalProps) {
  const [mode, setMode] = useState<'signin' | 'signup'>(initialMode);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: 'info' | 'warning' | 'error' } | null>(null);
  const { updateUser } = useAuth();
  const router = useRouter();

  const handleFacebookLogin = () => {
    setToast({ message: 'Tính năng đăng nhập Facebook hiện tại chưa có', type: 'info' });
  };

  const handleGoogleLogin = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      console.log('🔵 [GOOGLE] Token received:', tokenResponse);
      setLoading(true);
      setError('');
      
      try {
        const result = await authService.loginWithGoogle({ 
          idToken: tokenResponse.access_token 
        });
        console.log('📬 [GOOGLE] Login result:', result);
        
        if (result.success && result.data) {
          console.log('✅ [GOOGLE] Login successful');
          const userData = {
            email: result.data.email,
            fullName: result.data.fullName,
            role: result.data.role,
            expiresAt: result.data.expiresAt,
          };
          updateUser(userData);
          
          const redirectRoute = getRouteByRole(result.data.role);
          console.log('🚀 [GOOGLE] Redirecting to:', redirectRoute);
          
          onClose();
          router.push(redirectRoute);
        } else {
          setError(result.message);
        }
      } catch (err: any) {
        console.error('❌ [GOOGLE] Exception:', err);
        setError(err.message || 'Google login failed');
      } finally {
        setLoading(false);
      }
    },
    onError: (error) => {
      console.error('❌ [GOOGLE] OAuth error:', error);
      setError('Google login failed. Please try again.');
    },
  });

  if (!isOpen) return null;

  const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const toggleMode = () => {
    setMode(mode === 'signin' ? 'signup' : 'signin');
    setEmail('');
    setPassword('');
    setFullName('');
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
        
        // Get redirect route based on role
        const redirectRoute = getRouteByRole(result.data.role);
        console.log('🚀 [MODAL] Redirecting to:', redirectRoute);
        
        onClose();
        router.push(redirectRoute);
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

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log('🚀 [MODAL] SignUp form submitted');
    console.log('📧 Email:', email);
    console.log('👤 FullName:', fullName);
    setError('');
    setLoading(true);

    try {
      const result = await authService.register({ email, password, fullName });
      console.log('📬 [MODAL] Register result:', result);
      
      if (result.success && result.data) {
        console.log('✅ [MODAL] Registration successful, updating context...');
        const userData = {
          email: result.data.email,
          fullName: result.data.fullName,
          role: result.data.role,
          expiresAt: result.data.expiresAt,
        };
        console.log('👤 [MODAL] User data to update:', userData);
        updateUser(userData);
        console.log('🎉 [MODAL] Context updated, closing modal...');
        
        // Get redirect route based on role
        const redirectRoute = getRouteByRole(result.data.role);
        console.log('🚀 [MODAL] Redirecting to:', redirectRoute);
        
        onClose();
        router.push(redirectRoute);
      } else {
        console.warn('⚠️ [MODAL] Registration failed:', result.message);
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
                <button type="button" className={styles.socialButton} onClick={handleFacebookLogin}>
                  f
                </button>
                <button type="button" className={styles.socialButton} onClick={() => handleGoogleLogin()}>
                  G+
                </button>
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
                <button type="button" className={styles.socialButton} onClick={handleFacebookLogin}>
                  f
                </button>
                <button type="button" className={styles.socialButton} onClick={() => handleGoogleLogin()}>
                  G+
                </button>
              </div>

              <p className={styles.divider}>or use your email for registration</p>

              {error && <div className={styles.error}>{error}</div>}

              <form className={styles.form} onSubmit={handleSignUp}>
                <input
                  type="text"
                  placeholder="Full Name"
                  className={styles.input}
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  required
                />
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

                <button 
                  type="submit" 
                  className={styles.submitButton}
                  disabled={loading}
                >
                  {loading ? 'Signing Up...' : 'Sign Up'}
                </button>
              </form>
            </div>
          </>
        )}
      </div>
      
      {toast && (
        <Toast 
          message={toast.message} 
          type={toast.type} 
          onClose={() => setToast(null)} 
        />
      )}
    </div>
  );
}
