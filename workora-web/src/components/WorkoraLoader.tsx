'use client';

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Scissors, Hammer } from '@phosphor-icons/react';

// Custom Zipper Pull Icon
const ZipperIcon = ({ size = 24, className = "" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <rect x="9" y="4" width="6" height="10" rx="2" fill="currentColor" />
    <rect x="10" y="14" width="4" height="6" rx="1" fill="currentColor" />
    <circle cx="12" cy="7" r="1.5" fill="white" />
  </svg>
);

interface WorkoraLoaderProps {
  fullScreen?: boolean;
  /** Optional: Provide loading start time to auto-calculate duration */
  startTime?: number;
}

export default function WorkoraLoader({ fullScreen = false, startTime }: WorkoraLoaderProps) {
  const [phase, setPhase] = useState(0);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [cycleSpeed, setCycleSpeed] = useState(1300);

  // Track elapsed time if startTime is provided
  useEffect(() => {
    if (!startTime) return;
    
    const interval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      setElapsedTime(elapsed);
      
      // Adjust cycle speed based on loading time
      // Fast loading (< 2s): 900ms cycles
      // Normal loading (2-5s): 1300ms cycles  
      // Slow loading (> 5s): 1800ms cycles
      if (elapsed < 2000) {
        setCycleSpeed(900);
      } else if (elapsed < 5000) {
        setCycleSpeed(1300);
      } else {
        setCycleSpeed(1800);
      }
    }, 100);

    return () => clearInterval(interval);
  }, [startTime]);

  // Cycle through phases dynamically based on speed
  useEffect(() => {
    const interval = setInterval(() => {
      setPhase((prev) => (prev + 1) % 3);
    }, cycleSpeed);
    return () => clearInterval(interval);
  }, [cycleSpeed]);

  // Calculate animation duration based on cycle speed
  const animDuration = cycleSpeed / 1000;

  // Phase configurations
  const phases = [
    {
      id: 'cut',
      icon: <Scissors size={28} weight="fill" className="text-zinc-950 dark:text-white -rotate-90" />,
      trackStyle: 'border-b-2 border-dashed border-zinc-950 dark:border-white',
      gap: 6,
      iconAnim: { rotate: [-90, -45, -90, -45, -90, -45, -90], transition: { duration: animDuration } }
    },
    {
      id: 'build',
      icon: <Hammer size={28} weight="fill" className="text-[#0066FF]" />,
      trackStyle: 'bg-[radial-gradient(circle,currentColor_2px,transparent_2px)] bg-[length:12px_12px] h-[4px] text-zinc-950 dark:text-white',
      gap: 0,
      iconAnim: { rotate: [0, -45, 0, -45, 0, -45, 0], transition: { duration: animDuration } }
    },
    {
      id: 'zip',
      icon: <ZipperIcon size={28} className="text-[#7000FF] rotate-90" />,
      trackStyle: 'border-b-4 border-double border-zinc-400',
      gap: 8,
      iconAnim: { scale: [1, 1.1, 1], transition: { duration: animDuration } }
    }
  ];

  const currentPhase = phases[phase];

  // Dynamic easing based on loading time
  const easeType = elapsedTime > 5000 ? "easeOut" : elapsedTime > 2000 ? "easeInOut" : "linear";

  const loaderContent = (
    <div className="relative flex flex-col items-center justify-center w-[90vw] max-w-[300px]">
      
      {/* Container for the logo text and animation */}
      <div className="relative w-full h-[80px] flex flex-col items-center justify-center">
        
        {/* Top Half of Text */}
        <motion.div 
          animate={{ y: -currentPhase.gap / 2 }}
          transition={{ duration: animDuration * 0.77, ease: easeType }}
          className="absolute inset-0 flex items-center justify-center overflow-hidden"
          style={{ clipPath: 'inset(0 0 50% 0)' }}
        >
          <span className="text-5xl sm:text-6xl font-black tracking-tighter text-zinc-950 dark:text-white">workora</span>
        </motion.div>

        {/* Bottom Half of Text */}
        <motion.div 
          animate={{ y: currentPhase.gap / 2 }}
          transition={{ duration: animDuration * 0.77, ease: easeType }}
          className="absolute inset-0 flex items-center justify-center overflow-hidden"
          style={{ clipPath: 'inset(50% 0 0 0)' }}
        >
          <span className="text-5xl sm:text-6xl font-black tracking-tighter text-zinc-950 dark:text-white">workora</span>
        </motion.div>

        {/* The Animated Track (progresses left to right) */}
        <div className="absolute top-1/2 left-0 -translate-y-1/2 w-full h-[4px] z-10 overflow-hidden flex items-center px-4">
           <motion.div 
             key={`track-${phase}`}
             initial={{ width: '0%' }}
             animate={{ width: '100%' }}
             transition={{ duration: animDuration, ease: "linear" }}
             className={`h-full w-full ${currentPhase.trackStyle}`}
           />
        </div>

        {/* The Action Icon (moves left to right) */}
        <div className="absolute top-1/2 left-0 -translate-y-1/2 w-full h-full z-20 pointer-events-none px-4">
          <motion.div
            key={`icon-container-${phase}`}
            initial={{ left: '0%' }}
            animate={{ left: '100%' }}
            transition={{ duration: animDuration, ease: "linear" }}
            className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 flex items-center justify-center bg-white dark:bg-[#0A0E17] rounded-full p-1 shadow-sm border border-zinc-100 dark:border-zinc-800"
          >
            <motion.div animate={currentPhase.iconAnim.rotate || currentPhase.iconAnim.scale ? currentPhase.iconAnim : {}}>
              {currentPhase.icon}
            </motion.div>
          </motion.div>
        </div>
      </div>
      
      {/* Tagline with elapsed time indicator */}
      <motion.div 
        animate={{ opacity: [0.5, 1, 0.5] }}
        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        className="mt-2 text-zinc-400 font-bold text-[10px] uppercase tracking-[0.3em]"
      >
        {elapsedTime > 5000 ? 'Almost there...' : elapsedTime > 2000 ? 'Loading...' : 'Processing...'}
      </motion.div>
    </div>
  );

  if (fullScreen) {
    return (
      <div className="fixed inset-0 z-[9999] bg-white/80 dark:bg-[#0A0E17]/80 backdrop-blur-md flex items-center justify-center">
        {loaderContent}
      </div>
    );
  }

  return loaderContent;
}
