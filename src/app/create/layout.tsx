import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Create Your Greeting',
  description:
    'Tell us about the amazing person you want to celebrate. Answer a few guided questions and let AI create a cinematic greeting experience.',
  robots: { index: false },
};

export default function CreateLayout({ children }: { children: React.ReactNode }) {
  return children;
}
