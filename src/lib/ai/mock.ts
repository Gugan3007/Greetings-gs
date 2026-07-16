import type { FormData } from '@/features/form/schema';
import type { GreetingContent } from './schema';
import { buildCoverageMap } from './form-fields';

const includesAny = (value: string, terms: string[]) =>
  terms.some((term) => value.toLowerCase().includes(term));

const capitalizeFirst = (value: string) => value ? value[0].toLocaleUpperCase() + value.slice(1) : value;

function authoredPersonality(data: FormData, name: string) {
  const notes = `${data.personalityDescription} ${data.whatMakesThemSpecial} ${data.additionalNotes}`.toLowerCase();
  if (includesAny(notes, ['kind', 'care', 'gentle', 'help', 'warm'])) return `${name}'s kindness never performs for applause; it simply notices what a heart needs and quietly leaves the day softer than it found it.`;
  if (includesAny(notes, ['fun', 'laugh', 'joke', 'playful', 'funny'])) return `${name} carries laughter like pocket-sized sunlight, always ready to rescue an ordinary moment from taking itself too seriously.`;
  if (includesAny(notes, ['brave', 'strong', 'resilient', 'hardwork', 'hard work'])) return `There is a graceful strength in ${name} — not the loud kind, but the kind that keeps choosing courage when no one is watching.`;
  if (includesAny(notes, ['family', 'home', 'mother', 'mom', 'father', 'dad'])) return `${name} has made belonging feel less like a place and more like the certainty that someone will always leave a light on for you.`;
  if (includesAny(notes, ['travel', 'adventure', 'explore', 'curious'])) return `${name} meets the world with an open window for a heart, finding wonder in roads others might pass without noticing.`;
  return `What makes ${name} unforgettable is not one grand quality, but the rare way their presence makes people feel seen, safe, and a little more themselves.`;
}

function authoredMemory(data: FormData, name: string) {
  if (!data.bestMoment && !data.funniestMemory) return '';
  if (data.favoritePlace) return `${data.favoritePlace} is more than a pin on a map now; because of ${name}, it has become a doorway back to a feeling worth keeping.`;
  if (data.funniestMemory) return `Somewhere between a shared glance and uncontrollable laughter, ${name} turned one small moment into a story that still knows how to make the heart smile.`;
  return `One memory with ${name} has outgrown its place in time; it returns whenever the heart needs proof that beautiful days really happened.`;
}

const timelinePoetry = [
  'The day an ordinary date quietly became part of the story.',
  'A little chapter that still glows when memory turns back to it.',
  'One more reason this journey could never be called ordinary.',
  'A milestone made meaningful by the hearts that reached it together.',
];

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

function companionshipLine(data: FormData, name: string, archetype: NonNullable<GreetingContent['theme']['archetype']>) {
  const source = `${data.personalLetter} ${data.whatMakesThemSpecial} ${data.additionalNotes}`.toLowerCase();
  if (includesAny(source, ['always', 'wherever', 'whenever', 'there with you', 'with you'])) {
    if (archetype === 'romance') return `Wherever life decides to turn next, I want my place to be the quiet one beside ${name} — close enough for the hard days, playful enough for the good ones.`;
    if (archetype === 'family') return `Wherever the road bends, ${name} deserves the steady kind of love that keeps showing up without needing to be asked.`;
    return `${name} should never have to wonder where the support is; it is walking close, cheering softly, and staying near through every turn.`;
  }
  if (includesAny(source, ['safe', 'comfort', 'calm'])) return `${name} has a way of making care feel like a safe place to return to, and this page returns that warmth in its own small way.`;
  if (includesAny(source, ['laugh', 'funny', 'teasing'])) return `Even the silly moments with ${name} know how to become keepsakes, carrying laughter long after the moment has passed.`;
  return `The feeling behind these words is simple but not small: ${name} is deeply noticed, warmly chosen, and held in a story that keeps making room for more.`;
}

function letterCompanionshipLine(data: FormData, name: string, archetype: NonNullable<GreetingContent['theme']['archetype']>) {
  const source = `${data.personalLetter} ${data.whatMakesThemSpecial} ${data.additionalNotes}`.toLowerCase();
  if (includesAny(source, ['always', 'wherever', 'whenever', 'there with you', 'with you'])) {
    if (archetype === 'romance') return `I cannot promise that every day will be easy, but I can promise this: you will never have to look too far to find me choosing your side.`;
    if (archetype === 'family') return `May you always feel love close enough to lean on, especially on the days that ask for more courage than usual.`;
    return `Whatever changes around you, let this be one steady truth: you are not being cheered for from a distance.`;
  }
  if (includesAny(source, ['safe', 'comfort', 'calm'])) return `You have given so much calm to others; I hope this page gives a little of that peace back to you.`;
  if (includesAny(source, ['laugh', 'funny', 'teasing'])) return `I hope we keep collecting the kind of laughter that refuses to stay small.`;
  return `I hope these words make you feel what the form could only point toward: how fully and carefully you are loved.`;
}

