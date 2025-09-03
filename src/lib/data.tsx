import { Instagram, Youtube, Linkedin, LucideIcon } from 'lucide-react';
import { TikTokIcon } from '@/components/icons/tiktok-icon';
import React from 'react';

type SocialLinkData = {
  name: string;
  iconName: 'Instagram' | 'TikTok' | 'YouTube' | 'LinkedIn';
  href: string;
};

export const socialLinksData: SocialLinkData[] = [
  { name: 'Instagram', iconName: 'Instagram', href: 'https://www.instagram.com/georgemitarfilms/' },
  { name: 'TikTok', iconName: 'TikTok', href: '#' },
  { name: 'YouTube', iconName: 'YouTube', href: '#' },
  { name: 'LinkedIn', iconName: 'LinkedIn', href: '#' },
];

export const socialIcons: { [key: string]: React.FC<React.SVGProps<SVGSVGElement>> } = {
    Instagram: Instagram,
    TikTok: TikTokIcon,
    YouTube: Youtube,
    LinkedIn: Linkedin,
};


// For use in Header where components are needed directly
export const socialLinks = [
  { name: 'Instagram', href: 'https://www.instagram.com/georgemitarfilms/', icon: <Instagram /> },
  { name: 'TikTok', href: '#', icon: <TikTokIcon /> },
];
