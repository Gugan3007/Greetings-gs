'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Brain, Palette, LayoutGrid, PartyPopper } from 'lucide-react';
import confetti from 'canvas-confetti';

import { AuroraBackground } from '@/components/backgrounds/AuroraBackground';
import { FloatingOrbs } from '@/components/backgrounds/FloatingOrbs';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import { duration, ease } from '@/lib/motion';

// ─── Stage Configuration ─────────────────────────────────────────────────────

const STAGES = [
  {
    id: 'reading',
    label: 'Reading your memories',
    sublabel: 'Absorbing every word you shared...',
    icon: Sparkles,
    color: 'var(--accent-purple)',
    duration: 3000,
  },
  {
    id: 'understanding',
    label: 'Understanding who they are',
    sublabel: 'Building a picture of someone amazing...',
    icon: Brain,
    color: 'var(--accent-blue)',
    duration: 4000,
  },
  {
    id: 'styling',
    label: 'Choosing colors & mood',
    sublabel: 'Picking the perfect palette to match...',
    icon: Palette,
    color: 'var(--accent-rose)',
    duration: 3000,
  },
  {
    id: 'building',
    label: 'Building the experience',
    sublabel: 'Crafting every detail with care...',
    icon: LayoutGrid,
    color: 'var(--accent-purple)',
    duration: 4000,
  },
  {
    id: 'finishing',
    label: 'Adding final touches',
    sublabel: 'A little sparkle goes a long way...',
    icon: PartyPopper,
    color: 'var(--accent-blue)',
    duration: 2000,
  },
];

const MICRO_COPY = [
  'Teaching the site to smile...',
  'Adding a little sparkle...',
  'Folding memories into pixels...',
  'Making sure every word counts...',
  'Choosing the perfect moment...',
  'Turning feelings into art...',
  'Almost there, just a bit more magic...',
];

/**
 * AI Processing Screen — replaces a loading spinner with a
 * themed 5-stage animated sequence tied to real backend status.
 */
