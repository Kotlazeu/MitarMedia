
"use client";

import { ArrowRight, Bot, BarChart2, Heart, Play, Volume2, Maximize, Film } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Image from 'next/image';
import { cn } from '@/lib/utils';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
// import { Typewriter } from './typewriter';
import { FadeInWords } from './fade-in-words';
import React, { useState, useRef } from 'react';
import { MagnifyingGlass } from './magnifying-glass';
import { useLanguage } from '@/context/language-context';
import RotatingText from './rotating-text';
import BlurText from './blur-text';
import { motion } from 'framer-motion';

const GlassCard = ({ children, className, style }: { children: React.ReactNode, className?: string, style?: React.CSSProperties }) => (
  <div className={cn("glassmorphism rounded-2xl border border-white/10 p-4 shadow-2xl", className)} style={style}>
    {children}
  </div>
);

export function AiSection() {
  const { translations } = useLanguage();
  const [isBlurAnimationComplete, setIsBlurAnimationComplete] = useState(false);

  const handleAnimationComplete = () => {
    setIsBlurAnimationComplete(true);
  };

  return (
    <section id="ai-services" className="w-full min-h-screen flex items-center justify-center py-24 px-4 sm:px-6 lg:px-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center container">
        {/* Left Column: Text Content */}
        <div style={{ perspective: '1000px' }}>
            <div className="flex flex-col gap-6 animate-idle-perspective">
              <div className="inline-flex items-center gap-2 text-sm font-medium text-primary">
              </div>
              <div className="flex justify-center lg:justify-start items-center text-4xl md:text-5xl font-custom font-bold leading-tight text-foreground">
                {!isBlurAnimationComplete ? (
                   <BlurText
                      text="Be Different"
                      className="text-4xl md:text-5xl font-custom font-bold leading-tight text-foreground"
                      onAnimationComplete={handleAnimationComplete}
                    />
                ) : (
                  <>
                    <RotatingText
                      texts={['Be', 'We are']}
                      staggerFrom={"first"}
                      splitBy="characters"
                      mainClassName="overflow-hidden inline-flex justify-end"
                      splitLevelClassName="overflow-hidden"
                      elementLevelClassName="inline-block"
                    />
                    <motion.span 
                      layout="position" 
                      className="ml-4"
                      transition={{ type: "spring", stiffness: 300, damping: 20 }}
                    >
                      Different
                    </motion.span>
                  </>
                )}
              </div>
               <MagnifyingGlass>
                <FadeInWords 
                  text={translations.videoProductionSolutions}
                  glowOnHover={true}
                />
              </MagnifyingGlass>
            </div>
        </div>

        {/* Right Column: Visual Composition */}
        <div className="relative h-[500px] w-full">
          {/* Card 1: Background */}
          <GlassCard 
            className="absolute top-0 left-0 w-[80%] h-[80%] transition-all duration-500 hover:scale-105 -rotate-3 hover:rotate-0"
            >
            <div className="flex justify-between items-center mb-4">
              <p className="text-sm font-bold">Project Dashboard</p>
              <BarChart2 className="text-foreground/50" />
            </div>
            <div className="relative w-full h-[80%] rounded-lg overflow-hidden">
                <video src="https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4" autoPlay loop muted playsInline className="absolute w-full h-full object-cover"></video>
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
            </div>
          </GlassCard>

          {/* Card 2: Video frame */}
          <GlassCard 
            className="absolute bottom-0 right-0 w-[65%] lg:w-[50%] transition-all duration-500 hover:scale-105 z-10 p-2 rotate-3 hover:rotate-0"
            >
            <div className="relative w-full aspect-square rounded-lg overflow-hidden mb-2">
              <video src="https://storage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4" autoPlay loop muted playsInline className="absolute w-full h-full object-cover"></video>
            </div>
            <div className="flex items-center gap-2 text-foreground/80">
              <Film className="h-4 w-4" />
              <div className="w-full h-1 bg-foreground/20 rounded-full">
                <div className="w-1/3 h-1 bg-primary rounded-full"></div>
              </div>
              <Volume2 className="h-4 w-4" />
              <Maximize className="h-4 w-4" />
            </div>
          </GlassCard>

           {/* Floating element 1 */}
          <GlassCard 
            className="absolute top-[30%] right-2 sm:right-[-5%] flex items-center gap-2 p-2 transition-all duration-500 hover:scale-110 z-20 rotate-6 hover:rotate-0"
            >
            <Avatar>
                <AvatarImage src="https://placehold.co/100x100" data-ai-hint="man portrait" />
                <AvatarFallback>YT</AvatarFallback>
            </Avatar>
            <div>
                <p className="text-xs font-bold">Client X</p>
                <p className="text-xs text-foreground/60">{translations.clientFastResponse}</p>
            </div>
          </GlassCard>
          
          {/* Floating element 2 */}
          <GlassCard 
            className="absolute top-[65%] left-[-5%] p-2 transition-all duration-500 hover:scale-110 z-20 -rotate-12 hover:rotate-0"
            >
            <Heart className="h-8 w-8 text-red-500 fill-red-500" />
          </GlassCard>
        </div>
      </div>
    </section>
  );
}
