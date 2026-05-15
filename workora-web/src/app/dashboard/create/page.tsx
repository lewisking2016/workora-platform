'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sidebar } from '@/components/Sidebar';
import { 
  VideoCamera, 
  CheckCircle,
  CaretRight,
  Info
} from '@phosphor-icons/react';
import Link from 'next/link';

interface User {
  id: string;
  username: string;
  role: string;
}

const TRADES = ['Electrical', 'Construction', 'Automotive', 'Fashion', 'Domestic', 'Beauty', 'Repair', 'Logistics'];

export default function CreatePage() {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    video_url: '',
    thumbnail_url: ''
  });
  const [loading, setLoading] = useState(false);
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  useEffect(() => {
    const userStr = localStorage.getItem('workora_user');
    if (userStr) {
      try {
        const parsed = JSON.parse(userStr);
        // Defer setting state to avoid cascading render warning in strict environments
        setTimeout(() => {
          setCurrentUser(parsed);
        }, 0);
      } catch (err) {
        console.error('Failed to parse user session:', err);
      }
    }
  }, []);

  const handleSubmit = async () => {
    if (!currentUser) return;
    setLoading(true);
    try {
      const res = await fetch('/api/gigs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          worker_id: currentUser.id,
          // Placeholders for now
          video_url: '/uploads/placeholder-video.mp4',
          thumbnail_url: 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&q=80&w=800'
        })
      });
      
      if (res.ok) {
        setStep(3);
      }
    } catch (err) {
      console.error('Upload failed:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-screen w-full bg-white text-[#1A1A1A] font-display flex overflow-hidden">
      <Sidebar />
      
      <main className="flex-1 h-full overflow-y-auto bg-white pt-8 px-[5%] lg:px-12">
        <div className="max-w-2xl mx-auto flex flex-col gap-10 pb-32">
          
          <AnimatePresence mode="wait">
            {step === 1 && (
              <motion.div 
                key="step1"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="flex flex-col gap-10"
              >
                <div className="flex flex-col gap-2">
                  <h1 className="text-3xl font-black tracking-tighter text-zinc-950 uppercase">Share Proof of Work</h1>
                  <p className="text-zinc-500 font-bold text-sm tracking-tight uppercase">Every elite pro started with their first gig.</p>
                </div>

                <div className="aspect-video w-full rounded-[40px] border-4 border-dashed border-zinc-100 flex flex-col items-center justify-center gap-6 bg-zinc-50 group hover:bg-white hover:border-blue-100 transition-all cursor-pointer shadow-inner">
                   <div className="h-20 w-20 rounded-full bg-white flex items-center justify-center text-[#0066FF] shadow-xl group-hover:scale-110 transition-transform">
                      <VideoCamera size={40} weight="fill" />
                   </div>
                   <div className="text-center">
                      <p className="text-sm font-black text-zinc-950">Upload Proof Video</p>
                      <p className="text-[10px] text-zinc-400 font-bold uppercase tracking-widest mt-1">MP4, MOV up to 50MB</p>
                   </div>
                </div>

                <div className="flex flex-col gap-4">
                   <input 
                     placeholder="What did you do? (e.g. Full House Wiring)" 
                     className="h-16 w-full rounded-2xl bg-zinc-50 border border-zinc-100 px-6 font-bold text-base focus:bg-white focus:ring-1 focus:ring-blue-100 outline-none"
                     value={formData.title}
                     onChange={(e) => setFormData({...formData, title: e.target.value})}
                   />
                   <textarea 
                     placeholder="Tell the network about the project details..." 
                     className="h-40 w-full rounded-2xl bg-zinc-50 border border-zinc-100 p-6 font-bold text-base focus:bg-white focus:ring-1 focus:ring-blue-100 outline-none resize-none"
                     value={formData.description}
                     onChange={(e) => setFormData({...formData, description: e.target.value})}
                   />
                </div>

                <button 
                  onClick={() => setStep(2)}
                  disabled={!formData.title || !formData.description}
                  className="h-16 w-full bg-zinc-950 text-white rounded-full font-black text-sm uppercase tracking-widest shadow-xl flex items-center justify-center gap-4 disabled:opacity-30 transition-all"
                >
                  Next Step <CaretRight size={20} weight="bold" />
                </button>
              </motion.div>
            )}

            {step === 2 && (
              <motion.div 
                key="step2"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="flex flex-col gap-10"
              >
                <div className="flex flex-col gap-2">
                  <h1 className="text-3xl font-black tracking-tighter text-zinc-950 uppercase">Select Trade</h1>
                  <p className="text-zinc-500 font-bold text-sm tracking-tight uppercase">Help people find your work in the right category.</p>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  {TRADES.map(trade => (
                    <button 
                      key={trade}
                      onClick={() => setFormData({...formData, category: trade})}
                      className={`h-16 rounded-2xl border font-black text-[11px] uppercase tracking-widest transition-all ${formData.category === trade ? 'bg-[#0066FF] text-white border-[#0066FF] shadow-lg' : 'bg-zinc-50 text-zinc-400 border-zinc-100 hover:border-zinc-300'}`}
                    >
                      {trade}
                    </button>
                  ))}
                </div>

                <div className="bg-blue-50/50 p-6 rounded-[32px] border border-blue-100/50 flex items-start gap-4">
                   <div className="mt-0.5 text-[#0066FF]">
                      <Info size={24} weight="fill" />
                   </div>
                   <div className="flex flex-col gap-1">
                      <p className="text-sm font-black text-zinc-900">Elite Tip</p>
                      <p className="text-[12px] font-medium text-zinc-600 leading-relaxed">
                        Pros who tag their work correctly get 40% more visibility in the Workora Explore grid.
                      </p>
                   </div>
                </div>

                <div className="flex gap-4">
                   <button onClick={() => setStep(1)} className="h-16 flex-1 border border-zinc-200 text-zinc-400 rounded-full font-black text-sm uppercase tracking-widest">Back</button>
                   <button 
                     onClick={handleSubmit}
                     disabled={!formData.category || loading}
                     className="h-16 flex-[2] bg-[#0066FF] text-white rounded-full font-black text-sm uppercase tracking-widest shadow-xl flex items-center justify-center gap-4"
                   >
                     {loading ? <div className="h-6 w-6 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : "Post Proof of Work"}
                   </button>
                </div>
              </motion.div>
            )}

            {step === 3 && (
              <motion.div 
                key="step3"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex flex-col items-center justify-center gap-8 py-20"
              >
                <div className="h-32 w-32 rounded-full bg-green-50 flex items-center justify-center text-green-500 shadow-xl shadow-green-500/10">
                   <CheckCircle size={80} weight="fill" />
                </div>
                <div className="text-center flex flex-col gap-3">
                   <h1 className="text-3xl font-black tracking-tighter text-zinc-950 uppercase">Live on the Network!</h1>
                   <p className="text-zinc-500 font-bold text-sm tracking-tight uppercase max-w-xs">Your proof-of-work is now being shared with elite hirers.</p>
                </div>
                <Link href="/dashboard/feed" className="h-16 w-full bg-zinc-950 text-white rounded-full font-black text-sm uppercase tracking-widest flex items-center justify-center shadow-xl">
                   Go to My Feed
                </Link>
              </motion.div>
            )}
          </AnimatePresence>

        </div>
      </main>
    </div>
  );
}
