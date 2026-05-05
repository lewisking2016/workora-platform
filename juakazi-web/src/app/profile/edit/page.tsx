'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  PencilSimple, 
  Plus, 
  X, 
  Info, 
  MapPin, 
  ChatTeardropText,
  Briefcase,
  GraduationCap,
  Certificate,
  Wrench,
  CheckCircle,
  CaretLeft,
  CaretDown,
  Camera
} from '@phosphor-icons/react';
import Link from 'next/link';
import Image from 'next/image';

export default function EditProfilePage() {
  const [profile, setProfile] = useState({
    displayName: 'kinaga55',
    title: '',
    location: 'Kenya',
    languages: [],
    about: '',
    skills: [],
    experience: [],
    education: [],
    certifications: []
  });

  const [activeForm, setActiveForm] = useState<string | null>(null);
  const [showLanguages, setShowLanguages] = useState(false);

  const LANGUAGES = ['English', 'Spanish', 'French', 'German', 'Italian', 'Afar', 'Amharic', 'Arabic', 'Swahili'];

  // Character count for About
  const isAboutValid = profile.about.length >= 150;

  return (
    <div className="min-h-screen bg-zinc-50/50 pb-32 font-display">
      
      {/* 1. Header Navigation */}
      <div className="sticky top-0 z-50 bg-white/80 backdrop-blur-xl border-b border-zinc-100 px-[5%] py-4">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <Link href="/profile" className="flex items-center gap-2 text-zinc-400 hover:text-zinc-950 transition-colors font-black text-[10px] uppercase tracking-widest">
            <CaretLeft size={14} weight="bold" /> Back to Passport
          </Link>
          <h1 className="text-sm font-black tracking-tight text-zinc-950 uppercase tracking-[0.2em]">Edit Your New Profile</h1>
          <div className="w-20" /> {/* Spacer */}
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-[5%] pt-12">
        
        {/* Intro Message */}
        <div className="mb-12">
           <h2 className="text-3xl font-black tracking-tighter text-zinc-950">Edit your new profile</h2>
           <p className="text-zinc-500 font-bold mt-2">You can come back and update your profile anytime.</p>
        </div>

        <div className="space-y-12">
          
          {/* 2. Basic Identity Section */}
          <section className="bg-white rounded-[32px] border border-zinc-100 p-8 shadow-sm">
             <div className="flex flex-col md:flex-row items-center gap-8">
                <div className="relative group">
                   <div className="h-24 w-24 rounded-full bg-zinc-100 flex items-center justify-center overflow-hidden border-2 border-white shadow-lg">
                      <Image src="/logo/juakazi-dark-removebg.png" alt="Profile" width={40} height={40} className="opacity-20 grayscale" />
                   </div>
                   <button className="absolute bottom-0 right-0 h-8 w-8 bg-white border border-zinc-100 rounded-full flex items-center justify-center shadow-md hover:scale-110 transition-transform">
                      <Camera size={16} weight="bold" />
                   </button>
                </div>

                <div className="flex-1 space-y-4">
                   <div className="flex items-center gap-4">
                      <h3 className="text-2xl font-black tracking-tight text-zinc-950">{profile.displayName}</h3>
                      <button className="text-zinc-400 hover:text-[#0066FF] transition-colors"><PencilSimple size={20} weight="bold" /></button>
                      <span className="text-zinc-400 font-bold text-sm">@{profile.displayName}</span>
                   </div>
                   <div className="flex flex-wrap gap-6 items-center relative">
                      <button className="flex items-center gap-2 text-sm font-black text-[#0066FF] border-b border-transparent hover:border-[#0066FF] transition-all">Add title <PencilSimple size={14} /></button>
                      <div className="flex items-center gap-2 text-zinc-500 text-sm font-bold"><MapPin size={18} weight="fill" /> Kenya</div>
                      
                      <div className="relative">
                        <button 
                          onClick={() => setShowLanguages(!showLanguages)}
                          className="flex items-center gap-2 text-sm font-black text-[#0066FF] border-b border-transparent hover:border-[#0066FF] transition-all"
                        >
                          <ChatTeardropText size={18} /> Add languages <PencilSimple size={14} />
                        </button>

                        <AnimatePresence>
                           {showLanguages && (
                              <motion.div 
                                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                className="absolute top-full left-0 z-50 mt-4 w-72 bg-white rounded-[24px] border border-zinc-100 shadow-[0_30px_80px_-15px_rgba(0,0,0,0.2)] p-6"
                              >
                                 <button onClick={() => setShowLanguages(false)} className="absolute top-4 right-4 text-zinc-400 hover:text-zinc-950"><X size={16} weight="bold" /></button>
                                 
                                 <div className="bg-[#0066FF]/5 border border-[#0066FF]/10 rounded-xl p-4 text-[10px] font-bold text-[#0066FF] leading-relaxed mb-4">
                                    <Info size={14} weight="bold" className="inline mr-1" />
                                    Add the languages you work in and your proficiency level to align expectations with potential clients.
                                 </div>

                                 <div className="space-y-2">
                                    <div className="h-10 w-full rounded-xl bg-zinc-50 border border-zinc-200 px-4 flex items-center justify-between text-xs font-bold text-zinc-400">
                                       Select languages
                                       <CaretDown size={14} weight="bold" />
                                    </div>
                                    <div className="max-h-48 overflow-y-auto space-y-1 p-1">
                                       {LANGUAGES.map(lang => (
                                          <button key={lang} className="w-full text-left px-3 py-2 rounded-lg hover:bg-zinc-50 text-xs font-bold text-zinc-600 transition-colors">
                                             {lang}
                                          </button>
                                       ))}
                                    </div>
                                 </div>
                              </motion.div>
                           )}
                        </AnimatePresence>
                      </div>
                   </div>
                </div>
             </div>
          </section>

          <section className="bg-white rounded-[32px] border border-[#FF4D4D]/20 p-8 shadow-sm space-y-6">
             <div className="flex items-center justify-between">
                <h3 className="text-xl font-black tracking-tight text-zinc-950">About</h3>
                <div className="flex items-center gap-2 px-3 py-1 bg-zinc-50 rounded-full text-[10px] font-black uppercase tracking-widest text-zinc-400">
                   <Info size={14} weight="bold" />
                   Add details about your expertise
                </div>
             </div>

             <div className="relative group">
                <textarea 
                   placeholder="Share some details about yourself, your expertise, and what you offer."
                   className="w-full min-h-[160px] rounded-[24px] bg-zinc-50/50 border border-zinc-200 p-6 outline-none focus:bg-white focus:border-[#0066FF] transition-all font-medium text-zinc-700 leading-relaxed placeholder:text-zinc-300"
                   value={profile.about}
                   onChange={(e) => setProfile({ ...profile, about: e.target.value })}
                />
                <div className="absolute bottom-4 right-6 flex items-center gap-4 text-[10px] font-black uppercase tracking-widest transition-opacity duration-300">
                   <span className={isAboutValid ? 'text-zinc-300' : 'text-zinc-400'}>Minimum 150 characters</span>
                   <span className={isAboutValid ? 'text-[#0066FF]' : 'text-zinc-400'}>{profile.about.length}/2000</span>
                </div>
             </div>
          </section>

          {/* 4. Skills & Expertise */}
          <section className="bg-white rounded-[32px] border border-[#FF4D4D]/20 p-8 shadow-sm space-y-8">
             <div className="flex items-center justify-between">
                <div className="space-y-1">
                   <h3 className="text-xl font-black tracking-tight text-zinc-950">Skills and expertise</h3>
                   <p className="text-xs text-zinc-500 font-bold">Attract relevant clients by sharing your strengths and abilities</p>
                </div>
                <button 
                  onClick={() => setActiveForm('skills')}
                  className="h-10 w-10 bg-zinc-50 border border-zinc-100 rounded-xl flex items-center justify-center hover:bg-zinc-950 hover:text-white transition-all shadow-sm"
                >
                  <Plus size={20} weight="bold" />
                </button>
             </div>

             <AnimatePresence>
                {activeForm === 'skills' && (
                   <motion.div 
                     initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
                     className="bg-zinc-50 rounded-[24px] border border-zinc-100 p-6 relative"
                   >
                      <button onClick={() => setActiveForm(null)} className="absolute top-4 right-4 text-zinc-400 hover:text-zinc-950"><X size={18} weight="bold" /></button>
                      <div className="flex items-center gap-3 p-4 bg-[#0066FF]/5 rounded-xl border border-[#0066FF]/10 text-[11px] font-bold text-[#0066FF] mb-6">
                         <Info size={18} weight="bold" />
                         Adding your specific skills helps to make sure the right clients reach you.
                      </div>
                      <div className="space-y-4">
                         <input placeholder="Add skill or expertise (For example JavaScript)" className="h-12 w-full rounded-xl bg-white border border-zinc-200 px-4 outline-none focus:border-[#0066FF] font-medium text-sm" />
                         <select className="h-12 w-full rounded-xl bg-white border border-zinc-200 px-4 outline-none focus:border-[#0066FF] font-medium text-sm text-zinc-500">
                            <option>Experience level</option>
                            <option>Novice</option>
                            <option>Expert</option>
                            <option>Master</option>
                         </select>
                         <div className="flex justify-end gap-3 pt-4 border-t border-zinc-100 mt-6">
                            <button onClick={() => setActiveForm(null)} className="h-10 px-6 rounded-full font-black text-xs uppercase tracking-widest text-zinc-400 hover:text-zinc-950 transition-colors">Cancel</button>
                            <button className="h-10 px-6 bg-zinc-100 text-zinc-400 rounded-full font-black text-xs uppercase tracking-widest cursor-not-allowed">Add</button>
                         </div>
                      </div>
                   </motion.div>
                )}
             </AnimatePresence>

             {profile.skills.length === 0 && !activeForm && (
                <div className="py-12 flex flex-col items-center justify-center border-2 border-dashed border-zinc-100 rounded-[24px] bg-zinc-50/30">
                   <Wrench size={40} weight="duotone" className="text-zinc-200 mb-4" />
                   <p className="text-xs font-black uppercase tracking-widest text-zinc-300">No skills added yet</p>
                </div>
             )}
          </section>

          {/* 5. Work Experience */}
          <section className="bg-white rounded-[32px] border border-[#FF4D4D]/20 p-8 shadow-sm space-y-8">
             <div className="flex items-center justify-between">
                <div className="space-y-1">
                   <h3 className="text-xl font-black tracking-tight text-zinc-950">Work experience <span className="text-zinc-400 font-bold text-sm">(Optional)</span></h3>
                   <p className="text-xs text-zinc-500 font-bold">Add your job history and achievements to give clients insight into your expertise.</p>
                </div>
                <button 
                  onClick={() => setActiveForm('work')}
                  className="h-10 w-10 bg-zinc-50 border border-zinc-100 rounded-xl flex items-center justify-center hover:bg-zinc-950 hover:text-white transition-all shadow-sm"
                >
                  <Plus size={20} weight="bold" />
                </button>
             </div>

             <AnimatePresence>
                {activeForm === 'work' && (
                   <motion.div 
                     initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
                     className="bg-zinc-50 rounded-[24px] border border-zinc-100 p-6 relative space-y-4"
                   >
                      <button onClick={() => setActiveForm(null)} className="absolute top-4 right-4 text-zinc-400 hover:text-zinc-950"><X size={18} weight="bold" /></button>
                      <input placeholder="Title" className="h-12 w-full rounded-xl bg-white border border-zinc-200 px-4 outline-none focus:border-[#0066FF] font-medium text-sm" />
                      <select className="h-12 w-full rounded-xl bg-white border border-zinc-200 px-4 outline-none focus:border-[#0066FF] font-medium text-sm text-zinc-500"><option>Employment type (Optional)</option></select>
                      <input placeholder="Company name" className="h-12 w-full rounded-xl bg-white border border-zinc-200 px-4 outline-none focus:border-[#0066FF] font-medium text-sm" />
                      
                      <div className="flex items-center gap-2 py-2">
                         <input type="checkbox" id="current" className="h-4 w-4 rounded border-zinc-200" />
                         <label htmlFor="current" className="text-sm font-bold text-zinc-600">I currently work here</label>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                         <input placeholder="Start date" className="h-12 w-full rounded-xl bg-white border border-zinc-200 px-4 outline-none focus:border-[#0066FF] font-medium text-sm" />
                         <input placeholder="End date" className="h-12 w-full rounded-xl bg-white border border-zinc-200 px-4 outline-none focus:border-[#0066FF] font-medium text-sm" />
                      </div>

                      <textarea placeholder="Add your job history and achievements..." className="w-full min-h-[120px] rounded-xl bg-white border border-zinc-200 p-4 outline-none focus:border-[#0066FF] font-medium text-sm" />
                      
                      <div className="flex justify-end gap-3 pt-4 border-t border-zinc-100 mt-6">
                         <button onClick={() => setActiveForm(null)} className="h-10 px-6 rounded-full font-black text-xs uppercase tracking-widest text-zinc-400 hover:text-zinc-950 transition-colors">Cancel</button>
                         <button className="h-10 px-6 bg-zinc-100 text-zinc-400 rounded-full font-black text-xs uppercase tracking-widest cursor-not-allowed">Add</button>
                      </div>
                   </motion.div>
                )}
             </AnimatePresence>

             {profile.experience.length === 0 && !activeForm && (
                <div className="py-12 flex flex-col items-center justify-center border-2 border-dashed border-zinc-100 rounded-[24px] bg-zinc-50/30">
                   <Briefcase size={40} weight="duotone" className="text-zinc-200 mb-4" />
                   <p className="text-xs font-black uppercase tracking-widest text-zinc-300">No work experience yet</p>
                </div>
             )}
          </section>

          {/* 6. Education Section */}
          <section className="bg-white rounded-[32px] border border-[#FF4D4D]/20 p-8 shadow-sm space-y-8">
             <div className="flex items-center justify-between">
                <div className="space-y-1">
                   <h3 className="text-xl font-black tracking-tight text-zinc-950">Education <span className="text-zinc-400 font-bold text-sm">(Optional)</span></h3>
                   <p className="text-xs text-zinc-500 font-bold">Back up your skills by adding any educational degrees or programs.</p>
                </div>
                <button 
                  onClick={() => setActiveForm('edu')}
                  className="h-10 w-10 bg-zinc-50 border border-zinc-100 rounded-xl flex items-center justify-center hover:bg-zinc-950 hover:text-white transition-all shadow-sm"
                >
                  <Plus size={20} weight="bold" />
                </button>
             </div>

             <AnimatePresence>
                {activeForm === 'edu' && (
                   <motion.div 
                     initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
                     className="bg-zinc-50 rounded-[24px] border border-zinc-100 p-6 relative space-y-4"
                   >
                      <button onClick={() => setActiveForm(null)} className="absolute top-4 right-4 text-zinc-400 hover:text-zinc-950"><X size={18} weight="bold" /></button>
                      <select className="h-12 w-full rounded-xl bg-white border border-zinc-200 px-4 outline-none focus:border-[#0066FF] font-medium text-sm text-zinc-500"><option>Country</option></select>
                      <input placeholder="School" className="h-12 w-full rounded-xl bg-white border border-zinc-200 px-4 outline-none focus:border-[#0066FF] font-medium text-sm" />
                      
                      <div className="grid grid-cols-[1fr,2fr] gap-4">
                         <select className="h-12 w-full rounded-xl bg-white border border-zinc-200 px-4 outline-none focus:border-[#0066FF] font-medium text-sm text-zinc-500"><option>Degree</option></select>
                         <input placeholder="Field of study" className="h-12 w-full rounded-xl bg-white border border-zinc-200 px-4 outline-none focus:border-[#0066FF] font-medium text-sm" />
                      </div>

                      <select className="h-12 w-full rounded-xl bg-white border border-zinc-200 px-4 outline-none focus:border-[#0066FF] font-medium text-sm text-zinc-500"><option>Year of graduation</option></select>
                      
                      <div className="flex justify-end gap-3 pt-4 border-t border-zinc-100 mt-6">
                         <button onClick={() => setActiveForm(null)} className="h-10 px-6 rounded-full font-black text-xs uppercase tracking-widest text-zinc-400 hover:text-zinc-950 transition-colors">Cancel</button>
                         <button className="h-10 px-6 bg-zinc-100 text-zinc-400 rounded-full font-black text-xs uppercase tracking-widest cursor-not-allowed">Add</button>
                      </div>
                   </motion.div>
                )}
             </AnimatePresence>

             {profile.education.length === 0 && !activeForm && (
                <div className="py-12 flex flex-col items-center justify-center border-2 border-dashed border-zinc-100 rounded-[24px] bg-zinc-50/30">
                   <GraduationCap size={40} weight="duotone" className="text-zinc-200 mb-4" />
                   <p className="text-xs font-black uppercase tracking-widest text-zinc-300">No education added yet</p>
                </div>
             )}
          </section>

          {/* 7. Certifications */}
          <section className="bg-white rounded-[32px] border border-[#FF4D4D]/20 p-8 shadow-sm space-y-8">
             <div className="flex items-center justify-between">
                <div className="space-y-1">
                   <h3 className="text-xl font-black tracking-tight text-zinc-950">Certifications <span className="text-zinc-400 font-bold text-sm">(Optional)</span></h3>
                   <p className="text-xs text-zinc-500 font-bold">Showcase your mastery with certifications earned in your field.</p>
                </div>
                <button 
                  onClick={() => setActiveForm('cert')}
                  className="h-10 w-10 bg-zinc-50 border border-zinc-100 rounded-xl flex items-center justify-center hover:bg-zinc-950 hover:text-white transition-all shadow-sm"
                >
                  <Plus size={20} weight="bold" />
                </button>
             </div>

             <AnimatePresence>
                {activeForm === 'cert' && (
                   <motion.div 
                     initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
                     className="bg-zinc-50 rounded-[24px] border border-zinc-100 p-6 relative space-y-4"
                   >
                      <button onClick={() => setActiveForm(null)} className="absolute top-4 right-4 text-zinc-400 hover:text-zinc-950"><X size={18} weight="bold" /></button>
                      <input placeholder="Certificate or award" className="h-12 w-full rounded-xl bg-white border border-zinc-200 px-4 outline-none focus:border-[#0066FF] font-medium text-sm" />
                      <input placeholder="Received from (For example Adobe)" className="h-12 w-full rounded-xl bg-white border border-zinc-200 px-4 outline-none focus:border-[#0066FF] font-medium text-sm" />
                      <select className="h-12 w-full rounded-xl bg-white border border-zinc-200 px-4 outline-none focus:border-[#0066FF] font-medium text-sm text-zinc-500"><option>Year received</option></select>
                      
                      <div className="flex justify-end gap-3 pt-4 border-t border-zinc-100 mt-6">
                         <button onClick={() => setActiveForm(null)} className="h-10 px-6 rounded-full font-black text-xs uppercase tracking-widest text-zinc-400 hover:text-zinc-950 transition-colors">Cancel</button>
                         <button className="h-10 px-6 bg-zinc-100 text-zinc-400 rounded-full font-black text-xs uppercase tracking-widest cursor-not-allowed">Add</button>
                      </div>
                   </motion.div>
                )}
             </AnimatePresence>

             {profile.certifications.length === 0 && !activeForm && (
                <div className="py-12 flex flex-col items-center justify-center border-2 border-dashed border-zinc-100 rounded-[24px] bg-zinc-50/30">
                   <Certificate size={40} weight="duotone" className="text-zinc-200 mb-4" />
                   <p className="text-xs font-black uppercase tracking-widest text-zinc-300">No certifications yet</p>
                </div>
             )}
          </section>

        </div>

        {/* 8. Global Action Bar */}
        <div className="mt-16 pt-16 border-t border-zinc-100 flex flex-col items-center">
           <motion.button 
             animate={isAboutValid ? {
               boxShadow: [
                 "0 10px 20px -5px rgba(0, 102, 255, 0.3)",
                 "0 10px 40px 0px rgba(0, 102, 255, 0.6)",
                 "0 10px 20px -5px rgba(0, 102, 255, 0.3)"
               ]
             } : {}}
             transition={{ repeat: Infinity, duration: 2 }}
             className="h-16 px-16 bg-gradient-to-r from-[#0066FF] to-[#7000FF] text-white rounded-full font-black text-sm uppercase tracking-[0.2em] shadow-xl transition-all hover:scale-105 active:scale-95 flex items-center justify-center gap-4"
           >
             Save & Update Profile
             <CheckCircle size={24} weight="fill" />
           </motion.button>
           <p className="text-zinc-400 font-bold text-[10px] uppercase tracking-widest mt-6">Changes will be reflected in your Digital Trust Passport</p>
        </div>

      </div>
    </div>
  );
}
