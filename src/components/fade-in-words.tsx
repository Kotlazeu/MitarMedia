"use client";

import { useEffect, useState, useMemo } from 'react';
import { cn } from '@/lib/utils';

export function FadeInWords({
  text,
  className,
  stagger = 50,
  glowOnHover = false,
}: {
  text: string;
  className?: string;
  stagger?: number;
  glowOnHover?: boolean;
}) {
  const words = useMemo(() => text.split(' '), [text]);
  const [isMobile, setIsMobile] = useState(false);
  const [glowingWordIndex, setGlowingWordIndex] = useState<number | null>(null);

  useEffect(() => {
    const checkIsMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkIsMobile();
    window.addEventListener('resize', checkIsMobile);
    return () => window.removeEventListener('resize', checkIsMobile);
  }, []);

  useEffect(() => {
    if (glowOnHover && isMobile) {
      const glowInterval = setInterval(() => {
        const randomIndex = Math.floor(Math.random() * words.length);
        setGlowingWordIndex(randomIndex);
        
        setTimeout(() => {
            setGlowingWordIndex(null);
        }, 1500); // Glow duration

      }, 3000); // Interval between glows

      return () => clearInterval(glowInterval);
    }
  }, [glowOnHover, isMobile, words.length]);

  return (
    <p className={cn("text-lg text-center lg:text-left text-foreground/70", className)}>
      {words.map((word, i) => (
        <span
          key={i}
          className={cn(
            'opacity-0',
            'animate-fade-in-up',
            glowOnHover && 'word-base',
            glowOnHover && (isMobile ? (i === glowingWordIndex && 'word-glow-mobile') : 'word-glow')
          )}
          style={{ animationDelay: `${i * stagger}ms`, animationFillMode: 'forwards' }}
        >
          {word}{' '}
        </span>
      ))}
    </p>
  );
}
