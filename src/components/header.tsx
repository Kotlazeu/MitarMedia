
"use client";

import { useState, useEffect } from 'react';
import { Menu, Phone } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { socialLinks } from '@/lib/data';
import { cn } from '@/lib/utils';
import { PerspectiveWrapper } from './perspective-wrapper';
import { LanguageToggle } from './language-toggle';
import { useLanguage } from '@/context/language-context';
import Image from 'next/image';

export function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const { translations } = useLanguage();

  useEffect(() => {
    setIsMounted(true); 
    
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <header className={cn(
      "fixed top-0 z-50 w-full transition-opacity duration-500 ease-out",
      isScrolled ? 'opacity-0' : 'opacity-100',
      isMounted ? 'translate-y-0' : '-translate-y-full opacity-0'
    )}>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <PerspectiveWrapper>
          <div className={cn(
            "mt-4 rounded-2xl border border-white/10 p-2.5 shadow-2xl glassmorphism transition-all duration-300 w-full"
            )}>
            <div className="flex items-center justify-between">
              <Link href="/" className="flex items-center">
                <Image src="/logo.svg" alt="Mitar Media Logo" width={32} height={32} className="h-8 w-8" />
              </Link>

              <nav className={cn(
                "hidden md:flex items-center gap-4 transition-all duration-300"
                )}>
                <LanguageToggle />
                <div className="h-6 w-px bg-white/20"></div>
                {socialLinks.map((link) => (
                  <Button key={link.name} variant="ghost" size="icon" asChild className="[&_svg]:size-6">
                    <a href={link.href} target="_blank" rel="noopener noreferrer" aria-label={link.name}>
                      {link.icon}
                    </a>
                  </Button>
                ))}
                <Button asChild>
                  <a href="tel:+40769833101">
                    <Phone className="mr-2 h-4 w-4" />
                    {translations.contact}
                  </a>
                </Button>
              </nav>

              <div className="md:hidden flex items-center gap-2">
                 <Button asChild size="icon">
                    <a href="tel:+40769833101" aria-label="Call us">
                      <Phone className="h-5 w-5" />
                    </a>
                  </Button>
                <Sheet open={isOpen} onOpenChange={setIsOpen}>
                  <SheetTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <Menu className="h-6 w-6" />
                    </Button>
                  </SheetTrigger>
                  <SheetContent side="left" className="w-[280px] p-6 flex flex-col">
                    <SheetHeader>
                      <SheetTitle className="sr-only">Mobile Menu</SheetTitle>
                    </SheetHeader>
                    <Link href="/" className="flex items-center mb-8" onClick={() => setIsOpen(false)}>
                      <Image src="/logo.svg" alt="Mitar Media Logo" width={32} height={32} className="h-8 w-8" />
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
                    <div className="mt-auto space-y-4">
                       <LanguageToggle />
                       <Button asChild className="w-full">
                          <a href="tel:+40769833101">
                          <Phone className="mr-2 h-4 w-4" />
                          {translations.contactUs}
                          </a>
                      </Button>
                    </div>
                  </SheetContent>
                </Sheet>
              </div>
            </div>
          </div>
        </PerspectiveWrapper>
      </div>
    </header>
  );
}
