'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import {
  ChevronDown,
  ChevronUp,
  ExternalLink,
  Music2,
  Pause,
  Play,
  Volume2,
  VolumeX,
} from 'lucide-react';

import { useReducedMotion } from '@/hooks/useReducedMotion';
import { buildSongSearchLinks, formatMusicTime, resolveMusicSource } from './music-source';

type GreetingMusicPlayerProps = {
  music?: string;
  favoriteSong?: string;
  onPlayingChange?: (isPlaying: boolean) => void;
};

function Equalizer({ active, reducedMotion }: { active: boolean; reducedMotion: boolean }) {
  return (
    <span className="flex h-4 items-end gap-0.5" aria-hidden="true">
      {[0, 1, 2].map((index) => (
        <motion.span
          key={index}
          className="w-0.5 rounded-full bg-current"
          animate={active && !reducedMotion ? { height: [4, 14 - index * 2, 6, 12, 4] } : { height: 4 + index * 2 }}
          transition={{ duration: 0.8, delay: index * 0.12, repeat: active && !reducedMotion ? Infinity : 0, ease: 'easeInOut' }}
        />
      ))}
    </span>
  );
}

function SearchActions({ title }: { title: string }) {
  const links = buildSongSearchLinks(title);
  return (
    <div className="grid grid-cols-2 gap-2">
      <a
        href={links.spotify}
        target="_blank"
        rel="noreferrer"
        className="music-player__provider-link"
        aria-label={`Find ${title} on Spotify (opens in a new tab)`}
      >
        Spotify <ExternalLink className="h-3.5 w-3.5" />
      </a>
      <a
        href={links.youtube}
        target="_blank"
        rel="noreferrer"
        className="music-player__provider-link"
        aria-label={`Find ${title} on YouTube (opens in a new tab)`}
      >
        YouTube <ExternalLink className="h-3.5 w-3.5" />
      </a>
    </div>
  );
}

