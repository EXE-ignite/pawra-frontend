'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ForgotPasswordFormProps } from './ForgotPasswordForm.types';
import { authService } from '../../../services';
import { Toast } from '../../Toast';
import styles from './ForgotPasswordForm.module.scss';

export function ForgotPasswordForm({ onBack }: ForgotPasswordFormProps) {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [emailError, setEmailError] = useState('');
  const router = useRouter();

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateEmail(email)) {
      return;
    }
    
    setError('');
    setLoading(true);

    try {
      // TODO: Implement forgot password API call
      // const result = await authService.forgotPassword({ email });
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      setSuccess(true);
      setTimeout(() => {
        router.push('/auth?mode=signin');
      }, 2000);
    } catch (err: any) {
      console.error('❌ [FORGOT PASSWORD] Exception:', err);
      setError(err.message || 'Đã có lỗi xảy ra');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className={styles.container}>
        <div className={styles.logo}>
          <div className={styles.logoIcon}>
            <svg width="36" height="36" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M18 6C18 6 13 10 13 16C13 18 14 20 16 20C17 20 17.5 19.5 18 19C18.5 19.5 19 20 20 20C22 20 23 18 23 16C23 10 18 6 18 6Z" stroke="#805dc2" strokeWidth="1.8" fill="none"/>
              <circle cx="14" cy="16" r="2.5" stroke="#805dc2" strokeWidth="1.5" fill="none"/>
              <path d="M12 20C12 20 11 22 12 24" stroke="#805dc2" strokeWidth="1.5" strokeLinecap="round"/>
              <path d="M16 20C16 20 17 22 16 24" stroke="#805dc2" strokeWidth="1.5" strokeLinecap="round"/>
              <circle cx="22" cy="16" r="2.5" stroke="#805dc2" strokeWidth="1.5" fill="none"/>
              <path d="M20 20C20 20 19 22 20 24" stroke="#805dc2" strokeWidth="1.5" strokeLinecap="round"/>
              <path d="M24 20C24 20 25 22 24 24" stroke="#805dc2" strokeWidth="1.5" strokeLinecap="round"/>
              <circle cx="18" cy="28" r="1.5" fill="#805dc2"/>
              <circle cx="15" cy="30" r="1" fill="#805dc2"/>
              <circle cx="21" cy="30" r="1" fill="#805dc2"/>
              <circle cx="18" cy="31.5" r="1" fill="#805dc2"/>
              <circle cx="30" cy="10" r="2" fill="#805dc2"/>
              <path d="M28 10L26 8" stroke="#805dc2" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
          </div>
          <span className={styles.logoText}>Pawra</span>
        </div>

        <div className={styles.successMessage}>
          <div className={styles.successIcon}>
            <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
              <circle cx="24" cy="24" r="24" fill="#10b981"/>
              <path d="M16 24L22 30L32 18" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <h2 className={styles.successTitle}>Email sent!</h2>
          <p className={styles.successText}>
            We've sent a password reset link to {email}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.logo}>
        <div className={styles.logoIcon}>
          <svg width="36" height="36" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M18 6C18 6 13 10 13 16C13 18 14 20 16 20C17 20 17.5 19.5 18 19C18.5 19.5 19 20 20 20C22 20 23 18 23 16C23 10 18 6 18 6Z" stroke="#805dc2" strokeWidth="1.8" fill="none"/>
            <circle cx="14" cy="16" r="2.5" stroke="#805dc2" strokeWidth="1.5" fill="none"/>
            <path d="M12 20C12 20 11 22 12 24" stroke="#805dc2" strokeWidth="1.5" strokeLinecap="round"/>
            <path d="M16 20C16 20 17 22 16 24" stroke="#805dc2" strokeWidth="1.5" strokeLinecap="round"/>
            <circle cx="22" cy="16" r="2.5" stroke="#805dc2" strokeWidth="1.5" fill="none"/>
            <path d="M20 20C20 20 19 22 20 24" stroke="#805dc2" strokeWidth="1.5" strokeLinecap="round"/>
            <path d="M24 20C24 20 25 22 24 24" stroke="#805dc2" strokeWidth="1.5" strokeLinecap="round"/>
            <circle cx="18" cy="28" r="1.5" fill="#805dc2"/>
            <circle cx="15" cy="30" r="1" fill="#805dc2"/>
            <circle cx="21" cy="30" r="1" fill="#805dc2"/>
            <circle cx="18" cy="31.5" r="1" fill="#805dc2"/>
            <circle cx="30" cy="10" r="2" fill="#805dc2"/>
            <path d="M28 10L26 8" stroke="#805dc2" strokeWidth="1.5" strokeLinecap="round"/>
          </svg>
        </div>
        <span className={styles.logoText}>Pawra</span>
      </div>

      <h2 className={styles.title}>Forgot Password</h2>
      <p className={styles.subtitle}>Enter your registered email</p>

      {error && <div className={styles.error}>{error}</div>}

      <form className={styles.form} onSubmit={handleSubmit}>
        <div className={styles.inputWrapper}>
          <input
            type="email"
            placeholder="Mymail@example.com"
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

        <button 
          type="submit" 
          className={styles.submitButton}
          disabled={loading}
        >
          {loading ? 'Sending...' : 'Submit'}
        </button>

        <button 
          type="button" 
          className={styles.backButton}
          onClick={onBack}
        >
          Back to login
        </button>
      </form>
    </div>
  );
}
