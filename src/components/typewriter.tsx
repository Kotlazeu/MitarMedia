"use client";

import { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';

export function Typewriter({ text, className }: { text: string; className?: string }) {
  const [displayedText, setDisplayedText] = useState('');
  const [isClient, setIsClient] = useState(false);
  const [glowingIndex, setGlowingIndex] = useState(-1);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    setIsClient(true);
    setIsMobile(window.innerWidth < 768);
  }, []);

  const words = text.split(' ');

  useEffect(() => {
    let i = 0;
    setDisplayedText(''); // Reset text when `text` prop changes
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

  useEffect(() => {
    if (isMobile && displayedText.length === text.length) {
      const glowInterval = setInterval(() => {
        const randomIndex = Math.floor(Math.random() * words.length);
        setGlowingIndex(randomIndex);
      }, 1500); // Change glowing word every 1.5 seconds

      return () => clearInterval(glowInterval);
    }
  }, [isMobile, displayedText, text.length, words]);


  const displayedWords = displayedText.split(' ');

  return (
    <p className={cn(className)}>
      {displayedWords.map((word, index) => (
        <span
          key={index}
          className={cn({
            'word-glow': !isMobile,
            'word-glow-mobile': isMobile && index === glowingIndex,
          })}
        >
          {word}{' '}
        </span>
      ))}
      {displayedText.length === text.length && <span className="blinking-cursor">|</span>}
    </p>
  );
}
