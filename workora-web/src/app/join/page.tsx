'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Hammer, 
  Car, 
  DeviceMobile, 
  TShirt, 
  Broom, 
  Scissors, 
  Gear, 
  Moped,
  CaretLeft,
  CheckCircle,
  Users,
  User,
  Briefcase,
  Check,
  Info,
  Eye,
  EyeSlash,
  CaretDown
} from '@phosphor-icons/react';
import Link from 'next/link';
import Image from 'next/image';
import { BirthdayPicker } from '@/components/BirthdayPicker';
import WorkoraLoader from '@/components/WorkoraLoader';

const TRADES = [
  { name: 'Construction', sub: 'Masons, Roofers', icon: Hammer, color: 'text-[#0066FF]' },
  { name: 'Automotive', sub: 'Mechanics, Body', icon: Car, color: 'text-[#7000FF]' },
  { name: 'Tech Repair', sub: 'Phones, PC, TV', icon: DeviceMobile, color: 'text-[#0066FF]' },
  { name: 'Fashion', sub: 'Tailors, Cobblers', icon: TShirt, color: 'text-[#7000FF]' },
  { name: 'Domestic', sub: 'Cleaners, Cooks', icon: Broom, color: 'text-[#0066FF]' },
  { name: 'Beauty', sub: 'Barbers, Stylists', icon: Scissors, color: 'text-[#7000FF]' },
  { name: 'Industrial', sub: 'Welders, Fabricators', icon: Gear, color: 'text-[#0066FF]' },
  { name: 'Logistics', sub: 'Riders, Drivers', icon: Moped, color: 'text-[#7000FF]' },
];

const COUNTRIES = [
  { name: 'Kenya', code: '+254', flag: '🇰🇪' },
  { name: 'Uganda', code: '+256', flag: '🇺🇬' },
  { name: 'Tanzania', code: '+255', flag: '🇹🇿' },
  { name: 'Rwanda', code: '+250', flag: '🇷🇼' },
];

