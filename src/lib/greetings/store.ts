import 'server-only';

import type { GreetingContent } from '@/lib/ai/schema';

type StoredGreeting = {
  content: GreetingContent;
  createdAt: number;
};

declare global {
  var __gsGreetingStore: Map<string, StoredGreeting> | undefined;
}

const greetingStore = globalThis.__gsGreetingStore ?? new Map<string, StoredGreeting>();
globalThis.__gsGreetingStore = greetingStore;

export function saveGreeting(slug: string, content: GreetingContent) {
  greetingStore.set(slug, { content, createdAt: Date.now() });
}

export function getGreeting(slug: string) {
  return greetingStore.get(slug)?.content ?? null;
}
