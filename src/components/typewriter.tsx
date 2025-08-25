"use client";

import { useState, useEffect, useMemo } from 'react';
import { cn } from '@/lib/utils';

export function Typewriter({ 
  text, 
  className,
  enableGlowOnFinish = false
}: { 
  text: string; 
  className?: string;
  enableGlowOnFinish?: boolean;
}) {
  const [displayedText, setDisplayedText] = useState('');
  const [isTyping, setIsTyping] = useState(true);
  const [glowingWordIndex, setGlowingWordIndex] = useState<number | null>(null);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkIsMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkIsMobile();
    window.addEventListener('resize', checkIsMobile);
    return () => window.removeEventListener('resize', checkIsMobile);
  }, []);

  useEffect(() => {
    setDisplayedText('');
    setIsTyping(true);
    setGlowingWordIndex(null);
    
    if (text) {
      let typingInterval: NodeJS.Timeout;
      const startTyping = () => {
        setDisplayedText((prev) => {
          if (prev.length < text.length) {
            return text.slice(0, prev.length + 1);
          } else {
            clearInterval(typingInterval);
            setIsTyping(false);
            return text;
          }
        });
      };
      
      typingInterval = setInterval(startTyping, 20);

      return () => clearInterval(typingInterval);
    }
  }, [text]);

  const words = useMemo(() => text.split(' '), [text]);

  useEffect(() => {
    if (!isTyping && enableGlowOnFinish && isMobile) {
      const glowInterval = setInterval(() => {
        const randomIndex = Math.floor(Math.random() * words.length);
        setGlowingWordIndex(randomIndex);
        
        setTimeout(() => {
            setGlowingWordIndex(null);
        }, 1500); // Glow duration

      }, 3000); // Interval between glows

      return () => clearInterval(glowInterval);
    }
  }, [isTyping, enableGlowOnFinish, isMobile, words.length]);


  return (
    <p className={cn(className)}>
      {isTyping ? (
        <>
          {displayedText}
          <span className="blinking-cursor">|</span>
        </>
      ) : (
        enableGlowOnFinish ? (
          words.map((word, i) => (
            <span key={i}>
              <span className={cn(
                "word-base",
                isMobile ? 
                  (i === glowingWordIndex && 'word-glow-mobile') :
                  'word-glow'
              )}>
                {word}
              </span>
              {' '}
            </span>
          ))
        ) : (
          text
        )
      )}
    </p>
  );
}
