import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Creating Your Greeting...',
  description: 'AI is crafting a personalized, cinematic greeting experience.',
  robots: { index: false },
};

export default function ProcessingLayout({ children }: { children: React.ReactNode }) {
  return children;
}
