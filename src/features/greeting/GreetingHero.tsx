'use client';

import { motion } from 'framer-motion';
import { type GreetingContent } from '@/lib/ai/schema';
import { AuroraBackground } from '@/components/backgrounds/AuroraBackground';
import { ParticleField } from '@/components/backgrounds/ParticleField';
import { SplitText } from '@/components/motion/SplitText';
import { duration, ease } from '@/lib/motion';
import { ChevronDown } from 'lucide-react';

interface GreetingHeroProps {
  data: GreetingContent;
}

export function GreetingHero({ data }: GreetingHeroProps) {
  // Determine gradient colors based on theme accent
  const accentColors = {
    purple: ['#a855f7', '#3b82f6'],
    blue: ['#3b82f6', '#0ea5e9'],
    roseGold: ['#f43f5e', '#fbd38d'],
  };

  const [color1, color2] = accentColors[data.theme.accent] || accentColors.purple;

  return (
    <section className="relative flex min-h-[100svh] w-full flex-col items-center justify-center overflow-hidden">
      {/* Backgrounds */}
      <div className="absolute inset-0 z-0">
        <AuroraBackground />
      </div>
      
      {/* Optional Particle Field based on density */}
      {data.theme.density === 'luxury' && (
        <div className="absolute inset-0 z-0 opacity-50 mix-blend-screen">
          <ParticleField />
        </div>
      )}

      {/* Content */}
      <div className="relative z-10 flex w-full max-w-5xl flex-col items-center justify-center px-6 text-center">
        {/* Pre-heading */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: duration.normal, ease: ease.outExpo, delay: 0.2 }}
          className="mb-6 text-sm font-medium tracking-[0.2em] uppercase text-fg-secondary"
        >
          A Celebration For
        </motion.p>

        {/* Name */}
        <h1 
          className="mb-8 text-6xl font-bold tracking-tighter sm:text-8xl lg:text-9xl"
          style={{ fontFamily: 'var(--font-display)' }}
        >
          <SplitText
            mode="characters"
            delay={0.4}
            duration={0.8}
          >
            {data.recipientName}
          </SplitText>
        </h1>

        {/* Hero Headline */}
        <motion.p
          initial={{ opacity: 0, y: 20, filter: 'blur(10px)' }}
          animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
          transition={{ duration: duration.slow, ease: ease.outExpo, delay: 1 }}
          className="max-w-2xl text-xl font-light leading-relaxed text-fg-secondary sm:text-2xl md:text-3xl"
        >
          {data.heroHeadline}
        </motion.p>
      </div>

      {/* Scroll Indicator */}
      <motion.div
        className="absolute bottom-10 left-1/2 flex -translate-x-1/2 flex-col items-center gap-2"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2, duration: duration.normal }}
      >
        <span className="text-xs tracking-widest text-fg-muted uppercase">Scroll</span>
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
        >
          <ChevronDown className="h-4 w-4 text-fg-muted" />
        </motion.div>
      </motion.div>
    </section>
  );
}
