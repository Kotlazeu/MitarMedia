"use client";

import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import Link from 'next/link';

interface Layer {
  src: string;
  speed: number;
}

interface ParallaxImageProps {
  imageLayers: Layer[];
  mapLink: string;
}

export const ParallaxImage = ({ imageLayers, mapLink }: ParallaxImageProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start end', 'end start'],
  });

  return (
    <Link href={mapLink} target="_blank" rel="noopener noreferrer" className="block w-full h-full">
      <div
        ref={containerRef}
        className="relative w-full h-full overflow-hidden"
        style={{ perspective: '1000px' }}
      >
        {imageLayers.map((layer, index) => {
          const y = useTransform(scrollYProgress, [0, 1], ['0%', `${layer.speed}%`]);
          return (
            <motion.div
              key={index}
              className="absolute inset-0"
              style={{
                backgroundImage: `url(${layer.src})`,
                backgroundPosition: 'center',
                backgroundSize: 'cover',
                y,
                zIndex: index,
              }}
            />
          );
        })}
         <div className="absolute inset-0 bg-black/10 hover:bg-black/30 transition-colors duration-300"></div>
      </div>
    </Link>
  );
};
