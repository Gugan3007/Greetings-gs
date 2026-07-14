'use client';

import { cn } from '@/lib/utils';

/**
 * Animated aurora/gradient-mesh background.
 * Slow-moving, GPU-friendly, never competes with foreground.
 * Pure CSS — no JS animation loops needed.
 */
export function AuroraBackground({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        'pointer-events-none fixed inset-0 -z-10 overflow-hidden',
        className
      )}
      aria-hidden="true"
    >
      {/* Primary aurora gradient */}
      <div
        className="absolute inset-0 opacity-30"
        style={{
          background:
            'radial-gradient(ellipse 80% 60% at 50% 0%, rgba(124, 58, 237, 0.15) 0%, transparent 60%),' +
            'radial-gradient(ellipse 60% 40% at 80% 50%, rgba(59, 130, 246, 0.1) 0%, transparent 50%),' +
            'radial-gradient(ellipse 50% 50% at 20% 80%, rgba(168, 85, 247, 0.08) 0%, transparent 50%)',
          animation: 'aurora-shift 20s ease-in-out infinite',
          backgroundSize: '200% 200%',
        }}
      />

      {/* Secondary slow-moving glow */}
      <div
        className="absolute -top-1/2 -left-1/2 h-[200%] w-[200%] opacity-20"
        style={{
          background:
            'conic-gradient(from 180deg at 50% 50%, rgba(124, 58, 237, 0.08) 0deg, rgba(59, 130, 246, 0.05) 120deg, rgba(244, 114, 182, 0.04) 240deg, rgba(124, 58, 237, 0.08) 360deg)',
          animation: 'spin 60s linear infinite',
        }}
      />

      {/* Vignette overlay */}
      <div
        className="absolute inset-0"
        style={{
          background:
            'radial-gradient(ellipse at center, transparent 0%, var(--bg) 75%)',
        }}
      />

      <style jsx>{`
        @keyframes spin {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }
      `}</style>
    </div>
  );
}
