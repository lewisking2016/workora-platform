'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { 
  ShieldCheck, 
  IdentificationCard, 
  Star, 
  VideoCamera, 
  CheckCircle,
  ArrowRight,
  Fingerprint,
  Certificate,
  TrendUp
} from '@phosphor-icons/react';
import { fetchCurrentUser } from '@/lib/session';

interface ProfileData {
  full_name: string;
  trade: string;
  location: string;
  trust_score: string;
  total_gigs: number;
  rating: string;
  initial: string;
}

export default function TrustPassportPage() {
  const [profile, setProfile] = useState<ProfileData>({
    full_name: 'Workora Pro',
    trade: 'Master Electrician',
    location: 'Nairobi',
    trust_score: '98%',
    total_gigs: 147,
    rating: '4.9',
    initial: 'WP'
  });

  useEffect(() => {
    async function loadProfile() {
      const user = await fetchCurrentUser();
      if (user) {
        try {
          const res = await fetch('/api/profile/me');
          const data = await res.json();
          if (data.profile) {
            
            // Also fetch ratings to get the average
            const ratingsRes = await fetch(`/api/profile/ratings/${data.profile.id}`);
            const ratingsData = await ratingsRes.json();

            setProfile({
              full_name: data.profile.full_name || user.username,
              trade: data.profile.trade || 'Professional',
              location: data.profile.location || 'Kenya',
              trust_score: `${Math.min(100, Math.round(Number(ratingsData.average || data.profile.trust_score || 0) * 20))}%`,
              total_gigs: data.profile.total_gigs || 0,
              rating: Number(ratingsData.average || data.profile.trust_score || 0).toFixed(1),
              initial: (data.profile.full_name || user.username).charAt(0).toUpperCase()
            });
          }
        } catch (err) {
          console.error('Failed to load profile for trust card', err);
        }
      }
    }
    loadProfile();
  }, []);

  return (
    <main className="mx-auto max-w-screen-2xl px-[5%] pt-20 flex flex-col bg-white dark:bg-[#0A0E17] text-zinc-950 dark:text-zinc-50 overflow-x-hidden font-display min-h-screen">
      
      {/* Hero Section */}
      <section className="relative h-[55vh] min-h-[500px] w-full mt-4 rounded-[60px] overflow-hidden group bg-zinc-50 dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800">
        <div className="absolute -top-32 -right-32 w-[500px] h-[500px] bg-[#0066FF]/10 blur-[150px] rounded-full" />
        <div className="absolute -bottom-32 -left-32 w-[500px] h-[500px] bg-[#7000FF]/10 blur-[150px] rounded-full" />
        
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-[8%] z-20">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="flex flex-col items-center max-w-[900px]"
          >
            <motion.div 
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="h-20 w-20 rounded-[32px] bg-gradient-to-br from-[#0066FF] to-[#7000FF] shadow-lg shadow-[#0066FF]/20 flex items-center justify-center mb-10"
            >
              <ShieldCheck size={40} weight="bold" className="text-white" />
            </motion.div>
            
            <p className="text-[#0066FF] font-black uppercase tracking-[0.4em] text-[11px] mb-8">Digital Identity</p>
            
            <h1 className="text-5xl md:text-7xl lg:text-[80px] font-black tracking-tighter text-zinc-950 dark:text-white mb-10 leading-[0.95]">
              The Trust <br />
              <span className="italic bg-gradient-to-r from-[#0066FF] to-[#7000FF] bg-clip-text text-transparent">Passport.</span>
            </h1>
            
            <p className="text-zinc-600 dark:text-zinc-400 text-lg md:text-xl max-w-2xl font-medium leading-relaxed">
              Your reputation, verified identity, and proof of work — all in one portable digital passport that follows you everywhere on Workora.
            </p>
          </motion.div>
        </div>
      </section>

      {/* What is Trust Passport */}
      <section className="py-20 lg:py-32 px-[5%] flex flex-col lg:flex-row items-center gap-16 lg:gap-24">
        <div className="flex-1 flex flex-col gap-8">
          <div className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-zinc-50 dark:bg-zinc-900 text-[#0066FF] text-[11px] font-black uppercase tracking-[0.2em] border border-zinc-100 dark:border-zinc-800 w-fit">
            <Fingerprint size={18} weight="bold" /> Your Digital Identity
          </div>
          <h2 className="text-4xl md:text-5xl lg:text-[64px] font-black tracking-tighter leading-[0.9] text-zinc-950 dark:text-white">
            One identity. <br />
            Infinite trust.
          </h2>
          <p className="text-zinc-600 dark:text-zinc-400 text-lg md:text-xl leading-relaxed max-w-lg font-medium">
            The Trust Passport is a unique digital profile that captures your verified identity, skills, work history, and customer reviews. It&apos;s your professional reputation, made portable and verifiable.
          </p>
          <Link 
            href="/join" 
            className="group/btn h-14 px-10 bg-gradient-to-r from-[#0066FF] to-[#7000FF] text-white rounded-2xl font-black text-base flex items-center justify-center transition-all hover:scale-105 active:scale-95 shadow-xl w-fit whitespace-nowrap"
          >
            Get Your Passport <ArrowRight weight="bold" size={18} className="ml-2 transition-transform group-hover/btn:translate-x-1" />
          </Link>
        </div>
        <div className="flex-1 w-full">
          <div className="bg-zinc-50 dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 rounded-[40px] lg:rounded-[56px] p-8 lg:p-12 shadow-[0_40px_100px_-20px_rgba(0,0,0,0.08)] dark:shadow-black/50">
            <div className="flex items-center gap-6 mb-10">
              <div className="h-20 w-20 rounded-[24px] bg-gradient-to-br from-[#0066FF] to-[#7000FF] flex items-center justify-center text-white font-black text-2xl shadow-lg">
                {profile.initial}
              </div>
              <div>
                <h3 className="text-2xl font-black text-zinc-950 dark:text-white tracking-tight">{profile.full_name}</h3>
                <p className="text-zinc-500 dark:text-zinc-400 font-bold text-sm">{profile.trade} · {profile.location}</p>
              </div>
              <div className="ml-auto">
                <div className="h-10 w-10 rounded-xl bg-[#0066FF]/10 dark:bg-[#0066FF]/20 flex items-center justify-center">
                  <ShieldCheck size={22} weight="fill" className="text-[#0066FF]" />
                </div>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-4 mb-8">
              {[
                { label: 'Trust Score', value: profile.trust_score },
                { label: 'Jobs Done', value: profile.total_gigs.toString() },
                { label: 'Rating', value: profile.rating },
              ].map((stat) => (
                <div key={stat.label} className="bg-white dark:bg-zinc-800 rounded-2xl p-4 text-center border border-zinc-100 dark:border-zinc-700">
                  <p className="text-2xl font-black text-zinc-950 dark:text-white">{stat.value}</p>
                  <p className="text-[10px] font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider mt-1">{stat.label}</p>
                </div>
              ))}
            </div>
            <div className="flex flex-col gap-3">
              {['ID Verified', 'Skills Assessed', 'Background Checked'].map((item) => (
                <div key={item} className="flex items-center gap-3 text-sm font-bold text-zinc-700 dark:text-zinc-300">
                  <CheckCircle size={20} weight="fill" className="text-green-500" />
                  {item}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 lg:py-32 bg-zinc-50 dark:bg-zinc-900 rounded-[40px] lg:rounded-[80px] mx-[2%] px-[5%] lg:px-[10%] border border-zinc-100 dark:border-zinc-800">
        <div className="text-center mb-20">
          <h2 className="text-4xl md:text-5xl lg:text-[64px] font-black tracking-tighter text-zinc-950 dark:text-white leading-none mb-6">How it works.</h2>
          <p className="text-zinc-600 dark:text-zinc-400 text-lg md:text-xl max-w-2xl mx-auto font-medium leading-relaxed">
            Building your Trust Passport is a simple, guided process designed to showcase your best work.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {[
            { step: '01', icon: IdentificationCard, title: 'Verify Identity', desc: 'Submit your government ID and personal details for secure verification.' },
            { step: '02', icon: Certificate, title: 'Prove Your Skill', desc: 'Upload proof-of-work videos demonstrating your craft and expertise.' },
            { step: '03', icon: Star, title: 'Earn Reviews', desc: 'Complete jobs and collect genuine reviews from satisfied clients.' },
            { step: '04', icon: TrendUp, title: 'Build Reputation', desc: 'Your Trust Score grows with every successful job, unlocking new opportunities.' },
          ].map((item, i) => (
            <motion.div 
              key={item.step}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1, duration: 0.6 }}
              className="bg-white dark:bg-[#0A0E17] p-8 lg:p-10 rounded-[32px] border border-zinc-100 dark:border-zinc-800 flex flex-col gap-6 shadow-[0_10px_40px_-15px_rgba(0,0,0,0.05)] dark:shadow-black/40"
            >
              <span className="text-4xl font-black text-[#0066FF]/10 tracking-tighter">{item.step}</span>
              <div className="h-14 w-14 rounded-2xl bg-zinc-50 dark:bg-zinc-800 flex items-center justify-center border border-zinc-100 dark:border-zinc-700">
                <item.icon size={28} weight="duotone" className="text-[#0066FF]" />
              </div>
              <h3 className="text-xl font-black tracking-tight text-zinc-950 dark:text-white">{item.title}</h3>
              <p className="text-zinc-600 dark:text-zinc-400 font-medium leading-relaxed text-sm">{item.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section className="py-20 lg:py-40 px-[5%]">
        <div className="text-center mb-20">
          <h2 className="text-4xl md:text-5xl lg:text-[64px] font-black tracking-tighter text-zinc-950 dark:text-white leading-none mb-6">
            What&apos;s inside your passport.
          </h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {[
            { icon: IdentificationCard, title: 'Verified ID', desc: 'Government-issued ID verification ensures every Pro is who they claim to be.', color: 'text-[#0066FF]' },
            { icon: VideoCamera, title: 'Proof of Work Videos', desc: 'High-definition video evidence of your craft, visible to potential clients.', color: 'text-[#7000FF]' },
            { icon: Star, title: 'Client Reviews', desc: 'Genuine, verified reviews from real clients who hired you through Workora.', color: 'text-[#0066FF]' },
            { icon: Certificate, title: 'Skill Badges', desc: 'Earn skill badges through assessments and consistent high-quality work.', color: 'text-[#7000FF]' },
            { icon: TrendUp, title: 'Trust Score', desc: 'A dynamic score that grows as you complete more jobs successfully.', color: 'text-[#0066FF]' },
            { icon: ShieldCheck, title: 'Verification Badge', desc: 'The coveted Workora Verified badge displayed on your profile.', color: 'text-[#7000FF]' },
          ].map((item, i) => (
            <motion.div 
              key={item.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08 }}
              className="p-8 lg:p-10 rounded-[32px] bg-zinc-50 dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 flex flex-col gap-5 hover:-translate-y-2 transition-transform duration-500"
            >
              <div className={`h-14 w-14 rounded-2xl bg-white dark:bg-zinc-800 shadow-sm flex items-center justify-center border border-zinc-100 dark:border-zinc-700 ${item.color}`}>
                <item.icon size={28} weight="duotone" />
              </div>
              <h3 className="text-xl font-black tracking-tight text-zinc-950 dark:text-white">{item.title}</h3>
              <p className="text-zinc-600 dark:text-zinc-400 font-medium leading-relaxed text-sm">{item.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 lg:py-40 px-[5%]">
        <div className="bg-zinc-50 dark:bg-zinc-900 rounded-[40px] lg:rounded-[80px] p-8 lg:p-24 flex flex-col items-center text-center gap-8 lg:gap-12 relative overflow-hidden border border-zinc-100 dark:border-zinc-800">
          <div className="absolute inset-0 bg-gradient-to-br from-[#0066FF]/5 to-transparent" />
          <h2 className="text-4xl md:text-6xl lg:text-[80px] font-black tracking-tighter text-zinc-950 dark:text-white relative z-10 leading-[0.9]">
            Ready to build <br />
            your Trust Passport?
          </h2>
          <p className="text-zinc-600 dark:text-zinc-400 text-lg md:text-xl max-w-xl font-medium leading-relaxed relative z-10">
            Join thousands of verified professionals building their digital reputation on Workora.
          </p>
          <div className="flex flex-col sm:flex-row gap-6 relative z-10 w-full max-w-xl">
            <Link 
              href="/join" 
              className="h-14 flex-1 flex items-center justify-center bg-gradient-to-r from-[#0066FF] to-[#7000FF] text-white rounded-xl font-black text-xl hover:scale-105 hover:brightness-110 transition-all shadow-xl shadow-[#7000FF]/20 whitespace-nowrap"
            >
              Get Started
            </Link>
            <Link 
              href="/safety" 
              className="h-14 flex-1 flex items-center justify-center bg-white dark:bg-zinc-800 border-2 border-zinc-100 dark:border-zinc-700 text-zinc-950 dark:text-white rounded-xl font-black text-xl hover:bg-zinc-50 dark:hover:bg-zinc-700 transition-all whitespace-nowrap"
            >
              Learn About Safety
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
