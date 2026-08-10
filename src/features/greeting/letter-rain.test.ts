import { describe, expect, it } from 'vitest';

import { splitGraphemes } from './letter-rain';

describe('splitGraphemes', () => {
  it('preserves letters and spaces in sentence order', () => {
    expect(splitGraphemes('Love wins')).toEqual([
      'L', 'o', 'v', 'e', ' ', 'w', 'i', 'n', 's',
    ]);
  });

  it('keeps an emoji sequence together as one visible glyph', () => {
    expect(splitGraphemes('Hi ❤️')).toEqual(['H', 'i', ' ', '❤️']);
  });
});
