"use client";

import { useEffect, useState, useRef } from 'react';
import { cn } from '@/lib/utils';

const AnimatedCounter = ({ end, duration = 2 }: { end: number; duration?: number }) => {
  const [count, setCount] = useState(0);
  const frameRate = 1000 / 60;
  const totalFrames = Math.round(duration * 1000 / frameRate);

  useEffect(() => {
    let frame = 0;
    const counter = setInterval(() => {
      frame++;
      const progress = (frame / totalFrames) ** 2; // Ease-out
      const currentCount = Math.round(end * progress);

      if (frame === totalFrames) {
        setCount(end);
        clearInterval(counter);
      } else {
        setCount(currentCount);
      }
    }, frameRate);

    return () => clearInterval(counter);
  }, [end, duration, totalFrames, frameRate]);

  return <span>{count.toLocaleString()}</span>;
};

export function MetricsSection() {
  const [inView, setInView] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );
    if(ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  const metrics = [
    { value: 150, unit: 'M+', label: 'Views Generated' },
    { value: 5, unit: 'M+', label: 'Followers Engaged' },
    { value: 200, unit: '+', label: 'Satisfied Clients' },
    { value: 25, unit: 'M+', label: 'In Revenue' },
  ];

  return (
    <section ref={ref} className="w-full">
      <div className={cn(
        "grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8 p-8 rounded-2xl transition-shadow duration-300",
        "glassmorphism",
        "shadow-[0_0_20px_rgba(255,255,255,0.25)] hover:shadow-[0_0_35px_rgba(255,255,255,0.4)]"
        )}>
        {metrics.map((metric, index) => (
          <div key={index} className="text-center">
            <h3 className="text-4xl md:text-6xl font-headline font-bold text-primary">
              {inView ? <AnimatedCounter end={metric.value} /> : '0'}
              {metric.unit}
            </h3>
            <p className="text-sm md:text-base text-foreground/70 mt-2 font-body">{metric.label}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
