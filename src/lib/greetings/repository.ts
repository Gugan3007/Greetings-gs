import 'server-only';

import { createHash } from 'node:crypto';

import type { FormData } from '@/features/form/schema';
import { greetingContentSchema, type GreetingContent } from '@/lib/ai/schema';
import { getSupabaseAdmin } from '@/lib/supabase/admin';
import { getGreeting, saveGreeting } from './store';

type GreetingRecord = {
  slug: string;
  formData: FormData;
  content: GreetingContent;
  ownerTokenHash: string;
};

export type GreetingBackend = {
  insert(record: GreetingRecord): Promise<void>;
  findPublished(slug: string): Promise<unknown | null>;
};

type PersistGreetingInput = {
  slug: string;
  formData: FormData;
  content: GreetingContent;
  ownerToken: string;
};

function createSupabaseBackend(): GreetingBackend | null {
  const admin = getSupabaseAdmin();
  if (!admin) return null;

  return {
    async insert(record) {
      const { error } = await admin.from('greetings').insert({
        slug: record.slug,
        form_data: record.formData,
        ai_content: record.content,
        owner_token_hash: record.ownerTokenHash,
        status: 'published',
      });

      if (error) throw new Error(`Unable to publish greeting: ${error.message}`);
    },
    async findPublished(slug) {
      const { data, error } = await admin
        .from('greetings')
        .select('ai_content')
        .eq('slug', slug)
        .eq('status', 'published')
        .maybeSingle();

      if (error) throw new Error(`Unable to load greeting: ${error.message}`);
      return data?.ai_content ?? null;
    },
  };
}

export async function persistGreeting(
  input: PersistGreetingInput,
  backend: GreetingBackend | null = createSupabaseBackend()
): Promise<'supabase' | 'memory'> {
  if (backend) {
    await backend.insert({
      slug: input.slug,
      formData: input.formData,
      content: input.content,
      ownerTokenHash: createHash('sha256').update(input.ownerToken).digest('hex'),
    });
    saveGreeting(input.slug, input.content);
    return 'supabase';
  }

  saveGreeting(input.slug, input.content);
  return 'memory';
}

export async function findPublishedGreeting(
  slug: string,
  backend: GreetingBackend | null = createSupabaseBackend()
): Promise<GreetingContent | null> {
  const memoryGreeting = getGreeting(slug);
  if (memoryGreeting) return memoryGreeting;
  if (!backend) return null;

  const storedContent = await backend.findPublished(slug);
  const parsed = greetingContentSchema.safeParse(storedContent);
  if (!parsed.success) return null;

  saveGreeting(slug, parsed.data);
  return parsed.data;
}
