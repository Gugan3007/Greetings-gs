import type { FormData } from '@/features/form/schema';
import type { GreetingContent } from './schema';

const includesAny = (value: string, terms: string[]) =>
  terms.some((term) => value.toLowerCase().includes(term));

const capitalizeFirst = (value: string) => value ? value[0].toLocaleUpperCase() + value.slice(1) : value;
const lowerFirst = (value: string) => value ? value[0].toLocaleLowerCase() + value.slice(1) : value;

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
  const displayValue = capitalizeFirst(value);
  if (!value) return '';
  const lower = value.toLowerCase();
  if (includesAny(lower, ['porotta', 'parotta', 'paratha'])) {
    if (archetype === 'romance') return `If love had layers like a perfect ${value}, I would still save every warm, irresistible one for ${name}.`;
    if (archetype === 'family') return `${name} brings us together like hot ${value} at the family table — with warmth in every layer.`;
    return `Life with ${name} has ${value} energy: beautifully layered, best shared, and impossible to leave unfinished.`;
  }
  if (includesAny(lower, ['biryani', 'biriyani', 'biriani'])) {
    if (archetype === 'romance') return `If love were ${value}, ${name} would be the secret spice — the reason every ordinary moment suddenly feels unforgettable.`;
    if (archetype === 'family') return `${displayValue} fills the table, but ${name} is the warmth that makes everyone stay a little longer.`;
    return `${name} and ${value} have something in common: both turn a simple day into an occasion worth remembering.`;
  }
  if (includesAny(lower, ['cake', 'chocolate', 'sweet', 'ice cream'])) return `${name} makes ordinary days feel like dessert arrived early — especially when ${value} is involved.`;
  if (includesAny(lower, ['coffee', 'tea', 'chai'])) return `${name} is the human version of the perfect ${value}: warm, comforting, and exactly what a day needs.`;
  return `${displayValue} has the flavor, but ${name} is the memory everyone wants another serving of.`;
}

function buildMotifs(data: FormData, archetype: NonNullable<GreetingContent['theme']['archetype']>) {
  const motifs: string[] = [];
  const animal = data.favoriteAnimal.trim();
  if (animal) motifs.push(includesAny(animal, ['dog', 'puppy']) ? '🐾 Paw prints' : `${animal} moments`);
  if (data.favoriteFood) {
    if (includesAny(data.favoriteFood, ['porotta', 'parotta'])) motifs.push('🫓 Joyful layers');
    else if (includesAny(data.favoriteFood, ['biryani', 'biriyani'])) motifs.push('✦ Biryani nights');
    else motifs.push(`✦ ${data.favoriteFood}`);
  }
  if (data.favoriteFlower) motifs.push(`❀ ${data.favoriteFlower}`);
  if (data.favoriteHobby) motifs.push(`✦ ${data.favoriteHobby}`);
  if (data.favoritePlace) motifs.push(`⌖ ${data.favoritePlace}`);
  if (archetype === 'romance') motifs.push('F · L · A · M · E · S');
  if (archetype === 'family') motifs.push('Home is a person');
  if (archetype === 'friendship') motifs.push('Chosen family');
  return motifs.slice(0, 6);
}

