'use client';

import React, { useRef, useState, useEffect, useCallback } from 'react';
import { Play, Pause, SpeakerHigh, SpeakerSlash, ArrowClockwise, WarningCircle } from '@phosphor-icons/react';
import { FALLBACK_MEDIA_DATA_URI, resolveMediaUrl } from '@/lib/media';

interface VideoPlayerProps {
  src: string;
  poster?: string;
  className?: string;
  /** Start playing as soon as the element enters the viewport */
  autoPlay?: boolean;
  loop?: boolean;
  muted?: boolean;
  /** External pause signal (e.g. when the viewer scrolls away) */
  paused?: boolean;
  /** Intersection threshold 0–1. Default 0.5 = half visible */
  intersectionThreshold?: number;
  onEnded?: () => void;
}

export function VideoPlayer({
  src,
  poster,
  className = '',
  autoPlay = true,
  loop = true,
  muted = true,
  paused = false,
  intersectionThreshold = 0.5,
  onEnded,
}: VideoPlayerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(muted);
  const [showControls, setShowControls] = useState(false);
  const [hasLoaded, setHasLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [progress, setProgress] = useState(0);
  const [retryToken, setRetryToken] = useState(0);

  const resolvedSrc = resolveMediaUrl(src);
  const resolvedPoster = resolveMediaUrl(poster) || FALLBACK_MEDIA_DATA_URI;

  // ── Helpers ──────────────────────────────────────────────────────────────
  const attemptPlay = useCallback(() => {
    const v = videoRef.current;
    if (!v || !src) return;
    // Browsers require muted for autoplay without a user gesture
    v.muted = true;
    v.play()
      .then(() => setIsPlaying(true))
      .catch(() => {
        // Autoplay blocked — leave paused; user can tap to play
        setIsPlaying(false);
      });
  }, [src]);

  const attemptPause = useCallback(() => {
    const v = videoRef.current;
    if (!v) return;
    v.pause();
    setIsPlaying(false);
  }, []);

  // ── IntersectionObserver: play when visible, pause when hidden ───────────
  useEffect(() => {
    if (!autoPlay) return;
    const container = containerRef.current;
    if (!container) return;

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            attemptPlay();
          } else {
            attemptPause();
          }
        }
      },
      { threshold: intersectionThreshold }
    );

    observer.observe(container);
    return () => observer.disconnect();
  }, [autoPlay, intersectionThreshold, attemptPlay, attemptPause, retryToken]);

  // ── External `paused` prop ────────────────────────────────────────────────
  useEffect(() => {
    if (paused) {
      attemptPause();
    } else if (autoPlay) {
      // Only attempt if element is visible (check via IntersectionObserver state).
      // We use a simple wrapper: try to play; IntersectionObserver will pause again
      // if it's still off-screen.
      attemptPlay();
    }
  }, [paused, autoPlay, attemptPlay, attemptPause]);

  // ── Sync muted prop ───────────────────────────────────────────────────────
  useEffect(() => {
    setIsMuted(muted);
    if (videoRef.current) videoRef.current.muted = muted;
  }, [muted]);

  // ── Reset on src change ───────────────────────────────────────────────────
  useEffect(() => {
    setHasError(false);
    setHasLoaded(false);
    setProgress(0);
    setIsPlaying(false);
  }, [src, retryToken]);

  // ── Progress tracker ─────────────────────────────────────────────────────
  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;

    const onTimeUpdate = () => {
      if (v.duration > 0) setProgress((v.currentTime / v.duration) * 100);
    };

    v.addEventListener('timeupdate', onTimeUpdate);
    return () => v.removeEventListener('timeupdate', onTimeUpdate);
  }, [hasLoaded, retryToken]);

  // ── User controls ─────────────────────────────────────────────────────────
  const togglePlay = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isPlaying) {
      attemptPause();
    } else {
      const v = videoRef.current;
      if (!v) return;
      // User gesture: we can now unmute if desired
      v.play()
        .then(() => setIsPlaying(true))
        .catch(() => undefined);
    }
  };

  const toggleMute = (e: React.MouseEvent) => {
    e.stopPropagation();
    const v = videoRef.current;
    if (!v) return;
    const next = !isMuted;
    v.muted = next;
    setIsMuted(next);
  };

  const retry = (e: React.MouseEvent) => {
    e.stopPropagation();
    setRetryToken((t) => t + 1);
    setTimeout(() => {
      const v = videoRef.current;
      if (!v) return;
      v.load();
      attemptPlay();
    }, 50);
  };

  const handleVideoClick = (e: React.MouseEvent) => {
    togglePlay(e);
  };

  return (
    <div
      ref={containerRef}
      className={`relative group cursor-pointer overflow-hidden bg-black ${className}`}
      onMouseEnter={() => setShowControls(true)}
      onMouseLeave={() => setShowControls(false)}
      onClick={handleVideoClick}
    >
      {/* Poster / fallback */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={resolvedPoster}
        className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-500 ${
          src && !hasError && hasLoaded ? 'opacity-0 pointer-events-none' : 'opacity-100'
        }`}
        alt="Video poster"
      />

      {/* Video element */}
      {src && !hasError && (
        <video
          ref={videoRef}
          key={retryToken}
          src={resolvedSrc}
          poster={resolvedPoster}
          className={`relative z-10 w-full h-full object-cover transition-opacity duration-500 ${
            hasLoaded ? 'opacity-100' : 'opacity-0'
          }`}
          loop={loop}
          muted={isMuted}
          playsInline
          preload="metadata"
          onLoadedData={() => setHasLoaded(true)}
          onCanPlay={() => setHasLoaded(true)}
          onPlay={() => setIsPlaying(true)}
          onPause={() => setIsPlaying(false)}
          onEnded={() => {
            setIsPlaying(false);
            onEnded?.();
          }}
          onError={() => {
            setHasError(true);
            setHasLoaded(false);
          }}
        />
      )}

      {/* Error state */}
      {hasError && (
        <div className="absolute inset-0 z-20 flex flex-col items-center justify-center gap-3 bg-zinc-950/80 p-6 text-center text-white">
          <WarningCircle size={28} weight="fill" className="text-[#4F46E5]" />
          <div className="space-y-1">
            <p className="text-sm font-semibold">Video unavailable</p>
            <p className="text-xs text-white/70">We couldn&apos;t load this media right now.</p>
          </div>
          <button
            onClick={retry}
            className="inline-flex items-center gap-2 rounded-lg bg-white px-4 py-2 text-xs font-semibold text-zinc-950 transition-colors hover:bg-zinc-100"
          >
            <ArrowClockwise size={14} weight="bold" />
            Retry
          </button>
        </div>
      )}

      {/* Centered play icon overlay when paused */}
      <div
        className={`absolute inset-0 z-10 flex items-center justify-center pointer-events-none transition-opacity duration-300 ${
          !isPlaying && hasLoaded && !hasError ? 'opacity-100' : 'opacity-0'
        }`}
      >
        <div className="h-14 w-14 rounded-full bg-black/30 backdrop-blur-sm flex items-center justify-center border border-white/30">
          <Play size={28} weight="fill" className="text-white ml-1" />
        </div>
      </div>

      {/* Bottom controls (visible on hover or when paused) */}
      <div
        className={`absolute bottom-4 left-4 right-4 z-10 flex items-center justify-between transition-opacity duration-300 ${
          showControls || !isPlaying ? 'opacity-100' : 'opacity-0'
        }`}
      >
        <button
          onClick={togglePlay}
          className="h-9 w-9 rounded-full bg-black/40 backdrop-blur-md flex items-center justify-center text-white border border-white/10 hover:bg-black/60 transition-all"
        >
          {isPlaying ? <Pause size={18} weight="fill" /> : <Play size={18} weight="fill" />}
        </button>

        <button
          onClick={toggleMute}
          className="h-9 w-9 rounded-full bg-black/40 backdrop-blur-md flex items-center justify-center text-white border border-white/10 hover:bg-black/60 transition-all"
        >
          {isMuted ? <SpeakerSlash size={18} weight="fill" /> : <SpeakerHigh size={18} weight="fill" />}
        </button>
      </div>

      {/* Live progress bar */}
      <div
        className="absolute bottom-0 left-0 h-[3px] bg-[#0066FF] z-20 transition-all duration-150"
        style={{ width: `${progress}%` }}
      />
    </div>
  );
}
