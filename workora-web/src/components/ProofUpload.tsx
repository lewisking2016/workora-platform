'use client';

import React, { useState } from 'react';
import { VideoCamera, CloudArrowUp, CheckCircle, SpinnerGap } from '@phosphor-icons/react';
import { motion, AnimatePresence } from 'framer-motion';

export function ProofUpload() {
  const [isUploading, setIsUploading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    try {
      // 1. Get signed URL
      const res = await fetch('/api/upload', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ filename: file.name, contentType: file.type }),
      });
      const { uploadUrl } = await res.json();

      // 2. Upload directly to R2
      await fetch(uploadUrl, {
        method: 'PUT',
        body: file,
        headers: { 'Content-Type': file.type },
      });

      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
    } catch (error) {
      console.error('Upload failed:', error);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="flex flex-col gap-3">
      <label className="relative flex flex-col items-center justify-center h-48 w-full rounded-[40px] border-2 border-dashed border-zinc-100 bg-zinc-50 hover:bg-white hover:border-[#0066FF]/30 transition-all cursor-pointer overflow-hidden group shadow-sm hover:shadow-xl">
        <input 
          type="file" 
          accept="video/*" 
          className="hidden" 
          onChange={handleFileChange}
          disabled={isUploading}
        />
        
        <AnimatePresence mode="wait">
          {isUploading ? (
            <motion.div 
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex flex-col items-center gap-4"
            >
              <SpinnerGap size={40} className="text-[#0066FF] animate-spin" weight="bold" />
              <span className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-400">Verifying Assets...</span>
            </motion.div>
          ) : showSuccess ? (
            <motion.div 
              key="success"
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="flex flex-col items-center gap-4 text-[#0066FF]"
            >
              <CheckCircle size={48} weight="fill" />
              <span className="text-[10px] font-black uppercase tracking-[0.3em]">Verified & Uploaded</span>
            </motion.div>
          ) : (
            <motion.div 
              key="idle"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex flex-col items-center gap-4"
            >
              <div className="h-16 w-16 rounded-[24px] bg-white shadow-lg flex items-center justify-center text-[#0066FF] group-hover:scale-110 transition-transform duration-500 border border-zinc-50">
                <VideoCamera size={32} weight="duotone" />
              </div>
              <div className="flex flex-col items-center gap-1">
                 <span className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-950">Add Proof of Work</span>
                 <span className="text-[10px] font-bold text-zinc-400">Max 50MB • MP4/MOV</span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </label>
    </div>
  );
}