function foodHighlight(food: string, name: string) {
  if (includesAny(food, ['porotta', 'parotta'])) return `The quickest route to ${name}'s happiest mood has warm, flaky layers.`;
  if (includesAny(food, ['biryani', 'biriyani'])) return `Fragrant, generous, and never meant to be rushed — ${name}'s kind of comfort.`;
  return `${name}'s comfort pick, deserving of a place in this story all its own.`;
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
    romance: `Our story is not held together by grand gestures; it lives in the glances, laughter, and tiny rituals that only ${name} and I understand.`,
    family: `Before the world taught me what belonging meant, ${name} had already made it feel like home.`,
    friendship: `${name} has a rare gift: ordinary afternoons quietly become the stories we never stop telling.`,
    achievement: `This moment carries every unseen try, brave choice, and stubborn hope that brought ${name} here.`,
    comfort: `Consider this page a pocket of warmth for ${name} — soft, steady, and full of people quietly cheering them on.`,
    celebration: `Today feels brighter because it gets to pause, look at ${name}, and celebrate the person behind all that light.`,
  };

  const story = [
    relationshipOpeners[archetype],
    data.personalityDescription && `To know ${name} is to notice something immediately — ${lowerFirst(data.personalityDescription.trim())}`,
    data.whatMakesThemSpecial && `What stays with people long after the moment passes — ${lowerFirst(data.whatMakesThemSpecial.trim())}`,
    data.bestMoment && `One memory keeps finding its way back with a glow of its own — ${data.bestMoment.trim()}`,
    data.dreamGoal && `Ahead, one dream is waiting to meet ${name}'s courage — ${data.dreamGoal.trim()}`,
  ]
    .filter(Boolean)
    .join('\n\n');

  const originalQuotes: Record<typeof archetype, string> = {
    romance: `I did not fall for a perfect moment; I fell for the person who makes imperfect moments feel worth keeping.`,
    family: `Home was never only a place — it was the way ${name} made love feel dependable.`,
    friendship: `Some people join your life; ${name} somehow becomes part of its favorite language.`,
    achievement: `The applause belongs to this moment, but the courage belongs to every day that came before it.`,
    comfort: `Even on the quiet days, ${name} is surrounded by more love than a single page could hold.`,
    celebration: `${name} does not need to become more remarkable; today simply gives us time to notice what was already there.`,
  };

  const superpowerDescriptions: Record<typeof archetype, string> = {
    romance: `${name} makes being understood feel effortless — a quiet kind of magic that never asks for attention.`,
    family: `${name} can turn concern into comfort and an ordinary room into somewhere everyone belongs.`,
    friendship: `${name} listens between the words, remembers the small things, and always knows when laughter is needed.`,
    achievement: `${name} keeps moving with courage even when nobody is watching — that is the victory behind the victory.`,
    comfort: `${name}'s strength has never needed to be loud; it simply keeps showing up, one gentle day at a time.`,
    celebration: `${name} carries the kind of presence that makes people feel noticed, welcome, and glad they came.`,
  };

  const heroHeadlines: Record<typeof archetype, string> = {
    romance: `My favorite person, in every possible universe.`,
    family: `The person who taught love how to feel like home.`,
    friendship: `Proof that the best people make the best stories.`,
    achievement: `Quiet courage, finally getting its standing ovation.`,
    comfort: `A softer corner of the world, made just for ${name}.`,
    celebration: `A whole little world, made for ${name}.`,
  };

  const defaultLetters: Record<typeof archetype, string> = {
    romance: `Dear ${name},\n\nThank you for making love feel less like a grand promise and more like a thousand beautiful choices we keep making. I hope every road ahead gives us new reasons to laugh, grow, and choose each other again.`,
    family: `Dear ${name},\n\nSo much of what feels steady, generous, and good in our lives carries your fingerprints. May this next chapter return even a little of the care you have given so freely.`,
    friendship: `Dear ${name},\n\nThank you for being the person who can hold both the serious stories and the ridiculous ones. Life is kinder, funnier, and far more memorable with you in it.`,
    achievement: `Dear ${name},\n\nI hope you pause long enough to see what the rest of us see: courage that kept moving, even before anyone applauded. This moment is yours — and it is only the beginning.`,
    comfort: `Dear ${name},\n\nYou do not have to be strong every minute. Let today be gentle, let love do some of the carrying, and remember how many people are quietly standing beside you.`,
    celebration: `Dear ${name},\n\nMay the chapter ahead surprise you with good people, brave beginnings, and ordinary days that become favorite memories without warning.`,
  };

  const highlightCandidates = [
    data.favoriteAnimal && {
      title: `A soft spot for ${data.favoriteAnimal}`,
      description: `Even this page knows ${data.favoriteAnimal.toLowerCase()} belong wherever ${name} feels happiest.`,
      emoji: '🐾',
    },
    data.favoriteFood && { title: 'The comfort order', description: foodHighlight(data.favoriteFood, name), emoji: '✨' },
    data.favoriteHobby && { title: 'In their element', description: `${capitalizeFirst(data.favoriteHobby)} is where time slows down and ${name} looks completely at home.`, emoji: '✦' },
    data.achievement && { title: 'Proud is an understatement', description: data.achievement, emoji: '↗' },
    { title: 'Their real superpower', description: superpowerDescriptions[archetype], emoji: archetype === 'family' ? '⌂' : '♡' },
  ].filter(Boolean) as GreetingContent['memoryHighlights'];

  return {
    recipientName: data.recipientName,
    heroHeadline: heroHeadlines[archetype],
    greetingMessage: relationshipOpeners[archetype],
    story,
    letter: data.personalLetter || defaultLetters[archetype],
    quotes: [data.favoriteQuote, originalQuotes[archetype]].filter(Boolean) as string[],
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
      ? includesAny(data.favoriteFood, ['biryani', 'biriyani'])
        ? `A little spice, a lot of heart, and one person worth saving the last spoonful for.`
        : `F · L · A · M · E · S — whatever the old game says, my answer is still ${name}.`
      : archetype === 'family'
        ? `${name}: the reason “come home” has always sounded like a feeling, not a direction.`
        : data.favoriteAnimal
          ? `Officially approved by every imaginary paw print wandering through this page.`
        : motifs[0]
          ? `A small universe built from ${motifs[0].replace(/^[^\p{L}\p{N}]+/u, '').toLowerCase()} and the details only loved ones notice.`
          : `Made from the details that make ${name}, ${name}.`,
    ogTitle: `A special greeting for ${data.recipientName}`,
    ogDescription: signatureLine.slice(0, 160),
  };
}
