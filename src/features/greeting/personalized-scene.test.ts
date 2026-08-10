import { describe, expect, it } from 'vitest';

import type { GreetingContent } from '@/lib/ai/schema';
import { buildPersonalizedScene } from './personalized-scene';

function greetingWith(details: GreetingContent['personalizedDetails']): GreetingContent {
  return {
    recipientName: 'Niki',
    heroHeadline: 'For Niki',
    greetingMessage: 'A greeting',
    story: 'Story',
    letter: 'Letter',
    quotes: [],
    timeline: [],
    gallery: [],
    personalizedDetails: details,
    memoryHighlights: [],
    theme: { mode: 'dark', accent: 'blue', density: 'luxury', archetype: 'friendship' },
    closingMessage: 'With love.',
    ogTitle: 'For Niki',
    ogDescription: 'A greeting',
    coverageMap: {},
  };
}

describe('buildPersonalizedScene', () => {
  it('selects a deterministic capped scene from the highest-value input families', () => {
    const greeting = greetingWith([
      { field: 'favoriteColor', label: 'Favorite color', line: 'Ocean blue keeps a little sky nearby.' },
      { field: 'favoriteFood', label: 'Favorite food', line: 'Biryani brings the spice.' },
      { field: 'favoriteAnimal', label: 'Favorite animal', line: 'Dogs leave soft paw-print magic.' },
      { field: 'favoriteFlower', label: 'Favorite flower', line: 'Jasmine blooms quietly.' },
      { field: 'favoriteHobby', label: 'Favorite hobby', line: 'Music becomes a scene where Niki feels at home.' },
      { field: 'favoritePlace', label: 'Favorite place', line: 'The beach is a memory doorway.' },
      { field: 'favoriteGame', label: 'Favorite game', line: 'Chess adds a playful rule.' },
    ]);

    const scene = buildPersonalizedScene(greeting);

    expect(scene.palette).toEqual(['#60a5fa', '#22d3ee']);
    expect(scene.motifs.map((item) => item.family)).toEqual(
      expect.arrayContaining(['animal', 'flower', 'hobby'])
    );
    expect(scene.motifs.length).toBeLessThanOrEqual(6);
    expect(buildPersonalizedScene(greeting)).toEqual(scene);
  });

  it.each([
    ['Music fills the room.', '♫'],
    ['Dance becomes pure joy.', '⌁'],
    ['Painting at night feels like home.', '╱'],
    ['Travel keeps calling.', '✦'],
    ['Cooking is their element.', '≈'],
  ])('maps the hobby detail %s to %s', (line, glyph) => {
    const scene = buildPersonalizedScene(greetingWith([
      { field: 'favoriteHobby', label: 'Favorite hobby', line },
    ]));

    expect(scene.motifs.find((item) => item.family === 'hobby')?.glyph).toBe(glyph);
  });

  it.each([
    ['The beach is a memory doorway.', '∿'],
    ['Paris waits like a future postcard.', '⌁'],
    ['Home is the favorite place.', '⌂'],
  ])('maps the place detail %s to %s', (line, glyph) => {
    const scene = buildPersonalizedScene(greetingWith([
      { field: 'favoritePlace', label: 'Favorite place', line },
    ]));

    expect(scene.motifs.find((item) => item.family === 'place')?.glyph).toBe(glyph);
  });

  it.each([
    ['Chess adds a playful rule.', '♟'],
    ['Badminton adds a playful rule.', '⌁'],
    ['BGMI adds a playful rule.', '◇'],
  ])('maps the game detail %s to %s', (line, glyph) => {
    const scene = buildPersonalizedScene(greetingWith([
      { field: 'favoriteGame', label: 'Favorite game', line },
    ]));

    expect(scene.motifs.find((item) => item.family === 'game')?.glyph).toBe(glyph);
  });

  it('falls back to the emotional archetype when no preference motifs exist', () => {
    const scene = buildPersonalizedScene(greetingWith([]));

    expect(scene.motifs.some((item) => item.family === 'archetype')).toBe(true);
  });
});
