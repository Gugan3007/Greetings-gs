'use client';

import { motion } from 'framer-motion';
import type { GreetingContent } from '@/lib/ai/schema';
import { useReducedMotion } from '@/hooks/useReducedMotion';

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
  const motifs = [...(data.theme.motifs || []), ...archetypeSymbols[archetype]].slice(0, 8);
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
      <div className="absolute inset-y-0 left-0 hidden w-[18vw] min-w-40 border-r border-white/[0.035] xl:block">
        <div className="flex h-full flex-col items-center justify-around py-24">
          {motifs.filter((_, index) => index % 2 === 0).map((motif, index) => (
            <motion.span
              key={`${motif}-${index}`}
              className="max-w-36 -rotate-90 whitespace-nowrap text-[11px] font-semibold uppercase tracking-[0.32em] text-[color:var(--greeting-accent)] opacity-20"
              animate={reducedMotion ? undefined : { y: [0, -10, 0], opacity: [0.12, 0.28, 0.12] }}
              transition={{ duration: 7 + index, repeat: Infinity, ease: 'easeInOut' }}
            >
              {motif}
            </motion.span>
          ))}
        </div>
      </div>
      <div className="absolute inset-y-0 right-0 hidden w-[18vw] min-w-40 border-l border-white/[0.035] xl:block">
        <div className="flex h-full flex-col items-center justify-around py-24">
          {motifs.filter((_, index) => index % 2 === 1).map((motif, index) => (
            <motion.span
              key={`${motif}-${index}`}
              className="max-w-36 rotate-90 whitespace-nowrap text-[11px] font-semibold uppercase tracking-[0.32em] text-[color:var(--greeting-accent)] opacity-20"
              animate={reducedMotion ? undefined : { y: [0, 10, 0], opacity: [0.12, 0.28, 0.12] }}
              transition={{ duration: 8 + index, repeat: Infinity, ease: 'easeInOut' }}
            >
              {motif}
            </motion.span>
          ))}
        </div>
      </div>
    </div>
  );
}
