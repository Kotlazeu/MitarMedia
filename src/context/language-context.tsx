
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
    // You could also load the saved language from localStorage here
  }, []);
  
  // Set the lang attribute on the html element only on the client
  useEffect(() => {
    if (isMounted) {
      document.documentElement.lang = language;
    }
  }, [language, isMounted]);

  const toggleLanguage = () => {
    setLanguage((prevLanguage) => (prevLanguage === 'ro' ? 'en' : 'ro'));
  };

  const currentTranslations = useMemo(() => translations[language], [language]);

  const value = useMemo(() => ({
    language,
    toggleLanguage,
    translations: isMounted ? currentTranslations : translations.ro, // Always serve Romanian on the server
  }), [language, toggleLanguage, currentTranslations, isMounted]);

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
