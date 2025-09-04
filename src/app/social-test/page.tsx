"use client";

import { socialLinksData, socialIcons } from '@/lib/data';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import React from 'react';
import { MagnifyingGlass } from '@/components/magnifying-glass';

export default function SocialTestPage() {
  const mapLink = "https://www.google.com/maps/embed?pb=!1m14!1m12!1m3!1d500.0001506308622!2d21.245516633957912!3d45.79528108724393!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!5e1!3m2!1sen!2sro!4v1756980823138!5m2!1sen!2sro";

  return (
    <div className="flex justify-center items-center min-h-screen font-sans w-full p-4">
      <div style={{ perspective: '1000px' }}>
        <div className="w-full max-w-sm mx-auto bg-card/50 backdrop-blur-lg rounded-2xl shadow-lg overflow-hidden border border-border animate-idle-perspective">
          
          <header className="relative h-20 p-4">
             <div className="relative flex justify-end items-center">
              
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
                      const isTelLink = link.href.startsWith('tel:');
                      const Component = isTelLink ? 'a' : Link;
                      
                      return (
                          <Button key={link.name} asChild variant="default" size="icon" className="bg-secondary hover:bg-secondary/80 rounded-full h-12 w-12 transition-transform hover:scale-110">
                               <Component href={link.href} target={!isTelLink ? '_blank' : undefined} rel={!isTelLink ? 'noopener noreferrer' : undefined} aria-label={link.name}>
                                  <Icon className="h-6 w-6 text-secondary-foreground" />
                              </Component>
                          </Button>
                      );
                  })}
              </div>

              {/* GIF/Map Section */}
              <MagnifyingGlass mapLink={mapLink}>
                <Image 
                  src="/map-animation.gif" 
                  alt="Animated map background"
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-110"
                  data-ai-hint="satellite view"
                />
              </MagnifyingGlass>


              {/* Website Link */}
              <Button asChild className="w-full h-14 text-lg bg-primary text-primary-foreground hover:bg-primary/90 rounded-full flex justify-between items-center px-6 transition-transform hover:scale-105">
                  <Link href="/">
                      <span>Vizitează site-ul</span>
                      <ArrowRight className="h-5 w-5" />
                  </Link>
              </Button>

          </main>
        </div>
      </div>
    </div>
  );
}