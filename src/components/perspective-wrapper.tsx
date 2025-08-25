
"use client";

import React, { useRef, useState } from 'react';
import { cn } from '@/lib/utils';

interface PerspectiveWrapperProps {
  children: React.ReactNode;
  className?: string;
}

export const PerspectiveWrapper = ({ children, className }: PerspectiveWrapperProps) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [rotate, setRotate] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    const x = (mouseY / height - 0.5) * -15; // Intensity
    const y = (mouseX / width - 0.5) * 15;  // Intensity
    setRotate({ x, y });
  };

  const handleMouseLeave = () => {
    setRotate({ x: 0, y: 0 });
  };

  return (
    <div
      className={cn("w-full h-full", className)}
      style={{ perspective: '1000px' }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      <div
        ref={cardRef}
        style={{
          transform: `rotateX(${rotate.x}deg) rotateY(${rotate.y}deg)`,
          transition: 'transform 0.2s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
        }}
        className="w-full h-full"
      >
        {children}
      </div>
    </div>
  );
};
