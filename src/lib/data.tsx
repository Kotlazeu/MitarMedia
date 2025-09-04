import { Instagram, Youtube, Linkedin, LucideIcon, Facebook } from 'lucide-react';
import { TikTokIcon } from '@/components/icons/tiktok-icon';
import React from 'react';

type SocialLinkData = {
  name: string;
  iconName: 'Instagram' | 'TikTok' | 'YouTube' | 'LinkedIn' | 'Facebook';
  href: string;
};

export const socialLinksData: SocialLinkData[] = [
  { name: 'Facebook', iconName: 'Facebook', href: '#' },
  { name: 'Instagram', iconName: 'Instagram', href: 'https://www.instagram.com/georgemitarfilms/' },
  { name: 'LinkedIn', iconName: 'LinkedIn', href: '#' },
  { name: 'YouTube', iconName: 'YouTube', href: '#' },
];

export const socialIcons: { [key: string]: React.FC<any> } = {
    Instagram: Instagram,
    TikTok: TikTokIcon,
    YouTube: Youtube,
    LinkedIn: Linkedin,
    Facebook: Facebook,
};


// For use in Header where components are needed directly
export const socialLinks = [
  { name: 'Instagram', href: 'https://www.instagram.com/georgemitarfilms/', icon: <Instagram /> },
  { name: 'TikTok', href: '#', icon: <TikTokIcon /> },
];
