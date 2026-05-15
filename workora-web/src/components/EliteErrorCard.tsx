'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface EliteErrorCardProps {
  message: string | null;
  onClose?: () => void;
}

export function EliteErrorCard({ message, onClose }: EliteErrorCardProps) {
  return (
    <AnimatePresence>
      {message && (
        <motion.div 
          initial={{ opacity: 0, scale: 0.9, y: -10 }}
          animate={{ 
            opacity: 1, 
            scale: 1, 
            y: 0,
            x: [0, -10, 10, -10, 10, 0] 
          }}
          exit={{ opacity: 0, scale: 0.9, y: -10 }}
          transition={{
            duration: 0.4,
            x: { duration: 0.4, ease: "easeInOut" }
          }}
          className="w-full bg-red-50 border border-red-100 p-4 rounded-2xl mb-8 flex items-center gap-3 relative shadow-sm"
        >
          <div className="h-8 w-8 rounded-full bg-red-500 flex-shrink-0 flex items-center justify-center text-white font-black text-sm shadow-lg shadow-red-200">
            !
          </div>
          <div className="flex-1 pr-8">
            <p className="text-[12px] font-black text-red-600 uppercase tracking-tight leading-tight">
              {message}
            </p>
          </div>
          {onClose && (
            <button 
              onClick={onClose}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-red-300 hover:text-red-600 transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 256 256">
                <path d="M205.66,194.34a8,8,0,0,1-11.32,11.32L128,139.31,61.66,205.66a8,8,0,0,1-11.32-11.32L116.69,128,50.34,61.66A8,8,0,0,1,61.66,50.34L128,116.69l66.34-66.35a8,8,0,0,1,11.32,11.32L139.31,128Z"></path>
              </svg>
            </button>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
