"use client";

import { Instagram, Youtube, Linkedin } from 'lucide-react';
import { TikTokIcon } from '@/components/icons/tiktok-icon';
import Script from 'next/script';
import { useRef, useState } from 'react';
import { cn } from '@/lib/utils';

const socialLinks = [
  { name: 'Instagram', icon: <Instagram size={32} />, href: '#' },
  { name: 'YouTube', icon: <Youtube size={32} />, href: '#' },
  { name: 'TikTok', icon: <TikTokIcon className="h-8 w-8" />, href: '#' },
  { name: 'LinkedIn', icon: <Linkedin size={32} />, href: '#' },
];

export function SocialSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [isHovering, setIsHovering] = useState(false);
  const [rotate, setRotate] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!sectionRef.current) return;
    const rect = sectionRef.current.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    const x = (mouseY / height - 0.5) * -10;
    const y = (mouseX / width - 0.5) * 10;
    setRotate({ x, y });
  };

  const handleMouseEnter = () => {
    setIsHovering(true);
  };

  const handleMouseLeave = () => {
    setIsHovering(false);
    setRotate({ x: 0, y: 0 });
  };

  return (
    <section 
      ref={sectionRef}
      className="w-full"
      style={{ perspective: '1000px' }}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div className="flex justify-center items-center gap-8 mb-16">
        {socialLinks.map((social) => (
          <a
            key={social.name}
            href={social.href}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={social.name}
            className="text-foreground/70 transition-all duration-300 hover:text-primary hover:scale-110"
          >
            {social.icon}
          </a>
        ))}
      </div>

      <div className="text-center">
        <h2 className="text-3xl font-headline font-bold mb-2">Latest from Instagram</h2>
        <p className="text-foreground/70 mb-10">Follow us <a href="#" className="text-primary underline hover:text-primary/80">@visualedge</a></p>
        
        <div 
          style={{
            transform: isHovering
              ? `rotateX(${rotate.x}deg) rotateY(${rotate.y}deg)`
              : 'none',
            transition: 'transform 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94), box-shadow 0.3s ease-out',
          }}
          className={cn(
            "glassmorphism rounded-2xl p-4 shadow-[0_0_20px_rgba(255,255,255,0.25)] hover:shadow-[0_0_35px_rgba(255,255,255,0.4)]",
            !isHovering && 'animate-idle-perspective'
          )}
        >
            <Script src="https://elfsightcdn.com/platform.js" strategy="lazyOnload" />
            <div className="elfsight-app-547bb70d-1462-49c7-b4f4-604a55fba34a" data-elfsight-app-lazy></div>
        </div>
      </div>
    </section>
  );
}
