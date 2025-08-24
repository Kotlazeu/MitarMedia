"use client";

import { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';

export function Typewriter({ text, className }: { text: string; className?: string }) {
  const [displayedText, setDisplayedText] = useState('');
  const [isTyping, setIsTyping] = useState(true);

  useEffect(() => {
    setDisplayedText(''); // Reset on text change
    setIsTyping(true);
    
    if (text) {
      const typingInterval = setInterval(() => {
        setDisplayedText((prev) => {
          if (prev.length < text.length) {
            return text.slice(0, prev.length + 1);
          } else {
            clearInterval(typingInterval);
            setIsTyping(false);
            return text;
          }
        });
      }, 20); // Adjust typing speed here (in ms)

      return () => clearInterval(typingInterval);
    }
  }, [text]);

  return (
    <p className={cn(className, 'text-foreground/70')}>
      {displayedText}
      {isTyping && <span className="blinking-cursor">|</span>}
    </p>
  );
}