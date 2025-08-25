"use client";

import { useState, useEffect } from 'react';
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

  useEffect(() => {
    setDisplayedText(''); // Reset on text change
    setIsTyping(true);
    
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
      
      typingInterval = setInterval(startTyping, 20); // Adjust typing speed here (in ms)

      return () => clearInterval(typingInterval);
    }
  }, [text]);

  return (
    <p className={cn(className, 'text-foreground/70')}>
      {isTyping ? (
        <>
          {displayedText}
          <span className="blinking-cursor">|</span>
        </>
      ) : (
        enableGlowOnFinish ? (
          text.split(' ').map((word, i) => (
            <span key={i}>
              <span className="word-base word-glow">{word}</span>
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
