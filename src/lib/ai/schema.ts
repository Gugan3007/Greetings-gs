import { z } from 'zod';

/**
 * The contract between the AI agent output and the greeting template.
 * The AI's only job is to populate this schema — never raw HTML/CSS.
 */

export const greetingTimelineItemSchema = z.object({
  date: z.string(),
  caption: z.string().max(200),
});

export const greetingGalleryItemSchema = z.object({
  url: z.string().url(),
  caption: z.string().max(200).optional(),
});

export const greetingThemeSchema = z.object({
  mode: z.enum(['light', 'dark']),
  accent: z.enum(['purple', 'blue', 'roseGold']),
  density: z.enum(['minimal', 'luxury']),
  archetype: z
    .enum(['romance', 'family', 'friendship', 'celebration', 'comfort', 'achievement'])
    .optional(),
  motifs: z.array(z.string().max(24)).max(6).optional(),
  themeLabel: z.string().max(80).optional(),
});

export const greetingContentSchema = z.object({
  // ── Core Content ─────────────────────────
  recipientName: z.string(),
  presentedBy: z.string().max(100).optional(),
  heroHeadline: z.string().max(100),
  greetingMessage: z.string().max(500),
  story: z.string().max(2000),
  letter: z.string().max(5000),

  // ── Lists ────────────────────────────────
  quotes: z.array(z.string().max(300)).max(5),
  timeline: z.array(greetingTimelineItemSchema).max(12),
  gallery: z.array(greetingGalleryItemSchema).max(20),
  memoryHighlights: z
    .array(
      z.object({
        title: z.string().max(100),
        description: z.string().max(300),
        emoji: z.string().max(4).optional(),
      })
    )
    .max(6),

  // ── Theme ────────────────────────────────
  theme: greetingThemeSchema,

  // ── Media ────────────────────────────────
  music: z.string().optional(),

  // ── Generated Metadata ──────────────────
  closingMessage: z.string().max(300),
  signatureLine: z.string().max(180).optional(),
  playfulAside: z.string().max(220).optional(),
  ogTitle: z.string().max(70),
  ogDescription: z.string().max(160),
  coverageMap: z.record(z.string(), z.string()).default({}),
});

export type GreetingContent = z.infer<typeof greetingContentSchema>;
export type GreetingTheme = z.infer<typeof greetingThemeSchema>;
export type GreetingTimelineItem = z.infer<typeof greetingTimelineItemSchema>;
export type GreetingGalleryItem = z.infer<typeof greetingGalleryItemSchema>;
