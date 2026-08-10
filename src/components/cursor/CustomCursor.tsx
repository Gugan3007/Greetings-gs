'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';
import { useFinePointer, useIsSafari } from '@/hooks/useMediaQuery';
import { useReducedMotion } from '@/hooks/useReducedMotion';

type CursorVariant = 'default' | 'link' | 'button' | 'text' | 'image';

/**
 * Custom cursor that replaces the default pointer on desktop.
 * Morphs shape based on what it's hovering over.
 * Disabled entirely on touch devices.
 */
export function CustomCursor() {
  const hasFine = useFinePointer();
  const isSafari = useIsSafari();
  const prefersReduced = useReducedMotion();
  const [variant, setVariant] = useState<CursorVariant>('default');
  const [isVisible, setIsVisible] = useState(false);
  const trailRef = useRef<HTMLDivElement>(null);

  const cursorX = useMotionValue(0);
  const cursorY = useMotionValue(0);
  const trailX = useSpring(cursorX, { stiffness: 300, damping: 28, mass: 0.5 });
  const trailY = useSpring(cursorY, { stiffness: 300, damping: 28, mass: 0.5 });

  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      cursorX.set(e.clientX);
      cursorY.set(e.clientY);
      if (!isVisible) setIsVisible(true);
    },
    [cursorX, cursorY, isVisible]
  );

  const handleMouseLeave = useCallback(() => {
    setIsVisible(false);
  }, []);

  const handleMouseEnter = useCallback(() => {
    setIsVisible(true);
  }, []);

  useEffect(() => {
    if (!hasFine || prefersReduced || isSafari) return;

    // Hide default cursor globally
    document.body.style.cursor = 'none';

    window.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseleave', handleMouseLeave);
    document.addEventListener('mouseenter', handleMouseEnter);

    // Detect hoverable elements to morph cursor
    const handleElementHover = (e: Event) => {
      const target = e.target as HTMLElement;
      if (!target) return;

      if (
        target.closest('a') ||
        target.closest('[data-cursor="link"]')
      ) {
        setVariant('link');
      } else if (
        target.closest('button') ||
        target.closest('[data-cursor="button"]') ||
        target.closest('[data-magnetic]')
      ) {
        setVariant('button');
      } else if (
        target.closest('[data-cursor="text"]') ||
        target.tagName === 'INPUT' ||
        target.tagName === 'TEXTAREA'
      ) {
        setVariant('text');
      } else if (target.closest('[data-cursor="image"]')) {
        setVariant('image');
      } else {
        setVariant('default');
      }
    };

    document.addEventListener('mouseover', handleElementHover);

    return () => {
      document.body.style.cursor = '';
      window.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseleave', handleMouseLeave);
      document.removeEventListener('mouseenter', handleMouseEnter);
      document.removeEventListener('mouseover', handleElementHover);
    };
  }, [hasFine, prefersReduced, isSafari, handleMouseMove, handleMouseLeave, handleMouseEnter]);

  // Don't render on touch devices or reduced motion
  if (!hasFine || prefersReduced || isSafari) return null;

  const cursorSize = {
    default: 12,
    link: 48,
    button: 56,
    text: 2,
    image: 64,
  };

  const size = cursorSize[variant];

  return (
    <>
      {/* Main cursor dot */}
      <motion.div
        className="custom-cursor-layer pointer-events-none fixed top-0 left-0 z-[10000] mix-blend-difference"
        style={{
          x: cursorX,
          y: cursorY,
          translateX: '-50%',
          translateY: '-50%',
        }}
        animate={{
          width: size,
          height: size,
          borderRadius: variant === 'text' ? '1px' : '50%',
          opacity: isVisible ? 1 : 0,
        }}
        transition={{
          width: { type: 'spring', stiffness: 400, damping: 28 },
          height: { type: 'spring', stiffness: 400, damping: 28 },
          opacity: { duration: 0.15 },
        }}
      >
        <div
          className="h-full w-full rounded-full"
          style={{
            background:
              variant === 'default'
                ? '#fff'
                : variant === 'text'
                  ? '#fff'
                  : 'rgba(255, 255, 255, 0.1)',
            border:
              variant === 'link' || variant === 'button' || variant === 'image'
                ? '1px solid rgba(255, 255, 255, 0.5)'
                : 'none',
            borderRadius: variant === 'text' ? '1px' : '50%',
          }}
        />
      </motion.div>

      {/* Trail / glow */}
      <motion.div
        ref={trailRef}
        className="custom-cursor-layer pointer-events-none fixed top-0 left-0 z-[9999]"
        style={{
          x: trailX,
          y: trailY,
          translateX: '-50%',
          translateY: '-50%',
          width: 40,
          height: 40,
        }}
        animate={{
          opacity: isVisible ? 0.15 : 0,
        }}
        transition={{ opacity: { duration: 0.3 } }}
      >
        <div
          className="h-full w-full rounded-full"
          style={{
            background:
              'radial-gradient(circle, rgba(168, 85, 247, 0.4) 0%, transparent 70%)',
          }}
        />
      </motion.div>
    </>
  );
}
