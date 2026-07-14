'use client';

import { useCallback, useRef, type ReactNode, type MouseEvent } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { useReducedMotion } from '@/hooks/useReducedMotion';

interface RippleButtonProps {
  children: ReactNode;
  className?: string;
  onClick?: () => void;
  type?: 'button' | 'submit' | 'reset';
  disabled?: boolean;
  variant?: 'primary' | 'secondary' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  'aria-label'?: string;
}

const variantStyles = {
  primary: [
    'bg-gradient-to-r from-accent-purple to-accent-blue',
    'text-white font-semibold',
    'shadow-lg shadow-accent-purple/20',
    'hover:shadow-xl hover:shadow-accent-purple/30',
  ],
  secondary: [
    'bg-glass-bg border border-glass-border',
    'text-fg-secondary hover:text-foreground',
    'backdrop-blur-md',
  ],
  ghost: [
    'bg-transparent',
    'text-fg-secondary hover:text-foreground',
    'hover:bg-white/5',
  ],
};

const sizeStyles = {
  sm: 'px-4 py-2 text-sm rounded-[var(--radius-md)]',
  md: 'px-6 py-3 text-base rounded-[var(--radius-lg)]',
  lg: 'px-8 py-4 text-lg rounded-[var(--radius-xl)]',
};

/**
 * Button with click ripple feedback, hover lift, and press scale.
 * Multiple visual variants and sizes.
 */
export function RippleButton({
  children,
  className,
  onClick,
  type = 'button',
  disabled = false,
  variant = 'primary',
  size = 'md',
  'aria-label': ariaLabel,
}: RippleButtonProps) {
  const buttonRef = useRef<HTMLButtonElement>(null);
  const prefersReduced = useReducedMotion();

  const handleClick = useCallback(
    (e: MouseEvent<HTMLButtonElement>) => {
      if (prefersReduced) {
        onClick?.();
        return;
      }

      const button = buttonRef.current;
      if (!button) return;

      const rect = button.getBoundingClientRect();
      const ripple = document.createElement('span');
      const size = Math.max(rect.width, rect.height);
      const x = e.clientX - rect.left - size / 2;
      const y = e.clientY - rect.top - size / 2;

      ripple.style.cssText = `
        position: absolute;
        width: ${size}px;
        height: ${size}px;
        left: ${x}px;
        top: ${y}px;
        background: radial-gradient(circle, rgba(255,255,255,0.3) 0%, transparent 70%);
        border-radius: 50%;
        transform: scale(0);
        animation: ripple-expand 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        pointer-events: none;
        z-index: 0;
      `;

      button.appendChild(ripple);
      setTimeout(() => ripple.remove(), 600);

      onClick?.();
    },
    [onClick, prefersReduced]
  );

  return (
    <>
      <style jsx global>{`
        @keyframes ripple-expand {
          to {
            transform: scale(2.5);
            opacity: 0;
          }
        }
      `}</style>
      <motion.button
        ref={buttonRef}
        type={type}
        disabled={disabled}
        className={cn(
          'relative overflow-hidden inline-flex items-center justify-center',
          'font-medium transition-all duration-300 cursor-pointer',
          'focus-visible:ring-2 focus-visible:ring-accent-purple focus-visible:ring-offset-2 focus-visible:ring-offset-background',
          variantStyles[variant],
          sizeStyles[size],
          disabled && 'opacity-50 pointer-events-none',
          className
        )}
        onClick={handleClick}
        whileHover={prefersReduced ? undefined : { scale: 1.02, y: -2 }}
        whileTap={prefersReduced ? undefined : { scale: 0.97 }}
        aria-label={ariaLabel}
      >
        <span className="relative z-10 flex items-center gap-2">{children}</span>
      </motion.button>
    </>
  );
}
