"use client";

import Script from 'next/script';
import { cn } from '@/lib/utils';

export function SocialSection() {
  return (
    <section 
      className="w-full"
    >
      <div className="text-center">
        <h2 className="text-3xl font-headline font-bold mb-2">Latest from Instagram</h2>
        <p className="text-foreground/70 mb-10">Follow us <a href="#" className="text-primary underline hover:text-primary/80">@visualedge</a></p>
        
        <div style={{ perspective: '2750px' }}>
          <div 
            className={cn(
              "glassmorphism rounded-2xl p-4 shadow-[0_0_20px_rgba(255,255,255,0.25)] hover:shadow-[0_0_35px_rgba(255,255,255,0.4)]",
              'animate-idle-perspective'
            )}
          >
              <Script src="https://elfsightcdn.com/platform.js" strategy="lazyOnload" />
              <div className="elfsight-app-547bb70d-1462-49c7-b4f4-604a55fba34a" data-elfsight-app-lazy></div>
          </div>
        </div>
      </div>
    </section>
  );
}
