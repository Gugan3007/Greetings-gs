'use client';

import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import { duration, ease, stagger as staggerConfig } from '@/lib/motion';
import { cn } from '@/lib/utils';

type SplitMode = 'characters' | 'words' | 'lines';

interface SplitTextProps {
  children: string;
  className?: string;
  /** How to split the text */
  mode?: SplitMode;
  /** Delay before animation starts */
  delay?: number;
  /** Duration per element */
  duration?: number;
  /** Stagger between elements */
  stagger?: number;
  /** Apply gradient text effect */
  gradient?: boolean;
  /** Warm gradient instead of primary */
  warmGradient?: boolean;
  /** HTML tag to render as */
  as?: 'h1' | 'h2' | 'h3' | 'h4' | 'p' | 'span' | 'div';
  /** Direction to animate from */
  direction?: 'up' | 'down';
  /** Trigger animation (default: true) */
  animate?: boolean;
}

/**
 * Split text animation — reveals text character by character or word by word.
 * Supports gradient text effect. Respects reduced motion.
 */
const motionElements = {
  h1: motion.h1,
  h2: motion.h2,
  h3: motion.h3,
  h4: motion.h4,
  p: motion.p,
  span: motion.span,
  div: motion.div,
};

export function SplitText({
  children,
  className,
  mode = 'characters',
  delay = 0,
  duration: dur = duration.normal,
  stagger: staggerDelay,
  gradient = false,
  warmGradient = false,
  as: Tag = 'div',
  direction = 'up',
  animate: shouldAnimate = true,
}: SplitTextProps) {
  const prefersReduced = useReducedMotion();

  const defaultStagger =
    mode === 'characters'
      ? staggerConfig.character
      : mode === 'words'
        ? staggerConfig.word
        : staggerConfig.item;

  const actualStagger = staggerDelay ?? defaultStagger;

  const elements = useMemo(() => {
    if (mode === 'characters') {
      return children.split('').map((char, i) => ({
        key: `${char}-${i}`,
        content: char === ' ' ? '\u00A0' : char,
      }));
    }
    if (mode === 'words') {
      return children.split(' ').map((word, i) => ({
        key: `${word}-${i}`,
        content: word,
      }));
    }
    // lines
    return children.split('\n').map((line, i) => ({
      key: `${line}-${i}`,
      content: line,
    }));
  }, [children, mode]);

  const yOffset = direction === 'up' ? 30 : -30;

  if (prefersReduced) {
    return (
      <Tag
        className={cn(
          className,
          gradient && 'text-gradient',
          warmGradient && 'text-gradient-warm'
        )}
      >
        {children}
      </Tag>
    );
  }

  const MotionTag = motionElements[Tag as keyof typeof motionElements] || motion.div;

  return (
    <MotionTag
      className={cn(
        'overflow-hidden',
        gradient && 'text-gradient',
        warmGradient && 'text-gradient-warm',
        className
      )}
      aria-label={children}
    >
      {elements.map((el, i) => (
        <motion.span
          key={el.key}
          className="inline-block"
          initial={{ opacity: 0, y: yOffset }}
          animate={
            shouldAnimate
              ? { opacity: 1, y: 0 }
              : { opacity: 0, y: yOffset }
          }
          transition={{
            duration: dur,
            ease: ease.outExpo as [number, number, number, number],
            delay: delay + i * actualStagger,
          }}
          aria-hidden="true"
        >
          {el.content}
          {mode === 'words' && i < elements.length - 1 && '\u00A0'}
        </motion.span>
      ))}
    </MotionTag>
  );
}
