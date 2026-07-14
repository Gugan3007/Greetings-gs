'use client';

import { useRef, useState, type ReactNode } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';
import { useFinePointer } from '@/hooks/useMediaQuery';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import { cn } from '@/lib/utils';

interface MagneticButtonProps {
  children: ReactNode;
  className?: string;
  /** How strong the magnetic pull is (pixels) */
  strength?: number;
  /** Scale on hover */
  hoverScale?: number;
  /** Scale on press */
  pressScale?: number;
  onClick?: () => void;
  as?: 'button' | 'a' | 'div';
  href?: string;
  type?: 'button' | 'submit' | 'reset';
  disabled?: boolean;
  'aria-label'?: string;
}

const motionElements = {
  button: motion.button,
  a: motion.a,
  div: motion.div,
};

/**
 * Magnetic button — pulls toward the cursor on proximity with spring physics.
 * Falls back to normal button on touch devices.
 */
export function MagneticButton({
  children,
  className,
  strength = 30,
  hoverScale = 1.02,
  pressScale = 0.97,
  onClick,
  as: Tag = 'button',
  href,
  type = 'button',
  disabled,
  'aria-label': ariaLabel,
}: MagneticButtonProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);
  const hasFine = useFinePointer();
  const prefersReduced = useReducedMotion();

  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const springX = useSpring(x, { stiffness: 150, damping: 15, mass: 0.5 });
  const springY = useSpring(y, { stiffness: 150, damping: 15, mass: 0.5 });

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!ref.current || !hasFine || prefersReduced) return;
    const rect = ref.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    const deltaX = (e.clientX - centerX) / (rect.width / 2);
    const deltaY = (e.clientY - centerY) / (rect.height / 2);

    x.set(deltaX * strength);
    y.set(deltaY * strength);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    x.set(0);
    y.set(0);
  };

  const MotionTag = motionElements[Tag as keyof typeof motionElements] || motion.button;

  const motionProps = {
    ref,
    className: cn(
      'relative inline-flex items-center justify-center cursor-pointer',
      'transition-shadow duration-300',
      disabled && 'opacity-50 pointer-events-none',
      className
    ),
    style: hasFine && !prefersReduced ? { x: springX, y: springY } : undefined,
    onMouseMove: handleMouseMove,
    onMouseEnter: () => setIsHovered(true),
    onMouseLeave: handleMouseLeave,
    onClick,
    whileHover: prefersReduced ? undefined : { scale: hoverScale },
    whileTap: prefersReduced ? undefined : { scale: pressScale },
    'aria-label': ariaLabel,
    'data-magnetic': true,
    ...(Tag === 'button' ? { type, disabled } : {}),
    ...(Tag === 'a' ? { href } : {}),
  };

  return (
    // @ts-expect-error - dynamic tag motion component
    <MotionTag {...motionProps}>
      <motion.span
        className="relative z-10 flex items-center gap-2"
        animate={
          isHovered && hasFine && !prefersReduced
            ? { scale: 1.05 }
            : { scale: 1 }
        }
        transition={{ type: 'spring', stiffness: 300, damping: 20 }}
      >
        {children}
      </motion.span>
    </MotionTag>
  );
}
