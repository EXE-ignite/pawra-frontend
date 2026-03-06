'use client';

import React, { useState } from 'react';
import { useTranslation } from '@/modules/shared/contexts';
import styles from './NewsletterBox.module.scss';

export function NewsletterBox() {
  const { t } = useTranslation();
  const [email, setEmail] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Subscribing email:', email);
    setEmail('');
  };

  return (
    <div className={styles.newsletter}>
      <div className={styles.iconWrapper}>
        <span className={styles.icon}>📧</span>
      </div>
      <h3 className={styles.title}>{t('blog.joinNewsletter')}</h3>
      <p className={styles.description}>
        {t('blog.newsletterDesc')}
      </p>
      <form onSubmit={handleSubmit} className={styles.form}>
        <input 
          type="email"
          placeholder={t('blog.emailPlaceholder')}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className={styles.input}
        />
        <button type="submit" className={styles.button}>
          {t('blog.subscribeNow')}
        </button>
      </form>
    </div>
  );
}
