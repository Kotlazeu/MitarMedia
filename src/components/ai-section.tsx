import { ArrowRight, Bot, BarChart2, Heart, Play, Volume2, Maximize, Film } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Image from 'next/image';
import { cn } from '@/lib/utils';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

const GlassCard = ({ children, className }: { children: React.ReactNode, className?: string }) => (
  <div className={cn("glassmorphism rounded-2xl border border-white/10 p-4 shadow-2xl", className)}>
    {children}
  </div>
);

export function AiSection() {
  return (
    <section id="ai-services" className="w-full min-h-screen flex items-center justify-center py-24 px-4 sm:px-6 lg:px-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center container">
        {/* Left Column: Text Content */}
        <div className="flex flex-col gap-6">
          <div className="inline-flex items-center gap-2 text-sm font-medium text-primary">
          </div>
          <h1 className="text-4xl md:text-5xl font-headline font-bold leading-tight">
            The Future of Visuals, <br />
            Generated On Demand
          </h1>
          <p className="text-foreground/70 text-lg">
            Our state-of-the-art AI understands your creative briefs, generating stunning visuals, animations, and video content that aligns perfectly with your brand's vision. From concept to final cut, accelerate your production pipeline instantly.
          </p>
        </div>

        {/* Right Column: Visual Composition */}
        <div className="relative h-[500px] w-full">
          {/* Card 1: Background */}
          <GlassCard className="absolute top-0 left-0 w-[85%] h-[80%] -rotate-3 transition-all duration-500 hover:rotate-0 hover:scale-105">
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
          <GlassCard className="absolute bottom-0 right-0 w-[50%] rotate-3 transition-all duration-500 hover:rotate-0 hover:scale-105 z-10 p-2">
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
          <GlassCard className="absolute top-[30%] right-2 sm:right-[-5%] flex items-center gap-2 p-2 rotate-12 transition-all duration-500 hover:rotate-0 hover:scale-110 z-20">
            <Avatar>
                <AvatarImage src="https://placehold.co/100x100" data-ai-hint="man portrait" />
                <AvatarFallback>YT</AvatarFallback>
            </Avatar>
            <div>
                <p className="text-xs font-bold">Client X</p>
                <p className="text-xs text-foreground/60">That was super fast!</p>
            </div>
          </GlassCard>
          
          {/* Floating element 2 */}
          <GlassCard className="absolute top-[65%] left-[-5%] p-2 -rotate-12 transition-all duration-500 hover:rotate-0 hover:scale-110 z-20">
            <Heart className="h-8 w-8 text-red-500 fill-red-500" />
          </GlassCard>
        </div>
      </div>
    </section>
  );
}
