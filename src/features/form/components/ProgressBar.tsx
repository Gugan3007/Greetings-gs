'use client';

import { motion } from 'framer-motion';

interface ProgressBarProps {
  progress: number; // 0 to 100
  accentColor?: string;
}

/**
 * Animated progress bar with gradient fill.
 */
export function ProgressBar({ progress, accentColor = 'var(--accent-purple)' }: ProgressBarProps) {
  return (
    <div className="relative h-[2px] w-full overflow-hidden bg-glass-border">
      <motion.div
        className="absolute inset-y-0 left-0"
        style={{
          background: `linear-gradient(90deg, ${accentColor}, var(--accent-blue))`,
        }}
        initial={{ width: '0%' }}
        animate={{ width: `${progress}%` }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      />
      {/* Shimmer effect on the progress edge */}
      <motion.div
        className="absolute inset-y-0 w-20"
        style={{
          left: `${progress - 5}%`,
          background: `linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent)`,
        }}
        animate={{ opacity: [0.3, 0.8, 0.3] }}
        transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
      />
    </div>
  );
}
