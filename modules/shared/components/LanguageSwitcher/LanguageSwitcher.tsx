'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useTranslation } from '../../contexts/LanguageContext';
import type { Locale } from '../../contexts/LanguageContext';
import styles from './LanguageSwitcher.module.scss';

const locales: { code: Locale; flag: string }[] = [
  { code: 'vi', flag: '🇻🇳' },
  { code: 'en', flag: '🇺🇸' },
];

export function LanguageSwitcher() {
  const { locale, setLocale } = useTranslation();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const current = locales.find(l => l.code === locale) || locales[0];

  return (
    <div className={styles.switcher} ref={ref}>
      <button
        className={styles.toggleBtn}
        onClick={() => setOpen(!open)}
        aria-label="Change language"
      >
        <span className={styles.flag}>{current.flag}</span>
        <span className={styles.code}>{locale}</span>
      </button>

      {open && (
        <div className={styles.dropdown}>
          {locales.map(l => (
            <button
              key={l.code}
              className={`${styles.option} ${l.code === locale ? styles.active : ''}`}
              onClick={() => { setLocale(l.code); setOpen(false); }}
            >
              <span className={styles.flag}>{l.flag}</span>
              {l.code === 'vi' ? 'Tiếng Việt' : 'English'}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
