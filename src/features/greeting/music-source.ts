export type MusicSource =
  | { kind: 'audio'; src: string; title: string }
  | { kind: 'youtube'; embedUrl: string; title: string }
  | { kind: 'spotify'; embedUrl: string; title: string }
  | { kind: 'search'; title: string }
  | { kind: 'none' };

const AUDIO_EXTENSION = /\.(?:mp3|m4a|ogg|wav|aac|flac|webm)$/i;
const YOUTUBE_ID = /^[A-Za-z0-9_-]{11}$/;
const SPOTIFY_ID = /^[A-Za-z0-9]+$/;
const SPOTIFY_TYPES = new Set(['track', 'playlist', 'album']);

export function buildSongSearchLinks(song: string) {
  const query = encodeURIComponent(song.trim());
  return {
    spotify: `https://open.spotify.com/search/${query}`,
    youtube: `https://www.youtube.com/results?search_query=${query}`,
  };
}

function parseMusicUrl(value: string) {
  const isRootRelative = value.startsWith('/') && !value.startsWith('//');
  try {
    const url = new URL(value, 'https://greeting.local');
    if ((!isRootRelative && url.protocol !== 'https:') || url.username || url.password) return null;
    return { url, isRootRelative };
  } catch {
    return null;
  }
}

function youtubeVideoId(url: URL) {
  const host = url.hostname.toLowerCase();
  if (host === 'youtu.be') return url.pathname.split('/').filter(Boolean)[0] || '';
  if (host !== 'youtube.com' && host !== 'www.youtube.com' && host !== 'm.youtube.com') return '';

  if (url.pathname === '/watch') return url.searchParams.get('v') || '';
  const [kind, id] = url.pathname.split('/').filter(Boolean);
  return kind === 'shorts' || kind === 'embed' ? id || '' : '';
}

export function resolveMusicSource(music?: string, favoriteSong?: string): MusicSource {
  const value = music?.trim() || '';
  const favorite = favoriteSong?.trim() || '';
  const title = favorite || 'Background music';

  if (value) {
    const parsed = parseMusicUrl(value);
    if (parsed) {
      const { url, isRootRelative } = parsed;
      const videoId = !isRootRelative ? youtubeVideoId(url) : '';
      if (YOUTUBE_ID.test(videoId)) {
        return {
          kind: 'youtube',
          embedUrl: `https://www.youtube-nocookie.com/embed/${videoId}`,
          title,
        };
      }

      if (!isRootRelative && url.hostname.toLowerCase() === 'open.spotify.com') {
        const [type, id, ...rest] = url.pathname.split('/').filter(Boolean);
        if (rest.length === 0 && SPOTIFY_TYPES.has(type) && SPOTIFY_ID.test(id || '')) {
          return { kind: 'spotify', embedUrl: `https://open.spotify.com/embed/${type}/${id}`, title };
        }
      }

      if (AUDIO_EXTENSION.test(url.pathname)) return { kind: 'audio', src: value, title };
    }
  }

  return favorite ? { kind: 'search', title: favorite } : { kind: 'none' };
}
