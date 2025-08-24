"use client";

import { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';

export function Typewriter({ text, className }: { text: string; className?: string }) {
  const [displayedText, setDisplayedText] = useState('');
  const [glowingIndex, setGlowingIndex] = useState(-1);
  const [isMobile, setIsMobile] = useState(false);

  // Effect to check for mobile on client-side
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Effect for the typing animation
  useEffect(() => {
    setDisplayedText(''); // Reset on text change
    if (text) {
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
    }
  }, [text]);

  const words = text.split(' ');

  // Effect for the random glow on mobile, runs only when typing is complete
  useEffect(() => {
    if (isMobile && displayedText.length === text.length) {
      const glowInterval = setInterval(() => {
        // Set to a new random index, ensuring it's different from the previous one if possible
        setGlowingIndex(prevIndex => {
            let nextIndex;
            do {
                nextIndex = Math.floor(Math.random() * words.length);
            } while (words.length > 1 && nextIndex === prevIndex);
            return nextIndex;
        });
      }, 1500); // Change glowing word every 1.5 seconds

      return () => clearInterval(glowInterval);
    }
  }, [isMobile, displayedText, text, words.length]);


  const displayedWords = displayedText.split(' ');

  return (
    <p className={cn(className)}>
      {words.map((word, index) => (
        <span
          key={index}
          className={cn({
            'word-glow': !isMobile,
            'word-glow-mobile': isMobile && index === glowingIndex,
            // Hide words that haven't been "typed" yet
            'opacity-0': index >= displayedWords.length
          })}
        >
          {word}{' '}
        </span>
      ))}
      {displayedText.length === text.length && <span className="blinking-cursor">|</span>}
    </p>
  );
}
