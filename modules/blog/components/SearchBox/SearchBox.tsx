'use client';

import React, { useState } from 'react';
import { useTranslation } from '@/modules/shared/contexts';
import styles from './SearchBox.module.scss';

export function SearchBox() {
  const { t } = useTranslation();
  const [query, setQuery] = useState('');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Searching for:', query);
  };

  return (
    <div className={styles.searchBox}>
      <h3 className={styles.title}>{t('blog.findAdvice')}</h3>
      <form onSubmit={handleSearch} className={styles.form}>
        <div className={styles.inputWrapper}>
          <span className={styles.icon}>🔍</span>
          <input 
            type="text"
            placeholder={t('blog.searchPlaceholder')}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className={styles.input}
          />
        </div>
      </form>
    </div>
  );
}
