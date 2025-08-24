"use client";

import { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';

export function Typewriter({ text, className }: { text: string; className?: string }) {
  const [displayedText, setDisplayedText] = useState('');
  
  useEffect(() => {
    let i = 0;
    const typingInterval = setInterval(() => {
      if (i < text.length) {
        setDisplayedText((prev) => prev + text.charAt(i));
        i++;
      } else {
        clearInterval(typingInterval);
      }
    }, 50);

    return () => clearInterval(typingInterval);
  }, [text]);

  return (
    <p className={cn(className)}>
      {displayedText}
      <span className="blinking-cursor">|</span>
    </p>
  );
}
