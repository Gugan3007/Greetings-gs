# Input-Reactive Animation and Music Design

## Goal

Make each generated greeting feel visibly shaped by the sender's inputs, and give recipients a polished way to hear the supplied background music or find the named favorite song. The feature must remain graceful when media cannot autoplay, a provider cannot be embedded, or optional inputs are empty.

## Experience

The greeting keeps its existing authored, cinematic structure. A new compact music control floats above the page without obscuring the content. Input-driven ambient motifs and small scene accents extend the current personalized backdrop and occasion signature moment rather than adding a separate decorative section.

The page must stay calm and legible. It will select a limited set of high-value motifs, distribute them across the scroll experience, and vary their timing so the result feels personal instead of crowded.

## Music Sources and Fallbacks

Music uses this priority order:

1. If `backgroundMusic` produced a playable direct audio URL, render an HTML audio-backed floating player with play/pause, mute, progress, elapsed time, and volume controls.
2. If the supplied music value is a supported Spotify or YouTube URL, render a provider-appropriate embedded player in an expandable panel. Playback remains controlled by the recipient.
3. If only `favoriteSong` text exists, show an animated song dedication with the song title and actions that open encoded Spotify and YouTube searches in a new tab.
4. If no song or music input exists, render no music UI.

The app will never scrape search results or claim to play a named copyrighted song that it cannot access. Browser autoplay policies are respected: playback begins only after a user gesture. A failed or unsupported media URL produces a concise fallback state with the song-search actions when a favorite-song title exists.

## Data Contract

The generated greeting contract gains a `favoriteSong` field alongside the existing `music` field. Both the deterministic generator and AI prompt preserve these values from the validated form data. Existing saved greetings remain compatible because the new field is optional.

Music source parsing is isolated in a pure helper. It classifies direct audio, Spotify, YouTube, named-song, and unsupported sources, and it produces safe embed/search URLs. Provider URLs are allow-listed and user text is URL-encoded.

## Input-Reactive Motion System

The existing personalized backdrop becomes a small deterministic scene engine. It derives a bounded visual recipe from the generated greeting's `personalizedDetails`, theme, and occasion:

- Favorite color influences glow colors and accent intensity while preserving contrast.
- Favorite animal or pet adds sparse paw, wing, or gentle creature-related glyph motion.
- Favorite flower adds drifting petals or blooming line motifs.
- Favorite food adds abstract, tasteful shapes rather than literal oversized emoji.
- Hobby adds a corresponding motion family such as musical notes, dance arcs, brush strokes, travel paths, or cooking steam.
- Place and destination add horizon, map-path, star, wave, or landmark-inspired traces.
- Game adds restrained playful movement such as orbiting pieces, shuttle arcs, ball paths, or pixel sparkles.
- Relationship and occasion continue to choose the emotional archetype and signature celebration family.

The recipe selects at most a few simultaneous motif families. Each uses deterministic positions and delays so server/client rendering is stable. Decorative elements remain `aria-hidden`, pointer-events are disabled, and foreground contrast is maintained.

## Music-Reactive Presentation

When direct audio is actively playing, the player and backdrop receive a playback state. That state enables a lightweight equalizer, rotating disc or artwork treatment, a soft accent pulse, and slightly more energetic ambient motion. These are state-reactive animations rather than a promise of precise beat detection, avoiding cross-origin Web Audio failures.

Pausing or ending the track settles the page back to its ambient state. Muting does not stop animation because playback is still active. Reduced-motion mode removes transforms and looping motion while retaining clear play/pause state and progress information.

## Components and Boundaries

- `music-source` helper: validates and classifies music/song inputs and builds safe provider/search URLs.
- `GreetingMusicPlayer`: owns audio/embed UI state, media events, controls, errors, and accessible labels.
- `personalized-scene` helper: converts personalized details and theme data into a deterministic bounded animation recipe.
- `PersonalizedBackdrop`: renders the recipe and responds to shared playback state.
- Greeting page integration: places the player, provides playback state to the backdrop, and leaves the existing content sections unchanged.

The components communicate through narrow typed props. Provider parsing and motif selection remain independently unit-testable.

## Responsive and Accessible Behavior

The collapsed player is a compact pill near a lower safe-area edge. It expands upward on small screens and into a small popover on larger screens. It avoids the owner-preview and share controls, uses keyboard-operable native buttons and sliders, exposes playback state to assistive technology, and retains visible focus styles.

All ambient motion honors `prefers-reduced-motion`. Decorative motifs never receive focus or announce themselves. Search links clearly state that they open an external service.

## Testing and Verification

Unit tests cover direct-audio, Spotify, YouTube, named-song, invalid-source, and empty-source classification; URL parsing and encoding; motif selection; deterministic caps; and optional-field backwards compatibility.

Browser verification covers:

- Direct audio play, pause, seek, mute, volume, completion, and failure fallback.
- Provider-panel expansion and safe embed URLs.
- Favorite-song search actions when no playable media exists.
- Playback-driven and input-driven visual state changes.
- Empty optional inputs producing no stray UI.
- Desktop and mobile layouts, keyboard focus, and reduced-motion behavior.

Project verification runs unit tests, lint, and a production build under the repository's installed Next.js version.

## Delivery

Implementation is committed on the current branch and pushed to its configured upstream after verification. No provider credentials or deployment changes are required.
