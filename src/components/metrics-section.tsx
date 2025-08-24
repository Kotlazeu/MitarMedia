"use client";

import { useEffect, useState, useRef, useCallback } from 'react';
import { cn } from '@/lib/utils';

const AnimatedCounter = ({ 
  end, 
  duration = 2, 
  start,
  onProgress
}: { 
  end: number; 
  duration?: number; 
  start: boolean;
  onProgress: (progress: number) => void;
}) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!start) return;

    setCount(0); // Reset count when starting
    const frameRate = 1000 / 60;
    const totalFrames = Math.round(duration * 1000 / frameRate);
    let frame = 0;

    const counter = setInterval(() => {
      frame++;
      const progress = Math.min(1, frame / totalFrames);
      const easeOutProgress = 1 - Math.pow(1 - progress, 3);
      const currentCount = Math.round(end * easeOutProgress);
      
      setCount(currentCount);
      onProgress(currentCount / end);

      if (progress === 1) {
        setCount(end); // Ensure it ends on the exact value
        clearInterval(counter);
      }
    }, frameRate);

    return () => clearInterval(counter);
  }, [start, end, duration, onProgress]);

  return <span>{count.toLocaleString()}</span>;
};

export function MetricsSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [isHovering, setIsHovering] = useState(false);
  const [rotate, setRotate] = useState({ x: 0, y: 0 });

  const metrics = [
    { value: 150, unit: 'M+', label: 'Views Generated' },
    { value: 5, unit: 'M+', label: 'Followers Engaged' },
    { value: 200, unit: '+', label: 'Satisfied Clients' },
    { value: 25, unit: 'M+', label: 'In Revenue' },
  ];

  const [activeCounters, setActiveCounters] = useState<boolean[]>(new Array(metrics.length).fill(false));

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setActiveCounters(prev => {
            const newActive = [...prev];
            newActive[0] = true;
            return newActive;
          });
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );
    const currentRef = sectionRef.current;
    if(currentRef) observer.observe(currentRef);
    return () => {
      if(currentRef) {
        observer.unobserve(currentRef);
      }
    };
  }, []);

  const handleProgress = useCallback((index: number) => (progress: number) => {
    if (progress >= 0.8 && index < metrics.length - 1) {
      setActiveCounters(prev => {
        const newActive = [...prev];
        if (!newActive[index + 1]) {
          newActive[index + 1] = true;
        }
        return newActive;
      });
    }
  }, [metrics.length]);


  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!sectionRef.current) return;
    const rect = sectionRef.current.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    const x = (mouseY / height - 0.5) * -10;
    const y = (mouseX / width - 0.5) * 10;
    setRotate({ x, y });
  };

  const handleMouseEnter = () => {
    setIsHovering(true);
  };

  const handleMouseLeave = () => {
    setIsHovering(false);
    setRotate({ x: 0, y: 0 });
  };
  
  return (
    <section 
      ref={sectionRef} 
      className="w-full"
      style={{ perspective: '1000px' }}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div 
        style={{
          transform: isHovering
            ? `rotateX(${rotate.x}deg) rotateY(${rotate.y}deg)`
            : 'rotateX(0deg) rotateY(0deg)',
          transition: 'transform 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94), box-shadow 0.3s ease-out',
        }}
        className={cn(
        "grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8 p-8 rounded-2xl",
        "glassmorphism",
        "shadow-[0_0_20px_rgba(255,255,255,0.25)] hover:shadow-[0_0_35px_rgba(255,255,255,0.4)]"
        )}>
        {metrics.map((metric, index) => (
          <div key={index} className="text-center">
            <h3 className="text-4xl md:text-6xl font-headline font-bold text-primary">
              <AnimatedCounter 
                end={metric.value} 
                start={activeCounters[index]}
                onProgress={handleProgress(index)}
              />
              {metric.unit}
            </h3>
            <p className="text-sm md:text-base text-foreground/70 mt-2 font-body">{metric.label}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
