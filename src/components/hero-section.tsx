"use client";

import { useRef, useState } from 'react';
import { Button } from '@/components/ui/button';

export function HeroSection() {
  const videoRef = useRef<HTMLDivElement>(null);
  const [rotate, setRotate] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!videoRef.current) return;
    const rect = videoRef.current.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    const x = (mouseY / height - 0.5) * -15; // Rotirea pe axa X
    const y = (mouseX / width - 0.5) * 15;   // Rotirea pe axa Y
    setRotate({ x, y });
  };

  const handleMouseLeave = () => {
    setRotate({ x: 0, y: 0 });
  };

  return (
    <section className="min-h-screen w-full flex items-center justify-center text-center text-white py-24">
      <div className="relative z-10 flex flex-col items-center px-4 space-y-12">
        <div className="space-y-4">
          <h2 className="text-2xl md:text-3xl font-headline tracking-widest text-primary font-bold">VISUAL EDGE</h2>
          <h1 className="font-headline text-5xl md:text-7xl lg:text-8xl font-bold tracking-tighter text-shadow-lg">
            Crafting Visions, Creating Worlds
          </h1>
          <p className="font-body max-w-3xl mx-auto text-lg md:text-xl text-foreground/80">
            We are a full-service media production house specializing in breathtaking visual storytelling that captivates and inspires.
          </p>
        </div>

        <div
          ref={videoRef}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
          style={{
            transform: `perspective(1000px) rotateX(${rotate.x}deg) rotateY(${rotate.y}deg) scale(1.05)`,
            transition: 'transform 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
          }}
          className="group relative w-full max-w-4xl aspect-video rounded-2xl shadow-2xl hover:shadow-primary/30 border-2 border-white/10 transition-shadow duration-300"
        >
          <video
            autoPlay
            loop
            muted
            playsInline
            className="w-full h-full object-cover rounded-[14px]"
            poster="https://placehold.co/1280x720/000000/FFFFFF.png"
            data-ai-hint="showreel cinematic"
          >
            {/* Sursa videoclipului poate fi înlocuită. Acest link este un exemplu. */}
            <source src="https://www.w3schools.com/html/mov_bbb.mp4" type="video/mp4" />
          </video>
          <div className="absolute inset-0 bg-black/10 rounded-2xl pointer-events-none"></div>
        </div>
        
        <Button size="lg" className="font-headline text-lg">
          View Our Work
        </Button>
      </div>
    </section>
  );
}
