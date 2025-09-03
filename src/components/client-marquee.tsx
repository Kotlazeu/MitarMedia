
"use client";

import React, { useEffect, useState } from 'react';
import { useLanguage } from '@/context/language-context';
import { getContent } from '@/lib/content-store';
import Image from 'next/image';

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

  useEffect(() => {
    const interval = setInterval(async () => {
      const content = await getContent();
      const enabledClients = content.clients?.filter((c: any) => c.enabled) || [];
      setClients(enabledClients);
    }, 5000); // Refresh every 5 seconds

    return () => clearInterval(interval);
  }, []);


  if (clients.length === 0) {
      return null;
  }

  // Duplicate the logos enough times to ensure a smooth marquee effect
  const desiredCount = Math.max(12, clients.length * 2);
  const repeatedClients = Array.from({ length: Math.ceil(desiredCount / clients.length) }, () => clients).flat();


  return (
    <section className="w-full py-12 group">
      <h2 className="text-3xl font-headline font-bold text-center mb-10">{translations.ourPartners}</h2>
      <div
        className="relative w-full overflow-hidden [mask-image:linear-gradient(to_right,transparent,white_10%,white_90%,transparent)]"
      >
        <div className="flex w-max animate-marquee group-hover:[animation-play-state:paused]">
          {repeatedClients.map((client, index) => {
            if (!client.logo) return null;

            return (
                <div key={`${client.id}-${index}`} className="flex items-center justify-center mx-8 w-40 text-foreground/60">
                    <div className="relative w-12 h-12 mr-4">
                        <Image src={client.logo} alt={`${client.name} logo`} fill style={{ objectFit: 'contain' }}/>
                    </div>
                    <span className="text-2xl font-headline font-semibold">{client.name}</span>
                </div>
            )
          })}
        </div>
      </div>
    </section>
  );
}

    