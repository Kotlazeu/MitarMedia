
"use client";

import React, { useRef, useEffect } from 'react';
import { gsap } from 'gsap';
import { cn } from '@/lib/utils';

interface FluidGlassProps {
  children: React.ReactNode;
  className?: string;
}

export function FluidGlass({ children, className }: FluidGlassProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const blobRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    const blob = blobRef.current;
    if (!container || !blob) return;

    const handleMouseMove = (e: MouseEvent) => {
      const { clientX, clientY } = e;
      const { top, left } = container.getBoundingClientRect();
      const x = clientX - left;
      const y = clientY - top;

      gsap.to(blob, {
        x: x,
        y: y,
        duration: 0.4,
        ease: 'power2.out',
      });
    };

    const handleMouseEnter = () => {
      gsap.to(blob, { scale: 1, duration: 0.3 });
    };

    const handleMouseLeave = () => {
      gsap.to(blob, { scale: 0, duration: 0.3 });
    };
    
    container.addEventListener('mousemove', handleMouseMove);
    container.addEventListener('mouseenter', handleMouseEnter);
    container.addEventListener('mouseleave', handleMouseLeave);
    
    // Initial state
    gsap.set(blob, { scale: 0, xPercent: -50, yPercent: -50 });

    return () => {
      container.removeEventListener('mousemove', handleMouseMove);
      container.removeEventListener('mouseenter', handleMouseEnter);
      container.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, []);

  return (
    <div ref={containerRef} className={cn("fluid-glass-container", className)}>
      <div className="relative">
        <div ref={blobRef} className="blob-container" />
        <div className="relative z-20">
            {children}
        </div>
      </div>
    </div>
  );
}

    