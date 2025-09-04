"use client";

import { socialLinksData, socialIcons } from '@/lib/data';
import { Button } from '@/components/ui/button';
import Image from 'next/image';
import Link from 'next/link';
import React from 'react';
import { LanguageProvider } from '@/context/language-context';

export default function SocialTestPage() {
  return (
    <LanguageProvider>
      <div className="flex flex-col items-center justify-center min-h-screen p-4">
        <div className="w-full max-w-md mx-auto">
          <header className="flex flex-col items-center mb-8">
            <Image
              src="/logo.svg"
              alt="Mitar Media Logo"
              width={80}
              height={80}
              className="mb-4"
            />
            <h1 className="text-xl font-bold text-foreground">@MitarMedia</h1>
          </header>

          <main className="flex flex-col space-y-4">
            {socialLinksData.map((link) => {
              const Icon = socialIcons[link.iconName];
              if (!Icon) return null;
              const isTelLink = link.href.startsWith('tel:');
              const Component = isTelLink ? 'a' : Link;

              return (
                <Button
                  key={link.name}
                  asChild
                  className="w-full h-14 text-lg glassmorphism transition-transform duration-200 ease-in-out hover:scale-105"
                >
                  <Component href={link.href} target={!isTelLink ? '_blank' : undefined} rel={!isTelLink ? 'noopener noreferrer' : undefined}>
                    {Icon && <div className="absolute left-4"><Icon className="h-6 w-6" /></div>}
                    <span>{link.name}</span>
                  </Component>
                </Button>
              );
            })}
          </main>
        </div>
      </div>
    </LanguageProvider>
  );
}
