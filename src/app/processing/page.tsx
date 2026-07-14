'use client';

import dynamic from 'next/dynamic';

const ProcessingScreen = dynamic(
  () =>
    import('@/features/generation/ProcessingScreen').then((m) => ({
      default: m.ProcessingScreen,
    })),
  {
    ssr: false,
    loading: () => (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-accent-purple border-t-transparent" />
      </div>
    ),
  }
);

export default function ProcessingPage() {
  return <ProcessingScreen />;
}
