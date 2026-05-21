'use client';

import React, { useRef, useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, 
  Lightning, 
  LightningSlash, 
  Gear, 
  MagicWand, 
  Aperture, 
  MusicNotes, 
  TextT,
  ArrowsClockwise,
  Record,
  StopCircle,
  CheckCircle
} from '@phosphor-icons/react';

type CameraMode = 'WORK' | 'STORY' | 'POST';
type FilterType = 'none' | 'vibrance' | 'workshop' | 'grayscale';

interface CameraUIProps {
  onClose: () => void;
  onCapture: (file: File | Blob, type: string) => void;
}

export function CameraUI({ onClose, onCapture }: CameraUIProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [facingMode, setFacingMode] = useState<'user' | 'environment'>('environment');
  const [mode, setMode] = useState<CameraMode>('POST');
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [flash, setFlash] = useState(false);
  const [activeFilter, setActiveFilter] = useState<FilterType>('none');
  const chunksRef = useRef<Blob[]>([]);

  // 60-second limit
  const MAX_RECORDING_TIME = 60;

  const startCamera = useCallback(async () => {
    try {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
      const newStream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode },
        audio: true
      });
      setStream(newStream);
      if (videoRef.current) {
        videoRef.current.srcObject = newStream;
      }
    } catch (err) {
      console.error('Error accessing camera:', err);
    }
  }, [facingMode]);

  useEffect(() => {
    startCamera();
    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, [startCamera]);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isRecording) {
      interval = setInterval(() => {
        setRecordingTime((prev) => {
          if (prev >= MAX_RECORDING_TIME) {
            stopRecording();
            return prev;
          }
          return prev + 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isRecording]);

  const toggleCamera = () => {
    setFacingMode(prev => prev === 'user' ? 'environment' : 'user');
  };

  const applyFilterClass = () => {
    switch (activeFilter) {
      case 'vibrance': return 'contrast-125 saturate-150';
      case 'workshop': return 'contrast-150 sepia-[.30] hue-rotate-[-10deg]';
      case 'grayscale': return 'grayscale contrast-125';
      default: return '';
    }
  };

  const startRecording = () => {
    if (!stream) return;
    setIsRecording(true);
    setRecordingTime(0);
    chunksRef.current = [];

    const mediaRecorder = new MediaRecorder(stream, { mimeType: 'video/webm' });
    mediaRecorderRef.current = mediaRecorder;

    mediaRecorder.ondataavailable = (e) => {
      if (e.data.size > 0) chunksRef.current.push(e.data);
    };

    mediaRecorder.onstop = () => {
      const blob = new Blob(chunksRef.current, { type: 'video/webm' });
      onCapture(blob, 'video');
    };

    mediaRecorder.start();
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  const takePhoto = () => {
    if (!videoRef.current) return;
    const canvas = document.createElement('canvas');
    canvas.width = videoRef.current.videoWidth;
    canvas.height = videoRef.current.videoHeight;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      // Apply basic filter to canvas before capture if needed
      if (activeFilter === 'grayscale') ctx.filter = 'grayscale(100%)';
      ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
      canvas.toBlob((blob) => {
        if (blob) onCapture(blob, 'image');
      }, 'image/jpeg', 0.9);
    }
  };

  const handleCapture = () => {
    if (isRecording) {
      stopRecording();
    } else {
      // Work mode does video, POST/STORY do photo for simplicity in this pilot.
      if (mode === 'WORK') {
        startRecording();
      } else {
        takePhoto();
      }
    }
  };

  return (
    <div className="fixed inset-0 z-[99999] bg-black text-white flex flex-col font-sans overflow-hidden">
      {/* Video Background */}
      <video
        ref={videoRef}
        autoPlay
        playsInline
        muted
        className={`absolute inset-0 w-full h-full object-cover transition-all duration-300 ${applyFilterClass()}`}
      />

      {/* Top Controls Overlay */}
      <div className="relative z-10 flex items-center justify-between p-6 bg-gradient-to-b from-black/50 to-transparent">
        <button onClick={onClose} className="hover:scale-110 transition-transform">
          <X size={28} weight="bold" />
        </button>
        <div className="flex items-center gap-6">
          <button onClick={() => setFlash(!flash)} className="hover:scale-110 transition-transform">
            {flash ? <Lightning size={24} weight="fill" /> : <LightningSlash size={24} />}
          </button>
          <button className="hover:scale-110 transition-transform">
            <Gear size={24} />
          </button>
        </div>
      </div>

      {/* Recording Indicator */}
      {isRecording && (
        <div className="absolute top-20 left-1/2 -translate-x-1/2 z-10 flex items-center gap-2 bg-red-500/80 backdrop-blur-md px-3 py-1 rounded-full">
          <div className="w-2 h-2 rounded-full bg-white animate-pulse" />
          <span className="text-xs font-bold font-mono">00:{recordingTime.toString().padStart(2, '0')}</span>
        </div>
      )}

      {/* Side Tools Overlay */}
      <div className="absolute right-4 top-1/3 flex flex-col gap-6 z-10">
        <button className="flex flex-col items-center gap-1 hover:scale-110 transition-transform">
          <TextT size={24} />
          <span className="text-[10px] font-bold">Text</span>
        </button>
        <button className="flex flex-col items-center gap-1 hover:scale-110 transition-transform">
          <MusicNotes size={24} />
          <span className="text-[10px] font-bold">Audio</span>
        </button>
        <button 
          onClick={() => setActiveFilter(prev => prev === 'none' ? 'vibrance' : prev === 'vibrance' ? 'workshop' : prev === 'workshop' ? 'grayscale' : 'none')}
          className="flex flex-col items-center gap-1 hover:scale-110 transition-transform"
        >
          <MagicWand size={24} weight={activeFilter !== 'none' ? 'fill' : 'regular'} className={activeFilter !== 'none' ? 'text-[#00D1FF]' : ''} />
          <span className="text-[10px] font-bold">Filters</span>
        </button>
      </div>

      <div className="mt-auto relative z-10 bg-gradient-to-t from-black/80 via-black/40 to-transparent pt-20 pb-10 flex flex-col items-center">
        
        {/* Filter Name Pop */}
        <AnimatePresence>
          {activeFilter !== 'none' && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="absolute bottom-40 text-xs font-bold uppercase tracking-widest text-[#00D1FF] bg-black/40 backdrop-blur-md px-4 py-2 rounded-full"
            >
              {activeFilter}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Capture Controls */}
        <div className="flex items-center justify-center gap-12 w-full px-10 mb-8">
          {/* Last Photo Preview Placeholder */}
          <div className="w-10 h-10 rounded-lg border-2 border-white/20 bg-white/10 overflow-hidden" />
          
          {/* Massive Capture Button */}
          <button 
            onClick={handleCapture}
            className={`w-20 h-20 rounded-full border-4 flex items-center justify-center transition-all ${isRecording ? 'border-red-500 scale-110' : 'border-white hover:scale-105'}`}
          >
            <div className={`w-16 h-16 rounded-full transition-all ${isRecording ? 'bg-red-500 scale-50 rounded-sm' : 'bg-white'}`} />
          </button>
          
          {/* Flip Camera */}
          <button onClick={toggleCamera} className="w-10 h-10 flex items-center justify-center hover:scale-110 transition-transform">
            <ArrowsClockwise size={28} />
          </button>
        </div>

        {/* Mode Selector */}
        <div className="flex items-center justify-center gap-6 text-xs font-bold tracking-widest uppercase relative w-full overflow-hidden">
          <div className="absolute left-1/2 -translate-x-1/2 bottom-[-10px] w-1 h-1 rounded-full bg-white" />
          {(['WORK', 'STORY', 'POST'] as CameraMode[]).map((m) => (
            <button
              key={m}
              onClick={() => setMode(m)}
              className={`transition-colors py-2 ${mode === m ? 'text-white' : 'text-white/40 hover:text-white/80'}`}
            >
              {m}
            </button>
          ))}
        </div>

      </div>
    </div>
  );
}
