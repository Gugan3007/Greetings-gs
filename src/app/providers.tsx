'use client';

import { ReactNode } from 'react';
import dynamic from 'next/dynamic';
import { ReactLenis } from 'lenis/react';

// Lazy-load cursor — only on desktop with fine pointer
const CustomCursor = dynamic(
  () =>
    import('@/components/cursor/CustomCursor').then((m) => ({
      default: m.CustomCursor,
    })),
  { ssr: false }
);

/**
 * Client-side providers: Lenis smooth scroll + custom cursor.
 */
export function Providers({ children }: { children: ReactNode }) {
  return (
    <ReactLenis root options={{ lerp: 0.1, duration: 1.2 }}>
      <CustomCursor />
      {children}
    </ReactLenis>
  );
}
