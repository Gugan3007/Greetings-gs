'use client';

import { motion, useInView, useReducedMotion } from 'framer-motion';
import { useRef } from 'react';

export function WordTrain({ text }: { text: string }) {
  const trackRef = useRef<HTMLSpanElement>(null);
  const isInView = useInView(trackRef, { once: true, margin: '-12% 0px -12% 0px' });
  const prefersReducedMotion = useReducedMotion();
  const words = text.split(/\s+/).filter(Boolean);

  return (
    <span ref={trackRef} className="word-train" aria-label={text}>
      {words.map((word, index) => (
        <motion.span
          aria-hidden="true"
          className="word-train__car"
          key={`${word}-${index}`}
          initial={prefersReducedMotion ? false : { opacity: 0, x: -90 - index * 22, rotate: -2.5 }}
          animate={isInView || prefersReducedMotion ? { opacity: 1, x: 0, rotate: 0 } : undefined}
          transition={{
            duration: 0.72,
            delay: prefersReducedMotion ? 0 : index * 0.075,
            ease: [0.16, 1, 0.3, 1],
          }}
        >
          {word}
          {index < words.length - 1 ? <span className="word-train__coupler" /> : null}
        </motion.span>
      ))}
    </span>
  );
}
