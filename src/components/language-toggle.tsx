'use client';

import { useLanguage } from '@/context/language-context';
import { motion, AnimatePresence } from 'framer-motion';

export function LanguageToggle() {
  const { language, toggleLanguage } = useLanguage();

  return (
    <button
      onClick={toggleLanguage}
      className="relative w-12 h-12 rounded-full overflow-hidden flex items-center justify-center bg-secondary hover:bg-secondary/80 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-background"
      aria-label="Toggle language"
    >
      <AnimatePresence mode="wait" initial={false}>
        <motion.span
          key={language}
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -20, opacity: 0 }}
          transition={{ duration: 0.3, ease: 'easeInOut' }}
          className="absolute text-sm font-bold text-secondary-foreground"
        >
          {language.toUpperCase()}
        </motion.span>
      </AnimatePresence>
    </button>
  );
}
