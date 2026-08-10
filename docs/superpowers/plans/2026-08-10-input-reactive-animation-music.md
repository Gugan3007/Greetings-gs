# Input-Reactive Animation and Music Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (\`- [ ]\`) syntax for tracking.

**Goal:** Add a safe floating music experience and bounded, input-reactive ambient animation to generated greeting pages.

**Architecture:** Preserve favorite-song and music values in \`GreetingContent\`, classify them through a pure allow-listed helper, and render one client-side player with search fallbacks. A second pure helper converts personalized details into a deterministic scene recipe; the existing backdrop renders it and reacts to actual playback state.

**Tech Stack:** Next.js 16.2 App Router, React 19.2, TypeScript, Framer Motion, Tailwind CSS 4, Lucide React, Vitest.

## Global Constraints

- Playback begins only after a recipient gesture; never attempt unmuted autoplay.
- Never scrape providers or imply that a plain song title is directly playable.
- Allow-list Spotify/YouTube hosts and URL-encode search text.
- Keep new greeting fields optional for compatibility with saved greetings.
- Cap decorative motif families; keep decorations unfocusable and \`aria-hidden\`.
- Honor \`prefers-reduced-motion\` for every new loop or transform.
- Follow the repository's installed Next.js 16.2 client/media guidance.
- Add no provider credentials and no runtime dependency.

---

### Task 1: Preserve Music Inputs

**Files:**
- Modify: \`src/lib/ai/schema.ts:39-91\`
- Modify: \`src/lib/ai/mock.ts:221-258\`
- Modify: \`src/lib/ai/prompt.ts:84-116\`
- Modify: \`src/features/form/steps.ts:90-101,191-201\`
- Modify: \`src/lib/ai/mock.test.ts\`

**Interfaces:**
- Consumes: \`FormData.favoriteSong\` and \`FormData.backgroundMusic\`.
- Produces: optional \`GreetingContent.favoriteSong?: string\` and \`GreetingContent.music?: string\`.

- [ ] **Step 1: Write the failing preservation test**

\`\`\`ts
const result = createPersonalizedMock({
  ...baseFormData,
  favoriteSong: 'Here Comes the Sun — The Beatles',
  backgroundMusic: 'https://cdn.example.com/sun.mp3',
});
expect(result.favoriteSong).toBe('Here Comes the Sun — The Beatles');
expect(result.music).toBe('https://cdn.example.com/sun.mp3');
\`\`\`

- [ ] **Step 2: Confirm the test fails**

Run: \`npm test -- src/lib/ai/mock.test.ts\`

Expected: failure because \`favoriteSong\` is absent from \`GreetingContent\`.

- [ ] **Step 3: Add the optional contract and assignments**

\`\`\`ts
favoriteSong: z.string().max(200).optional(),
music: z.string().max(2048).optional(),
\`\`\`

\`\`\`ts
favoriteSong: data.favoriteSong || undefined,
music: data.backgroundMusic || undefined,
\`\`\`

Tell the AI prompt these are transport fields whose exact short title/URL must be preserved.

- [ ] **Step 4: Clarify form inputs**

Update favorite-song helper text to accept a title or Spotify/YouTube link. Add optional \`backgroundMusic\` text input labeled “Background music link” with direct audio, Spotify, or YouTube URL examples. Do not create a file uploader because current storage accepts images only.

- [ ] **Step 5: Re-run and commit**

Run: \`npm test -- src/lib/ai/mock.test.ts\`

Expected: PASS.

\`\`\`bash
git add src/lib/ai/schema.ts src/lib/ai/mock.ts src/lib/ai/prompt.ts src/features/form/steps.ts src/lib/ai/mock.test.ts
git commit -m "preserve greeting music inputs"
\`\`\`

### Task 2: Classify Safe Music Sources

**Files:**
- Create: \`src/features/greeting/music-source.ts\`
- Create: \`src/features/greeting/music-source.test.ts\`

**Interfaces:**
- Consumes: \`resolveMusicSource(music?: string, favoriteSong?: string)\`.
- Produces: \`MusicSource\` with \`kind: 'audio' | 'youtube' | 'spotify' | 'search' | 'none'\`, plus \`buildSongSearchLinks(song)\`.

- [ ] **Step 1: Write table-driven failing tests**

\`\`\`ts
expect(resolveMusicSource('https://cdn.example.com/song.mp3', 'Song'))
  .toMatchObject({ kind: 'audio', src: 'https://cdn.example.com/song.mp3', title: 'Song' });
expect(resolveMusicSource('https://youtu.be/dQw4w9WgXcQ', 'Song'))
  .toMatchObject({ kind: 'youtube', embedUrl: 'https://www.youtube-nocookie.com/embed/dQw4w9WgXcQ' });
expect(resolveMusicSource('https://open.spotify.com/track/abc123', 'Song'))
  .toMatchObject({ kind: 'spotify', embedUrl: 'https://open.spotify.com/embed/track/abc123' });
expect(resolveMusicSource('', 'A & B')).toMatchObject({ kind: 'search', title: 'A & B' });
expect(resolveMusicSource('javascript:alert(1)', '')).toEqual({ kind: 'none' });
expect(buildSongSearchLinks('A & B').youtube).toContain('A%20%26%20B');
\`\`\`

Also reject lookalike hosts, unsupported Spotify paths, malformed video IDs, URL credentials, and non-HTTP protocols.

- [ ] **Step 2: Confirm red**

Run: \`npm test -- src/features/greeting/music-source.test.ts\`

Expected: FAIL because the helper does not exist.

- [ ] **Step 3: Implement the classifier**

\`\`\`ts
export type MusicSource =
  | { kind: 'audio'; src: string; title: string }
  | { kind: 'youtube'; embedUrl: string; title: string }
  | { kind: 'spotify'; embedUrl: string; title: string }
  | { kind: 'search'; title: string }
  | { kind: 'none' };

export function buildSongSearchLinks(song: string) {
  const query = encodeURIComponent(song.trim());
  return {
    spotify: \`https://open.spotify.com/search/\${query}\`,
    youtube: \`https://www.youtube.com/results?search_query=\${query}\`,
  };
}
\`\`\`

Use \`new URL()\`, exact hostname checks, narrow path/ID regexes, and \`https:\` or root-relative direct audio. Prefer \`music\` over \`favoriteSong\`.

- [ ] **Step 4: Verify and commit**

Run: \`npm test -- src/features/greeting/music-source.test.ts\`

Expected: PASS.

\`\`\`bash
git add src/features/greeting/music-source.ts src/features/greeting/music-source.test.ts
git commit -m "classify safe greeting music sources"
\`\`\`

### Task 3: Derive the Personalized Scene

**Files:**
- Create: \`src/features/greeting/personalized-scene.ts\`
- Create: \`src/features/greeting/personalized-scene.test.ts\`
- Modify: \`src/features/greeting/PersonalizedBackdrop.tsx\`
- Modify: \`src/features/greeting/personalized-backdrop.test.ts\`

**Interfaces:**
- Consumes: \`buildPersonalizedScene(data: GreetingContent)\` and \`PersonalizedBackdrop({ data, isMusicPlaying })\`.
- Produces: deterministic \`{ palette: string[]; motifs: SceneMotif[] }\`.

- [ ] **Step 1: Write failing recipe tests**

\`\`\`ts
const scene = buildPersonalizedScene(greeting);
expect(scene.motifs.map((item) => item.family))
  .toEqual(expect.arrayContaining(['animal', 'flower', 'hobby']));
expect(scene.motifs.length).toBeLessThanOrEqual(6);
expect(buildPersonalizedScene(greeting)).toEqual(scene);
\`\`\`

Add cases for music, dance, painting, travel, cooking, beach, chess, badminton, and color-palette keywords. Unknown inputs fall back to the archetype.

- [ ] **Step 2: Confirm red**

Run: \`npm test -- src/features/greeting/personalized-scene.test.ts\`

Expected: FAIL because the helper does not exist.

- [ ] **Step 3: Implement a bounded deterministic recipe**

\`\`\`ts
export type SceneMotif = {
  id: string;
  family: 'animal' | 'flower' | 'food' | 'hobby' | 'place' | 'game' | 'archetype';
  glyph: string;
  className: string;
  drift: number;
  duration: number;
  delay: number;
};
\`\`\`

Use module-level keyword tables and fixed layout slots. Select at most three input families plus archetype accents, return at most six motifs, and never call \`Math.random()\`.

- [ ] **Step 4: Render recipe and playback state**

Replace the repeated fallback glyph loop. Add \`isMusicPlaying?: boolean\`; when true and reduced motion is false, increase drift modestly and show a low-opacity pulse halo. Retain \`aria-hidden\`, fixed positioning, and disabled pointer events.

- [ ] **Step 5: Verify and commit**

Run: \`npm test -- src/features/greeting/personalized-scene.test.ts src/features/greeting/personalized-backdrop.test.ts\`

Expected: PASS.

\`\`\`bash
git add src/features/greeting/personalized-scene.ts src/features/greeting/personalized-scene.test.ts src/features/greeting/PersonalizedBackdrop.tsx src/features/greeting/personalized-backdrop.test.ts
git commit -m "add input reactive greeting scenes"
\`\`\`

### Task 4: Build and Integrate the Music Player

**Files:**
- Create: \`src/features/greeting/GreetingMusicPlayer.tsx\`
- Modify: \`src/app/g/[slug]/page.tsx:1-163\`
- Modify: \`src/app/globals.css\`

**Interfaces:**
- Consumes: \`GreetingMusicPlayer({ music, favoriteSong, onPlayingChange })\`.
- Produces: \`onPlayingChange(isPlaying: boolean)\` for the backdrop.

- [ ] **Step 1: Build the audio state machine**

Use one \`HTMLAudioElement\` ref plus \`isExpanded\`, \`isPlaying\`, \`isMuted\`, \`duration\`, \`currentTime\`, \`volume\`, and \`hasError\`. Treat \`play\`, \`pause\`, \`timeupdate\`, \`durationchange\`, \`ended\`, and \`error\` events as truth. Use \`preload="metadata"\`, omit autoplay, and notify the parent only from media events.

- [ ] **Step 2: Render accessible direct-audio controls**

\`\`\`tsx
<button type="button" aria-label={isPlaying ? 'Pause background music' : 'Play background music'} />
<input type="range" aria-label="Song progress" min={0} max={duration || 0} value={currentTime} />
<button type="button" aria-label={isMuted ? 'Unmute background music' : 'Mute background music'} />
<input type="range" aria-label="Music volume" min={0} max={1} step={0.05} value={volume} />
\`\`\`

Animate equalizer/disc only while playing and motion is allowed. If \`audio.play()\` rejects or \`error\` fires, show a concise fallback with search links when a title exists.

- [ ] **Step 3: Render provider and title-only variants**

For providers, omit the iframe until expansion, then add \`loading="lazy"\`, descriptive \`title\`, responsive sizing, and a narrow \`allow\`. For a song title, show Spotify/YouTube search links using \`target="_blank" rel="noreferrer"\`.

- [ ] **Step 4: Connect the greeting page**

\`\`\`ts
const [isMusicPlaying, setIsMusicPlaying] = useState(false);
\`\`\`

Pass it to \`PersonalizedBackdrop\`, mount \`GreetingMusicPlayer\` after owner preview, and pass \`data.music\`, \`data.favoriteSong\`, and \`setIsMusicPlaying\`. Return \`null\` when both sources are absent.

- [ ] **Step 5: Add responsive safe-area styles**

Use current glass/accent tokens. Place the control lower-right on desktop and centered above \`env(safe-area-inset-bottom)\` on mobile, below modals and above content. Fit 320px screens, preserve focus rings, and explicitly style control typography.

- [ ] **Step 6: Verify and commit**

Run: \`npm run lint && npm run build\`

Expected: both exit 0.

\`\`\`bash
git add src/features/greeting/GreetingMusicPlayer.tsx src/app/g/'[slug]'/page.tsx src/app/globals.css
git commit -m "add interactive greeting music player"
\`\`\`

### Task 5: Regression and Rendered Verification

**Files:**
- Modify only files required by concrete verification findings.

**Interfaces:**
- Consumes: the complete greeting flow.
- Produces: verified desktop/mobile behavior and a clean pushed branch.

- [ ] **Step 1: Run all automation**

\`\`\`bash
npm test
npm run lint
npm run build
\`\`\`

Expected: all commands exit 0.

- [ ] **Step 2: Exercise representative greetings**

Run \`npm run dev\` and create or seed cases for direct audio, YouTube, Spotify, title-only, no-song, favorite color, animal, flower, hobby, place, game, and occasion inputs.

- [ ] **Step 3: Verify music interactions**

At desktop and mobile sizes, test play/pause, seek, mute, volume, end, error fallback, provider expansion, search links, keyboard focus, and no playback before a click. Confirm backdrop energy follows actual direct-audio media events.

- [ ] **Step 4: Verify motion/accessibility**

Confirm motifs change across inputs, remain capped, never intercept clicks, and preserve contrast. Emulate reduced motion and confirm loops/transforms stop while state remains understandable.

- [ ] **Step 5: Inspect screenshots**

Capture desktop/mobile screenshots with the player collapsed and expanded. Inspect via \`view_image\` for layout, typography, palette, motifs, safe-area placement, legibility, focus, and overlap. Fix every material issue and re-check.

- [ ] **Step 6: Check, commit fixes, and push**

\`\`\`bash
git diff --check
git status --short --branch
git log -5 --oneline --decorate
git push
\`\`\`

Expected: no whitespace errors or unintended files; the configured upstream is updated. If verification required fixes, commit them first as \`polish reactive greeting experience\`.