export function GreetingMusicPlayer({ music, favoriteSong, onPlayingChange }: GreetingMusicPlayerProps) {
  const source = useMemo(() => resolveMusicSource(music, favoriteSong), [music, favoriteSong]);
  const audioRef = useRef<HTMLAudioElement>(null);
  const reducedMotion = useReducedMotion();
  const [isExpanded, setIsExpanded] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [volume, setVolume] = useState(0.75);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    const audio = audioRef.current;
    return () => {
      audio?.pause();
      onPlayingChange?.(false);
    };
  }, [source, onPlayingChange]);

  if (source.kind === 'none') return null;

  const isAudio = source.kind === 'audio';
  const panelId = 'greeting-music-panel';

  const togglePlayback = async () => {
    const audio = audioRef.current;
    if (!audio || hasError) return;
    if (audio.paused) {
      try {
        await audio.play();
      } catch {
        setHasError(true);
        setIsPlaying(false);
        onPlayingChange?.(false);
      }
    } else {
      audio.pause();
    }
  };

  const seek = (nextTime: number) => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.currentTime = nextTime;
    setCurrentTime(nextTime);
  };

  const changeVolume = (nextVolume: number) => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.volume = nextVolume;
    audio.muted = false;
    setVolume(nextVolume);
    setIsMuted(false);
  };

  const toggleMute = () => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.muted = !audio.muted;
    setIsMuted(audio.muted);
  };

  return (
    <aside className="music-player" aria-label="Greeting soundtrack">
      <AnimatePresence initial={false}>
        {isExpanded ? (
          <motion.div
            id={panelId}
            key="panel"
            className="music-player__panel"
            initial={reducedMotion ? false : { opacity: 0, y: 12, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={reducedMotion ? { opacity: 0 } : { opacity: 0, y: 8, scale: 0.98 }}
            transition={{ duration: reducedMotion ? 0 : 0.24 }}
          >
            <div className="flex items-start gap-3">
              <motion.div
                className="music-player__art"
                animate={isPlaying && !reducedMotion ? { rotate: 360 } : undefined}
                transition={{ duration: 7, repeat: Infinity, ease: 'linear' }}
              >
                <span className="h-2 w-2 rounded-full border border-white/40 bg-black/70" />
              </motion.div>
              <div className="min-w-0 flex-1">
                <p className="text-[0.65rem] font-semibold tracking-[0.18em] text-fg-muted uppercase">
                  {isAudio ? (hasError ? 'Playback unavailable' : isPlaying ? 'Playing for you' : 'Your soundtrack') : 'A song chosen for you'}
                </p>
                <p className="truncate text-sm font-semibold text-foreground">{source.title}</p>
              </div>
              <button
                type="button"
                className="music-player__icon-button"
                onClick={() => setIsExpanded(false)}
                aria-label="Collapse music player"
              >
                <ChevronDown className="h-4 w-4" />
              </button>
            </div>

            {source.kind === 'audio' ? (
              hasError ? (
                <div className="mt-4 space-y-3">
                  <p className="text-xs leading-relaxed text-fg-secondary">This audio link could not be played in the browser.</p>
                  {favoriteSong?.trim() ? <SearchActions title={favoriteSong.trim()} /> : null}
                </div>
              ) : (
                <div className="mt-4 space-y-3">
                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      className="music-player__play-button"
                      onClick={togglePlayback}
                      aria-label={isPlaying ? 'Pause background music' : 'Play background music'}
                    >
                      {isPlaying ? <Pause className="h-4 w-4 fill-current" /> : <Play className="ml-0.5 h-4 w-4 fill-current" />}
                    </button>
                    <div className="min-w-0 flex-1">
                      <input
                        type="range"
                        className="music-player__range"
                        aria-label="Song progress"
                        min={0}
                        max={duration || 0}
                        step={0.1}
                        value={Math.min(currentTime, duration || 0)}
                        onChange={(event) => seek(Number(event.target.value))}
                      />
                      <div className="mt-1 flex justify-between font-mono text-[0.62rem] text-fg-muted">
                        <span>{formatMusicTime(currentTime)}</span>
                        <span>{formatMusicTime(duration)}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      className="music-player__icon-button"
                      onClick={toggleMute}
                      aria-label={isMuted ? 'Unmute background music' : 'Mute background music'}
                    >
                      {isMuted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
                    </button>
                    <input
                      type="range"
                      className="music-player__range"
                      aria-label="Music volume"
                      min={0}
                      max={1}
                      step={0.05}
                      value={volume}
                      onChange={(event) => changeVolume(Number(event.target.value))}
                    />
                  </div>
                </div>
              )
            ) : source.kind === 'youtube' || source.kind === 'spotify' ? (
              <div className="mt-4 overflow-hidden rounded-2xl border border-white/10 bg-black/20">
                <iframe
                  src={source.embedUrl}
                  title={`${source.kind === 'youtube' ? 'YouTube' : 'Spotify'} player for ${source.title}`}
                  className={source.kind === 'youtube' ? 'aspect-video w-full' : 'h-[152px] w-full'}
                  loading="lazy"
                  allow="autoplay; encrypted-media; picture-in-picture"
                  allowFullScreen={source.kind === 'youtube'}
                />
              </div>
            ) : (
              <div className="mt-4 space-y-3">
                <p className="text-xs leading-relaxed text-fg-secondary">Find their favorite version and let it soundtrack the moment.</p>
                <SearchActions title={source.title} />
              </div>
            )}
          </motion.div>
        ) : null}
      </AnimatePresence>

      <motion.div
        className="music-player__bar"
        layout={!reducedMotion}
        animate={isPlaying && !reducedMotion ? { boxShadow: ['0 18px 70px rgba(0,0,0,.46)', '0 18px 82px color-mix(in srgb, var(--greeting-accent) 30%, transparent)', '0 18px 70px rgba(0,0,0,.46)'] } : undefined}
        transition={{ duration: 2.6, repeat: Infinity, ease: 'easeInOut' }}
      >
        <button
          type="button"
          className="music-player__art music-player__art--small"
          onClick={isAudio ? togglePlayback : () => setIsExpanded(true)}
          aria-label={isAudio ? (isPlaying ? 'Pause background music' : 'Play background music') : 'Open song player'}
        >
          {isAudio ? (isPlaying ? <Pause className="h-3.5 w-3.5 fill-current" /> : <Play className="ml-0.5 h-3.5 w-3.5 fill-current" />) : <Music2 className="h-3.5 w-3.5" />}
        </button>
        <button
          type="button"
          className="min-w-0 flex-1 text-left"
          onClick={() => setIsExpanded((open) => !open)}
          aria-expanded={isExpanded}
          aria-controls={panelId}
        >
          <span className="block text-[0.58rem] font-semibold tracking-[0.16em] text-fg-muted uppercase">
            {isPlaying ? 'Now playing' : 'Soundtrack'}
          </span>
          <span className="block max-w-44 truncate text-xs font-semibold text-foreground">{source.title}</span>
        </button>
        <span className="text-[color:var(--greeting-accent)]">
          <Equalizer active={isPlaying} reducedMotion={reducedMotion} />
        </span>
        <button
          type="button"
          className="music-player__icon-button"
          onClick={() => setIsExpanded((open) => !open)}
          aria-label={isExpanded ? 'Collapse music player' : 'Expand music player'}
          aria-expanded={isExpanded}
          aria-controls={panelId}
        >
          {isExpanded ? <ChevronDown className="h-4 w-4" /> : <ChevronUp className="h-4 w-4" />}
        </button>
      </motion.div>

      {source.kind === 'audio' ? (
        <audio
          ref={audioRef}
          src={source.src}
          preload="metadata"
          onPlay={() => {
            setHasError(false);
            setIsPlaying(true);
            onPlayingChange?.(true);
          }}
          onPause={() => {
            setIsPlaying(false);
            onPlayingChange?.(false);
          }}
          onTimeUpdate={(event) => setCurrentTime(event.currentTarget.currentTime)}
          onDurationChange={(event) => setDuration(Number.isFinite(event.currentTarget.duration) ? event.currentTarget.duration : 0)}
          onEnded={() => {
            setIsPlaying(false);
            setCurrentTime(duration);
            onPlayingChange?.(false);
          }}
          onError={() => {
            setHasError(true);
            setIsPlaying(false);
            setIsExpanded(true);
            onPlayingChange?.(false);
          }}
        />
      ) : null}
    </aside>
  );
}
