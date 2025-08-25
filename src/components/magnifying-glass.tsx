"use client";

import React, { useState, useRef, useEffect } from 'react';
import { cn } from '@/lib/utils';

export function MagnifyingGlass({ children }: { children: React.ReactNode }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);
  const [isDesktop, setIsDesktop] = useState(false);

  useEffect(() => {
    const checkIsDesktop = () => {
      setIsDesktop(window.innerWidth >= 1024);
    };
    checkIsDesktop();
    window.addEventListener('resize', checkIsDesktop);
    return () => window.removeEventListener('resize', checkIsDesktop);
  }, []);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (containerRef.current && isDesktop) {
      const rect = containerRef.current.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      setPosition({ x, y });
    }
  };

  const handleMouseEnter = () => {
    if (isDesktop) setIsHovering(true);
  };

  const handleMouseLeave = () => {
    if (isDesktop) setIsHovering(false);
  };

  const magnifierSize = 150;
  const zoomFactor = 1.5;

  return (
    <div
      ref={containerRef}
      className="magnify-container relative text-foreground/70 text-lg text-center lg:text-left"
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* Original, non-interactive content */}
      {children}
      
      {/* Magnifier visual effect */}
      {isDesktop && (
        <div
          className="magnifier"
          style={{
            left: `${position.x}px`,
            top: `${position.y}px`,
            width: `${magnifierSize}px`,
            height: `${magnifierSize}px`,
            opacity: isHovering ? 1 : 0,
          }}
        >
          <span
            className="magnifier-content"
            style={{
                left: `${-position.x * zoomFactor + magnifierSize / 2}px`,
                top: `${-position.y * zoomFactor + magnifierSize / 2}px`,
            }}
          >
            {children}
          </span>
        </div>
      )}
    </div>
  );
}