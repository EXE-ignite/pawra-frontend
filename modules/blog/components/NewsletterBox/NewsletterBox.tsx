'use client';

import React, { useState } from 'react';
import styles from './NewsletterBox.module.scss';

export function NewsletterBox() {
  const [email, setEmail] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implement newsletter subscription
    console.log('Subscribing email:', email);
    setEmail('');
  };

  return (
    <div className={styles.newsletter}>
      <div className={styles.iconWrapper}>
        <span className={styles.icon}>📧</span>
      </div>
      <h3 className={styles.title}>Join our pack!</h3>
      <p className={styles.description}>
        Get the latest pet health tips delivered to your inbox every week.
      </p>
      <form onSubmit={handleSubmit} className={styles.form}>
        <input 
          type="email"
          placeholder="Your email address"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className={styles.input}
        />
        <button type="submit" className={styles.button}>
          Subscribe Now
        </button>
      </form>
    </div>
  );
}
