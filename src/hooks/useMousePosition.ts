'use client';

import { useEffect, useState, useCallback, useRef } from 'react';

interface MousePosition {
  x: number;
  y: number;
  /** Normalized x position (0 to 1) */
  nx: number;
  /** Normalized y position (0 to 1) */
  ny: number;
}

/**
 * Hook to track mouse position with RAF throttling.
 * Returns normalized and absolute mouse coordinates.
 */
export function useMousePosition(): MousePosition {
  const [position, setPosition] = useState<MousePosition>({
    x: 0,
    y: 0,
    nx: 0.5,
    ny: 0.5,
  });

  const rafId = useRef<number | null>(null);

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (rafId.current !== null) return;
    rafId.current = requestAnimationFrame(() => {
      setPosition({
        x: e.clientX,
        y: e.clientY,
        nx: e.clientX / window.innerWidth,
        ny: e.clientY / window.innerHeight,
      });
      rafId.current = null;
    });
  }, []);

  useEffect(() => {
    window.addEventListener('mousemove', handleMouseMove);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      if (rafId.current !== null) cancelAnimationFrame(rafId.current);
    };
  }, [handleMouseMove]);

  return position;
}
