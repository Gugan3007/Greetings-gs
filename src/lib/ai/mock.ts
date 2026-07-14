import type { FormData } from '@/features/form/schema';
import type { GreetingContent } from './schema';

const includesAny = (value: string, terms: string[]) =>
  terms.some((term) => value.toLowerCase().includes(term));

function relationshipArchetype(data: FormData): NonNullable<GreetingContent['theme']['archetype']> {
  const relationship = data.relationship.toLowerCase();
  if (includesAny(relationship, ['girlfriend', 'boyfriend', 'wife', 'husband', 'partner', 'fianc', 'lover'])) return 'romance';
  if (includesAny(relationship, ['mom', 'mother', 'dad', 'father', 'sister', 'brother', 'daughter', 'son', 'parent', 'grand'])) return 'family';
  if (data.occasion === 'graduation' || data.occasion === 'congratulations') return 'achievement';
  if (data.occasion === 'get-well') return 'comfort';
  if (includesAny(relationship, ['friend', 'bestie', 'buddy'])) return 'friendship';
  return 'celebration';
}

function accentFromColor(color: string): GreetingContent['theme']['accent'] {
  const normalized = color.toLowerCase();
  if (includesAny(normalized, ['blue', 'cyan', 'teal', 'aqua', 'green'])) return 'blue';
  if (includesAny(normalized, ['rose', 'pink', 'peach', 'gold', 'orange', 'red'])) return 'roseGold';
  return 'purple';
}

function foodLine(food: string, archetype: NonNullable<GreetingContent['theme']['archetype']>, name: string) {
  const value = food.trim();
  if (!value) return '';
  const lower = value.toLowerCase();
  if (includesAny(lower, ['porotta', 'parotta', 'paratha'])) {
    if (archetype === 'romance') return `With ${name}, love has the best kind of layers — warm, surprising, and impossible to resist, just like a perfect ${value}.`;
    if (archetype === 'family') return `${name} brings people together the way a hot ${value} brings everyone to the table: instantly and happily.`;
    return `Life with ${name} is like the perfect ${value}: full of layers, best shared, and never boring.`;
  }
  if (includesAny(lower, ['cake', 'chocolate', 'sweet', 'ice cream'])) return `${name} makes ordinary days feel like dessert arrived early — especially when ${value} is involved.`;
  if (includesAny(lower, ['coffee', 'tea', 'chai'])) return `${name} is the human version of the perfect ${value}: warm, comforting, and exactly what a day needs.`;
  return `${value} may be a favorite, but the real treat is every moment shared with ${name}.`;
}

function buildMotifs(data: FormData, archetype: NonNullable<GreetingContent['theme']['archetype']>) {
  const motifs: string[] = [];
  const animal = data.favoriteAnimal.trim();
  if (animal) motifs.push(includesAny(animal, ['dog', 'puppy']) ? '🐾 Paw prints' : `${animal} moments`);
  if (data.favoriteFood) motifs.push(includesAny(data.favoriteFood, ['porotta', 'parotta']) ? '🫓 Joyful layers' : `✦ ${data.favoriteFood}`);
  if (data.favoriteFlower) motifs.push(`❀ ${data.favoriteFlower}`);
  if (data.favoriteHobby) motifs.push(`✦ ${data.favoriteHobby}`);
  if (data.favoritePlace) motifs.push(`⌖ ${data.favoritePlace}`);
  if (archetype === 'romance') motifs.push('F · L · A · M · E · S');
  if (archetype === 'family') motifs.push('Home is a person');
  if (archetype === 'friendship') motifs.push('Chosen family');
  return motifs.slice(0, 6);
}

