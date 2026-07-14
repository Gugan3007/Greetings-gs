'use client';

import { cn } from '@/lib/utils';

/**
 * Floating soft-glow orbs background.
 * Slow CSS animation, very low opacity, adds depth without competing.
 */
export function FloatingOrbs({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        'pointer-events-none fixed inset-0 -z-10 overflow-hidden',
        className
      )}
      aria-hidden="true"
    >
      {/* Purple orb — top right */}
      <div
        className="absolute -top-32 -right-32 h-[500px] w-[500px] rounded-full opacity-[0.06]"
        style={{
          background: 'radial-gradient(circle, var(--accent-purple) 0%, transparent 70%)',
          animation: 'float 25s ease-in-out infinite',
        }}
      />

      {/* Blue orb — center left */}
      <div
        className="absolute top-1/3 -left-48 h-[600px] w-[600px] rounded-full opacity-[0.04]"
        style={{
          background: 'radial-gradient(circle, var(--accent-blue) 0%, transparent 70%)',
          animation: 'float-delayed 30s ease-in-out infinite',
        }}
      />

      {/* Rose orb — bottom right */}
      <div
        className="absolute -bottom-32 right-1/4 h-[400px] w-[400px] rounded-full opacity-[0.05]"
        style={{
          background: 'radial-gradient(circle, var(--accent-rose) 0%, transparent 70%)',
          animation: 'float 35s ease-in-out infinite reverse',
        }}
      />

      {/* Small accent orb */}
      <div
        className="absolute top-2/3 right-1/3 h-[200px] w-[200px] rounded-full opacity-[0.04]"
        style={{
          background: 'radial-gradient(circle, var(--accent-purple-light) 0%, transparent 70%)',
          animation: 'pulse-glow 8s ease-in-out infinite',
        }}
      />
    </div>
  );
}
