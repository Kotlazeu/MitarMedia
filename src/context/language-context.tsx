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
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const toggleLanguage = () => {
    setLanguage((prevLanguage) => (prevLanguage === 'ro' ? 'en' : 'ro'));
  };

  const currentTranslations = useMemo(() => translations[language], [language]);

  const value = useMemo(() => ({
    language,
    toggleLanguage,
    translations: currentTranslations,
  }), [language, toggleLanguage, currentTranslations]);

  if (!isMounted) {
    // Render with default language on the server and initial client render
    return (
        <LanguageContext.Provider value={{ language: 'ro', toggleLanguage: () => {}, translations: translations.ro }}>
            {children}
        </LanguageContext.Provider>
    );
  }

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
