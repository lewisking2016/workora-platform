'use client';

import React, { useRef, useState, useEffect } from 'react';
import { Play, Pause, SpeakerHigh, SpeakerSlash, ArrowClockwise, WarningCircle } from '@phosphor-icons/react';
import { FALLBACK_MEDIA_DATA_URI, resolveMediaUrl } from '@/lib/media';

interface VideoPlayerProps {
  src: string;
  poster?: string;
  className?: string;
  autoPlay?: boolean;
  loop?: boolean;
  muted?: boolean;
  paused?: boolean;
  onEnded?: () => void;
}

export function VideoPlayer({ src, poster, className = "", autoPlay = false, loop = true, muted = true, paused = false, onEnded }: VideoPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(autoPlay);
  const [isMuted, setIsMuted] = useState(muted);
  const [showControls, setShowControls] = useState(false);
  const [hasVideoLoaded, setHasVideoLoaded] = useState(false);
  const [hasVideoError, setHasVideoError] = useState(false);
  const [retryToken, setRetryToken] = useState(0);
  const resolvedSrc = resolveMediaUrl(src);
  const resolvedPoster = resolveMediaUrl(poster) || FALLBACK_MEDIA_DATA_URI;

  useEffect(() => {
    setHasVideoError(false);
    setHasVideoLoaded(false);
    if (videoRef.current && autoPlay) {
      videoRef.current.play().catch(err => console.log('Auto-play prevented:', err));
      setIsPlaying(true);
    }
  }, [autoPlay, src, retryToken]);

  useEffect(() => {
    if (!videoRef.current) return;

    if (paused) {
      videoRef.current.pause();
      setIsPlaying(false);
      return;
    }

    if (autoPlay) {
      videoRef.current.play().catch(() => undefined);
      setIsPlaying(true);
    }
  }, [paused, autoPlay]);

  useEffect(() => {
    setIsMuted(muted);
    if (videoRef.current) {
      videoRef.current.muted = muted;
    }
  }, [muted]);

  const togglePlay = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const toggleMute = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  const retryPlayback = (e: React.MouseEvent) => {
    e.stopPropagation();
    setHasVideoError(false);
    setHasVideoLoaded(false);
    setRetryToken((value) => value + 1);
    if (videoRef.current) {
      videoRef.current.load();
      if (autoPlay) {
        videoRef.current.play().catch(() => undefined);
      }
    }
  };

  return (
    <div 
      className={`relative group cursor-pointer overflow-hidden bg-black ${className}`}
      onMouseEnter={() => setShowControls(true)}
      onMouseLeave={() => setShowControls(false)}
      onClick={togglePlay}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={resolvedPoster}
        className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-300 ${
          src && !hasVideoError && hasVideoLoaded ? 'opacity-0' : 'opacity-100'
        }`}
        alt="Video poster"
      />

      {src && !hasVideoError && (
        <video
          ref={videoRef}
          key={retryToken}
          src={resolvedSrc}
          poster={resolvedPoster}
          className={`relative z-10 w-full h-full object-cover transition-opacity duration-300 ${
            hasVideoLoaded ? 'opacity-100' : 'opacity-0'
          }`}
          loop={loop}
          muted={isMuted}
          playsInline
          preload="metadata"
          onLoadedData={() => setHasVideoLoaded(true)}
          onCanPlay={() => setHasVideoLoaded(true)}
          onEnded={onEnded}
          onError={() => {
            setHasVideoError(true);
            setHasVideoLoaded(false);
          }}
        />
      )}

      {hasVideoError && (
        <div className="absolute inset-0 z-20 flex flex-col items-center justify-center gap-3 bg-zinc-950/80 p-6 text-center text-white">
          <WarningCircle size={28} weight="fill" className="text-[#4F46E5]" />
          <div className="space-y-1">
            <p className="text-sm font-semibold">Video unavailable</p>
            <p className="text-xs text-white/70">We could not load this media right now.</p>
          </div>
          <button
            onClick={retryPlayback}
            className="inline-flex items-center gap-2 rounded-lg bg-white px-4 py-2 text-xs font-semibold text-zinc-950 transition-colors hover:bg-zinc-100"
          >
            <ArrowClockwise size={14} weight="bold" />
            Retry
          </button>
        </div>
      )}

      {/* Play/Pause Overlay Icon (Briefly appears on click) */}
      <div className={`absolute inset-0 flex items-center justify-center pointer-events-none transition-opacity duration-300 ${!isPlaying ? 'opacity-100' : 'opacity-0'}`}>
        <div className="h-16 w-16 rounded-full bg-black/20 backdrop-blur-sm flex items-center justify-center border border-white/30">
          <Play size={32} weight="fill" className="text-white ml-1" />
        </div>
      </div>

      {/* Bottom Controls */}
      <div className={`absolute bottom-4 left-4 right-4 flex items-center justify-between transition-opacity duration-300 ${showControls || !isPlaying ? 'opacity-100' : 'opacity-0'}`}>
        <button 
          onClick={togglePlay}
          className="h-10 w-10 rounded-full bg-black/40 backdrop-blur-md flex items-center justify-center text-white border border-white/10 hover:bg-black/60 transition-all"
        >
          {isPlaying ? <Pause size={20} weight="fill" /> : <Play size={20} weight="fill" />}
        </button>

        <button 
          onClick={toggleMute}
          className="h-10 w-10 rounded-full bg-black/40 backdrop-blur-md flex items-center justify-center text-white border border-white/10 hover:bg-black/60 transition-all"
        >
          {isMuted ? <SpeakerSlash size={20} weight="fill" /> : <SpeakerHigh size={20} weight="fill" />}
        </button>
      </div>

      {/* Progress Bar */}
      <div className="absolute bottom-0 left-0 h-1 bg-[#0066FF] transition-all duration-300" style={{ width: '0%' }} id="video-progress" />
    </div>
  );
}
