'use client';

import { type GreetingContent } from '@/lib/ai/schema';
import { Reveal } from '@/components/motion/Reveal';
import { SplitText } from '@/components/motion/SplitText';

interface GreetingNarrativeProps {
  data: GreetingContent;
}

export function GreetingNarrative({ data }: GreetingNarrativeProps) {
  // Split the story by paragraphs for better pacing
  const paragraphs = data.story.split('\n').filter((p) => p.trim().length > 0);
  const quotes = data.quotes || [];

  return (
    <section className="relative mx-auto max-w-3xl px-6 py-24 sm:py-32">
      <div className="space-y-16 sm:space-y-24">
        {paragraphs.map((paragraph, idx) => (
          <div key={idx}>
            <Reveal
              direction="up"
              duration={0.8}
              margin="-30%"
            >
              <p className="text-xl font-light leading-relaxed text-fg-secondary sm:text-2xl sm:leading-loose">
                {paragraph}
              </p>
            </Reveal>

            {/* Interleave a pull quote after certain paragraphs if available */}
            {quotes[idx] && (
              <div className="my-24 py-12">
                <Reveal
                  direction="up"
                  duration={0.8}
                  blur={10}
                  margin="-50%"
                >
                  <blockquote 
                    className="border-l-4 pl-8 italic text-3xl font-medium sm:text-4xl md:text-5xl leading-tight text-foreground"
                    style={{ 
                      borderColor: `var(--accent-${data.theme.accent || 'purple'})`,
                      fontFamily: 'var(--font-display)' 
                    }}
                  >
                    <SplitText
                      mode="words"
                      delay={0.2}
                      duration={0.8}
                    >
                      {quotes[idx]}
                    </SplitText>
                  </blockquote>
                </Reveal>
              </div>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}
