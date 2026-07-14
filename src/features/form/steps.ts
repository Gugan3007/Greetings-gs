import { Heart, User, Sparkles, Camera, Palette, Send, type LucideIcon } from 'lucide-react';
import type { FormData } from './schema';

// ─── Step Configuration ──────────────────────────────────────────────────────

export interface FormField {
  key: keyof FormData;
  label: string;
  placeholder?: string;
  type: 'text' | 'textarea' | 'select' | 'date' | 'number' | 'file' | 'toggle' | 'option-cards' | 'timeline' | 'photos' | 'checkbox';
  options?: { value: string; label: string; emoji?: string; description?: string }[];
  required?: boolean;
  maxLength?: number;
  helperText?: string;
}

export interface FormStep {
  id: string;
  title: string;
  subtitle: string;
  icon: LucideIcon;
  accentColor: string;
  fields: FormField[];
}

export const FORM_STEPS: FormStep[] = [
  // ── Step 1: Who is this for? ────────────────────────
  {
    id: 'recipient',
    title: 'Who is this for?',
    subtitle: 'Tell us about the amazing person receiving this greeting.',
    icon: User,
    accentColor: 'var(--accent-purple)',
    fields: [
      { key: 'recipientName', label: 'Their full name', placeholder: 'e.g. Emma Johnson', type: 'text', required: true },
      { key: 'recipientNickname', label: 'What do you call them?', placeholder: 'e.g. Em, Emmy, Sunshine', type: 'text', helperText: 'Their nickname or what you lovingly call them' },
      { key: 'relationship', label: 'Who are they to you?', placeholder: 'e.g. Best friend, Mom, Partner', type: 'text', required: true },
      { key: 'recipientAge', label: 'How old are they turning? (optional)', placeholder: 'e.g. 25', type: 'text' },
      { key: 'recipientGender', label: 'Pronouns (optional)', type: 'option-cards', options: [
        { value: 'she/her', label: 'She/Her' },
        { value: 'he/him', label: 'He/Him' },
        { value: 'they/them', label: 'They/Them' },
        { value: 'other', label: 'Other' },
      ]},
    ],
  },

  // ── Step 2: What's the occasion? ────────────────────
  {
    id: 'occasion',
    title: "What's the occasion?",
    subtitle: 'Every celebration deserves its own story.',
    icon: Sparkles,
    accentColor: 'var(--accent-blue)',
    fields: [
      { key: 'occasion', label: 'Choose the occasion', type: 'option-cards', required: true, options: [
        { value: 'birthday', label: 'Birthday', emoji: '🎂' },
        { value: 'anniversary', label: 'Anniversary', emoji: '💕' },
        { value: 'graduation', label: 'Graduation', emoji: '🎓' },
        { value: 'wedding', label: 'Wedding', emoji: '💍' },
        { value: 'farewell', label: 'Farewell', emoji: '✈️' },
        { value: 'get-well', label: 'Get Well', emoji: '🌻' },
        { value: 'congratulations', label: 'Congratulations', emoji: '🎉' },
        { value: 'just-because', label: 'Just Because', emoji: '💝' },
        { value: 'custom', label: 'Custom', emoji: '✨' },
      ]},
      { key: 'occasionDate', label: 'Date of the occasion (optional)', type: 'date' },
      { key: 'customOccasion', label: 'Custom occasion name', placeholder: 'e.g. Promotion, New Home', type: 'text' },
    ],
  },

  // ── Step 3: Their personality ───────────────────────
  {
    id: 'personality',
    title: 'What are they like?',
    subtitle: 'Help us understand their vibe so the greeting feels authentic.',
    icon: Heart,
    accentColor: 'var(--accent-rose)',
    fields: [
      { key: 'personalityDescription', label: 'Describe their personality', placeholder: 'e.g. Bubbly, always laughing, incredibly caring, loves adventure...', type: 'textarea', maxLength: 500, helperText: 'A few sentences about what makes them who they are' },
      { key: 'favoriteColor', label: 'Favorite color', placeholder: 'e.g. Ocean blue', type: 'text' },
      { key: 'favoriteHobby', label: 'Favorite hobby', placeholder: 'e.g. Painting, hiking, cooking', type: 'text' },
      { key: 'favoriteSong', label: 'Favorite song or artist', placeholder: 'e.g. "Here Comes the Sun" - The Beatles', type: 'text' },
      { key: 'favoriteFood', label: 'Favorite food', placeholder: 'e.g. Grandma\'s apple pie', type: 'text' },
      { key: 'favoriteMovie', label: 'Favorite movie', placeholder: 'e.g. The Princess Bride', type: 'text' },
      { key: 'favoritePlace', label: 'Favorite place', placeholder: 'e.g. That café on 5th street', type: 'text' },
      { key: 'favoriteQuote', label: 'A quote they love', placeholder: 'e.g. "Be the change you wish to see"', type: 'text', maxLength: 300 },
    ],
  },

  // ── Step 4: The emotional core ──────────────────────
  {
    id: 'emotions',
    title: 'The heart of the matter',
    subtitle: 'This is what makes the greeting truly personal. Take your time.',
    icon: Heart,
    accentColor: 'var(--accent-purple)',
    fields: [
      { key: 'whatMakesThemSpecial', label: 'What makes them special to you?', placeholder: 'Tell us what makes this person irreplaceable in your life...', type: 'textarea', required: true, maxLength: 1000, helperText: 'This becomes the heart of their greeting' },
      { key: 'bestMoment', label: 'Your best moment together', placeholder: 'That time you both...', type: 'textarea', maxLength: 1000 },
      { key: 'funniestMemory', label: 'Your funniest memory together', placeholder: 'Remember when...', type: 'textarea', maxLength: 1000 },
      { key: 'achievement', label: 'An achievement you\'re proud of them for', placeholder: 'e.g. How they overcame...', type: 'textarea', maxLength: 500 },
      { key: 'dreamGoal', label: 'A dream or goal you want to acknowledge', placeholder: 'e.g. Their dream of opening a bakery...', type: 'textarea', maxLength: 500 },
    ],
  },

  // ── Step 5: Your letter ─────────────────────────────
  {
    id: 'letter',
    title: 'Share what you feel',
    subtitle: 'Give us the meaning. Our storyteller will shape it into something beautifully expressed.',
    icon: Heart,
    accentColor: 'var(--accent-rose)',
    fields: [
      { key: 'personalLetter', label: 'What do you want them to feel?', placeholder: 'Share the thoughts, promises, or wishes you want the greeting to convey...', type: 'textarea', maxLength: 5000, helperText: 'We will re-author your notes with warmth and polish — they will not be copied word for word.' },
    ],
  },

  // ── Step 6: Timeline ────────────────────────────────
  {
    id: 'timeline',
    title: 'Your story together',
    subtitle: 'Add key moments and milestones from your journey together.',
    icon: Sparkles,
    accentColor: 'var(--accent-blue)',
    fields: [
      { key: 'timeline', label: 'Timeline milestones', type: 'timeline', helperText: 'Add at least 3 milestones for the best experience (dates + short captions)' },
    ],
  },

  // ── Step 7: Photos & Media ──────────────────────────
  {
    id: 'media',
    title: 'Add photos & media',
    subtitle: 'Photos bring the greeting to life. Upload your best memories together.',
    icon: Camera,
    accentColor: 'var(--accent-purple)',
    fields: [
      { key: 'photos', label: 'Photos', type: 'photos', helperText: 'Upload up to 20 photos. Square or portrait work best.' },
      { key: 'mediaConsent', label: 'I confirm I have the rights to share these photos, videos, and music', type: 'checkbox', required: true },
    ],
  },

  // ── Step 8: Style & tone ────────────────────────────
  {
    id: 'style',
    title: 'Set the mood',
    subtitle: 'Choose the tone and style that best matches your relationship.',
    icon: Palette,
    accentColor: 'var(--accent-rose)',
    fields: [
      { key: 'tone', label: 'Tone of the greeting', type: 'option-cards', options: [
        { value: 'funny', label: 'Funny', emoji: '😂', description: 'Light-hearted & witty' },
        { value: 'emotional', label: 'Emotional', emoji: '🥹', description: 'Deep & heartfelt' },
        { value: 'formal', label: 'Formal', emoji: '🎩', description: 'Elegant & respectful' },
        { value: 'cute', label: 'Cute', emoji: '🥰', description: 'Sweet & playful' },
      ]},
      { key: 'themeMode', label: 'Theme', type: 'option-cards', options: [
        { value: 'dark', label: 'Dark', emoji: '🌙', description: 'Premium dark mode' },
        { value: 'light', label: 'Light', emoji: '☀️', description: 'Clean light mode' },
      ]},
      { key: 'photoLayout', label: 'Photo layout style', type: 'option-cards', options: [
        { value: 'polaroid', label: 'Polaroid Stack', emoji: '📸', description: 'Scattered instant photos' },
        { value: 'filmstrip', label: 'Film Strip', emoji: '🎞️', description: 'Horizontal scrolling' },
        { value: 'masonry', label: 'Masonry', emoji: '🧱', description: 'Pinterest-style grid' },
        { value: 'carousel', label: 'Carousel', emoji: '🎠', description: 'Full-width slides' },
      ]},
      { key: 'emojiUsage', label: 'Emoji usage', type: 'option-cards', options: [
        { value: 'none', label: 'None', description: 'Clean, no emoji' },
        { value: 'light', label: 'Light', description: 'A few accents' },
        { value: 'expressive', label: 'Expressive', description: 'Lots of emoji!' },
      ]},
    ],
  },

  // ── Step 9: Final details & send ────────────────────
  {
    id: 'delivery',
    title: 'Final touches',
    subtitle: 'Any last details before we create the magic?',
    icon: Send,
    accentColor: 'var(--accent-blue)',
    fields: [
      { key: 'senderName', label: 'Your name', placeholder: 'How should the greeting be signed?', type: 'text', required: true, helperText: 'Shown delicately at the end as the presenter' },
      { key: 'additionalNotes', label: 'Anything else the AI should know?', placeholder: 'e.g. They love cats, mention their dog Max, avoid mentioning their ex...', type: 'textarea', maxLength: 1000, helperText: 'Optional but helps the AI nail the details' },
      { key: 'deviceTarget', label: 'Primary device for viewing', type: 'option-cards', options: [
        { value: 'mobile', label: 'Mobile', emoji: '📱' },
        { value: 'desktop', label: 'Desktop', emoji: '💻' },
        { value: 'both', label: 'Both', emoji: '📱💻' },
      ]},
      { key: 'socialLinks', label: 'Social links to embed (optional)', placeholder: 'e.g. instagram.com/username', type: 'text' },
    ],
  },
];

export const TOTAL_STEPS = FORM_STEPS.length;