export function createPersonalizedMock(data: FormData): GreetingContent {
  const name = data.recipientNickname?.trim() || data.recipientName;
  const archetype = relationshipArchetype(data);
  const motifs = buildMotifs(data, archetype);
  const signatureLine = foodLine(data.favoriteFood, archetype, name) ||
    (data.favoriteAnimal
      ? `${name} leaves a little happiness everywhere — and maybe a few ${data.favoriteAnimal.toLowerCase()}-shaped footprints too.`
      : `${name} has a rare way of making the ordinary feel worth remembering.`);

  const relationshipOpeners: Record<typeof archetype, string> = {
    romance: `Some love stories are written in grand gestures. Ours lives in glances, laughter, and the little moments only we understand.`,
    family: `Some people are part of our story. ${name} is part of what makes it feel like home.`,
    friendship: `The best friendships turn ordinary days into the stories we keep telling. ${name} does exactly that.`,
    achievement: `${name} did not simply arrive at this moment — they earned it, one brave step at a time.`,
    comfort: `This is a small pocket of warmth for ${name}, filled with every good thought being sent their way.`,
    celebration: `Today has one very good reason to feel brighter: ${name}.`,
  };

  const details = [data.personalityDescription, data.whatMakesThemSpecial, data.bestMoment]
    .map((item) => item?.trim())
    .filter(Boolean);
  const story = [relationshipOpeners[archetype], details[0], details[1], details[2], signatureLine]
    .filter(Boolean)
    .join('\n\n');

  const highlightCandidates = [
    data.favoriteAnimal && {
      title: `A soft spot for ${data.favoriteAnimal}`,
      description: `${name}'s love for ${data.favoriteAnimal.toLowerCase()} is now woven into this little world.`,
      emoji: '🐾',
    },
    data.favoriteFood && { title: 'The comfort order', description: `${data.favoriteFood}, because the best favorites deserve their own spotlight.`, emoji: '✨' },
    data.favoriteHobby && { title: 'In their element', description: `Nothing looks more like joy than ${name} enjoying ${data.favoriteHobby}.`, emoji: '✦' },
    data.achievement && { title: 'Proud is an understatement', description: data.achievement, emoji: '↗' },
    { title: 'Their real superpower', description: data.whatMakesThemSpecial, emoji: archetype === 'family' ? '⌂' : '♡' },
  ].filter(Boolean) as GreetingContent['memoryHighlights'];

  return {
    recipientName: data.recipientName,
    heroHeadline: archetype === 'romance' ? `My favorite person, in every possible universe.` : `A whole little world, made for ${name}.`,
    greetingMessage: relationshipOpeners[archetype],
    story,
    letter: data.personalLetter || `Dear ${name},\n\n${data.whatMakesThemSpecial}\n\nMay this next chapter bring you the same joy you give to everyone around you.`,
    quotes: [signatureLine, data.favoriteQuote || `The little things are never little when they remind me of ${name}.`],
    timeline: data.timeline.slice(0, 8).map((milestone) => ({ date: milestone.date, caption: milestone.caption })),
    gallery: data.photos.slice(0, 12).map((url, index) => ({ url, caption: index === 0 ? 'A moment worth keeping' : undefined })),
    memoryHighlights: highlightCandidates.slice(0, 5),
    theme: {
      mode: data.themeMode,
      accent: accentFromColor(data.favoriteColor),
      density: data.density,
      archetype,
      motifs,
      themeLabel: archetype === 'romance' ? 'A love story in little things' : archetype === 'family' ? 'The feeling of home' : `A ${data.occasion.replace('-', ' ')} made personal`,
    },
    music: data.backgroundMusic || undefined,
    closingMessage: archetype === 'romance' ? 'Still choosing you. Always.' : archetype === 'family' ? 'With all the love a home can hold.' : 'Keep shining exactly as you are.',
    signatureLine,
    playfulAside: archetype === 'romance'
      ? `F · L · A · M · E · S — whatever the old game says, my answer is still ${name}.`
      : archetype === 'family'
        ? `${name}: proof that “home” was never only a place.`
        : motifs[0]
          ? `This page comes with a little extra ${motifs[0].replace(/^[^\p{L}\p{N}]+/u, '')}.`
          : `Made from the details that make ${name}, ${name}.`,
    ogTitle: `A special greeting for ${data.recipientName}`,
    ogDescription: signatureLine.slice(0, 160),
  };
}
