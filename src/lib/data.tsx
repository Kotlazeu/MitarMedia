import { Instagram, Youtube, Linkedin, LucideIcon, Facebook, Phone } from 'lucide-react';
import { TikTokIcon } from '@/components/icons/tiktok-icon';
import React from 'react';

type SocialLinkData = {
  name: string;
  iconName: 'Instagram' | 'TikTok' | 'YouTube' | 'LinkedIn' | 'Facebook' | 'Phone';
  href: string;
};

export const socialLinksData: SocialLinkData[] = [
  { name: 'TikTok', iconName: 'TikTok', href: '#' },
  { name: 'Instagram', iconName: 'Instagram', href: 'https://www.instagram.com/georgemitarfilms/' },
  { name: 'Phone', iconName: 'Phone', href: 'tel:+40769833101' },
];

export const socialIcons: { [key: string]: React.FC<any> } = {
    Instagram: Instagram,
    TikTok: TikTokIcon,
    YouTube: Youtube,
    LinkedIn: Linkedin,
    Facebook: Facebook,
    Phone: Phone,
};


// For use in Header where components are needed directly
export const socialLinks = [
  { name: 'Instagram', href: 'https://www.instagram.com/georgemitarfilms/', icon: <Instagram /> },
  { name: 'TikTok', href: '#', icon: <TikTokIcon /> },
];
