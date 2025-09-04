
import { socialLinksData, socialIcons } from '@/lib/data';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Menu, ArrowRight } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import React from 'react';

export default function SocialTestPage() {
  return (
    <div className="flex justify-center min-h-screen font-sans">
      <div className="w-full max-w-sm mx-auto bg-white dark:bg-black rounded-b-3xl shadow-lg overflow-hidden">
        
        {/* Header with Gradient */}
        <header className="relative bg-gradient-to-br from-purple-600 via-indigo-600 to-teal-500 h-40 p-4 text-white">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-2">
                <span className="font-bold text-lg">✨ SmartBio</span>
            </div>
            <Button variant="ghost" size="icon" className="text-white">
              <Menu />
            </Button>
          </div>
        </header>

        {/* Content Card */}
        <main className="relative bg-white dark:bg-black p-6 -mt-20">
            
            {/* Avatar */}
            <div className="relative flex justify-center -mt-16 mb-4">
                <Avatar className="h-28 w-28 border-4 border-white dark:border-black">
                    <AvatarImage src="https://picsum.photos/200/200" data-ai-hint="avatar illustration" alt="Rock Agency" />
                    <AvatarFallback>RA</AvatarFallback>
                </Avatar>
            </div>

            {/* Info Section */}
            <div className="text-center">
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Rock Agency</h1>
                <p className="text-gray-600 dark:text-gray-400 mt-2 px-4">
                    Rock Agency is a digital agency company and website studio specializing in products, commerce, and SaaS website.
                </p>
            </div>

            {/* Social Links */}
            <div className="flex justify-center space-x-4 my-6">
                {socialLinksData.map((link) => {
                    const Icon = socialIcons[link.iconName];
                    if (!Icon) return null;
                    return (
                        <Button key={link.name} asChild variant="default" size="icon" className="bg-gray-900 dark:bg-gray-800 hover:bg-gray-700 dark:hover:bg-gray-700 rounded-full h-12 w-12">
                             <a href={link.href} target="_blank" rel="noopener noreferrer" aria-label={link.name}>
                                <Icon className="h-6 w-6 text-white" />
                            </a>
                        </Button>
                    );
                })}
            </div>

            {/* Map Section */}
            <div className="relative rounded-2xl overflow-hidden mb-6">
                <Image src="https://picsum.photos/600/400" data-ai-hint="street map" alt="Location Map" width={600} height={400} className="w-full" />
                <div className="absolute inset-0 flex items-center justify-center bg-black/20">
                     <Button className="bg-blue-600 hover:bg-blue-700 text-white rounded-full px-6 py-2">See Our Location</Button>
                </div>
            </div>

            {/* Website Link */}
            <Button asChild className="w-full h-14 text-lg bg-gray-900 dark:bg-gray-800 hover:bg-gray-700 dark:hover:bg-gray-700 rounded-full flex justify-between items-center px-6">
                <Link href="#">
                    <span>Visit our website</span>
                    <ArrowRight className="h-5 w-5" />
                </Link>
            </Button>

        </main>
      </div>
    </div>
  );
}
