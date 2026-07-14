'use client';

import { useCallback, useSyncExternalStore } from 'react';

/**
 * Hook to detect media query matches reactively.
 */
export function useMediaQuery(query: string): boolean {
  const subscribe = useCallback((notify: () => void) => {
    const media = window.matchMedia(query);
    media.addEventListener('change', notify);
    return () => media.removeEventListener('change', notify);
  }, [query]);

  const getSnapshot = useCallback(() => window.matchMedia(query).matches, [query]);
  return useSyncExternalStore(subscribe, getSnapshot, () => false);
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
