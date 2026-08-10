'use client';

import { useMemo } from 'react';
import { motion } from 'framer-motion';
import type { GreetingContent } from '@/lib/ai/schema';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import { buildPersonalizedScene } from './personalized-scene';

export function PersonalizedBackdrop({
  data,
  isMusicPlaying = false,
}: {
  data: GreetingContent;
  isMusicPlaying?: boolean;
}) {
  const reducedMotion = useReducedMotion();
  const scene = useMemo(() => buildPersonalizedScene(data), [data]);

  return (
    <div
      className="pointer-events-none fixed inset-0 z-0 overflow-hidden"
      data-music-playing={isMusicPlaying ? 'true' : 'false'}
      aria-hidden="true"
    >
      <div className="greeting-vignette absolute inset-0" />
      <motion.div
        className="absolute left-1/2 top-1/2 h-[52rem] w-[52rem] -translate-x-1/2 -translate-y-1/2 rounded-full blur-3xl"
        style={{
          background: `radial-gradient(circle, ${scene.palette[0]}1f 0%, ${scene.palette[1]}0d 36%, transparent 68%)`,
        }}
        animate={reducedMotion || !isMusicPlaying ? undefined : { scale: [0.92, 1.08, 0.92], opacity: [0.5, 0.85, 0.5] }}
        transition={{ duration: 2.8, repeat: Infinity, ease: 'easeInOut' }}
      />
      <div className="absolute inset-0 opacity-90">
        {scene.motifs.map((item, index) => (
          <motion.span
            key={item.id}
            data-personalized-glyph={item.glyph}
            data-personalized-family={item.family}
            className={`absolute ${item.className} select-none text-4xl font-light opacity-[0.09] sm:text-6xl`}
            style={{
              color: scene.palette[index % scene.palette.length],
              textShadow: `0 0 34px ${scene.palette[index % scene.palette.length]}55`,
            }}
            animate={reducedMotion ? undefined : {
              y: [0, item.drift * (isMusicPlaying ? 1.35 : 1), 0],
              x: [0, index % 2 === 0 ? 8 : -8, 0],
              rotate: [0, index % 2 === 0 ? -7 : 7, 0],
              scale: isMusicPlaying ? [1, 1.12, 1] : [1, 1.04, 1],
            }}
            transition={{
              duration: isMusicPlaying ? Math.max(5.5, item.duration * 0.7) : item.duration,
              delay: item.delay,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          >
            {item.glyph}
          </motion.span>
        ))}
      </div>
      <div className="absolute inset-x-0 top-0 h-28 bg-gradient-to-b from-background via-background/70 to-transparent" />
      <div className="absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-background via-background/70 to-transparent" />
    </div>
  );
}
