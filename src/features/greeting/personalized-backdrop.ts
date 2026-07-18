import type { GreetingContent } from '@/lib/ai/schema';

const DETAIL_FIELDS_FOR_AMBIENCE = new Set([
  'favoriteColor',
  'favoriteFood',
  'favoriteAnimal',
  'favoriteFlower',
  'favoriteHobby',
  'favoritePlace',
  'travelDestination',
  'favoriteGame',
]);

function compactMotif(value: string) {
  return value
    .replace(/^[^\p{L}\p{N}]+/u, '')
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, 22);
}

function extractDetailMotif(field: string, line: string) {
  const lowerLine = line.toLowerCase();

  if (field === 'favoriteColor') {
    const color = ['blue', 'pink', 'purple', 'gold', 'green', 'black', 'red', 'white'].find((item) => lowerLine.includes(item));
    return color || 'favorite color';
  }

  if (field === 'favoriteFood') {
    const food = ['porotta', 'parotta', 'biryani', 'biriyani', 'chicken', 'coffee', 'chocolate', 'pizza', 'ice cream'].find((item) => lowerLine.includes(item));
    return food || compactMotif(line.split(/\s+is\s+|\s+becomes\s+/i)[0] || line);
  }

  const afterLikes = line.match(/\blikes\s+([^,.:;]+)/i)?.[1];
  if (afterLikes) return compactMotif(afterLikes);

  const beforeBecomes = line.match(/^(.+?)\s+becomes\b/i)?.[1];
  if (beforeBecomes) return compactMotif(beforeBecomes);

  const loveFor = line.match(/\blove for\s+([^,.:;]+)/i)?.[1];
  if (loveFor) return compactMotif(loveFor);

  return compactMotif(line.split(/[,.]/)[0] || line);
}

export function buildBackdropMotifs(data: GreetingContent) {
  const motifSet = new Set<string>();

  for (const motif of data.theme.motifs || []) {
    const compacted = compactMotif(motif);
    if (compacted) motifSet.add(compacted);
  }

  for (const detail of data.personalizedDetails || []) {
    if (!DETAIL_FIELDS_FOR_AMBIENCE.has(detail.field)) continue;
    const motif = extractDetailMotif(detail.field, detail.line);
    if (motif) motifSet.add(motif);
  }

  return [...motifSet].slice(0, 6);
}
