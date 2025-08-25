"use client";

import React, { useState, useRef, useEffect } from 'react';
import { cn } from '@/lib/utils';

export function MagnifyingGlass({ children }: { children: React.ReactNode }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [mousePosition, setMousePosition] = useState({ x: -9999, y: -9999 });
  const [isHovering, setIsHovering] = useState(false);
  const [isDesktop, setIsDesktop] = useState(false);

  useEffect(() => {
    const checkIsDesktop = () => {
      setIsDesktop(window.innerWidth >= 768);
    };
    checkIsDesktop();
    window.addEventListener('resize', checkIsDesktop);
    return () => window.removeEventListener('resize', checkIsDesktop);
  }, []);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current || !isDesktop) return;
    const rect = containerRef.current.getBoundingClientRect();
    setMousePosition({ 
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  };

  const handleMouseEnter = () => {
    if (!isDesktop) return;
    setIsHovering(true);
  };

  const handleMouseLeave = () => {
    if (!isDesktop) return;
    setIsHovering(false);
    setMousePosition({ x: -9999, y: -9999 });
  };
  
  const glassSize = 150;

  return (
    <div
      ref={containerRef}
      className="magnify-container text-foreground/70 text-lg h-40 text-center lg:text-left"
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* Original Content */}
      <div className="pointer-events-none">
        {children}
      </div>

      {/* Magnifying Glass Effect */}
      {isDesktop && (
        <div
          className="magnify-glass"
          style={{
            '--mouse-x': `${mousePosition.x}px`,
            '--mouse-y': `${mousePosition.y}px`,
            '--glass-size': `${glassSize}px`,
            opacity: isHovering ? 1 : 0,
          } as React.CSSProperties}
        >
          <div
            className="magnify-glass-content"
            style={{
              transform: `translate(calc(${glassSize / 2}px - ${mousePosition.x}px), calc(${glassSize / 2}px - ${mousePosition.y}px))`,
            }}
          >
            {/* Cloned, Scaled-up Content */}
            {children}
          </div>
        </div>
      )}
    </div>
  );
}
