import { describe, expect, it } from 'vitest';

import type { GreetingContent } from '@/lib/ai/schema';
import { buildBackdropMotifs } from './personalized-backdrop';

const baseGreeting: GreetingContent = {
  recipientName: 'Niki',
  presentedBy: 'Pranitha',
  heroHeadline: 'For Niki',
  greetingMessage: 'A greeting',
  story: 'Story',
  letter: 'Letter',
  quotes: ['Quote'],
  timeline: [],
  gallery: [],
  personalizedDetails: [
    { field: 'favoriteColor', label: 'Favorite color', line: 'Niki likes blue, so this page keeps a little sky in its pocket.' },
    { field: 'favoriteFood', label: 'Favorite food', line: 'Chicken is folded into the page as comfort.' },
    { field: 'favoriteHobby', label: 'Favorite hobby', line: 'playing with pets becomes a scene where Niki looks at home.' },
  ],
  memoryHighlights: [],
  theme: {
    mode: 'dark',
    accent: 'blue',
    density: 'luxury',
    archetype: 'family',
    motifs: ['sunflower', 'puppies moments'],
  },
  closingMessage: 'With love.',
  ogTitle: 'For Niki',
  ogDescription: 'A greeting',
  coverageMap: {},
};

describe('buildBackdropMotifs', () => {
  it('turns personalized details into ambient motifs without exposing every field label', () => {
    const motifs = buildBackdropMotifs(baseGreeting);

    expect(motifs).toEqual(expect.arrayContaining(['blue', 'chicken', 'playing with pets']));
    expect(motifs).not.toContain('Favorite color');
    expect(motifs.every((motif) => motif.length <= 22)).toBe(true);
    expect(motifs.length).toBeLessThanOrEqual(6);
  });
});
