'use client';

import { useEffect, useMemo, useState, useSyncExternalStore, type CSSProperties } from 'react';
import { useParams } from 'next/navigation';
import { type GreetingContent } from '@/lib/ai/schema';
import { dedupeGreetingContent } from '@/lib/ai/dedupe';
import { GreetingHero } from '@/features/greeting/GreetingHero';
import { GreetingNarrative } from '@/features/greeting/GreetingNarrative';
import { GreetingHighlights } from '@/features/greeting/GreetingHighlights';
import { GreetingTimeline } from '@/features/greeting/GreetingTimeline';
import { GreetingGallery } from '@/features/greeting/GreetingGallery';
import { GreetingLetter } from '@/features/greeting/GreetingLetter';
import { GreetingSignature } from '@/features/greeting/GreetingSignature';
import { GreetingDedication } from '@/features/greeting/GreetingDedication';
import { PersonalizedBackdrop } from '@/features/greeting/PersonalizedBackdrop';
import { ShareModal } from '@/features/greeting/ShareModal';
import { Heart, Share2 } from 'lucide-react';

const subscribeSession = () => () => undefined;

type GreetingResult = {
  slug: string;
  mockContent?: GreetingContent;
  ownerToken?: string;
  shareUrl?: string;
};

export default function GreetingPage() {
  const params = useParams();
  const slug = params.slug as string;
  const resultRaw = useSyncExternalStore(
    subscribeSession,
    () => sessionStorage.getItem(`gs-greeting-result:${slug}`) || sessionStorage.getItem('gs-greeting-result'),
    () => null
  );
  const sessionResult = useMemo(() => {
    if (!resultRaw) return null;
    try {
      const result = JSON.parse(resultRaw) as GreetingResult;
      return result.slug === slug ? result : null;
    } catch {
      return null;
    }
  }, [resultRaw, slug]);
  const [remoteResult, setRemoteResult] = useState<GreetingResult | null>(null);
  const [remoteMissing, setRemoteMissing] = useState(false);

  useEffect(() => {
    if (sessionResult?.mockContent) return;
    const controller = new AbortController();

    fetch(`/api/greetings/${encodeURIComponent(slug)}`, { signal: controller.signal })
      .then(async (response) => {
        if (!response.ok) throw new Error('Greeting not found');
        return response.json() as Promise<GreetingResult>;
      })
      .then((result) => setRemoteResult(result))
      .catch((error: unknown) => {
        if (!(error instanceof DOMException && error.name === 'AbortError')) setRemoteMissing(true);
      });

    return () => controller.abort();
  }, [sessionResult, slug]);

  const availableResult = sessionResult?.mockContent ? sessionResult : remoteResult;
  const data = useMemo(() => {
    const content = availableResult?.mockContent || null;
    return content ? dedupeGreetingContent(content) : null;
  }, [availableResult]);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const isOwner = Boolean(
    sessionResult?.ownerToken &&
    sessionStorage.getItem(`gs-greeting-owner:${slug}`) === sessionResult.ownerToken
  );

  if (!data) {
    return (
      <div className="flex min-h-[100svh] items-center justify-center bg-background text-foreground">
        {remoteMissing ? (
          <div className="mx-auto max-w-md px-6 text-center">
            <p className="font-display text-2xl font-semibold">This greeting is no longer available here.</p>
            <p className="mt-3 text-sm text-fg-secondary">Ask the sender for a fresh link, or keep their computer server running while opening a local link.</p>
          </div>
        ) : (
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-accent-purple border-t-transparent" />
        )}
      </div>
    );
  }

  // Inject theme variables dynamically based on generated content
  const accentVar = `--accent-${data.theme.accent}`;
  
  return (
    <div 
      className={`greeting-page relative min-h-[100svh] overflow-x-hidden text-foreground selection:bg-accent-purple/30 selection:text-white theme-${data.theme.mode}`}
      style={{ '--greeting-accent': `var(${accentVar})` } as CSSProperties}
    >
      <PersonalizedBackdrop data={data} />

      {isOwner ? (
        <div className="fixed inset-x-0 top-5 z-40 flex justify-center px-4">
          <div className="flex items-center gap-3 rounded-full border border-white/10 bg-black/60 px-4 py-2 text-xs font-medium text-white/70 shadow-xl backdrop-blur-xl">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
            Sender preview
            <button type="button" className="rounded-full px-1 py-0.5 text-white transition-opacity hover:opacity-70" onClick={() => setIsShareModalOpen(true)}>Share</button>
          </div>
        </div>
      ) : null}

      <main className="relative z-10">
        <GreetingHero data={data} />
        <GreetingSignature data={data} />
        <GreetingNarrative data={data} />
        <GreetingHighlights data={data} />
        <GreetingTimeline data={data} />
        <GreetingGallery data={data} />
        <GreetingLetter data={data} />
        <GreetingDedication data={data} />
      </main>

      {/* ── Footer ── */}
      <footer className="relative mt-20 border-t border-glass-border bg-glass-bg py-12 backdrop-blur-xl">
        <div className="mx-auto flex max-w-4xl flex-col items-center justify-center gap-6 px-6 text-center">
          <p className="text-sm font-medium text-fg-secondary">
            Generated with love using <span className="text-foreground">GS Greetings AI</span>
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <button
              type="button"
              className="flex items-center gap-2 rounded-full bg-gradient-to-r from-accent-purple to-accent-blue px-6 py-2.5 text-sm font-medium text-white shadow-lg transition-transform hover:scale-105"
              onClick={() => setIsShareModalOpen(true)}
            >
              <Share2 className="h-4 w-4" />
              Share Greeting
            </button>
            <button
              type="button"
              className="flex items-center gap-2 rounded-full border border-glass-border bg-white/5 px-6 py-2.5 text-sm font-medium transition-colors hover:bg-white/10"
              onClick={() => window.location.href = '/create?new=1'}
            >
              Create Your Own
              <Heart className="h-4 w-4 text-accent-rose" />
            </button>
          </div>
        </div>
      </footer>

      {/* ── Share Modal ── */}
      <ShareModal
        isOpen={isShareModalOpen}
        onClose={() => setIsShareModalOpen(false)}
        url={sessionResult?.shareUrl || (typeof window !== 'undefined' ? window.location.href : `/g/${slug}`)}
        title={data.ogTitle || 'A special greeting for you'}
      />
    </div>
  );
}
