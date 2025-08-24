"use client";

import { useState } from 'react';
import { Film, Menu, X } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";
import { cn } from '@/lib/utils';

const navLinks = [
  { href: '#ai-services', label: 'Servicii AI' },
  { href: '#metrics', label: 'Metrici' },
  { href: '#clients', label: 'Clienți' },
  { href: '#social', label: 'Social' },
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
              {navLinks.map((link) => (
                <Button key={link.href} variant="ghost" asChild>
                  <Link href={link.href}>{link.label}</Link>
                </Button>
              ))}
            </nav>

            <div className="md:hidden">
              <Sheet open={isOpen} onOpenChange={setIsOpen}>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <Menu className="h-6 w-6" />
                  </Button>
                </SheetTrigger>
                <SheetContent side="left" className="w-[280px] p-6">
                  <Link href="/" className="flex items-center gap-2 mb-8" onClick={() => setIsOpen(false)}>
                    <div className="bg-primary p-2 rounded-lg">
                      <Film className="h-6 w-6 text-primary-foreground" />
                    </div>
                    <span className="text-xl font-bold font-headline">Visual Edge</span>
                  </Link>
                  <nav className="flex flex-col gap-4">
                    {navLinks.map((link) => (
                      <Button key={link.href} variant="ghost" className="justify-start text-lg" asChild>
                        <Link href={link.href} onClick={() => setIsOpen(false)}>{link.label}</Link>
                      </Button>
                    ))}
                  </nav>
                </SheetContent>
              </Sheet>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
