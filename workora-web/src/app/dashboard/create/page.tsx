'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, 
  CaretRight,
  PlusCircle,
  ClockCounterClockwise,
  Lightning,
  Sparkle,
  House,
  MagnifyingGlass,
  PlusSquare,
  ChatCircleDots,
  CheckCircle
} from '@phosphor-icons/react';
import Link from 'next/link';
import { Sidebar } from '@/components/Sidebar';
import { usePathname } from 'next/navigation';

type PostType = 'work' | 'story' | 'tip';

export default function CreatePage() {
  const pathname = usePathname();
  const [selectedType, setSelectedType] = useState<PostType | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (f) {
      setFile(f);
      const reader = new FileReader();
      reader.onloadend = () => setPreview(reader.result as string);
      reader.readAsDataURL(f);
    }
  };

  const handleUpload = async () => {
    if (!file || !selectedType) return;
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSuccess(true);
      setTimeout(() => {
        setSuccess(false);
        setSelectedType(null);
        setFile(null);
        setPreview(null);
        setDescription('');
      }, 3000);
    }, 2000);
  };

  const OPTIONS = [
    { 
      id: 'work', 
      title: 'Proof of Work', 
      desc: 'Showcase a finished job to build trust', 
      icon: CheckCircle, 
      color: 'bg-blue-50 text-[#0066FF]',
      accent: 'border-blue-100 hover:border-[#0066FF]'
    },
    { 
      id: 'story', 
      title: 'Status / Story', 
      desc: 'Share what you are working on right now', 
      icon: ClockCounterClockwise, 
      color: 'bg-purple-50 text-[#7000FF]',
      accent: 'border-purple-100 hover:border-[#7000FF]'
    },
    { 
      id: 'tip', 
      title: 'Expert Tip', 
      desc: 'Share knowledge and gain followers', 
      icon: Sparkle, 
      color: 'bg-amber-50 text-amber-600',
      accent: 'border-amber-100 hover:border-amber-600'
    }
  ];

  return (
    <div className="h-screen w-full bg-white text-zinc-950 font-display flex overflow-hidden">
      <Sidebar />

      <main className="flex-1 h-full overflow-y-auto bg-zinc-50/50 flex flex-col items-center pt-8 px-4">
        <div className="w-full max-w-2xl bg-white rounded-[40px] shadow-sm border border-zinc-100 overflow-hidden mb-20">
          
          <div className="p-8 border-b border-zinc-50 flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-black tracking-tight">Create Content</h1>
              <p className="text-zinc-400 font-bold text-xs mt-1 uppercase tracking-widest">Build your professional presence</p>
            </div>
            <Link href="/dashboard/feed" className="h-10 w-10 rounded-full bg-zinc-100 flex items-center justify-center hover:bg-zinc-200 transition-colors">
              <X size={20} weight="bold" />
            </Link>
          </div>

          <div className="p-8">
            <AnimatePresence mode="wait">
              {!selectedType ? (
                <motion.div key="selector" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-4">
                  {OPTIONS.map((opt) => (
                    <button 
                      key={opt.id} 
                      onClick={() => setSelectedType(opt.id as PostType)}
                      className={`w-full p-6 rounded-3xl border-2 ${opt.accent} transition-all text-left flex items-center gap-6 group`}
                    >
                      <div className={`h-16 w-16 rounded-2xl ${opt.color} flex items-center justify-center transition-transform group-hover:scale-110`}>
                        <opt.icon size={32} weight="duotone" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-black text-lg">{opt.title}</h3>
                        <p className="text-zinc-500 font-bold text-xs">{opt.desc}</p>
                      </div>
                      <CaretRight size={20} weight="bold" className="text-zinc-300 group-hover:text-zinc-900 group-hover:translate-x-1 transition-all" />
                    </button>
                  ))}
                </motion.div>
              ) : success ? (
                <motion.div key="success" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="flex flex-col items-center justify-center py-12 text-center">
                  <div className="h-20 w-20 rounded-full bg-emerald-50 text-emerald-500 flex items-center justify-center mb-6">
                    <CheckCircle size={48} weight="fill" />
                  </div>
                  <h2 className="text-2xl font-black">Shared successfully!</h2>
                  <p className="text-zinc-500 font-bold text-sm mt-2">Your work is now live on the Workora network.</p>
                </motion.div>
              ) : (
                <motion.div key="editor" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-8">
                  <div className="flex items-center gap-4">
                    <button onClick={() => setSelectedType(null)} className="text-zinc-400 font-black text-[10px] uppercase tracking-widest hover:text-zinc-950 transition-colors">Change Type</button>
                    <span className="h-4 w-px bg-zinc-200" />
                    <span className="text-[10px] font-black uppercase tracking-widest text-[#0066FF]">{selectedType}</span>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <div className="space-y-4">
                      <p className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Media</p>
                      {preview ? (
                        <div className="relative aspect-square rounded-3xl overflow-hidden bg-zinc-100 group">
                          {file?.type.startsWith('video') ? (
                            <video src={preview} className="w-full h-full object-cover" controls />
                          ) : (
                            <img src={preview} alt="Preview" className="w-full h-full object-cover" />
                          )}
                          <button 
                            onClick={() => { setFile(null); setPreview(null); }}
                            className="absolute top-4 right-4 h-10 w-10 rounded-full bg-black/50 backdrop-blur-md text-white flex items-center justify-center hover:bg-black/70 transition-colors"
                          >
                            <X size={20} weight="bold" />
                          </button>
                        </div>
                      ) : (
                        <label className="aspect-square rounded-3xl border-2 border-dashed border-zinc-200 flex flex-col items-center justify-center gap-4 cursor-pointer hover:border-[#0066FF] hover:bg-blue-50/30 transition-all group">
                          <div className="h-16 w-16 rounded-full bg-zinc-50 text-zinc-400 flex items-center justify-center group-hover:text-[#0066FF] transition-colors">
                            <PlusCircle size={32} weight="duotone" />
                          </div>
                          <div className="text-center">
                            <p className="font-black text-xs">Select Video or Photo</p>
                            <p className="text-[10px] text-zinc-400 font-bold mt-1">MP4, MOV, JPG, PNG up to 50MB</p>
                          </div>
                          <input type="file" className="hidden" accept="video/*,image/*" onChange={handleFileChange} />
                        </label>
                      )}
                    </div>

                    <div className="space-y-6">
                      <div className="space-y-4">
                        <p className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Caption / Description</p>
                        <textarea 
                          value={description}
                          onChange={(e) => setDescription(e.target.value)}
                          placeholder="Write something about your work..."
                          className="w-full h-40 rounded-3xl bg-zinc-50 border border-zinc-100 p-6 text-sm font-bold outline-none focus:bg-white focus:border-[#0066FF] transition-all resize-none"
                        />
                      </div>

                      <button 
                        disabled={!file || loading}
                        onClick={handleUpload}
                        className="h-16 w-full bg-gradient-to-r from-[#0066FF] to-[#7000FF] text-white rounded-full font-black text-sm uppercase tracking-widest shadow-xl shadow-blue-500/20 flex items-center justify-center gap-3 disabled:opacity-50 disabled:grayscale transition-all"
                      >
                        {loading ? <div className="h-6 w-6 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : (
                          <>Share Now <Lightning size={20} weight="fill" /></>
                        )}
                      </button>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </main>

      {/* Mobile Nav */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-white/90 backdrop-blur-2xl p-4 px-8 flex justify-between items-center z-[300] shadow-[0_-10px_40px_rgba(0,0,0,0.08)] border-t border-zinc-50">
        <Link href="/dashboard/feed" className="flex flex-col items-center gap-1">
          <House size={26} weight={pathname === '/dashboard/feed' ? "fill" : "regular"} className={pathname === '/dashboard/feed' ? "text-[#0066FF]" : "text-zinc-400"} />
          <span className={`text-[8px] font-black uppercase tracking-widest ${pathname === '/dashboard/feed' ? "text-[#0066FF]" : "text-zinc-400"}`}>Home</span>
        </Link>
        <Link href="/dashboard/search" className="flex flex-col items-center gap-1">
          <MagnifyingGlass size={26} className="text-zinc-400" />
          <span className="text-[8px] font-black uppercase tracking-widest text-zinc-400">Search</span>
        </Link>
        <Link href="/dashboard/create" className="bg-[#0066FF] h-12 w-12 rounded-[20px] shadow-lg shadow-blue-500/40 flex items-center justify-center transform -translate-y-6 rotate-45 border-4 border-white transition-transform active:scale-90">
          <PlusSquare size={26} weight="bold" className="text-white -rotate-45" />
        </Link>
        <Link href="/dashboard/messages" className="flex flex-col items-center gap-1">
          <ChatCircleDots size={26} className="text-zinc-400" />
          <span className="text-[8px] font-black uppercase tracking-widest text-zinc-400">Chat</span>
        </Link>
        <Link href="/dashboard/profile" className="flex flex-col items-center gap-1">
          <div className="h-7 w-7 rounded-full bg-gradient-to-br from-[#0066FF] to-[#7000FF] flex items-center justify-center text-white text-[10px] font-black uppercase border-2 border-white shadow-sm">
            U
          </div>
          <span className="text-[8px] font-black uppercase tracking-widest text-zinc-400">Profile</span>
        </Link>
      </nav>
    </div>
  );
}
