import { describe, expect, it } from 'vitest';

import { FORM_STEPS } from './steps';

function findField(key: string) {
  return FORM_STEPS.flatMap((step) => step.fields).find((field) => field.key === key);
}

describe('form preference fields', () => {
  it('offers quick choices plus a custom input for personal preference fields', () => {
    for (const key of ['favoriteColor', 'favoriteFood', 'favoriteHobby', 'favoriteAnimal', 'favoritePlace']) {
      const field = findField(key);

      expect(field?.type).toBe('choice-text');
      expect(field?.options?.length).toBeGreaterThan(2);
      expect(field?.placeholder?.toLowerCase()).toContain('custom');
    }
  });

  it('asks for all preference fields that the output generator knows how to use', () => {
    for (const key of ['favoriteAnimal', 'favoriteFlower', 'travelDestination', 'favoriteGame']) {
      expect(findField(key)).toBeDefined();
    }
  });
});
