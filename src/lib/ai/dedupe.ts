import type { GreetingContent } from './schema';

const textKey = (value: string) =>
  value
    .toLocaleLowerCase()
    .replace(/[“”"'`]/g, '')
    .replace(/[^\p{L}\p{N}]+/gu, ' ')
    .trim();

function uniqueText(values: string[], blocked = new Set<string>()) {
  const seen = new Set(blocked);
  return values.filter((value) => {
    const key = textKey(value);
    if (!key || seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

/**
 * Final safety pass for both provider and local generation. The template uses
 * signature, story, quotes, and highlights in separate visual moments, so an
 * exact sentence must never be allowed to occupy more than one of them.
 */
export function dedupeGreetingContent(content: GreetingContent): GreetingContent {
  const signatureKey = content.signatureLine ? textKey(content.signatureLine) : '';
  const asideKey = content.playfulAside ? textKey(content.playfulAside) : '';
  const blocked = new Set([
    signatureKey,
    asideKey,
    textKey(content.heroHeadline),
    textKey(content.greetingMessage),
    textKey(content.closingMessage),
  ].filter(Boolean));
  const storyParagraphs = uniqueText(
    content.story.split(/\n\s*\n/).map((paragraph) => paragraph.trim()),
    blocked
  );
  const storyKeys = new Set(storyParagraphs.map(textKey));
  const quotes = uniqueText(content.quotes, new Set([...blocked, ...storyKeys]));
  const highlightDescriptions = new Set<string>();
  const memoryHighlights = content.memoryHighlights.filter((highlight) => {
    const key = textKey(highlight.description);
    if (!key || blocked.has(key) || storyKeys.has(key) || highlightDescriptions.has(key)) return false;
    highlightDescriptions.add(key);
    return true;
  });

  return {
    ...content,
    story: storyParagraphs.join('\n\n'),
    quotes: quotes.length > 0
      ? quotes
      : [`There is only one ${content.recipientName}, and every beautiful detail here knows it.`],
    memoryHighlights,
  };
}
