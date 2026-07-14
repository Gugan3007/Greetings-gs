'use client';

import type { GreetingContent } from '@/lib/ai/schema';
import { Reveal } from '@/components/motion/Reveal';

export function GreetingDedication({ data }: { data: GreetingContent }) {
  return (
    <section className="greeting-section py-20 sm:py-28" aria-label="Greeting dedication">
      <Reveal direction="up" blur={8}>
        <div className="dedication-card mx-auto max-w-3xl rounded-[2rem] px-6 py-14 text-center sm:px-12 sm:py-20">
          <p className="text-xs font-semibold uppercase tracking-[0.32em] text-fg-tertiary">Written from the heart</p>
          <p className="font-signature mt-5 text-4xl text-foreground sm:text-5xl">For {data.recipientName}</p>
          <span className="dedication-card__thread mx-auto my-9 block" aria-hidden="true" />
          <p className="text-[0.65rem] font-semibold uppercase tracking-[0.3em] text-fg-tertiary">Presented with love by</p>
          <p className="font-signature mt-4 text-3xl text-[color:var(--greeting-accent)] sm:text-4xl">
            {data.presentedBy || 'Someone who cares deeply'}
          </p>
        </div>
      </Reveal>
    </section>
  );
}
