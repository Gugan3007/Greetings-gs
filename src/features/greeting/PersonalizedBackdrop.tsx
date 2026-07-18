'use client';

import { motion } from 'framer-motion';
import type { GreetingContent } from '@/lib/ai/schema';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import { buildBackdropMotifs } from './personalized-backdrop';

const archetypeSymbols = {
  romance: ['♡', '✦', 'FLAMES'],
  family: ['⌂', '♡', 'HOME'],
  friendship: ['✦', '∞', 'US'],
  celebration: ['✦', '·', 'JOY'],
  comfort: ['❀', '♡', 'BREATHE'],
  achievement: ['↗', '✦', 'BRAVO'],
};

export function PersonalizedBackdrop({ data }: { data: GreetingContent }) {
  const reducedMotion = useReducedMotion();
  const archetype = data.theme.archetype || 'celebration';
  const motifs = [...buildBackdropMotifs(data), ...archetypeSymbols[archetype]].slice(0, 6);
  const motifText = motifs.join(' ').toLowerCase();
  const glyphs = [
    motifText.includes('paw') || motifText.includes('dog') || motifText.includes('cat') ? '🐾' : null,
    motifText.includes('flower') || motifText.includes('garden') ? '❀' : null,
    motifText.includes('layer') || motifText.includes('porotta') ? '◌' : null,
    motifText.includes('biryani') ? '✦' : null,
    archetype === 'romance' ? '♡' : null,
    archetype === 'family' ? '⌂' : null,
    archetype === 'achievement' ? '↗' : null,
  ].filter(Boolean) as string[];
  const glyphPositions = ['left-[9%] top-[18%]', 'right-[11%] top-[31%]', 'left-[14%] top-[68%]', 'right-[16%] top-[78%]'];

  return (
    <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden" aria-hidden="true">
      <div className="greeting-vignette absolute inset-0" />
      <div className="absolute inset-0">
        {glyphPositions.map((position, index) => (
          <motion.span
            key={`${position}-${index}`}
            data-personalized-glyph={glyphs[index % Math.max(glyphs.length, 1)] || '✦'}
            className={`absolute ${position} text-5xl text-[color:var(--greeting-accent)] opacity-[0.055] sm:text-7xl`}
            animate={reducedMotion ? undefined : { y: [0, index % 2 === 0 ? -12 : 12, 0], rotate: [0, index % 2 === 0 ? -5 : 5, 0] }}
            transition={{ duration: 10 + index * 2, repeat: Infinity, ease: 'easeInOut' }}
          >
            {glyphs[index % Math.max(glyphs.length, 1)] || '✦'}
          </motion.span>
        ))}
      </div>
      <div className="absolute inset-x-0 top-0 h-28 bg-gradient-to-b from-background via-background/70 to-transparent" />
      <div className="absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-background via-background/70 to-transparent" />
    </div>
  );
}
