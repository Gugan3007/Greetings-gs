import { describe, expect, it } from 'vitest';

import { applyMusicVolume } from './music-volume';

describe('applyMusicVolume', () => {
  it.each([
    [0.75, 0.75],
    [-1, 0],
    [2, 1],
    [Number.NaN, 0.75],
  ])('applies %s as a safe media volume of %s', (requested, expected) => {
    const media = { volume: 1 };

    expect(applyMusicVolume(media, requested)).toBe(expected);
    expect(media.volume).toBe(expected);
  });
});
