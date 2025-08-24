"use client";

import { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';

export function Typewriter({ text, className }: { text: string; className?: string }) {
  const [displayedText, setDisplayedText] = useState('');
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    let i = 0;
    const typingInterval = setInterval(() => {
      if (i < text.length) {
        setDisplayedText((prev) => prev + text.charAt(i));
        i++;
      } else {
        clearInterval(typingInterval);
      }
    }, 25);

    return () => clearInterval(typingInterval);
  }, [text]);

  const isMobile = isClient ? window.innerWidth < 768 : false;
  const words = displayedText.split(' ');
  const glowIndices = [2, 5, 8, 12, 17, 22]; // Pre-determined words to glow on mobile

  return (
    <p className={cn(className)}>
      {words.map((word, index) => (
        <span
          key={index}
          className={cn({
            'word-glow': !isMobile,
            'word-glow-mobile': isMobile && glowIndices.includes(index),
          })}
        >
          {word}{' '}
        </span>
      ))}
      <span className="blinking-cursor">|</span>
    </p>
  );
}
