'use client';

import { ReactNode } from 'react';
import dynamic from 'next/dynamic';

// Lazy-load cursor — only on desktop with fine pointer
const CustomCursor = dynamic(
  () =>
    import('@/components/cursor/CustomCursor').then((m) => ({
      default: m.CustomCursor,
    })),
  { ssr: false }
);

/**
 * Client-side providers. Native scrolling is intentionally retained because it
 * is substantially smoother and more reliable in Safari for media-heavy pages.
 */
export function Providers({ children }: { children: ReactNode }) {
  return <><CustomCursor />{children}</>;
}
