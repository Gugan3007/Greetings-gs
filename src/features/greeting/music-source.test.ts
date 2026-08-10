import { describe, expect, it } from 'vitest';

import { buildSongSearchLinks, resolveMusicSource } from './music-source';

describe('resolveMusicSource', () => {
  it('classifies an HTTPS audio file and preserves its title', () => {
    expect(resolveMusicSource('https://cdn.example.com/song.mp3?download=1', 'Our Song')).toEqual({
      kind: 'audio',
      src: 'https://cdn.example.com/song.mp3?download=1',
      title: 'Our Song',
    });
  });

  it('accepts a root-relative audio file', () => {
    expect(resolveMusicSource('/music/moment.m4a', '')).toEqual({
      kind: 'audio',
      src: '/music/moment.m4a',
      title: 'Background music',
    });
  });

  it.each([
    ['https://youtu.be/dQw4w9WgXcQ', 'https://www.youtube-nocookie.com/embed/dQw4w9WgXcQ'],
    ['https://www.youtube.com/watch?v=dQw4w9WgXcQ', 'https://www.youtube-nocookie.com/embed/dQw4w9WgXcQ'],
    ['https://youtube.com/shorts/dQw4w9WgXcQ', 'https://www.youtube-nocookie.com/embed/dQw4w9WgXcQ'],
  ])('builds a privacy-enhanced YouTube embed for %s', (input, embedUrl) => {
    expect(resolveMusicSource(input, 'Our Song')).toEqual({ kind: 'youtube', embedUrl, title: 'Our Song' });
  });

  it.each([
    ['https://open.spotify.com/track/abc123', 'https://open.spotify.com/embed/track/abc123'],
    ['https://open.spotify.com/playlist/mix456?si=token', 'https://open.spotify.com/embed/playlist/mix456'],
    ['https://open.spotify.com/album/album789', 'https://open.spotify.com/embed/album/album789'],
  ])('builds an allow-listed Spotify embed for %s', (input, embedUrl) => {
    expect(resolveMusicSource(input, 'Our Song')).toEqual({ kind: 'spotify', embedUrl, title: 'Our Song' });
  });

  it('returns a search dedication when only a song title is present', () => {
    expect(resolveMusicSource('', '  A & B  ')).toEqual({ kind: 'search', title: 'A & B' });
  });

  it.each([
    'javascript:alert(1)',
    'http://cdn.example.com/song.mp3',
    'https://youtube.com.evil.test/watch?v=dQw4w9WgXcQ',
    'https://user:pass@youtube.com/watch?v=dQw4w9WgXcQ',
    'https://youtube.com/watch?v=bad!',
    'https://open.spotify.com/artist/abc123',
    'https://example.com/not-audio.txt',
  ])('rejects unsafe or unsupported source %s', (input) => {
    expect(resolveMusicSource(input, '')).toEqual({ kind: 'none' });
  });

  it('falls back to the named song when a media link is unsupported', () => {
    expect(resolveMusicSource('https://example.com/page', 'Fallback Song')).toEqual({
      kind: 'search',
      title: 'Fallback Song',
    });
  });
});

describe('buildSongSearchLinks', () => {
  it('encodes user text into provider search URLs', () => {
    expect(buildSongSearchLinks('A & B')).toEqual({
      spotify: 'https://open.spotify.com/search/A%20%26%20B',
      youtube: 'https://www.youtube.com/results?search_query=A%20%26%20B',
    });
  });
});
