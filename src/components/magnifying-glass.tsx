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

  const magnifierSize = 100;
  const zoomFactor = 1.5;

  return (
    <div
      ref={containerRef}
      className="magnify-container relative text-foreground/70 text-lg text-center lg:text-left"
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
        <svg style={{ position: 'absolute', width: 0, height: 0 }}>
            <defs>
                <filter id="warp">
                    <feImage xlinkHref="data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D'http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg'%20viewBox%3D'0%200%20100%20100'%3E%3CradialGradient%20id%3D'g'%20cx%3D'50'%20cy%3D'50'%20r%3D'50'%3E%3Cstop%20offset%3D'70%25'%20stop-color%3D'white'%2F%3E%3Cstop%20offset%3D'100%25'%20stop-color%3D'black'%2F%3E%3C%2FradialGradient%3E%3Crect%20width%3D'100'%20height%3D'100'%20fill%3D'url(%23g)'%2F%3E%3C%2Fsvg%3E" x="0" y="0" width="100%" height="100%" result="gradient"/>
                    <feDisplacementMap in="SourceGraphic" in2="gradient" scale="20" xChannelSelector="R" yChannelSelector="G"/>
                </filter>
            </defs>
        </svg>

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
            filter: 'url(#warp)',
          }}
        >
          <div
            className="magnifier-content"
            style={{
                left: `${-position.x * zoomFactor + magnifierSize / 2}px`,
                top: `${-position.y * zoomFactor + magnifierSize / 2}px`,
                width: containerRef.current?.clientWidth,
                height: containerRef.current?.clientHeight,
            }}
          >
            {children}
          </div>
        </div>
      )}
    </div>
  );
}
