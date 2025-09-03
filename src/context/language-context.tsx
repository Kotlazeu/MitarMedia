
"use client";

import React, { createContext, useState, useContext, ReactNode, useMemo, useEffect } from 'react';
import { translations } from '@/lib/translations';

type Language = 'ro' | 'en';

interface LanguageContextType {
  language: Language;
  toggleLanguage: () => void;
  translations: any;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  const [language, setLanguage] = useState<Language>('ro');

  useEffect(() => {
    // Set lang attribute on client-side for accessibility and SEO hints
    document.documentElement.lang = language;
  }, [language]);

  const toggleLanguage = () => {
    setLanguage((prevLanguage) => (prevLanguage === 'ro' ? 'en' : 'ro'));
  };

  const currentTranslations = useMemo(() => translations[language], [language]);

  const value = useMemo(() => ({
    language,
    toggleLanguage,
    translations: currentTranslations,
  }), [language, toggleLanguage, currentTranslations]);

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