function preferenceScene(data: FormData, name: string) {
  const scenes: string[] = [];
  if (data.favoriteAnimal) {
    scenes.push(includesAny(data.favoriteAnimal, ['dog', 'puppy'])
      ? `Even the imagined paw prints around this page feel right for ${name}, because every soft-hearted detail seems to know where it belongs.`
      : `A little trace of ${data.favoriteAnimal} belongs in this story, because ${name}'s favorite things deserve more than a passing mention.`);
  }
  if (data.favoriteFood && !includesAny(data.favoriteFood, ['porotta', 'parotta', 'biryani', 'biriyani'])) {
    scenes.push(`${capitalizeFirst(data.favoriteFood)} becomes part of the scene too, not as a label, but as one more flavor of how ${name} likes joy to arrive.`);
  }
  return scenes.join('\n\n');
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

  const storyOpeners: Record<typeof archetype, string> = {
    romance: `Somewhere along the way, the smallest moments with ${name} became the ones my heart began saving most carefully.`,
    family: `The love ${name} gives has never needed a spotlight; it can be felt in the traditions, reassurances, and quiet care that hold a family together.`,
    friendship: `The best part of knowing ${name} is how easily a simple day can collect the kind of details that become an inside story for years.`,
    achievement: `Long before this milestone had a name, ${name} was building it through choices that looked small to the world and brave to those who truly noticed.`,
    comfort: `There are seasons when love is best expressed as patience, presence, and a gentle reminder that ${name} never has to carry everything alone.`,
    celebration: `A meaningful celebration looks beyond the calendar and notices all the little ways ${name} has made the journey worth cheering for.`,
  };

  const story = [
    storyOpeners[archetype],
    authoredPersonality(data, name),
    companionshipLine(data, name, archetype),
    preferenceScene(data, name),
    authoredMemory(data, name),
    data.achievement && `There is a hard-won chapter behind this celebration, and it deserves to be remembered not only for the result, but for the courage ${name} carried all the way there.`,
    data.dreamGoal && `A dream is waiting beyond this page, and if hope had a favorite person to bet on, it would surely choose ${name}.`,
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
    romance: `Dear ${name},\n\nThank you for making love feel less like a grand promise and more like a thousand beautiful choices we keep making. ${letterCompanionshipLine(data, name, archetype)} I hope every road ahead gives us new reasons to laugh, grow, and choose each other again.`,
    family: `Dear ${name},\n\nSo much of what feels steady, generous, and good in our lives carries your fingerprints. ${letterCompanionshipLine(data, name, archetype)} May this next chapter return even a little of the care you have given so freely.`,
    friendship: `Dear ${name},\n\nThank you for being the person who can hold both the serious stories and the ridiculous ones. ${letterCompanionshipLine(data, name, archetype)} Life is kinder, funnier, and far more memorable with you in it.`,
    achievement: `Dear ${name},\n\nI hope you pause long enough to see what the rest of us see: courage that kept moving, even before anyone applauded. ${letterCompanionshipLine(data, name, archetype)} This moment is yours, and it is only the beginning.`,
    comfort: `Dear ${name},\n\nYou do not have to be strong every minute. ${letterCompanionshipLine(data, name, archetype)} Let today be gentle, let love do some of the carrying, and remember how many people are quietly standing beside you.`,
    celebration: `Dear ${name},\n\n${letterCompanionshipLine(data, name, archetype)} May the chapter ahead surprise you with good people, brave beginnings, and ordinary days that become favorite memories without warning.`,
  };

  const highlightCandidates = [
    data.favoriteAnimal && {
      title: `A soft spot for ${data.favoriteAnimal}`,
      description: `Even this page knows ${data.favoriteAnimal.toLowerCase()} belong wherever ${name} feels happiest.`,
      emoji: '🐾',
    },
    data.favoriteFood && { title: 'The comfort order', description: foodHighlight(data.favoriteFood, name), emoji: '✨' },
    data.favoriteHobby && { title: 'In their element', description: `${capitalizeFirst(data.favoriteHobby)} is where time slows down and ${name} looks completely at home.`, emoji: '✦' },
    data.achievement && { title: 'Proud is an understatement', description: `${name} turned persistence into a chapter worth standing up for.`, emoji: '↗' },
    { title: 'Their real superpower', description: superpowerDescriptions[archetype], emoji: archetype === 'family' ? '⌂' : '♡' },
  ].filter(Boolean) as GreetingContent['memoryHighlights'];

  return {
    recipientName: data.recipientName,
    presentedBy: data.senderName,
    heroHeadline: heroHeadlines[archetype],
    greetingMessage: relationshipOpeners[archetype],
    story,
    letter: defaultLetters[archetype],
    quotes: [originalQuotes[archetype]],
    timeline: data.timeline.slice(0, 8).map((milestone, index) => ({ date: milestone.date, caption: timelinePoetry[index % timelinePoetry.length] })),
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
    coverageMap: buildCoverageMap(),
  };
}
