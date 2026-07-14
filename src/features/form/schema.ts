import { z } from 'zod';

// ─── Occasion Types ──────────────────────────────────────────────────────────

export const OCCASIONS = [
  'birthday',
  'anniversary',
  'graduation',
  'wedding',
  'farewell',
  'get-well',
  'congratulations',
  'just-because',
  'custom',
] as const;

export type Occasion = (typeof OCCASIONS)[number];

export const OCCASION_LABELS: Record<Occasion, string> = {
  birthday: '🎂 Birthday',
  anniversary: '💕 Anniversary',
  graduation: '🎓 Graduation',
  wedding: '💍 Wedding',
  farewell: '✈️ Farewell',
  'get-well': '🌻 Get Well',
  congratulations: '🎉 Congratulations',
  'just-because': '💝 Just Because',
  custom: '✨ Custom',
};

// ─── Tone & Style ────────────────────────────────────────────────────────────

export const TONES = ['funny', 'emotional', 'formal', 'cute'] as const;
export type Tone = (typeof TONES)[number];

export const TONE_LABELS: Record<Tone, { label: string; emoji: string; description: string }> = {
  funny: { label: 'Funny', emoji: '😂', description: 'Light-hearted, witty, inside jokes' },
  emotional: { label: 'Emotional', emoji: '🥹', description: 'Deep, heartfelt, tear-jerker' },
  formal: { label: 'Formal', emoji: '🎩', description: 'Elegant, professional, respectful' },
  cute: { label: 'Cute', emoji: '🥰', description: 'Sweet, playful, warm' },
};

export const DENSITIES = ['minimal', 'luxury'] as const;
export type Density = (typeof DENSITIES)[number];

export const THEMES = ['light', 'dark'] as const;
export type ThemeMode = (typeof THEMES)[number];

export const EMOJI_USAGE = ['none', 'light', 'expressive'] as const;
export type EmojiUsage = (typeof EMOJI_USAGE)[number];

export const PHOTO_LAYOUTS = ['filmstrip', 'masonry', 'polaroid', 'carousel'] as const;
export type PhotoLayout = (typeof PHOTO_LAYOUTS)[number];

export const PHOTO_LAYOUT_LABELS: Record<PhotoLayout, { label: string; description: string }> = {
  filmstrip: { label: 'Film Strip', description: 'Horizontal scrolling frames' },
  masonry: { label: 'Masonry Grid', description: 'Pinterest-style flowing grid' },
  polaroid: { label: 'Polaroid Stack', description: 'Scattered instant photos' },
  carousel: { label: 'Carousel', description: 'Swipeable full-width slides' },
};

export const DEVICE_TARGETS = ['mobile', 'desktop', 'both'] as const;
export type DeviceTarget = (typeof DEVICE_TARGETS)[number];

export const GENDERS = ['he/him', 'she/her', 'they/them', 'other'] as const;
export type Gender = (typeof GENDERS)[number];

// ─── Timeline Milestone ──────────────────────────────────────────────────────

export const timelineMilestoneSchema = z.object({
  date: z.string().min(1, 'Date is required'),
  caption: z.string().min(1, 'Caption is required').max(200, 'Max 200 characters'),
});

export type TimelineMilestone = z.infer<typeof timelineMilestoneSchema>;

// ─── Main Form Schema ────────────────────────────────────────────────────────

export const formSchema = z.object({
  // ── Recipient Basics ─────────────────────
  recipientName: z.string().min(1, 'Name is required').max(100),
  recipientNickname: z.string().max(50).optional().default(''),
  recipientAge: z.string().optional().default(''),
  recipientGender: z.enum(GENDERS).optional(),
  relationship: z.string().min(1, 'Relationship is required').max(100),
  occasionDate: z.string().optional().default(''),
  occasion: z.enum(OCCASIONS),
  customOccasion: z.string().max(100).optional().default(''),

  // ── Personality & Preferences ────────────
  personalityDescription: z.string().max(500).optional().default(''),
  favoriteColor: z.string().max(50).optional().default(''),
  favoriteFood: z.string().max(100).optional().default(''),
  favoriteMovie: z.string().max(100).optional().default(''),
  favoriteSong: z.string().max(100).optional().default(''),
  favoriteHobby: z.string().max(100).optional().default(''),
  favoritePlace: z.string().max(100).optional().default(''),
  favoriteAnimal: z.string().max(100).optional().default(''),
  favoriteFlower: z.string().max(100).optional().default(''),
  travelDestination: z.string().max(100).optional().default(''),
  favoriteGame: z.string().max(100).optional().default(''),
  favoriteQuote: z.string().max(300).optional().default(''),

  // ── Emotional Core ───────────────────────
  whatMakesThemSpecial: z.string().min(1, 'Required').max(1000),
  personalLetter: z.string().max(5000).optional().default(''),
  funniestMemory: z.string().max(1000).optional().default(''),
  bestMoment: z.string().max(1000).optional().default(''),
  achievement: z.string().max(500).optional().default(''),
  dreamGoal: z.string().max(500).optional().default(''),
  timeline: z.array(timelineMilestoneSchema).min(0).max(12).default([]),

  // ── Media (stored as URL strings after upload) ──
  photos: z.array(z.string()).min(0).max(20).default([]),
  video: z.string().optional().default(''),
  voiceMessage: z.string().optional().default(''),
  backgroundMusic: z.string().optional().default(''),

  // ── Style Preferences ────────────────────
  tone: z.enum(TONES).default('emotional'),
  density: z.enum(DENSITIES).default('luxury'),
  themeMode: z.enum(THEMES).default('dark'),
  language: z.string().default('en'),
  emojiUsage: z.enum(EMOJI_USAGE).default('light'),
  photoLayout: z.enum(PHOTO_LAYOUTS).default('polaroid'),

  // ── Delivery ─────────────────────────────
  senderName: z.string().min(1, 'Your name is required').max(100),
  deviceTarget: z.enum(DEVICE_TARGETS).default('both'),
  socialLinks: z.string().max(500).optional().default(''),
  additionalNotes: z.string().max(1000).optional().default(''),

  // ── Consent ──────────────────────────────
  mediaConsent: z.boolean().refine((v) => v === true, {
    message: 'You must confirm you have rights to the uploaded media',
  }),
});

export type FormData = z.infer<typeof formSchema>;

// ─── Default Form Values ─────────────────────────────────────────────────────

export const defaultFormValues: FormData = {
  recipientName: '',
  recipientNickname: '',
  recipientAge: '',
  recipientGender: undefined,
  relationship: '',
  occasionDate: '',
  occasion: 'birthday',
  customOccasion: '',
  personalityDescription: '',
  favoriteColor: '',
  favoriteFood: '',
  favoriteMovie: '',
  favoriteSong: '',
  favoriteHobby: '',
  favoritePlace: '',
  favoriteAnimal: '',
  favoriteFlower: '',
  travelDestination: '',
  favoriteGame: '',
  favoriteQuote: '',
  whatMakesThemSpecial: '',
  personalLetter: '',
  funniestMemory: '',
  bestMoment: '',
  achievement: '',
  dreamGoal: '',
  timeline: [],
  photos: [],
  video: '',
  voiceMessage: '',
  backgroundMusic: '',
  tone: 'emotional',
  density: 'luxury',
  themeMode: 'dark',
  language: 'en',
  emojiUsage: 'light',
  photoLayout: 'polaroid',
  senderName: '',
  deviceTarget: 'both',
  socialLinks: '',
  additionalNotes: '',
  mediaConsent: false,
};
