import type { FormData } from '@/features/form/schema';
import { FIELD_LABELS, FORM_FIELD_KEYS } from './form-fields';

type PersonalizedDetail = {
  field: string;
  label: string;
  line: string;
};

const hasText = (value: unknown): value is string => typeof value === 'string' && value.trim().length > 0;

const isMeaningful = (value: unknown) => {
  if (Array.isArray(value)) return value.length > 0;
  if (typeof value === 'boolean') return value === true;
  return value !== undefined && value !== null && value !== '';
};

const clean = (value: unknown) => String(value ?? '').trim();

function colorLine(value: string, name: string) {
  const color = value.trim();
  const lower = color.toLowerCase();
  if (lower.includes('blue')) {
    return `${name} likes ${color}, so this page keeps a little sky in its pocket: calm enough to trust, deep enough to fall for.`;
  }
  if (/(pink|rose|peach|red)/i.test(color)) return `${color} follows ${name} through the design like a shy blush that learned how to glow.`;
  if (/(gold|yellow|orange)/i.test(color)) return `${color} becomes the warm little spotlight this story saves for ${name}.`;
  if (/(green|teal)/i.test(color)) return `${color} gives ${name}'s page the feeling of something alive, fresh, and quietly hopeful.`;
  return `${color} is not just a favorite color here; it becomes the mood lighting for ${name}'s story.`;
}

function detailLine(field: keyof FormData, value: FormData[keyof FormData], data: FormData, name: string) {
  const text = clean(value);

  switch (field) {
    case 'recipientName':
      return `${name} is the name this whole little world gathers around.`;
    case 'recipientNickname':
      return `${text} gets treated like a secret title only affection knows how to pronounce.`;
    case 'recipientAge':
      return `${text} is not just an age; it is a chapter arriving with its own soft spotlight.`;
    case 'recipientGender':
      return `${text} helps the words hold ${name} with the right kind of care.`;
    case 'relationship':
      return `Being ${text} is the emotional compass for every scene on this page.`;
    case 'occasionDate':
      return `${text} becomes a small pin in time, marking where this feeling learned a date.`;
    case 'occasion':
      return `${text.replace('-', ' ')} shapes the celebration without making it feel ordinary.`;
    case 'customOccasion':
      return `${text} gets its own custom glow, because not every important moment fits a preset label.`;
    case 'personalityDescription':
      return `${name}'s personality is rewritten here as movement, warmth, and tiny details that refuse to be generic.`;
    case 'favoriteColor':
      return colorLine(text, name);
    case 'favoriteFood':
      if (/porotta|parotta|paratha/i.test(text)) return `${text} becomes the pickup line: like every perfect layer, ${name} makes the heart want one more warm moment.`;
      if (/biryani|biriyani/i.test(text)) return `${text} brings the spice, but ${name} is the reason the whole moment feels worth serving with both hands.`;
      return `${text} is folded into the page as a flavor of comfort only ${name}'s story could choose.`;
    case 'favoriteAnimal':
      return /dog|puppy/i.test(text)
        ? `${name}'s love for ${text} leaves soft paw-print magic across the page.`
        : `${text} wanders into the design as one of ${name}'s tender little favorites.`;
    case 'favoriteFlower':
      return `${text} blooms quietly in the background, because ${name}'s favorite things deserve petals, not bullet points.`;
    case 'favoriteHobby':
      return `${text} becomes a scene where ${name} looks completely at home.`;
    case 'favoritePlace':
      return `${text} is treated like a memory doorway, not just a location.`;
    case 'favoriteMovie':
      return `${text} lends the page a little cinema from ${name}'s own taste.`;
    case 'favoriteSong':
      return `${text} becomes the invisible soundtrack behind the softer lines.`;
    case 'favoriteGame':
      return `${text} adds a playful rule to the page: joy should feel personal.`;
    case 'favoriteQuote':
      return `${name}'s loved quote is carried as a quiet echo, polished into the page's own voice.`;
    case 'travelDestination':
      return `${text} waits in the distance like a future postcard with ${name}'s name on it.`;
    case 'whatMakesThemSpecial':
      return `Your reason for loving ${name} is transformed into the emotional heartbeat of the story.`;
    case 'personalLetter':
      return `Your note is not pasted here; it is re-authored into a promise that feels worthy of ${name}.`;
    case 'funniestMemory':
      return `That funny memory becomes laughter with a longer life than the moment itself.`;
    case 'bestMoment':
      return `The best moment becomes a glowing scene, held carefully instead of repeated plainly.`;
    case 'achievement':
      return `${name}'s achievement is framed as courage with a little applause around it.`;
    case 'dreamGoal':
      return `${name}'s dream is placed near the ending, where hope knows how to look forward.`;
    case 'timeline':
      return `${Array.isArray(value) ? value.length : 0} timeline moment${Array.isArray(value) && value.length === 1 ? '' : 's'} become stepping stones through the page.`;
    case 'photos':
      return `${Array.isArray(value) ? value.length : 0} photo${Array.isArray(value) && value.length === 1 ? '' : 's'} become visual proof that the story has lived moments.`;
    case 'video':
      return `The video detail is saved as another doorway into the memory.`;
    case 'voiceMessage':
      return `The voice note turns the greeting into something closer to being there.`;
    case 'backgroundMusic':
      return `${text} becomes the page's emotional undercurrent.`;
    case 'tone':
      return `${text} controls the voice, so the writing feels intentionally ${text}, not accidentally generic.`;
    case 'density':
      return `${text} density tells the design how richly to dress the moment.`;
    case 'themeMode':
      return `${text} mode becomes the room where the feeling is staged.`;
    case 'language':
      return `${text} guides the page toward the language the heart should speak in.`;
    case 'emojiUsage':
      return `${text} emoji usage decides whether the sparkle whispers or dances.`;
    case 'photoLayout':
      return `${text} layout shapes how the memories make their entrance.`;
    case 'senderName':
      return `${text} is written into the dedication as the hand behind the gift.`;
    case 'deviceTarget':
      return `${text} viewing keeps the page paced for the screen where the surprise will land.`;
    case 'socialLinks':
      return `The social link is held as a small bridge beyond the greeting.`;
    case 'additionalNotes':
      return `Your extra note becomes creative direction, not copied text.`;
    case 'mediaConsent':
      return `The shared memories are handled with permission and care.`;
    default:
      return `${FIELD_LABELS[field]} is woven into the page with ${name} in mind.`;
  }
}

export function buildPersonalizedDetails(data: FormData): PersonalizedDetail[] {
  const name = data.recipientNickname?.trim() || data.recipientName || 'them';

  return FORM_FIELD_KEYS.flatMap((field) => {
    const value = data[field];
    if (!isMeaningful(value)) return [];

    if (hasText(value) && value.trim().length === 0) return [];

    return [{
      field,
      label: FIELD_LABELS[field],
      line: detailLine(field, value, data, name),
    }];
  });
}
