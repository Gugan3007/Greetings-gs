'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { type GreetingContent } from '@/lib/ai/schema';
import { GreetingHero } from '@/features/greeting/GreetingHero';
import { GreetingNarrative } from '@/features/greeting/GreetingNarrative';
import { GreetingHighlights } from '@/features/greeting/GreetingHighlights';
import { GreetingTimeline } from '@/features/greeting/GreetingTimeline';
import { GreetingGallery } from '@/features/greeting/GreetingGallery';
import { GreetingLetter } from '@/features/greeting/GreetingLetter';
import { ShareModal } from '@/features/greeting/ShareModal';
import { MagneticButton } from '@/components/motion/MagneticButton';
import { Heart, Share2 } from 'lucide-react';

export default function GreetingPage() {
  const params = useParams();
  const slug = params.slug as string;
  const [data, setData] = useState<GreetingContent | null>(null);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);

  useEffect(() => {
    // Determine which mode we are in (mock vs real)
    const resultRaw = sessionStorage.getItem('gs-greeting-result');
    if (resultRaw) {
      const result = JSON.parse(resultRaw);
      if (result.slug === slug) {
        setData(result.mockContent);
      }
    } else {
      // Real DB fetch would go here
    }
  }, [slug]);

  if (!data) {
    return (
      <div className="flex min-h-[100svh] items-center justify-center bg-background text-foreground">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-accent-purple border-t-transparent" />
      </div>
    );
  }

  // Inject theme variables dynamically based on generated content
  const accentVar = `--accent-${data.theme.accent}`;
  
  return (
    <div 
      className="relative min-h-[100svh] overflow-x-hidden bg-background text-foreground selection:bg-accent-purple/30 selection:text-white"
      style={{
        // Define root accent variables for this specific greeting
        ['--greeting-accent' as any]: `var(${accentVar})`,
      }}
    >
      {/* ── Components ── */}
      <GreetingHero data={data} />
      <GreetingNarrative data={data} />
      <GreetingHighlights data={data} />
      <GreetingTimeline data={data} />
      <GreetingGallery data={data} />
      <GreetingLetter data={data} />

      {/* ── Footer ── */}
      <footer className="relative mt-20 border-t border-glass-border bg-glass-bg py-12 backdrop-blur-xl">
        <div className="mx-auto flex max-w-4xl flex-col items-center justify-center gap-6 text-center">
          <p className="text-sm font-medium text-fg-secondary">
            Generated with love using <span className="text-foreground">GS Greetings AI</span>
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <MagneticButton
              className="flex items-center gap-2 rounded-full bg-gradient-to-r from-accent-purple to-accent-blue px-6 py-2.5 text-sm font-medium text-white shadow-lg transition-transform hover:scale-105"
              onClick={() => setIsShareModalOpen(true)}
            >
              <Share2 className="h-4 w-4" />
              Share Greeting
            </MagneticButton>
            <MagneticButton
              className="flex items-center gap-2 rounded-full border border-glass-border bg-white/5 px-6 py-2.5 text-sm font-medium transition-colors hover:bg-white/10"
              onClick={() => window.location.href = '/'}
            >
              Create Your Own
              <Heart className="h-4 w-4 text-accent-rose" />
            </MagneticButton>
          </div>
        </div>
      </footer>

      {/* ── Share Modal ── */}
      <ShareModal
        isOpen={isShareModalOpen}
        onClose={() => setIsShareModalOpen(false)}
        url={typeof window !== 'undefined' ? window.location.href : `https://gs-greetings.com/g/${slug}`}
        title={data.ogTitle || 'A special greeting for you'}
      />
    </div>
  );
}
