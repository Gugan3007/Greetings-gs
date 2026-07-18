import { describe, expect, it } from 'vitest';

import { defaultFormValues, type FormData } from '@/features/form/schema';
import { buildSignatureMoment, resolveSignatureMomentKey } from './signature-moment';

const baseInput: FormData = {
  ...defaultFormValues,
  recipientName: 'Maya',
  relationship: 'friend',
  whatMakesThemSpecial: 'She brings warmth into ordinary days.',
  senderName: 'Gugan',
  mediaConsent: true,
};

describe('signature occasion moment registry', () => {
  it('maps built-in occasions to their dedicated visual families', () => {
    expect(buildSignatureMoment({ ...baseInput, occasion: 'birthday' }).visualFamily).toBe('balloons');
    expect(buildSignatureMoment({ ...baseInput, occasion: 'anniversary' }).visualFamily).toBe('ring');
    expect(buildSignatureMoment({ ...baseInput, occasion: 'wedding' }).visualFamily).toBe('ring');
    expect(buildSignatureMoment({ ...baseInput, occasion: 'graduation' }).visualFamily).toBe('cap');
    expect(buildSignatureMoment({ ...baseInput, occasion: 'get-well' }).visualFamily).toBe('bouquet');
  });

  it('semantically maps custom typed occasions instead of becoming generic', () => {
    expect(resolveSignatureMomentKey('custom', 'New Home celebration')).toBe('new-home');
    expect(resolveSignatureMomentKey('custom', 'first day at a new job')).toBe('new-job');
    expect(resolveSignatureMomentKey('custom', 'Retirement party')).toBe('retirement');
    expect(resolveSignatureMomentKey('custom', 'Sobriety anniversary')).toBe('sobriety-anniversary');
  });

  it('uses the recipient name inside the dedicated occasion wish', () => {
    const result = buildSignatureMoment({ ...baseInput, occasion: 'birthday', recipientNickname: 'Mimi' });

    expect(result.wish).toMatch(/Mimi/);
    expect(result.occasionLabel).toBe('Birthday');
  });

  it('falls back to the quiet ambient moment only when no semantic match exists', () => {
    const result = buildSignatureMoment({ ...baseInput, occasion: 'custom', customOccasion: 'Moon appreciation evening' });

    expect(result.key).toBe('just-because');
    expect(result.visualFamily).toBe('aurora');
  });
});
