
import { socialLinksData, socialIcons } from '@/lib/data';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Menu, ArrowRight } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import React from 'react';

export default function SocialTestPage() {
  return (
    <div className="flex justify-center items-center min-h-screen font-sans w-full p-4">
      <div className="w-full max-w-sm mx-auto bg-card/50 backdrop-blur-lg rounded-2xl shadow-lg overflow-hidden border border-border">
        
        {/* Header */}
        <header className="relative h-24 p-4 text-white">
           <div className="relative flex justify-end items-center">
            <Button variant="ghost" size="icon" className="text-white backdrop-blur-sm bg-white/10 rounded-full">
              <Menu />
            </Button>
          </div>
        </header>

        {/* Content Card */}
        <main className="relative p-6 -mt-20">
            
            {/* Logo */}
            <div className="relative flex justify-center mb-4">
                 <Image src="/logo.svg" alt="Mitar Media" width={112} height={112} className="h-28 w-28" />
            </div>

            {/* Info Section */}
            <div className="text-center">
                <h1 className="text-3xl font-bold text-foreground">@MitarMedia</h1>
                <p className="text-muted-foreground mt-2 px-4">
                    Soluții complete de producție video. Creăm viziuni, construim lumi.
                </p>
            </div>

            {/* Social Links */}
            <div className="flex justify-center space-x-4 my-6">
                {socialLinksData.map((link) => {
                    const Icon = socialIcons[link.iconName];
                    if (!Icon) return null;
                    return (
                        <Button key={link.name} asChild variant="default" size="icon" className="bg-secondary hover:bg-secondary/80 rounded-full h-12 w-12 transition-transform hover:scale-110">
                             <a href={link.href} target="_blank" rel="noopener noreferrer" aria-label={link.name}>
                                <Icon className="h-6 w-6 text-secondary-foreground" />
                            </a>
                        </Button>
                    );
                })}
            </div>

            {/* Map Section */}
            <div className="relative rounded-2xl overflow-hidden mb-6 aspect-video">
                <Image src="https://picsum.photos/600/400" data-ai-hint="street map" alt="Location Map" fill className="object-cover" />
                <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                     <Button className="bg-primary hover:bg-primary/90 text-primary-foreground rounded-full px-6 py-2">Vezi Locația</Button>
                </div>
            </div>

            {/* Website Link */}
            <Button asChild className="w-full h-14 text-lg bg-secondary hover:bg-secondary/80 rounded-full flex justify-between items-center px-6 transition-transform hover:scale-105">
                <Link href="/">
                    <span>Vizitează site-ul</span>
                    <ArrowRight className="h-5 w-5" />
                </Link>
            </Button>

        </main>
      </div>
    </div>
  );
}
