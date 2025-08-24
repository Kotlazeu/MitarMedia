import { Instagram, Youtube, Linkedin } from 'lucide-react';
import { TikTokIcon } from '@/components/icons/tiktok-icon';
import Image from 'next/image';

const socialLinks = [
  { name: 'Instagram', icon: <Instagram size={32} />, href: '#' },
  { name: 'YouTube', icon: <Youtube size={32} />, href: '#' },
  { name: 'TikTok', icon: <TikTokIcon className="h-8 w-8" />, href: '#' },
  { name: 'LinkedIn', icon: <Linkedin size={32} />, href: '#' },
];

export function SocialSection() {
  // Placeholder data for the Instagram feed
  const instagramPosts = Array.from({ length: 6 }, (_, i) => ({
    id: i,
    src: `https://placehold.co/400x400`,
    alt: `Instagram post placeholder ${i + 1}`,
    hint: `filmmaking behind the scenes`
  }));

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
        
        {/* Note for developers: Instagram API integration goes here. */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          {instagramPosts.map((post) => (
            <div key={post.id} className="aspect-square relative group overflow-hidden rounded-lg">
              <Image
                src={post.src}
                alt={post.alt}
                data-ai-hint={post.hint}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
                <Instagram className="text-white" size={48} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
