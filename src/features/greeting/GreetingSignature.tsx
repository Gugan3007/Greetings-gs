'use client';

import { Sparkles } from 'lucide-react';
import type { GreetingContent } from '@/lib/ai/schema';
import { Reveal } from '@/components/motion/Reveal';
import { WordTrain } from './WordTrain';

export function GreetingSignature({ data }: { data: GreetingContent }) {
  if (!data.signatureLine && !data.playfulAside) return null;

  return (
    <section className="greeting-section py-20 sm:py-28">
      <Reveal direction="up" blur={8}>
        <div className="greeting-feature mx-auto max-w-4xl overflow-hidden rounded-[2rem] border border-white/10 px-6 py-12 text-center sm:px-12 sm:py-16">
          <div className="mb-6 flex justify-center">
            <Sparkles className="h-5 w-5 text-[color:var(--greeting-accent)]" />
          </div>
          {data.signatureLine ? (
            <p className="mx-auto max-w-3xl font-display text-3xl font-medium leading-tight sm:text-4xl md:text-5xl">
              <WordTrain text={data.signatureLine} />
            </p>
          ) : null}
          {data.playfulAside ? (
            <p className="mx-auto mt-7 max-w-2xl text-sm font-medium uppercase tracking-[0.16em] text-fg-secondary sm:text-base">
              {data.playfulAside}
            </p>
          ) : null}
        </div>
      </Reveal>
    </section>
  );
}
