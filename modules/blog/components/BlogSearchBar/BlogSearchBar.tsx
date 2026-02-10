'use client';

import { useState } from 'react';
import { BlogSearchBarProps } from './BlogSearchBar.types';
import styles from './BlogSearchBar.module.scss';

export function BlogSearchBar({ value, onSearch, onFilterClick, onCreateClick }: BlogSearchBarProps) {
  const [searchValue, setSearchValue] = useState(value);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setSearchValue(newValue);
    onSearch(newValue);
  };

  return (
    <div className={styles.searchBar}>
      <div className={styles.searchWrapper}>
        <svg className={styles.searchIcon} width="20" height="20" viewBox="0 0 24 24" fill="none">
          <path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z" fill="currentColor"/>
        </svg>
        <input
          type="text"
          className={styles.searchInput}
          placeholder="Search blog posts..."
          value={searchValue}
          onChange={handleChange}
        />
      </div>
      <div className={styles.actions}>
        <button className={styles.filterButton} onClick={onFilterClick}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
            <path d="M10 18h4v-2h-4v2zM3 6v2h18V6H3zm3 7h12v-2H6v2z" fill="currentColor"/>
          </svg>
          Filter
        </button>
        <button className={styles.createButton} onClick={onCreateClick}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
            <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z" fill="currentColor"/>
          </svg>
          Create New Post
        </button>
      </div>
    </div>
  );
}
