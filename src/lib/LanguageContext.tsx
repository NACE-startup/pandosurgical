'use client';

import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import { translate, getStoredLanguage, storeLanguage, type Language } from './i18n';

interface LanguageContextValue {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextValue | null>(null);

export function LanguageProvider({ children }: { children: ReactNode }) {
  // Defaults to 'en' on first render so server and client always agree (avoids a hydration mismatch),
  // then syncs the real stored value after mount.
  const [language, setLanguageState] = useState<Language>('en');

  useEffect(() => {
    setLanguageState(getStoredLanguage());
  }, []);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    storeLanguage(lang);
  };

  const t = (key: string) => translate(language, key);

  return <LanguageContext.Provider value={{ language, setLanguage, t }}>{children}</LanguageContext.Provider>;
}

export function useLanguage(): LanguageContextValue {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error('useLanguage must be used within a LanguageProvider');
  return ctx;
}
