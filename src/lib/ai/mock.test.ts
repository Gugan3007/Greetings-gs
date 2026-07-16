import { describe, expect, it } from 'vitest';

import { defaultFormValues, type FormData } from '@/features/form/schema';
import { createPersonalizedMock } from './mock';
import { FORM_FIELD_KEYS } from './form-fields';

const richInput: FormData = {
  ...defaultFormValues,
  recipientName: 'Mitra',
  recipientGender: 'she/her',
  relationship: 'my girlfriend',
  occasion: 'just-because',
  personalityDescription: 'She is warm and playful with tiny details.',
  favoriteColor: 'blue',
  favoriteFood: 'porotta',
  favoriteAnimal: 'dogs',
  favoritePlace: 'Thindal temple',
  whatMakesThemSpecial: 'She makes ordinary evenings feel safe, funny, and unforgettable.',
  personalLetter: 'I am always there with you, whenever and wherever you go.',
  bestMoment: 'Our first date at Thindal temple.',
  funniestMemory: 'Laughing over food and teasing each other about the last bite.',
  timeline: [{ date: '2026-02-28', caption: 'We first met at Thindal Murugan Temple' }],
  tone: 'cute',
  senderName: 'Gugan',
  mediaConsent: true,
};

describe('createPersonalizedMock', () => {
  it('covers every form field in the generated coverage map', () => {
    const result = createPersonalizedMock(richInput);

    expect(Object.keys(result.coverageMap).sort()).toEqual([...FORM_FIELD_KEYS].sort());
  });

  it('transforms typed sender copy instead of pasting it verbatim', () => {
    const result = createPersonalizedMock(richInput);
    const visibleCopy = [
      result.heroHeadline,
      result.greetingMessage,
      result.story,
      result.letter,
      result.closingMessage,
      result.signatureLine,
      result.playfulAside,
      ...result.quotes,
    ].join('\n');

    expect(visibleCopy).not.toContain(richInput.personalLetter);
    expect(visibleCopy).not.toContain(richInput.whatMakesThemSpecial);
    expect(visibleCopy).toMatch(/porotta/i);
    expect(visibleCopy).toMatch(/paw|dog/i);
    expect(visibleCopy).toMatch(/Thindal/i);
    expect(visibleCopy).toMatch(/beside|choose|with you|near/i);
  });

  it('does not repeat full sentences across the story and letter', () => {
    const result = createPersonalizedMock(richInput);
    const storySentences = new Set(
      result.story
        .split(/(?<=[.!?])\s+/)
        .map((sentence) => sentence.trim())
        .filter(Boolean)
    );
    const repeated = result.letter
      .split(/(?<=[.!?])\s+/)
      .map((sentence) => sentence.trim())
      .filter((sentence) => storySentences.has(sentence));

    expect(repeated).toEqual([]);
  });
});
