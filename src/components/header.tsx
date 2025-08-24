"use client";

import { useState } from 'react';
import { Film, Menu, Phone, Instagram, Youtube, Linkedin } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";
import { TikTokIcon } from '@/components/icons/tiktok-icon';

const socialLinks = [
  { name: 'Instagram', icon: <Instagram />, href: '#' },
  { name: 'YouTube', icon: <Youtube />, href: '#' },
  { name: 'TikTok', icon: <TikTokIcon />, href: '#' },
  { name: 'LinkedIn', icon: <Linkedin />, href: '#' },
];

export function Header() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 transition-all duration-300">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mt-4 rounded-2xl border border-white/10 p-2.5 shadow-2xl glassmorphism">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2">
              <div className="bg-primary p-2 rounded-lg">
                <Film className="h-6 w-6 text-primary-foreground" />
              </div>
              <span className="text-xl font-bold font-headline">Visual Edge</span>
            </Link>

            <nav className="hidden md:flex items-center gap-2">
              {socialLinks.map((link) => (
                <Button key={link.name} variant="ghost" size="icon" asChild className="[&_svg]:size-6">
                  <a href={link.href} target="_blank" rel="noopener noreferrer" aria-label={link.name}>
                    {link.icon}
                  </a>
                </Button>
              ))}
              <Button asChild>
                <a href="tel:+40123456789">
                  <Phone className="mr-2 h-4 w-4" />
                  Contact
                </a>
              </Button>
            </nav>

            <div className="md:hidden">
              <Sheet open={isOpen} onOpenChange={setIsOpen}>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <Menu className="h-6 w-6" />
                  </Button>
                </SheetTrigger>
                <SheetContent side="left" className="w-[280px] p-6 flex flex-col">
                  <Link href="/" className="flex items-center gap-2 mb-8" onClick={() => setIsOpen(false)}>
                    <div className="bg-primary p-2 rounded-lg">
                      <Film className="h-6 w-6 text-primary-foreground" />
                    </div>
                    <span className="text-xl font-bold font-headline">Visual Edge</span>
                  </Link>
                  <nav className="flex flex-col gap-4">
                     {socialLinks.map((link) => (
                      <Button key={link.name} variant="ghost" className="justify-start text-lg [&_svg]:size-6" asChild>
                        <a href={link.href} onClick={() => setIsOpen(false)} target="_blank" rel="noopener noreferrer">
                          {link.icon}
                          <span className="ml-4">{link.name}</span>
                        </a>
                      </Button>
                    ))}
                  </nav>
                  <div className="mt-auto">
                     <Button asChild className="w-full">
                        <a href="tel:+40123456789">
                        <Phone className="mr-2 h-4 w-4" />
                        Contactează-ne
                        </a>
                    </Button>
                  </div>
                </SheetContent>
              </Sheet>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
