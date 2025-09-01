
"use client";

import { Aperture, Briefcase, Cloud, Code, Database, Globe, Layers, Server, LucideProps } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { useLanguage } from '@/context/language-context';
import { getContent } from '@/lib/content-store';

// Map icon names to actual components
const iconComponents: { [key: string]: React.FC<LucideProps> } = {
  Aperture,
  Briefcase,
  Cloud,
  Code,
  Database,
  Globe,
  Layers,
  Server,
};


export function ClientMarquee() {
  const { translations } = useLanguage();
  const [clients, setClients] = useState<any[]>([]);

  useEffect(() => {
    const loadClients = async () => {
        const content = await getContent();
        const enabledClients = content.clients?.filter((c: any) => c.enabled) || [];
        setClients(enabledClients);
    };
    loadClients();
  }, []);

  if (clients.length === 0) {
      return null;
  }

  const duplicatedLogos = [...clients, ...clients];

  return (
    <section className="w-full py-12 group">
      <h2 className="text-3xl font-headline font-bold text-center mb-10">{translations.ourPartners}</h2>
      <div
        className="relative w-full overflow-hidden [mask-image:linear-gradient(to_right,transparent,white_10%,white_90%,transparent)]"
      >
        <div className="flex w-max animate-marquee group-hover:[animation-play-state:paused]">
          {duplicatedLogos.map((client, index) => {
            const IconComponent = iconComponents[client.icon];
            if (!IconComponent) return null;

            return (
                <div key={index} className="flex items-center justify-center mx-8 w-40 text-foreground/60">
                    <div className="w-12 h-12 mr-4"><IconComponent className="w-full h-full" /></div>
                    <span className="text-2xl font-headline font-semibold">{client.name}</span>
                </div>
            )
          })}
        </div>
      </div>
    </section>
  );
}
