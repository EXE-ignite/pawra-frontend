'use client';

import React, { useState } from 'react';
import { GoogleLogin, CredentialResponse } from '@react-oauth/google';
import { SignInFormProps } from './SignInForm.types';
import { authService } from '../../../services';
import { Toast } from '../../Toast';
import styles from './SignInForm.module.scss';

export function SignInForm({ onSuccess, onToggleMode }: SignInFormProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [emailError, setEmailError] = useState('');
  const [toast, setToast] = useState<{ message: string; type: 'info' | 'warning' | 'error' } | null>(null);

  const handleFacebookLogin = () => {
    setToast({ message: 'Tính năng đăng nhập Facebook hiện tại chưa có', type: 'info' });
  };

  const handleGoogleSuccess = async (credentialResponse: CredentialResponse) => {
    console.log('🔵 [GOOGLE] Credential received:', credentialResponse);

    if (!credentialResponse.credential) {
      setError('Google login failed. Please try again.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const result = await authService.loginWithGoogle({
        idToken: credentialResponse.credential,
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
        setError(result.message || 'Google login failed');
      }
    } catch (err: any) {
      console.error('❌ [GOOGLE] Exception:', err);
      setError(err.message || 'Google login failed');
    } finally {
      setLoading(false);
    }
  };

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setEmailError('Please enter the right email address');
      return false;
    }
    setEmailError('');
    return true;
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setEmail(value);
    if (value && emailError) {
      validateEmail(value);
    }
  };

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log('🚀 [SIGNIN] Form submitted');
    console.log('📧 Email:', email);
    
    if (!validateEmail(email)) {
      return;
    }
    
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
      <div className={styles.logo}>
        <div className={styles.logoIcon}>
          <svg width="36" height="36" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
            {/* Heart shape */}
            <path d="M18 6C18 6 13 10 13 16C13 18 14 20 16 20C17 20 17.5 19.5 18 19C18.5 19.5 19 20 20 20C22 20 23 18 23 16C23 10 18 6 18 6Z" stroke="#805dc2" strokeWidth="1.8" fill="none"/>
            {/* Cat */}
            <circle cx="14" cy="16" r="2.5" stroke="#805dc2" strokeWidth="1.5" fill="none"/>
            <path d="M12 20C12 20 11 22 12 24" stroke="#805dc2" strokeWidth="1.5" strokeLinecap="round"/>
            <path d="M16 20C16 20 17 22 16 24" stroke="#805dc2" strokeWidth="1.5" strokeLinecap="round"/>
            {/* Dog */}
            <circle cx="22" cy="16" r="2.5" stroke="#805dc2" strokeWidth="1.5" fill="none"/>
            <path d="M20 20C20 20 19 22 20 24" stroke="#805dc2" strokeWidth="1.5" strokeLinecap="round"/>
            <path d="M24 20C24 20 25 22 24 24" stroke="#805dc2" strokeWidth="1.5" strokeLinecap="round"/>
            {/* Paw print */}
            <circle cx="18" cy="28" r="1.5" fill="#805dc2"/>
            <circle cx="15" cy="30" r="1" fill="#805dc2"/>
            <circle cx="21" cy="30" r="1" fill="#805dc2"/>
            <circle cx="18" cy="31.5" r="1" fill="#805dc2"/>
            {/* Bird */}
            <circle cx="30" cy="10" r="2" fill="#805dc2"/>
            <path d="M28 10L26 8" stroke="#805dc2" strokeWidth="1.5" strokeLinecap="round"/>
          </svg>
        </div>
        <span className={styles.logoText}>Pawra</span>
      </div>

      <h2 className={styles.title}>Login by email</h2>

      {error && <div className={styles.error}>{error}</div>}

      <form className={styles.form} onSubmit={handleSignIn}>
        <div className={styles.inputWrapper}>
          <input
            type="email"
            placeholder="Email"
            className={`${styles.input} ${emailError ? styles.inputError : ''}`}
            value={email}
            onChange={handleEmailChange}
            onBlur={() => email && validateEmail(email)}
            required
          />
          {email && !emailError && (
            <div className={styles.checkIcon}>
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <circle cx="8" cy="8" r="8" fill="#10b981"/>
                <path d="M5 8L7 10L11 6" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
          )}
        </div>
        {emailError && <div className={styles.fieldError}>{emailError}</div>}

        <div className={styles.inputWrapper}>
          <input
            type={showPassword ? 'text' : 'password'}
            placeholder="Password"
            className={styles.input}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button
            type="button"
            className={styles.eyeButton}
            onClick={() => setShowPassword(!showPassword)}
          >
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              {showPassword ? (
                <>
                  <path d="M10 4C6 4 3.27 6.11 2 9C3.27 11.89 6 14 10 14C14 14 16.73 11.89 18 9C16.73 6.11 14 4 10 4Z" stroke="#6b7280" strokeWidth="1.5"/>
                  <circle cx="10" cy="9" r="2" stroke="#6b7280" strokeWidth="1.5"/>
                  <path d="M2 2L18 18" stroke="#6b7280" strokeWidth="1.5" strokeLinecap="round"/>
                </>
              ) : (
                <>
                  <path d="M10 4C6 4 3.27 6.11 2 9C3.27 11.89 6 14 10 14C14 14 16.73 11.89 18 9C16.73 6.11 14 4 10 4Z" stroke="#6b7280" strokeWidth="1.5"/>
                  <circle cx="10" cy="9" r="2" stroke="#6b7280" strokeWidth="1.5"/>
                </>
              )}
            </svg>
          </button>
        </div>

        <button 
          type="submit" 
          className={styles.submitButton}
          disabled={loading}
        >
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none" className={styles.pawIcon}>
            <path d="M10 2C10 2 7 4 7 7C7 8 7.5 9 8.5 9C9 9 9.25 8.75 9.5 8.5C9.75 8.75 10 9 10.5 9C11.5 9 12 8 12 7C12 4 10 2 10 2Z" stroke="white" strokeWidth="1.5" fill="none"/>
            <circle cx="8" cy="7" r="0.5" fill="white"/>
            <circle cx="12" cy="7" r="0.5" fill="white"/>
            <path d="M10 15C10 15 9 14 8 14C7 14 6 15 6 16" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
            <path d="M10 15C10 15 11 14 12 14C13 14 14 15 14 16" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
            <circle cx="10" cy="17.5" r="1" fill="white"/>
          </svg>
          {loading ? 'Logging in...' : 'Login'}
        </button>

        <div className={styles.divider}>
          <span>or</span>
        </div>

        <div className={styles.googleButton}>
          <GoogleLogin
            onSuccess={handleGoogleSuccess}
            onError={() => setError('Google login failed. Please try again.')}
            width="100%"
          />
        </div>

        <div className={styles.footerLinks}>
          <span className={styles.footerText}>
            Don't have an account?{' '}
            <button type="button" className={styles.linkButton} onClick={onToggleMode}>
              Sign up
            </button>
          </span>
          <button 
            type="button" 
            className={styles.linkButton}
            onClick={() => window.location.href = '/auth/forgot-password'}
          >
            Forgot password?
          </button>
        </div>
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
