'use client';

import React, { useState } from 'react';
import { useGoogleLogin } from '@react-oauth/google';
import { SignInFormProps } from './SignInForm.types';
import { authService } from '../../../services';
import { Toast } from '../../Toast';
import styles from './SignInForm.module.scss';

export function SignInForm({ onSuccess }: SignInFormProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: 'info' | 'warning' | 'error' } | null>(null);

  const isGoogleConfigured = typeof window !== 'undefined' && 
    process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID && 
    process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID !== '';

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
          onSuccess(userData);
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

  const handleGoogleClick = () => {
    if (!isGoogleConfigured) {
      setToast({ message: 'Google login is not configured', type: 'warning' });
      return;
    }
    handleGoogleLogin();
  };

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log('🚀 [SIGNIN] Form submitted');
    console.log('📧 Email:', email);
    setError('');
    setLoading(true);

    try {
      const result = await authService.login({ email, password });
      console.log('📬 [SIGNIN] Login result:', result);
      
      if (result.success && result.data) {
        console.log('✅ [SIGNIN] Login successful');
        const userData = {
          email: result.data.email,
          fullName: result.data.fullName,
          role: result.data.role,
          expiresAt: result.data.expiresAt,
        };
        onSuccess(userData);
      } else {
        console.warn('⚠️ [SIGNIN] Login failed:', result.message);
        setError(result.message);
      }
    } catch (err: any) {
      console.error('❌ [SIGNIN] Exception:', err);
      setError(err.message || 'Đã có lỗi xảy ra');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Sign in</h2>

      <div className={styles.socialButtons}>
        <button type="button" className={styles.socialButton} onClick={handleFacebookLogin}>
          f
        </button>
        <button type="button" className={styles.socialButton} onClick={handleGoogleClick}>
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
