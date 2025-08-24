"use client";

import React, { useRef, useEffect, useState } from 'react';

type ScrollAnimationWrapperProps = {
  children: React.ReactNode;
  className?: string;
};

export const ScrollAnimationWrapper = ({ children, className }: ScrollAnimationWrapperProps) => {
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
      {
        rootMargin: '0px 0px -50px 0px',
      }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => {
      if (ref.current) {
        observer.unobserve(ref.current);
      }
    };
  }, []);

  return (
    <div ref={ref} data-in-view={inView} className={className}>
      {children}
    </div>
  );
};
