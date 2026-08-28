'use client';

import React, { useRef, useEffect, type ReactNode } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

interface ScrollRevealProps {
  children: ReactNode;
  className?: string;
  delay?: number;
  direction?: 'up' | 'down' | 'left' | 'right' | 'scale';
  duration?: number;
  stagger?: number;
}

export function ScrollReveal({
  children,
  className = '',
  delay = 0,
  direction = 'up',
  duration = 0.6,
  stagger = 0,
}: ScrollRevealProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const from: gsap.TweenVars = { opacity: 0, duration, ease: 'power3.out' };

    switch (direction) {
      case 'up':
        from.y = 40;
        break;
      case 'down':
        from.y = -40;
        break;
      case 'left':
        from.x = 40;
        break;
      case 'right':
        from.x = -40;
        break;
      case 'scale':
        from.scale = 0.92;
        break;
    }

    const targets = stagger > 0 ? el.children : el;

    gsap.from(targets, {
      ...from,
      delay,
      stagger: stagger || 0,
      scrollTrigger: {
        trigger: el,
        start: 'top 88%',
        once: true,
      },
    });

    return () => {
      ScrollTrigger.getAll().forEach((t) => t.kill());
    };
  }, [delay, direction, duration, stagger]);

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}

/**
 * Staggered grid — children animate in sequence on scroll.
 */
export function ScrollGrid({
  children,
  className = '',
  columns = 3,
  staggerDelay = 0.08,
}: {
  children: ReactNode;
  className?: string;
  columns?: number;
  staggerDelay?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const items = el.children;
    if (!items.length) return;

    gsap.from(items, {
      opacity: 0,
      y: 30,
      scale: 0.96,
      duration: 0.5,
      ease: 'power3.out',
      stagger: staggerDelay,
      scrollTrigger: {
        trigger: el,
        start: 'top 85%',
        once: true,
      },
    });

    return () => {
      ScrollTrigger.getAll().forEach((t) => t.kill());
    };
  }, [staggerDelay]);

  return (
    <div
      ref={ref}
      className={className}
      style={{ display: 'grid', gridTemplateColumns: `repeat(${columns}, 1fr)` }}
    >
      {children}
    </div>
  );
}
