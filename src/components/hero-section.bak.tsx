import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Typewriter } from './typewriter';

export function HeroSection() {
  return (
    <section className="w-full min-h-screen flex items-center justify-center py-12 md:py-24 lg:py-32 xl:py-48 text-center">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center space-y-4">
          <h1 className="title text-gradient-aurora">
            Crafting Visions, Creating Worlds
          </h1>
          <div className="max-w-[700px] text-foreground/80 md:text-xl">
            <Typewriter />
          </div>
          <Button size="lg" className="group">
            Explore Our Work
            <ArrowRight className="h-5 w-5 ml-2 transition-transform group-hover:translate-x-1" />
          </Button>
        </div>
      </div>
    </section>
  );
}
