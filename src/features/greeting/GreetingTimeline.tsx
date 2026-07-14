'use client';

import { type GreetingContent } from '@/lib/ai/schema';
import { Reveal } from '@/components/motion/Reveal';

interface GreetingTimelineProps {
  data: GreetingContent;
}

export function GreetingTimeline({ data }: GreetingTimelineProps) {
  const milestones = data.timeline || [];

  if (milestones.length === 0) return null;

  return (
    <section className="mx-auto max-w-4xl px-6 py-24 sm:py-32">
      <Reveal direction="up">
        <h2 
          className="mb-20 text-center text-4xl font-bold sm:text-5xl"
          style={{ fontFamily: 'var(--font-display)' }}
        >
          Our Journey
        </h2>
      </Reveal>

      <div className="relative">
        {/* Vertical Line */}
        <div className="absolute left-4 top-0 bottom-0 w-px bg-glass-border sm:left-1/2 sm:-ml-px" />

        <div className="space-y-12 sm:space-y-24">
          {milestones.map((milestone, idx) => {
            const isEven = idx % 2 === 0;
            
            return (
              <div 
                key={idx} 
                className={`relative flex items-center ${
                  isEven ? 'sm:flex-row-reverse' : 'sm:flex-row'
                }`}
              >
                {/* Dot */}
                <div 
                  className="absolute left-4 h-3 w-3 -translate-x-[5.5px] rounded-full sm:left-1/2 sm:-translate-x-1.5"
                  style={{ background: `var(--accent-${data.theme.accent || 'purple'})` }}
                />

                {/* Content */}
                <div className={`w-full pl-12 sm:w-1/2 sm:px-12 ${isEven ? 'sm:text-left' : 'sm:text-right'}`}>
                  <Reveal 
                    direction={isEven ? 'right' : 'left'}
                    delay={0.1}
                    className="flex flex-col gap-2"
                  >
                    <span className="text-sm font-bold uppercase tracking-widest text-fg-muted">
                      {milestone.date}
                    </span>
                    <h3 className="text-xl font-medium leading-relaxed text-foreground sm:text-2xl">
                      {milestone.caption}
                    </h3>
                  </Reveal>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