export function ProcessingScreen() {
  const [currentStage, setCurrentStage] = useState(0);
  const [progress, setProgress] = useState(0);
  const [microCopy, setMicroCopy] = useState(MICRO_COPY[0]);
  const [isComplete, setIsComplete] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const prefersReduced = useReducedMotion();
  const microCopyIndex = useRef(0);
  const hasStarted = useRef(false);

  // Simulate stage progression while waiting for API
  useEffect(() => {
    if (hasStarted.current || error) return;
    hasStarted.current = true;

    const totalDuration = STAGES.reduce((sum, s) => sum + s.duration, 0);
    let totalElapsed = 0;
    
    // 1. Start the visual progress bar and stages
    const progressInterval = setInterval(() => {
      if (isComplete || error) {
        clearInterval(progressInterval);
        return;
      }
      
      totalElapsed += 100;
      // Cap at 95% until the actual API returns
      const normalizedProgress = Math.min((totalElapsed / totalDuration) * 100, 95);
      setProgress(normalizedProgress);

      let elapsed = 0;
      for (let i = 0; i < STAGES.length; i++) {
        elapsed += STAGES[i].duration;
        if (totalElapsed < elapsed) {
          setCurrentStage(i);
          break;
        }
      }
    }, 100);

    // 2. Call the generation API
    const generate = async () => {
      try {
        const stored = sessionStorage.getItem('gs-greeting-submission');
        if (!stored) throw new Error('No form data found');

        const formData = JSON.parse(stored);

        const res = await fetch('/api/generate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData),
        });

        const data = await res.json();

        if (!res.ok) throw new Error(data.error || 'Generation failed');

        // Generation successful!
        clearInterval(progressInterval);
        setProgress(100);
        setCurrentStage(STAGES.length - 1);
        setIsComplete(true);
        
        // Save the slug/mock data for the redirect
        sessionStorage.setItem('gs-greeting-result', JSON.stringify(data));

      } catch (err) {
        console.error(err);
        setError(err instanceof Error ? err.message : 'Something went wrong');
        clearInterval(progressInterval);
      }
    };

    generate();

    return () => clearInterval(progressInterval);
  }, [isComplete, error]);

  // Rotate micro-copy
  useEffect(() => {
    const interval = setInterval(() => {
      microCopyIndex.current = (microCopyIndex.current + 1) % MICRO_COPY.length;
      setMicroCopy(MICRO_COPY[microCopyIndex.current]);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  // Confetti on completion
  useEffect(() => {
    if (isComplete && !prefersReduced) {
      const fire = () => {
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#a855f7', '#3b82f6', '#f472b6', '#60a5fa'],
        });
      };
      fire();
      setTimeout(fire, 300);

      // Redirect after celebration
      setTimeout(() => {
        const resultRaw = sessionStorage.getItem('gs-greeting-result');
        if (resultRaw) {
          const result = JSON.parse(resultRaw);
          // If we have a DB, we redirect to /g/[slug]. 
          // Since we might be running without a DB in mock mode, we pass the mock slug
          window.location.href = `/g/${result.slug}`;
        } else {
          window.location.href = '/';
        }
      }, 2500);
    }
  }, [isComplete, prefersReduced]);

  if (error) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center px-6 text-center">
        <AuroraBackground />
        <div className="relative z-10 flex max-w-md flex-col items-center gap-4 rounded-[var(--radius-lg)] border border-glass-border bg-glass-bg p-8 backdrop-blur-xl">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-accent-rose/20 text-accent-rose">
            <span className="text-xl">!</span>
          </div>
          <h2 className="text-xl font-bold">Something went wrong</h2>
          <p className="text-fg-secondary">{error}</p>
          <button
            onClick={() => window.history.back()}
            className="mt-4 rounded-[var(--radius-md)] bg-white/10 px-6 py-2 text-sm font-medium transition-colors hover:bg-white/20"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  const stage = STAGES[currentStage] || STAGES[STAGES.length - 1];

  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center px-6">
      <AuroraBackground />
      <FloatingOrbs />

      <div className="relative z-10 flex max-w-lg flex-col items-center text-center">
        {/* Stage Icon */}
        <AnimatePresence mode="wait">
          <motion.div
            key={stage.id}
            className="mb-8 flex h-20 w-20 items-center justify-center rounded-full"
            style={{
              background: `${stage.color}15`,
              boxShadow: `0 0 60px ${stage.color}20`,
            }}
            initial={{ opacity: 0, scale: 0.5, rotate: -10 }}
            animate={{ opacity: 1, scale: 1, rotate: 0 }}
            exit={{ opacity: 0, scale: 0.5, rotate: 10 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          >
            <stage.icon className="h-10 w-10" style={{ color: stage.color }} />
          </motion.div>
        </AnimatePresence>

        {/* Stage Label */}
        <AnimatePresence mode="wait">
          <motion.div
            key={stage.id + '-text'}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
          >
            <h1
              className="mb-2 text-2xl font-bold sm:text-3xl"
              style={{ fontFamily: 'var(--font-display)' }}
            >
              {isComplete ? '✨ Ready!' : stage.label}
            </h1>
            <p className="text-fg-secondary">
              {isComplete ? 'Your greeting is complete.' : stage.sublabel}
            </p>
          </motion.div>
        </AnimatePresence>

        {/* Progress Bar */}
        <div className="mt-10 w-full max-w-xs">
          <div className="relative h-1.5 overflow-hidden rounded-full bg-glass-border">
            <motion.div
              className="absolute inset-y-0 left-0 rounded-full"
              style={{
                background: `linear-gradient(90deg, var(--accent-purple), var(--accent-blue))`,
              }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.3, ease: 'easeOut' }}
            />
          </div>
          <p className="mt-2 text-xs text-fg-muted">
            {Math.round(progress)}% complete
          </p>
        </div>

        {/* Rotating Micro-copy */}
        <AnimatePresence mode="wait">
          <motion.p
            key={microCopy}
            className="mt-6 text-sm italic text-fg-tertiary"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 0.7, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
          >
            {microCopy}
          </motion.p>
        </AnimatePresence>

        {/* Stage dots */}
        <div className="mt-8 flex gap-2">
          {STAGES.map((s, i) => (
            <div
              key={s.id}
              className="h-2 w-2 rounded-full transition-all duration-300"
              style={{
                background:
                  i <= currentStage ? stage.color : 'rgba(255,255,255,0.1)',
                transform: i === currentStage ? 'scale(1.5)' : 'scale(1)',
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
