
import { socialLinksData, socialIcons } from '@/lib/data';
import { Button } from '@/components/ui/button';
import { Menu, ArrowRight } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import React from 'react';

export default function SocialTestPage() {
  return (
    <div className="flex justify-center items-center min-h-screen font-sans w-full p-4">
      <div className="w-full max-w-sm mx-auto bg-card/50 backdrop-blur-lg rounded-2xl shadow-lg overflow-hidden border border-border">
        
        {/* Header */}
        <header className="relative h-24 p-4">
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
            <div className="rounded-2xl overflow-hidden mb-6 aspect-video">
                <iframe 
                    src="https://www.google.com/maps/embed?pb=!1m14!1m12!1m3!1d500.0001506308622!2d21.245516633957912!3d45.79528108724393!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!5e1!3m2!1sen!2sro!4v1756980823138!5m2!1sen!2sro" 
                    width="100%" 
                    height="100%" 
                    style={{ border:0 }} 
                    allowFullScreen={true} 
                    loading="lazy" 
                    referrerPolicy="no-referrer-when-downgrade">
                </iframe>
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
