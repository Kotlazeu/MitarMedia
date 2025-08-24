import { Instagram, Youtube, Linkedin } from 'lucide-react';
import { TikTokIcon } from '@/components/icons/tiktok-icon';
import Script from 'next/script';

const socialLinks = [
  { name: 'Instagram', icon: <Instagram size={32} />, href: '#' },
  { name: 'YouTube', icon: <Youtube size={32} />, href: '#' },
  { name: 'TikTok', icon: <TikTokIcon className="h-8 w-8" />, href: '#' },
  { name: 'LinkedIn', icon: <Linkedin size={32} />, href: '#' },
];

export function SocialSection() {
  return (
    <section className="w-full">
      <div className="flex justify-center items-center gap-8 mb-16">
        {socialLinks.map((social) => (
          <a
            key={social.name}
            href={social.href}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={social.name}
            className="text-foreground/70 transition-all duration-300 hover:text-primary hover:scale-110"
          >
            {social.icon}
          </a>
        ))}
      </div>

      <div className="text-center">
        <h2 className="text-3xl font-headline font-bold mb-2">Latest from Instagram</h2>
        <p className="text-foreground/70 mb-10">Follow us <a href="#" className="text-primary underline hover:text-primary/80">@visualedge</a></p>
        
        <div className="glassmorphism rounded-2xl p-4">
            <Script src="https://elfsightcdn.com/platform.js" strategy="lazyOnload" />
            <div className="elfsight-app-547bb70d-1462-49c7-b4f4-604a55fba34a" data-elfsight-app-lazy></div>
        </div>
      </div>
    </section>
  );
}
