
"use client";

import { useEffect, useState, useRef, useCallback } from 'react';
import { cn } from '@/lib/utils';
import { useLanguage } from '@/context/language-context';
import { getContent } from '@/lib/content-store';

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
  const animationFrameRef = useRef<number>();
  const startTimeRef = useRef<number>();
  const onProgressRef = useRef(onProgress);

  useEffect(() => {
    onProgressRef.current = onProgress;
  }, [onProgress]);

  const animate = useCallback((timestamp: number) => {
    if (startTimeRef.current === undefined) {
      startTimeRef.current = timestamp;
    }
    const elapsedTime = timestamp - startTimeRef.current;
    const progress = Math.min(elapsedTime / (duration * 1000), 1);
    const easeOutProgress = 1 - Math.pow(1 - progress, 3);
    const currentCount = Math.round(end * easeOutProgress);
    
    setCount(currentCount);
    onProgressRef.current(currentCount / end);

    if (progress < 1) {
      animationFrameRef.current = requestAnimationFrame(animate);
    } else {
      setCount(end); // Ensure it ends on the exact value
    }
  }, [end, duration]);
  
  useEffect(() => {
    if (start) {
      startTimeRef.current = undefined;
      animationFrameRef.current = requestAnimationFrame(animate);
    } else {
      setCount(0);
    }

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [start, animate]);

  return <span>{count.toLocaleString()}</span>;
};

export function MetricsSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [isHovering, setIsHovering] = useState(false);
  const [rotate, setRotate] = useState({ x: 0, y: 0 });
  const [isIntersecting, setIsIntersecting] = useState(false);
  const { translations } = useLanguage();

  const [metrics, setMetrics] = useState<any[]>([]);

  useEffect(() => {
    const loadMetrics = async () => {
        const content = await getContent();
        setMetrics(content.metrics || []);
    };
    loadMetrics();
  }, []);

  const [activeCounters, setActiveCounters] = useState<boolean[]>(new Array(metrics.length).fill(false));

  useEffect(() => {
    setActiveCounters(new Array(metrics.length).fill(false));
  }, [metrics]);


  useEffect(() => {
    if (metrics.length === 0) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsIntersecting(true);
          setActiveCounters(prev => {
              const newActive = [...prev];
              if (!newActive[0]) {
                  newActive[0] = true;
              }
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
  }, [metrics.length]);
  
  useEffect(() => {
  }, [translations]);


  const handleProgress = useCallback((index: number) => (progress: number) => {
    if (progress >= 0.8 && index < metrics.length - 1) {
      setActiveCounters(prev => {
        if (prev[index + 1]) return prev; 
        const newActive = [...prev];
        newActive[index + 1] = true;
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
  
  if (metrics.length === 0) {
      return null; // or a loading skeleton
  }

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
            <p className="text-sm md:text-base text-foreground/70 mt-2 font-body">
                {translations.metrics[metric.labelKey as keyof typeof translations.metrics]}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
