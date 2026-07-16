'use client';

import { motion } from 'framer-motion';
import { Sparkles } from 'lucide-react';
import type { GreetingContent } from '@/lib/ai/schema';
import { Reveal } from '@/components/motion/Reveal';

export function GreetingPersonalDetails({ data }: { data: GreetingContent }) {
  const details = data.personalizedDetails || [];

  if (details.length === 0) return null;

  return (
    <section className="greeting-section py-20 sm:py-32" aria-label="Personalized details">
      <Reveal direction="up">
        <div className="mx-auto mb-12 max-w-3xl text-center">
          <p className="mb-4 text-xs font-semibold uppercase tracking-[0.28em] text-[color:var(--greeting-accent)]">
            Every Detail Woven In
          </p>
          <h2 className="font-display text-4xl font-bold text-balance sm:text-5xl">
            Nothing you shared was left outside the story.
          </h2>
        </div>
      </Reveal>

      <div className="mx-auto grid max-w-5xl gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {details.map((detail, index) => (
          <Reveal key={`${detail.field}-${index}`} direction="up" delay={Math.min(index * 0.035, 0.5)}>
            <motion.article
              className="group relative h-full overflow-hidden rounded-[1.5rem] border border-white/10 bg-white/[0.035] p-5 text-left shadow-[0_18px_70px_rgba(0,0,0,0.22)] backdrop-blur-xl"
              whileHover={{ y: -5, scale: 1.01 }}
              transition={{ type: 'spring', stiffness: 260, damping: 22 }}
            >
              <div className="mb-4 flex items-center gap-3">
                <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[color:var(--greeting-accent)]/15 text-[color:var(--greeting-accent)]">
                  <Sparkles className="h-4 w-4" />
                </span>
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-fg-tertiary">
                  {detail.label}
                </p>
              </div>
              <p className="text-sm font-medium leading-relaxed text-fg-secondary sm:text-base">
                {detail.line}
              </p>
              <span className="pointer-events-none absolute inset-x-5 bottom-0 h-px bg-gradient-to-r from-transparent via-[color:var(--greeting-accent)]/60 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
            </motion.article>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
