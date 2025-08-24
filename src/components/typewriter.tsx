"use client";

import { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';

export function Typewriter({ text, className }: { text: string; className?: string }) {
  const [glowingIndex, setGlowingIndex] = useState(-1);
  const [isMobile, setIsMobile] = useState(false);
  const [isClient, setIsClient] = useState(false);

  // Effect to set client-side flag and check for mobile
  useEffect(() => {
    setIsClient(true);
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const words = text.split(' ');

  // Effect for the random glow on mobile
  useEffect(() => {
    if (isClient && isMobile) {
      const glowInterval = setInterval(() => {
        setGlowingIndex(prevIndex => {
            let nextIndex;
            do {
                nextIndex = Math.floor(Math.random() * words.length);
            } while (words.length > 1 && nextIndex === prevIndex);
            return nextIndex;
        });
      }, 1500); // Change glowing word every 1.5 seconds

      return () => clearInterval(glowInterval);
    } else {
        // Reset glow index if not mobile
        setGlowingIndex(-1);
    }
  }, [isClient, isMobile, words.length]);


  if (!isClient) {
    // Render nothing or a placeholder on the server to avoid hydration mismatch
    return <p className={cn(className, "h-[10em] md:h-auto")}>{text} <span className="blinking-cursor">|</span></p>;
  }
  
  return (
    <p className={cn(className)}>
      {words.map((word, index) => (
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
      <span className="blinking-cursor">|</span>
    </p>
  );
}
