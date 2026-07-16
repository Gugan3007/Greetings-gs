import { describe, expect, it, vi } from 'vitest';

import type { FormData } from '@/features/form/schema';
import type { GreetingContent } from '@/lib/ai/schema';
import { getGreeting } from './store';

vi.mock('server-only', () => ({}));

const content: GreetingContent = {
  recipientName: 'Maya',
  presentedBy: 'Arun',
  heroHeadline: 'A beautiful day for Maya.',
  greetingMessage: 'This day belongs to Maya.',
  story: 'A story written with care.',
  letter: 'Dear Maya,\n\nKeep shining.',
  quotes: ['Some people make a day worth remembering.'],
  timeline: [],
  gallery: [],
  personalizedDetails: [],
  memoryHighlights: [],
  theme: { mode: 'dark', accent: 'purple', density: 'luxury' },
  closingMessage: 'With love.',
  ogTitle: 'For Maya',
  ogDescription: 'A greeting for Maya.',
  coverageMap: {},
};

const input = {
  slug: 'maya-123',
  formData: {} as FormData,
  content,
  ownerToken: 'sender-secret-token',
};

describe('greeting repository', () => {
  it('rejects generation when configured persistence fails', async () => {
    const { persistGreeting } = await import('./repository');
    const backend = {
      insert: vi.fn().mockRejectedValue(new Error('database unavailable')),
      findPublished: vi.fn(),
    };

    await expect(persistGreeting(input, backend)).rejects.toThrow('database unavailable');
    expect(getGreeting(input.slug)).toBeNull();
  });

  it('loads a published greeting from durable storage after memory is empty', async () => {
    const { findPublishedGreeting } = await import('./repository');
    const backend = {
      insert: vi.fn(),
      findPublished: vi.fn().mockResolvedValue(content),
    };

    await expect(findPublishedGreeting(input.slug, backend)).resolves.toEqual(content);
    expect(getGreeting(input.slug)).toEqual(content);
  });
});
