import type { Metadata } from 'next';
import { fontSans, fontDisplay } from '@/lib/fonts';
import { Providers } from './providers';
import './globals.css';

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'),
  title: {
    default: 'GS Greetings AI — Emotion Designed Beautifully',
    template: '%s | GS Greetings AI',
  },
  description:
    'Create stunning, AI-powered personalized greeting websites. Turn your memories and feelings into a cinematic, shareable experience that feels hand-crafted.',
  keywords: [
    'greeting',
    'personalized gift',
    'AI greeting',
    'birthday gift',
    'anniversary gift',
    'custom website',
    'GS Greetings',
  ],
  authors: [{ name: 'GS' }],
  openGraph: {
    title: 'GS Greetings AI — Emotion Designed Beautifully',
    description:
      'Turn your memories into a cinematic, shareable greeting website powered by AI.',
    type: 'website',
    locale: 'en_US',
    siteName: 'GS Greetings AI',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'GS Greetings AI',
    description:
      'Turn your memories into a cinematic, shareable greeting website powered by AI.',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${fontSans.variable} ${fontDisplay.variable} h-full antialiased`}
    >
      <body className="noise-overlay min-h-full flex flex-col">
        <Providers>{children}</Providers>
        <span className="gs-watermark" aria-hidden="true">-GS</span>
      </body>
    </html>
  );
}
