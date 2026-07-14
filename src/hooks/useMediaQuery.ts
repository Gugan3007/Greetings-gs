'use client';

import { useEffect, useState } from 'react';

/**
 * Hook to detect media query matches reactively.
 */
export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    const mql = window.matchMedia(query);
    setMatches(mql.matches);

    const handler = (e: MediaQueryListEvent) => setMatches(e.matches);
    mql.addEventListener('change', handler);
    return () => mql.removeEventListener('change', handler);
  }, [query]);

  return matches;
}

/**
 * Convenience: returns true if device has a fine pointer (mouse/trackpad).
 */
export function useFinePointer(): boolean {
  return useMediaQuery('(pointer: fine)');
}

/**
 * Convenience: returns true if viewport is mobile-sized.
 */
export function useIsMobile(): boolean {
  return useMediaQuery('(max-width: 768px)');
}
