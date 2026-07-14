'use client';

import { type GreetingContent } from '@/lib/ai/schema';
import { GlassCard } from '@/components/motion/GlassCard';
import { Reveal } from '@/components/motion/Reveal';

interface GreetingHighlightsProps {
  data: GreetingContent;
}

export function GreetingHighlights({ data }: GreetingHighlightsProps) {
  const highlights = data.memoryHighlights || [];

  if (highlights.length === 0) return null;

  return (
    <section className="mx-auto max-w-5xl px-6 py-24 sm:py-32">
      <Reveal direction="up">
        <h2 
          className="mb-16 text-center text-4xl font-bold sm:text-5xl"
          style={{ fontFamily: 'var(--font-display)' }}
        >
          The Little Things
        </h2>
      </Reveal>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {highlights.map((highlight, idx) => {
          // Make some cards span 2 columns if we have an odd number, for a bento feel
          const isLarge = highlights.length % 2 !== 0 && idx === 0;

          return (
            <Reveal
              key={idx}
              scale={0.9}
              direction="up"
              delay={idx * 0.1}
              className={isLarge ? 'sm:col-span-2 lg:col-span-2' : ''}
            >
              <GlassCard 
                className="flex h-full flex-col justify-center p-8 sm:p-10"
                hover={true}
              >
                {highlight.emoji && (
                  <span className="mb-4 text-4xl">{highlight.emoji}</span>
                )}
                <h3 className="mb-2 text-xl font-bold text-foreground">
                  {highlight.title}
                </h3>
                <p className="text-sm font-medium leading-relaxed text-fg-secondary sm:text-base">
                  {highlight.description}
                </p>
              </GlassCard>
            </Reveal>
          );
        })}
      </div>
    </section>
  );
}
