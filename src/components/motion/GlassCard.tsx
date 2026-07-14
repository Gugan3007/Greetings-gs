'use client';

import { type ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface GlassCardProps {
  children: ReactNode;
  className?: string;
  /** Animated gradient border */
  animatedBorder?: boolean;
  /** Hover lift effect */
  hover?: boolean;
  /** Padding preset */
  padding?: 'sm' | 'md' | 'lg';
  as?: 'div' | 'article' | 'section';
}

const paddingMap = {
  sm: 'p-4',
  md: 'p-6',
  lg: 'p-8 md:p-10',
};

/**
 * Glassmorphism card with optional animated gradient border.
 * Premium glass effect with backdrop blur.
 */
export function GlassCard({
  children,
  className,
  animatedBorder = false,
  hover = true,
  padding = 'md',
  as: Tag = 'div',
}: GlassCardProps) {
  return (
    <Tag
      className={cn(
        'glass rounded-[var(--radius-lg)]',
        paddingMap[padding],
        hover && [
          'transition-all duration-300',
          'hover:shadow-[0_10px_50px_rgba(168,85,247,0.08)]',
          'hover:-translate-y-1',
          'hover:border-[rgba(255,255,255,0.12)]',
        ],
        animatedBorder && 'animated-border',
        className
      )}
    >
      {children}
    </Tag>
  );
}
