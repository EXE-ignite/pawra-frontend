import React from 'react';
import { WelcomePanelProps } from './WelcomePanel.types';
import styles from './WelcomePanel.module.scss';

export function WelcomePanel({ mode, onToggle }: WelcomePanelProps) {
  return (
    <div className={styles.container}>
      {mode === 'signin' ? (
        <>
          <h2 className={styles.title}>Hello, Friend!</h2>
          <p className={styles.text}>
            Enter your personal details and start journey with us
          </p>
          <button className={styles.button} onClick={onToggle}>
            Sign Up
          </button>
        </>
      ) : (
        <>
          <h2 className={styles.title}>Welcome Back!</h2>
          <p className={styles.text}>
            To keep connected with us please login with your personal info
          </p>
          <button className={styles.button} onClick={onToggle}>
            Sign In
          </button>
        </>
      )}
    </div>
  );
}
