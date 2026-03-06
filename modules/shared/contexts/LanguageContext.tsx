'use client';

import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { vi, en } from '../i18n';

export type Locale = 'vi' | 'en';

type TranslationValue = string | Record<string, unknown>;
type Translations = Record<string, TranslationValue>;

interface LanguageContextType {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: (key: string, params?: Record<string, string | number>) => string;
}

const translations: Record<Locale, Translations> = { vi, en } as Record<Locale, Translations>;

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

function getNestedValue(obj: Record<string, unknown>, path: string): string | undefined {
  const keys = path.split('.');
  let current: unknown = obj;
  for (const key of keys) {
    if (current == null || typeof current !== 'object') return undefined;
    current = (current as Record<string, unknown>)[key];
  }
  return typeof current === 'string' ? current : undefined;
}

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>('vi');

  useEffect(() => {
    const saved = localStorage.getItem('locale') as Locale | null;
    if (saved === 'vi' || saved === 'en') {
      setLocaleState(saved);
      document.documentElement.lang = saved;
    }
  }, []);

  const setLocale = useCallback((newLocale: Locale) => {
    setLocaleState(newLocale);
    localStorage.setItem('locale', newLocale);
    document.documentElement.lang = newLocale;
  }, []);

  const t = useCallback(
    (key: string, params?: Record<string, string | number>): string => {
      let value = getNestedValue(translations[locale] as Record<string, unknown>, key);
      if (value === undefined) {
        value = getNestedValue(translations['en'] as Record<string, unknown>, key);
      }
      if (value === undefined) return key;

      if (params) {
        return Object.entries(params).reduce<string>(
          (str, [k, v]) => str.replace(new RegExp(`\\{${k}\\}`, 'g'), String(v)),
          value,
        );
      }
      return value;
    },
    [locale],
  );

  return (
    <LanguageContext.Provider value={{ locale, setLocale, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useTranslation() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useTranslation must be used within a LanguageProvider');
  }
  return context;
}
