import type { GreetingContent } from '@/lib/ai/schema';

export type SceneMotifFamily = 'animal' | 'flower' | 'food' | 'hobby' | 'place' | 'game' | 'archetype';

export type SceneMotif = {
  id: string;
  family: SceneMotifFamily;
  glyph: string;
  className: string;
  drift: number;
  duration: number;
  delay: number;
};

export type PersonalizedScene = {
  palette: [string, string];
  motifs: SceneMotif[];
};

const FIELD_FAMILIES: Record<string, SceneMotifFamily | undefined> = {
  favoriteAnimal: 'animal',
  favoriteFlower: 'flower',
  favoriteFood: 'food',
  favoriteHobby: 'hobby',
  favoritePlace: 'place',
  travelDestination: 'place',
  favoriteGame: 'game',
};

const FAMILY_PRIORITY: SceneMotifFamily[] = ['animal', 'flower', 'hobby', 'place', 'game', 'food'];
const SLOTS = [
  'left-[7%] top-[16%]',
  'right-[8%] top-[28%]',
  'left-[12%] top-[52%]',
  'right-[13%] top-[66%]',
  'left-[20%] top-[82%]',
  'right-[22%] top-[88%]',
];

const ARCHETYPE_GLYPHS: Record<NonNullable<GreetingContent['theme']['archetype']>, string[]> = {
  romance: ['♡', '∞'],
  family: ['⌂', '♡'],
  friendship: ['✦', '∞'],
  celebration: ['✦', '·'],
  comfort: ['❀', '♡'],
  achievement: ['↗', '✦'],
};

const PALETTES: Array<[RegExp, [string, string]]> = [
  [/blue|ocean|sky/i, ['#60a5fa', '#22d3ee']],
  [/pink|rose|peach|red/i, ['#fb7185', '#f9a8d4']],
  [/purple|violet|lavender/i, ['#c084fc', '#818cf8']],
  [/gold|yellow|orange/i, ['#fbbf24', '#fb7185']],
  [/green|teal|mint/i, ['#34d399', '#2dd4bf']],
  [/black|white|silver/i, ['#d4d4d8', '#71717a']],
];

function glyphFor(family: SceneMotifFamily, text: string) {
  if (family === 'animal') {
    if (/dog|cat|pupp|paw/i.test(text)) return '🐾';
    if (/bird/i.test(text)) return '⌁';
    if (/horse/i.test(text)) return '♞';
    return '◌';
  }
  if (family === 'flower') return '❀';
  if (family === 'food') {
    if (/coffee/i.test(text)) return '≋';
    if (/porotta|parotta|layer/i.test(text)) return '◌';
    if (/ice cream/i.test(text)) return '◒';
    return '✦';
  }
  if (family === 'hobby') {
    if (/music|sing/i.test(text)) return '♫';
    if (/dance/i.test(text)) return '⌁';
    if (/paint|sketch|draw/i.test(text)) return '╱';
    if (/cook/i.test(text)) return '≈';
    return '✦';
  }
  if (family === 'place') {
    if (/beach|ocean|sea|maldives/i.test(text)) return '∿';
    if (/home|temple/i.test(text)) return '⌂';
    return '⌁';
  }
  if (family === 'game') {
    if (/chess/i.test(text)) return '♟';
    if (/badminton/i.test(text)) return '⌁';
    if (/bgmi|pixel|video game/i.test(text)) return '◇';
    if (/football|cricket/i.test(text)) return '●';
    return '◈';
  }
  return '✦';
}

function motif(family: SceneMotifFamily, glyph: string, index: number): SceneMotif {
  return {
    id: `${family}-${index}-${glyph}`,
    family,
    glyph,
    className: SLOTS[index],
    drift: index % 2 === 0 ? -14 : 14,
    duration: 10 + index * 1.75,
    delay: index * 0.45,
  };
}

export function buildPersonalizedScene(data: GreetingContent): PersonalizedScene {
  const detailText = data.personalizedDetails.map((detail) => detail.line).join(' ');
  const colorText = data.personalizedDetails
    .filter((detail) => detail.field === 'favoriteColor')
    .map((detail) => detail.line)
    .join(' ');
  const palette = PALETTES.find(([pattern]) => pattern.test(colorText))?.[1]
    || (data.theme.accent === 'roseGold'
      ? ['#fb7185', '#e8b4b8']
      : data.theme.accent === 'purple'
        ? ['#c084fc', '#818cf8']
        : ['#60a5fa', '#22d3ee']) as [string, string];

  const byFamily = new Map<SceneMotifFamily, string>();
  for (const detail of data.personalizedDetails) {
    const family = FIELD_FAMILIES[detail.field];
    if (family && !byFamily.has(family)) byFamily.set(family, detail.line);
  }

  const themeText = (data.theme.motifs || []).join(' ');
  if (!byFamily.has('animal') && /dog|cat|pupp|paw|bird|horse|rabbit/i.test(themeText)) byFamily.set('animal', themeText);
  if (!byFamily.has('flower') && /flower|rose|jasmine|sunflower|lily|lotus|tulip/i.test(themeText)) byFamily.set('flower', themeText);
  if (!byFamily.has('hobby') && /music|dance|paint|sketch|travel|cook/i.test(themeText)) byFamily.set('hobby', themeText);

  const selected = FAMILY_PRIORITY
    .filter((family) => byFamily.has(family))
    .slice(0, 3)
    .map((family, index) => motif(family, glyphFor(family, byFamily.get(family) || detailText), index));

  const archetype = data.theme.archetype || 'celebration';
  const accents = ARCHETYPE_GLYPHS[archetype].map((glyph, offset) =>
    motif('archetype', glyph, selected.length + offset)
  );

  return { palette, motifs: [...selected, ...accents].slice(0, 6) };
}
