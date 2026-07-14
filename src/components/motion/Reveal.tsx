'use client';

import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import { duration, ease } from '@/lib/motion';
import { cn } from '@/lib/utils';

type Direction = 'up' | 'down' | 'left' | 'right' | 'none';

interface RevealProps {
  children: React.ReactNode;
  className?: string;
  direction?: Direction;
  delay?: number;
  duration?: number;
  distance?: number;
  once?: boolean;
  /** Viewport margin for triggering (e.g., '-100px') */
  margin?: string;
  /** Scale entrance (0.9 = starts at 90% size) */
  scale?: number;
  /** Blur entrance in pixels */
  blur?: number;
}

const directionOffset: Record<Direction, { x: number; y: number }> = {
  up: { x: 0, y: 1 },
  down: { x: 0, y: -1 },
  left: { x: 1, y: 0 },
  right: { x: -1, y: 0 },
  none: { x: 0, y: 0 },
};

/**
 * Scroll-triggered reveal animation wrapper.
 * Fades in + slides from a direction when the element enters the viewport.
 * Respects prefers-reduced-motion.
 */
export function Reveal({
  children,
  className,
  direction = 'up',
  delay = 0,
  duration: dur = duration.slow,
  distance = 40,
  once = true,
  margin = '-80px',
  scale: scaleStart,
  blur = 0,
}: RevealProps) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once, margin: margin as `${number}px` });
  const prefersReduced = useReducedMotion();

  const offset = directionOffset[direction];

  if (prefersReduced) {
    return (
      <div ref={ref} className={className}>
        {children}
      </div>
    );
  }

  return (
    <motion.div
      ref={ref}
      className={cn(className)}
      initial={{
        opacity: 0,
        x: offset.x * distance,
        y: offset.y * distance,
        scale: scaleStart ?? 1,
        filter: blur > 0 ? `blur(${blur}px)` : undefined,
      }}
      animate={
        isInView
          ? {
              opacity: 1,
              x: 0,
              y: 0,
              scale: 1,
              filter: blur > 0 ? 'blur(0px)' : undefined,
            }
          : undefined
      }
      transition={{
        duration: dur,
        ease: ease.outExpo as [number, number, number, number],
        delay,
      }}
    >
      {children}
    </motion.div>
  );
}
