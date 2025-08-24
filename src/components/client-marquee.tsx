"use client";

import { Aperture, Briefcase, Cloud, Code, Database, Globe, Layers, Server } from 'lucide-react';
import React from 'react';

export function ClientMarquee() {
  const logos = [
    { name: 'Quantum', icon: <Aperture /> },
    { name: 'Apex', icon: <Briefcase /> },
    { name: 'Nebula', icon: <Cloud /> },
    { name: 'Syntax', icon: <Code /> },
    { name: 'Nexus', icon: <Database /> },
    { name: 'Horizon', icon: <Globe /> },
    { name: 'Strata', icon: <Layers /> },
    { name: 'Vertex', icon: <Server /> },
  ];

  const duplicatedLogos = [...logos, ...logos];

  return (
    <section className="w-full py-12">
      <h2 className="text-3xl font-headline font-bold text-center mb-10">Trusted By Industry Leaders</h2>
      <div
        className="relative w-full overflow-hidden [mask-image:linear-gradient(to_right,transparent,white_10%,white_90%,transparent)]"
      >
        <div className="flex w-max animate-marquee hover:[animation-play-state:paused]">
          {duplicatedLogos.map((logo, index) => (
            <div key={index} className="flex items-center justify-center mx-8 w-40 text-foreground/60">
              <div className="w-12 h-12 mr-4">{React.cloneElement(logo.icon, { className: "w-full h-full" })}</div>
              <span className="text-2xl font-headline font-semibold">{logo.name}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
