'use client';

import React, { useState } from 'react';
import styles from './SearchBox.module.scss';

export function SearchBox() {
  const [query, setQuery] = useState('');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implement search
    console.log('Searching for:', query);
  };

  return (
    <div className={styles.searchBox}>
      <h3 className={styles.title}>Find Advice</h3>
      <form onSubmit={handleSearch} className={styles.form}>
        <div className={styles.inputWrapper}>
          <span className={styles.icon}>🔍</span>
          <input 
            type="text"
            placeholder="Search pet advice..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className={styles.input}
          />
        </div>
      </form>
    </div>
  );
}
