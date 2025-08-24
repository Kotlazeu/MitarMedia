import { Button } from '@/components/ui/button';
import { PlayCircle } from 'lucide-react';
import Image from 'next/image';

export function HeroSection() {
  return (
    <section className="relative h-screen w-full flex items-center justify-center text-center text-white overflow-hidden">
      {/* Background Video Placeholder */}
      <div className="absolute top-0 left-0 w-full h-full z-0">
        <Image
          src="https://placehold.co/1920x1080"
          alt="Showreel background"
          data-ai-hint="cinematic abstract"
          fill
          className="object-cover"
          priority
        />
        {/* Dark overlay for text readability */}
        <div className="absolute inset-0 bg-black/60"></div>
      </div>
      
      {/* Note: An auto-playing, muted, and looped <video> element would replace the Image component above. */}
      {/* 
      <video autoPlay loop muted playsInline className="absolute top-0 left-0 w-full h-full object-cover z-0">
        <source src="/path-to-your-showreel.mp4" type="video/mp4" />
      </video>
      */}

      <div className="relative z-10 flex flex-col items-center px-4">
        <div className="mb-8">
            <h2 className="text-2xl md:text-3xl font-headline tracking-widest text-primary font-bold">VISUAL EDGE</h2>
        </div>
        <h1 className="font-headline text-5xl md:text-7xl lg:text-8xl font-bold tracking-tighter mb-4 text-shadow-lg">
          Crafting Visions, Creating Worlds
        </h1>
        <p className="font-body max-w-2xl text-lg md:text-xl text-foreground/80 mb-8">
          We are a full-service media production house specializing in breathtaking visual storytelling that captivates and inspires.
        </p>
        <Button size="lg" className="font-headline text-lg">
          View Our Work
        </Button>
      </div>
    </section>
  );
}
