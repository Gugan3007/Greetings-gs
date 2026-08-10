'use client';

import { type GreetingContent } from '@/lib/ai/schema';
import { Reveal } from '@/components/motion/Reveal';

interface GreetingLetterProps {
  data: GreetingContent;
}

export function GreetingLetter({ data }: GreetingLetterProps) {
  if (!data.letter) return null;

  return (
    <section className="greeting-section relative py-20 sm:py-36">
      <Reveal direction="up" duration={0.8} className="relative z-10">
        <div className="mx-auto max-w-3xl rounded-[2rem] border border-glass-border bg-glass-bg p-8 text-center shadow-2xl backdrop-blur-2xl sm:p-14 md:p-16">
          <p 
            className="whitespace-pre-wrap text-lg font-light leading-relaxed text-foreground sm:text-xl sm:leading-loose"
            style={{ fontFamily: 'var(--font-display)' }}
          >
            {data.letter}
          </p>

          {data.closingMessage && (
            <div className="mt-12 text-center">
              <p className="text-xl font-medium italic text-fg-secondary">
                {data.closingMessage}
              </p>
            </div>
          )}
        </div>
      </Reveal>
      
      {/* Background glow for the letter */}
      <div 
        className="absolute left-1/2 top-1/2 -z-10 h-3/4 w-3/4 -translate-x-1/2 -translate-y-1/2 blur-[100px]"
        style={{ background: `var(--accent-${data.theme.accent || 'purple'})`, opacity: 0.15 }}
      />
    </section>
  );
}
