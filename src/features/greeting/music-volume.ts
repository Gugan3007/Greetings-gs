export const INITIAL_MUSIC_VOLUME = 0.75;

type MediaVolumeTarget = { volume: number };

export function applyMusicVolume(media: MediaVolumeTarget, requestedVolume: number) {
  const nextVolume = Number.isFinite(requestedVolume)
    ? Math.min(1, Math.max(0, requestedVolume))
    : INITIAL_MUSIC_VOLUME;
  media.volume = nextVolume;
  return nextVolume;
}
