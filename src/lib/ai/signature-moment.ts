import type { FormData } from '@/features/form/schema';
import type { GreetingContent } from './schema';

export const SIGNATURE_VISUAL_FAMILIES = [
  'balloons',
  'ring',
  'cap',
  'bouquet',
  'airplane',
  'fireworks',
  'aurora',
  'doorway',
  'briefcase',
] as const;

export type SignatureVisualFamily = (typeof SIGNATURE_VISUAL_FAMILIES)[number];

export type SignatureMoment = NonNullable<GreetingContent['signatureMoment']>;

type SignatureMomentConfig = {
  key: string;
  visualFamily: SignatureVisualFamily;
  occasionLabel: string;
  wish: (name: string) => string;
};

const normalize = (value: string | undefined) =>
  (value || '')
    .toLowerCase()
    .replace(/[^\p{L}\p{N}\s-]/gu, ' ')
    .replace(/\s+/g, ' ')
    .trim();

const titleCase = (value: string) =>
  value
    .split(/[\s-]+/)
    .filter(Boolean)
    .map((part) => part[0]?.toLocaleUpperCase() + part.slice(1))
    .join(' ');

export const SIGNATURE_MOMENT_REGISTRY: Record<string, SignatureMomentConfig> = {
  birthday: {
    key: 'birthday',
    visualFamily: 'balloons',
    occasionLabel: 'Birthday',
    wish: (name) => `Let joy rise around you today, ${name}.`,
  },
  anniversary: {
    key: 'anniversary',
    visualFamily: 'ring',
    occasionLabel: 'Anniversary',
    wish: (name) => `Here's to forever, ${name}.`,
  },
  wedding: {
    key: 'wedding',
    visualFamily: 'ring',
    occasionLabel: 'Wedding',
    wish: (name) => `May forever find its most beautiful shape around you, ${name}.`,
  },
  graduation: {
    key: 'graduation',
    visualFamily: 'cap',
    occasionLabel: 'Graduation',
    wish: (name) => `You did it, ${name}.`,
  },
  'get-well': {
    key: 'get-well',
    visualFamily: 'bouquet',
    occasionLabel: 'Get Well',
    wish: () => `Thinking of you, always.`,
  },
  farewell: {
    key: 'farewell',
    visualFamily: 'airplane',
    occasionLabel: 'Farewell',
    wish: (name) => `Go gently, go brightly, ${name}.`,
  },
  congratulations: {
    key: 'congratulations',
    visualFamily: 'fireworks',
    occasionLabel: 'Congratulations',
    wish: (name) => `This applause knows your name, ${name}.`,
  },
  'just-because': {
    key: 'just-because',
    visualFamily: 'aurora',
    occasionLabel: 'Just Because',
    wish: (name) => `No reason needed — you are reason enough, ${name}.`,
  },
  'new-home': {
    key: 'new-home',
    visualFamily: 'doorway',
    occasionLabel: 'New Home',
    wish: (name) => `May every door open into warmth, ${name}.`,
  },
  'new-job': {
    key: 'new-job',
    visualFamily: 'briefcase',
    occasionLabel: 'New Job',
    wish: (name) => `Step in like the room was waiting for you, ${name}.`,
  },
  retirement: {
    key: 'retirement',
    visualFamily: 'airplane',
    occasionLabel: 'Retirement',
    wish: (name) => `May the next horizon move at the speed of joy, ${name}.`,
  },
  'adoption-day': {
    key: 'adoption-day',
    visualFamily: 'aurora',
    occasionLabel: 'Adoption Day',
    wish: (name) => `Some families are found by love's finest compass, ${name}.`,
  },
  'sobriety-anniversary': {
    key: 'sobriety-anniversary',
    visualFamily: 'fireworks',
    occasionLabel: 'Sobriety Anniversary',
    wish: (name) => `Every brave day behind you is shining here, ${name}.`,
  },
};

const CUSTOM_OCCASION_MATCHERS: Array<{ key: string; terms: string[] }> = [
  { key: 'new-home', terms: ['new home', 'housewarming', 'home warming', 'house warming', 'new house', 'first home'] },
  { key: 'new-job', terms: ['new job', 'promotion', 'career', 'joining', 'office', 'work anniversary', 'first day'] },
  { key: 'retirement', terms: ['retirement', 'retire', 'retired'] },
  { key: 'adoption-day', terms: ['adoption', 'adoption day', 'gotcha day'] },
  { key: 'sobriety-anniversary', terms: ['sobriety', 'sober', 'recovery anniversary'] },
  { key: 'anniversary', terms: ['anniversary', 'love anniversary'] },
  { key: 'wedding', terms: ['wedding', 'marriage', 'reception', 'engagement'] },
  { key: 'graduation', terms: ['graduation', 'graduate', 'convocation', 'degree'] },
  { key: 'birthday', terms: ['birthday', 'born day'] },
  { key: 'get-well', terms: ['get well', 'recover', 'recovery', 'hospital', 'healing'] },
  { key: 'farewell', terms: ['farewell', 'goodbye', 'send off', 'moving away'] },
  { key: 'congratulations', terms: ['congratulations', 'congrats', 'winner', 'award', 'achievement'] },
];

export function resolveSignatureMomentKey(occasion: string, customOccasion?: string) {
  const baseOccasion = normalize(occasion);
  const custom = normalize(customOccasion);

  if (baseOccasion === 'custom' && custom) {
    const matched = CUSTOM_OCCASION_MATCHERS.find(({ terms }) => terms.some((term) => custom.includes(term)));
    return matched?.key || 'just-because';
  }

  return SIGNATURE_MOMENT_REGISTRY[baseOccasion] ? baseOccasion : 'just-because';
}

export function buildSignatureMoment(data: FormData): SignatureMoment {
  const name = data.recipientNickname?.trim() || data.recipientName.trim() || 'you';
  const key = resolveSignatureMomentKey(data.occasion, data.customOccasion);
  const config = SIGNATURE_MOMENT_REGISTRY[key] || SIGNATURE_MOMENT_REGISTRY['just-because'];
  const customLabel = data.occasion === 'custom' && data.customOccasion.trim()
    ? titleCase(data.customOccasion.trim())
    : config.occasionLabel;

  return {
    key: config.key,
    visualFamily: config.visualFamily,
    occasionLabel: customLabel,
    wish: config.wish(name),
  };
}
