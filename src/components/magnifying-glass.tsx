"use client";

import React, { useState, useRef, useEffect } from 'react';
import { cn } from '@/lib/utils';
import Link from 'next/link';

export function MagnifyingGlass({ children, mapLink }: { children: React.ReactNode; mapLink: string }) {
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

  const magnifierSize = 100;
  const zoomFactor = 1.5;

  return (
    <div
      ref={containerRef}
      className="magnify-container group relative rounded-2xl overflow-hidden mb-6 aspect-square"
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* Background GIF */}
      {children}
      
      {/* Static button for mobile */}
      {!isDesktop && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/20 group-hover:bg-black/40 transition-colors duration-300 p-4">
          <Link href={mapLink} target="_blank" rel="noopener noreferrer" className="w-full max-w-[200px]">
            <div className="glassmorphism-button flex items-center justify-center h-[50px] rounded-full transition-all duration-300 group-hover:scale-105">
              <span className="text-sm font-semibold text-white/90">
                Fă-ne o vizită
              </span>
            </div>
          </Link>
        </div>
      )}

      {/* Mouse-following button for desktop */}
      {isDesktop && (
        <Link 
            href={mapLink} 
            target="_blank" 
            rel="noopener noreferrer"
            className="magnifier glassmorphism-button"
            style={{
                left: `${position.x}px`,
                top: `${position.y}px`,
                width: `150px`,
                height: `50px`,
                borderRadius: `9999px`,
                opacity: isHovering ? 1 : 0,
                transform: 'translate(-50%, -50%)',
            }}
        >
             <div
                className="flex items-center justify-center h-full w-full"
            >
                <span className="text-sm font-semibold text-white/90">
                    Fă-ne o vizită
                </span>
            </div>
        </Link>
      )}
    </div>
  );
}
