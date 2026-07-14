import { Inter, Space_Grotesk } from 'next/font/google';

/**
 * Body font — Inter: clean, modern, highly readable at all sizes.
 */
export const fontSans = Inter({
  subsets: ['latin'],
  variable: '--font-sans',
  display: 'swap',
});

/**
 * Display font — Space Grotesk: bold, geometric, perfect for headlines.
 */
export const fontDisplay = Space_Grotesk({
  subsets: ['latin'],
  variable: '--font-display',
  display: 'swap',
});
