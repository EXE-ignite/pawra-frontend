'use client';

import React, { useState } from 'react';
import { useGoogleLogin } from '@react-oauth/google';
import { SignUpFormProps } from './SignUpForm.types';
import { authService } from '../../../services';
import { Toast } from '../../Toast';
import styles from './SignUpForm.module.scss';

export function SignUpForm({ onSuccess }: SignUpFormProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: 'info' | 'warning' | 'error' } | null>(null);

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

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log('🚀 [SIGNUP] Form submitted');
    console.log('📧 Email:', email);
    console.log('👤 FullName:', fullName);
    setError('');
    setLoading(true);

    try {
      const result = await authService.register({ email, password, fullName });
      console.log('📬 [SIGNUP] Register result:', result);
      
      if (result.success && result.data) {
        console.log('✅ [SIGNUP] Registration successful');
        const userData = {
          email: result.data.email,
          fullName: result.data.fullName,
          role: result.data.role,
          expiresAt: result.data.expiresAt,
        };
        onSuccess(userData);
      } else {
        console.warn('⚠️ [SIGNUP] Registration failed:', result.message);
        setError(result.message);
      }
    } catch (err: any) {
      console.error('❌ [SIGNUP] Exception:', err);
      setError(err.message || 'Đã có lỗi xảy ra');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
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
