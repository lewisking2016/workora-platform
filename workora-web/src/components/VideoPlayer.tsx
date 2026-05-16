'use client';

import React, { useRef, useState, useEffect } from 'react';
import { Play, Pause, SpeakerHigh, SpeakerSlash } from '@phosphor-icons/react';

interface VideoPlayerProps {
  src: string;
  poster?: string;
  className?: string;
}

export function VideoPlayer({ src, poster, className = "" }: VideoPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [showControls, setShowControls] = useState(false);

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

  return (
    <div 
      className={`relative group cursor-pointer overflow-hidden bg-black ${className}`}
      onMouseEnter={() => setShowControls(true)}
      onMouseLeave={() => setShowControls(false)}
      onClick={togglePlay}
    >
      <video
        ref={videoRef}
        src={src}
        poster={poster}
        className="w-full h-full object-cover"
        loop
        muted={isMuted}
        playsInline
      />

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