export default function JoinPage() {
  const [step, setStep] = useState(0); 
  const [teamType, setTeamType] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [selectedCountry, setSelectedCountry] = useState(COUNTRIES[0]);
  const [showCountryPicker, setShowCountryPicker] = useState(false);

  const [formData, setFormData] = useState({
    role: '', 
    trade: '',
    fullName: '',
    phone: '',
    username: '',
    password: '',
    birthday: '',
  });

  const [loading, setLoading] = useState(false);

  // Validation Logic
  const isFullNameValid = formData.fullName.trim().split(' ').length >= 2;
  const isPasswordValid = formData.password.length >= 8 && /\d/.test(formData.password);
  const isPhoneValid = formData.phone.length >= 9; // Min 9 digits after code
  const isUsernameValid = formData.username.length >= 3;
  
  const isFormValid = isFullNameValid && isPasswordValid && isPhoneValid && isUsernameValid && formData.birthday;

  const handleRegister = async () => {
    setError(null);
    setLoading(true);
    try {
      // Artificial delay to showcase the 3-stage loading animation (4 seconds)
      await new Promise(resolve => setTimeout(resolve, 4000));

      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          phone: `${selectedCountry.code}${formData.phone}`
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Registration failed');
      }

      // Store auth data for dashboard routing
      if (data.data?.token) {
        localStorage.setItem('workora_token', data.data.token);
      }
      localStorage.setItem('workora_role', formData.role);
      localStorage.setItem('workora_username', formData.username);

      setStep(3); 
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Registration failed';
      setError(errorMessage);
      console.error('Registration failed:', err);
    } finally {
      setLoading(false);
    }
  };

  const nextStep = () => setStep(s => s + 1);
  const prevStep = () => setStep(s => s - 1);

  return (
    <div className="min-h-screen bg-white text-zinc-950 flex flex-col items-center pt-20 px-[5%] overflow-x-hidden font-display relative pb-32">
      
      {/* Fullscreen Loader overlay */}
      {loading && <WorkoraLoader fullScreen />}
      
      {/* Header Logo */}
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
        <Link href="/" className="relative flex items-center justify-center transition-transform hover:scale-110 mx-auto">
          <div className="relative h-20 w-20">
            <Image src="/logo/workora_logo.png" alt="Workora Logo" fill className="object-contain brightness-0" priority />
          </div>
        </Link>
      </motion.div>

      <div className="w-full max-w-[400px] flex flex-col items-center">
        <AnimatePresence mode="wait">
          
          {/* Step 0: Identity Selection */}
          {step === 0 && (
            <motion.div key="step0" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="flex flex-col gap-8 w-full text-center">
              <div className="flex flex-col gap-2">
                <h1 className="text-2xl font-black tracking-tight text-zinc-950">Choose your path</h1>
                <p className="text-zinc-500 font-bold text-sm">How do you want to use Workora today?</p>
              </div>
              <div className="flex flex-col gap-4">
                <button onClick={() => { setFormData({ ...formData, role: 'client' }); setStep(2); }} className="flex items-center gap-6 p-8 rounded-[32px] border-2 border-zinc-100 bg-zinc-50 hover:border-[#0066FF] transition-all group shadow-sm hover:shadow-xl">
                  <div className="h-14 w-14 rounded-2xl bg-white flex items-center justify-center text-[#0066FF] shadow-sm group-hover:scale-110 transition-transform"><Users size={32} weight="duotone" /></div>
                  <div className="flex flex-col text-left">
                    <span className="font-black text-sm uppercase tracking-widest text-zinc-950">Personal Account</span>
                    <span className="text-[10px] text-zinc-400 font-bold">I want to hire elite pros.</span>
                  </div>
                </button>
                <button onClick={() => { setFormData({ ...formData, role: 'pro' }); nextStep(); }} className="flex items-center gap-6 p-8 rounded-[32px] border-2 border-zinc-100 bg-zinc-50 hover:border-[#7000FF] transition-all group shadow-sm hover:shadow-xl">
                  <div className="h-14 w-14 rounded-2xl bg-white flex items-center justify-center text-[#7000FF] shadow-sm group-hover:scale-110 transition-transform"><Briefcase size={32} weight="duotone" /></div>
                  <div className="flex flex-col text-left">
                    <span className="font-black text-sm uppercase tracking-widest text-zinc-950">Business Account</span>
                    <span className="text-[10px] text-zinc-400 font-bold">I have the skills to join.</span>
                  </div>
                </button>
              </div>
            </motion.div>
          )}

          {/* Step 1: Trade Selection */}
          {step === 1 && (
            <motion.div key="step1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="flex flex-col gap-8 w-full">
               <button onClick={prevStep} className="flex items-center gap-2 text-zinc-400 hover:text-zinc-950 transition-colors font-black text-[10px] uppercase tracking-widest">
                <CaretLeft size={14} weight="bold" /> Back
              </button>
              <div className="text-center">
                <h1 className="text-2xl font-black tracking-tight text-zinc-950">What&apos;s your trade?</h1>
                <p className="text-zinc-500 font-bold text-sm">Select the category that defines your expertise.</p>
              </div>
              <div className="grid grid-cols-2 gap-3">
                {TRADES.map((t) => (
                  <button key={t.name} onClick={() => { setFormData({ ...formData, trade: t.name }); nextStep(); }} className="p-4 rounded-2xl border border-zinc-100 bg-zinc-50 hover:bg-white hover:border-zinc-300 transition-all flex flex-col gap-3 group">
                    <t.icon size={24} weight="duotone" className={`${t.color} group-hover:scale-110 transition-transform`} />
                    <div className="text-left">
                      <p className="text-[10px] font-black uppercase tracking-widest text-zinc-950">{t.name}</p>
                      <p className="text-[9px] text-zinc-400 font-bold leading-tight">{t.sub}</p>
                    </div>
                  </button>
                ))}
              </div>
            </motion.div>
          )}

          {/* Step 2: Registration Form */}
          {step === 2 && (
            <motion.div key="step2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="flex flex-col gap-8 w-full">
               <button onClick={prevStep} className="flex items-center gap-2 text-zinc-400 hover:text-zinc-950 transition-colors font-black text-[10px] uppercase tracking-widest">
                <CaretLeft size={14} weight="bold" /> Back
              </button>
              <div className="text-center">
                <h1 className="text-2xl font-black tracking-tight text-zinc-950">Create your account</h1>
                <p className="text-zinc-500 font-bold text-sm">You&apos;re one step away from the elite network.</p>
              </div>
              <div className="flex flex-col gap-4">
                <input placeholder="Full Name (First & Last)" className={`h-12 w-full rounded-xl bg-zinc-50 border px-4 outline-none transition-all font-bold text-xs ${formData.fullName && !isFullNameValid ? 'border-red-500 bg-red-50' : 'border-zinc-200 focus:bg-white focus:border-[#0066FF]'}`} value={formData.fullName} onChange={(e) => setFormData({ ...formData, fullName: e.target.value })} />
                
                {/* Phone Input with Country Selector */}
                <div className="relative flex gap-2">
                   <div className="relative">
                      <button 
                        onClick={() => setShowCountryPicker(!showCountryPicker)}
                        className="h-12 px-3 rounded-xl bg-zinc-50 border border-zinc-200 flex items-center gap-2 hover:bg-white transition-all shadow-sm"
                      >
                         <span className="text-lg">{selectedCountry.flag}</span>
                         <span className="text-[10px] font-black">{selectedCountry.code}</span>
                         <CaretDown size={10} weight="bold" />
                      </button>

                      <AnimatePresence>
                         {showCountryPicker && (
                            <motion.div 
                              initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }}
                              className="absolute top-full left-0 z-50 mt-2 w-48 bg-white rounded-2xl border border-zinc-100 shadow-xl p-2"
                            >
                               {COUNTRIES.map(c => (
                                  <button key={c.code} onClick={() => { setSelectedCountry(c); setShowCountryPicker(false); }} className="w-full flex items-center gap-3 px-3 py-2 rounded-xl hover:bg-zinc-50 transition-colors">
                                     <span>{c.flag}</span>
                                     <span className="text-[10px] font-black text-zinc-950">{c.name}</span>
                                     <span className="ml-auto text-[9px] font-bold text-zinc-400">{c.code}</span>
                                  </button>
                               ))}
                            </motion.div>
                         )}
                      </AnimatePresence>
                   </div>
                   <input placeholder="7xx xxx xxx" className={`h-12 flex-1 rounded-xl bg-zinc-50 border px-4 outline-none transition-all font-bold text-xs ${formData.phone && !isPhoneValid ? 'border-red-500 bg-red-50' : 'border-zinc-200 focus:bg-white focus:border-[#0066FF]'}`} value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value.replace(/\D/g, '') })} />
                </div>

                <input placeholder="Username" className="h-12 w-full rounded-xl bg-zinc-50 border border-zinc-200 px-4 outline-none focus:bg-white focus:border-[#0066FF] transition-all font-bold text-xs" value={formData.username} onChange={(e) => setFormData({ ...formData, username: e.target.value })} />
                
                {/* Password Input with Visibility Toggle */}
                <div className="relative">
                   <input type={showPassword ? "text" : "password"} placeholder="Password (Min 8 chars + 1 number)" className={`h-12 w-full rounded-xl bg-zinc-50 border px-4 outline-none transition-all font-bold text-xs pr-12 ${formData.password && !isPasswordValid ? 'border-red-500 bg-red-50' : 'border-zinc-200 focus:bg-white focus:border-[#0066FF]'}`} value={formData.password} onChange={(e) => setFormData({ ...formData, password: e.target.value })} />
                   <button onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-950 transition-colors">
                      {showPassword ? <EyeSlash size={18} weight="bold" /> : <Eye size={18} weight="bold" />}
                   </button>
                </div>

                <BirthdayPicker value={formData.birthday} onChange={(val: string) => setFormData({ ...formData, birthday: val })} />
                
                {error && <p className="text-red-500 text-[10px] font-bold text-center uppercase tracking-widest">{error}</p>}

                <motion.button disabled={!isFormValid || loading} onClick={handleRegister} animate={isFormValid ? { boxShadow: ["0 10px 20px -5px rgba(0, 102, 255, 0.3)", "0 10px 40px 0px rgba(0, 102, 255, 0.6)", "0 10px 20px -5px rgba(0, 102, 255, 0.3)"] } : {}} transition={{ repeat: Infinity, duration: 2 }} className="h-14 w-full bg-gradient-to-r from-[#0066FF] to-[#7000FF] text-white rounded-full font-black text-sm uppercase tracking-widest mt-4 flex items-center justify-center gap-3 shadow-lg">
                  {loading ? <div className="h-5 w-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : "Create Account"}
                </motion.button>
              </div>
            </motion.div>
          )}

          {/* Step 3: Team Selection */}
          {step === 3 && (
            <motion.div key="step3" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="flex flex-col gap-8 w-full text-center">
              <div className="flex flex-col gap-2">
                <h1 className="text-2xl font-black tracking-tight text-zinc-950">Are you part of a team?</h1>
                <p className="text-zinc-500 font-bold text-sm">This helps us tailor your experience and improve how you find work.</p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <button onClick={() => { setTeamType('solo'); setStep(4); }} className="p-8 rounded-[32px] border-2 border-zinc-100 bg-zinc-50 hover:border-[#0066FF] transition-all group flex flex-col items-center gap-4 shadow-sm hover:shadow-xl">
                  <div className="h-16 w-16 rounded-2xl bg-white flex items-center justify-center text-[#0066FF] shadow-sm group-hover:scale-110 transition-transform"><User size={32} weight="duotone" /></div>
                  <div className="text-center">
                    <p className="font-black text-sm text-zinc-950">No</p>
                    <p className="text-[10px] text-zinc-400 font-bold">I work independently</p>
                  </div>
                </button>
                <button onClick={() => { setTeamType('team'); setStep(4); }} className="p-8 rounded-[32px] border-2 border-zinc-100 bg-zinc-50 hover:border-[#7000FF] transition-all group flex flex-col items-center gap-4 shadow-sm hover:shadow-xl">
                  <div className="h-16 w-16 rounded-2xl bg-white flex items-center justify-center text-[#7000FF] shadow-sm group-hover:scale-110 transition-transform"><Users size={32} weight="duotone" /></div>
                  <div className="text-center">
                    <p className="font-black text-sm text-zinc-950">Yes</p>
                    <p className="text-[10px] text-zinc-400 font-bold">I&apos;m part of a team</p>
                  </div>
                </button>
              </div>
            </motion.div>
          )}

          {/* Step 4: Kickstart Modal */}
          {step === 4 && (
            <motion.div key="step4" initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-zinc-950/20 backdrop-blur-sm text-center">
               <div className="bg-white rounded-[40px] w-full max-w-[700px] shadow-[0_40px_100px_-20px_rgba(0,0,0,0.3)] p-12 overflow-hidden relative">
                  <div className="text-center mb-10">
                     <h2 className="text-3xl font-black tracking-tighter text-zinc-950">It&apos;s official... You&apos;re Workora&apos;s newest pro!</h2>
                     <p className="text-zinc-500 font-bold text-sm mt-3 max-w-lg mx-auto leading-relaxed">Now&apos;s a great time to join Pro Plus Kickstart, our program for pros who are new to Workora. Access the benefits you need to help you get your first order faster.</p>
                  </div>

                  <div className="border border-[#FF4D4D]/20 rounded-[32px] p-8 mb-10 relative text-left">
                     <span className="absolute top-6 right-8 bg-[#0066FF]/10 text-[#0066FF] text-[9px] font-black px-3 py-1 rounded-full uppercase tracking-widest">Elite</span>
                     <h3 className="text-xl font-black text-zinc-950">get verified and &quot;Kickstart your business&quot;</h3>
                     <div className="flex items-baseline gap-2 mt-2">
                        <span className="text-sm font-bold text-zinc-950 mr-1">Ksh</span>
                        <span className="text-3xl font-black text-zinc-950">300</span>
                        <span className="text-zinc-400 font-bold text-sm">/month</span>
                     </div>
                     <p className="text-zinc-400 font-bold text-xs mt-4">Fast-track your success with Pro Plus Kickstart&apos;s exclusive tools and resources.</p>

                     <div className="grid grid-cols-2 gap-x-8 gap-y-4 mt-8">
                        {[
                          'Guided onboarding', 'Keyword research', 'ID verification', 
                          'AI-generated profile feedback', 'Promotions: Up to 5 orders/month',
                          'Coupons: 5/month', 'Follow-up messages: 5/month',
                          'Buyer activity insights', 'Priority support', 'Live walkthrough sessions',
                          'Tips and insights'
                        ].map(item => (
                          <div key={item} className="flex items-center gap-2">
                             <Check size={14} weight="bold" className="text-zinc-950" />
                             <span className="text-[11px] font-bold text-zinc-600">{item}</span>
                             <Info size={12} weight="bold" className="text-zinc-300" />
                          </div>
                        ))}
                     </div>
                  </div>

                  <div className="flex items-center justify-center gap-4">
                     <button onClick={() => setStep(5)} className="h-14 px-10 bg-zinc-100 text-zinc-950 rounded-full font-black text-xs uppercase tracking-widest hover:bg-zinc-200 transition-colors">Continue with free tier</button>
                     <button className="h-14 px-10 bg-zinc-950 text-white rounded-full font-black text-xs uppercase tracking-widest hover:brightness-110 transition-all shadow-xl">Join now</button>
                  </div>
               </div>
            </motion.div>
          )}

          {/* Step 5: Final Success */}
          {step === 5 && (
            <motion.div key="step5" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="flex flex-col items-center text-center gap-8 w-full">
              <div className="h-24 w-24 rounded-full bg-gradient-to-br from-[#0066FF]/10 to-[#7000FF]/10 flex items-center justify-center">
                 <CheckCircle size={56} weight="fill" className="text-[#0066FF]" />
              </div>
              <div className="flex flex-col gap-3">
                <h1 className="text-2xl font-black tracking-tighter text-zinc-950">You&apos;re in the Network!</h1>
                <p className="text-zinc-500 font-bold text-sm">Your {teamType === 'team' ? 'team' : 'pro'} passport is ready, @{formData.username}.</p>
              </div>
              <Link href="/dashboard" className="h-14 w-full bg-gradient-to-r from-[#0066FF] to-[#7000FF] text-white rounded-full font-black text-sm uppercase tracking-widest shadow-xl shadow-blue-500/20 flex items-center justify-center">Go to my Dashboard</Link>
            </motion.div>
          )}

        </AnimatePresence>

        {/* Footer */}
        <div className="mt-20 flex flex-wrap justify-center gap-x-4 gap-y-2 text-[10px] font-bold text-zinc-400 uppercase tracking-widest">
           <Link href="#">ImeanTech</Link>
           <Link href="#">About</Link>
           <Link href="#">Blog</Link>
           <Link href="#">Privacy</Link>
           <Link href="#">Terms</Link>
        </div>
      </div>
    </div>
  );
}
