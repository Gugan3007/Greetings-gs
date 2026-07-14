'use client';

import { motion, useInView, useReducedMotion } from 'framer-motion';
import { useRef } from 'react';

import { splitGraphemes } from './letter-rain';

export function LetterRain({ text }: { text: string }) {
  const sentenceRef = useRef<HTMLSpanElement>(null);
  const isInView = useInView(sentenceRef, { once: true, margin: '-12% 0px -12% 0px' });
  const prefersReducedMotion = useReducedMotion();
  const words = text.trim().split(/\s+/).filter(Boolean);

  return (
    <span
      ref={sentenceRef}
      className="letter-rain"
      aria-label={text}
      data-assembled={isInView || prefersReducedMotion ? 'true' : 'false'}
    >
      <span className="letter-rain__cloud" aria-hidden="true">
        <span />
        <span />
        <span />
      </span>

      {words.map((word, wordIndex) => {
        const glyphs = splitGraphemes(word);
        const wordStart = words
          .slice(0, wordIndex)
          .reduce((count, previousWord) => count + splitGraphemes(previousWord).length, 0);

        return (
          <span className="letter-rain__word" aria-hidden="true" key={`${word}-${wordIndex}`}>
            {glyphs.map((glyph, glyphIndex) => {
              const index = wordStart + glyphIndex;
              return (
                <motion.span
                  className="letter-rain__glyph"
                  key={`${glyph}-${index}`}
                  initial={prefersReducedMotion ? false : {
                    opacity: 0,
                    y: -90 - (index % 5) * 28,
                    x: ((index % 7) - 3) * 9,
                    rotate: ((index % 5) - 2) * 4,
                  }}
                  animate={isInView || prefersReducedMotion ? {
                    opacity: 1,
                    y: 0,
                    x: 0,
                    rotate: 0,
                  } : undefined}
                  transition={prefersReducedMotion ? { duration: 0 } : {
                    delay: index * 0.035,
                    type: 'spring',
                    stiffness: 115,
                    damping: 16,
                    mass: 0.7,
                  }}
                >
                  {glyph}
                </motion.span>
              );
            })}
          </span>
        );
      })}
    </span>
  );
}
