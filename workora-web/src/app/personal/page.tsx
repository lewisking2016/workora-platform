'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { 
  UserCheck,
  VideoCamera,
  Star,
  ShieldCheck,
  ChatCircle,
  Clock,
  CheckCircle,
  ArrowRight,
  Sparkle
} from '@phosphor-icons/react';
import { MeshBackground } from '@/components/MeshBackground';
import { TechCard } from '@/components/TechCard';

export default function PersonalPage() {
  const steps = [
    {
      icon: UserCheck,
      title: 'Browse Verified Profiles',
      description: 'Every professional is verified with ID, trade certificates, and work history.',
    },
    {
      icon: VideoCamera,
      title: 'Watch Proof of Work',
      description: 'See real videos and photos of completed projects before you hire.',
    },
    {
      icon: Star,
      title: 'Read Real Reviews',
      description: 'Authentic reviews from verified clients who hired through Workora.',
    },
    {
      icon: ChatCircle,
      title: 'Connect Directly',
      description: 'Message professionals instantly. Get quotes, schedule visits, negotiate rates.',
    },
  ];

  const features = [
    'No upfront fees',
    'Secure messaging',
    'Project tracking',
    'Payment protection',
    'Dispute resolution',
    'Quality guarantee',
  ];

  return (
    <main className="min-h-screen bg-transparent text-zinc-950">
      {/* Hero */}
      <section className="relative min-h-[85vh] flex items-center justify-center overflow-hidden pt-20">
        <MeshBackground variant="hero" />
        
        <div className="relative z-10 max-w-6xl mx-auto px-6 py-20 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="space-y-8"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-green-50 border border-green-200 text-xs font-bold uppercase tracking-wider text-green-700">
              <Sparkle size={16} weight="fill" />
              For Personal Hiring
            </div>
            
            <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-black tracking-tight leading-none">
              <motion.span 
                initial={{ opacity: 0, y: 15 }} 
                animate={{ opacity: 1, y: 0 }} 
                transition={{ duration: 0.5, delay: 0.1 }}
                className="inline-block"
              >
                Find trusted pros
              </motion.span>
              <br />
              <motion.span 
                initial={{ opacity: 0, scale: 0.95 }} 
                animate={{ opacity: 1, scale: 1 }} 
                transition={{ duration: 0.6, delay: 0.3 }}
                className="bg-gradient-to-r from-green-600 via-emerald-600 to-green-600 bg-clip-text text-transparent animated-text inline-block"
              >
                near you
              </motion.span>
            </h1>
            
            <p className="text-xl sm:text-2xl text-zinc-600 max-w-3xl mx-auto leading-relaxed">
              From plumbers to electricians, carpenters to masons. All verified, rated, and ready to work.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
              <Link
                href="/dashboard/search"
                className="group inline-flex items-center justify-center gap-2 h-14 px-8 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-xl font-bold text-base hover:shadow-2xl hover:shadow-green-500/30 hover:scale-105 transition-all btn"
              >
                Find a helper
                <ArrowRight size={20} weight="bold" className="transition-transform group-hover:translate-x-1" />
              </Link>
              <Link
                href="/join"
                className="inline-flex items-center justify-center h-14 px-8 bg-white border-2 border-zinc-300 text-zinc-950 rounded-xl font-bold text-base hover:bg-zinc-50 transition-all btn"
              >
                Join free
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* How It Works */}
      <section className="relative py-24">
        <MeshBackground variant="prominent" />
        <div className="relative z-10 max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-black mb-4">
              How it works
            </h2>
            <p className="text-xl text-zinc-600 max-w-2xl mx-auto">
              Four simple steps from search to hire
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {steps.map((step, i) => (
              <motion.div
                key={step.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.15 }}
                className="h-full"
              >
                <TechCard hover glow className="h-full border border-green-500/10 hover:border-green-500/30">
                  <div className="p-8">
                    <div className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-green-50 text-green-600 mb-4 font-black text-lg">
                      {i + 1}
                    </div>
                    <div className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-green-50 text-green-600 mb-4 ml-2">
                      <step.icon size={24} weight="bold" />
                    </div>
                    <h3 className="text-xl font-black mb-3 text-zinc-950">
                      {step.title}
                    </h3>
                    <p className="text-zinc-600 leading-relaxed">
                      {step.description}
                    </p>
                  </div>
                </TechCard>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Trust Features */}
      <section className="relative py-24 bg-zinc-50">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <TechCard hover={false}>
              <div className="p-8">
                <div className="inline-flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-br from-green-500 to-emerald-500 text-white mb-6 shadow-lg">
                  <ShieldCheck size={28} weight="bold" />
                </div>
                <h3 className="text-3xl font-black mb-4 text-zinc-950">
                  Protected every step
                </h3>
                <p className="text-zinc-600 mb-6 leading-relaxed">
                  Your safety and satisfaction are guaranteed. We verify every professional and back every project.
                </p>
                <div className="space-y-3">
                  {features.map((feature) => (
                    <div key={feature} className="flex items-center gap-3">
                      <CheckCircle size={20} weight="fill" className="text-green-600 flex-shrink-0" />
                      <span className="text-zinc-700 font-medium">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>
            </TechCard>
            
            <div>
              <h2 className="text-4xl md:text-5xl font-black mb-6">
                Hire with confidence
              </h2>
              <p className="text-xl text-zinc-600 mb-6">
                Every professional on Workora is verified, rated, and backed by our trust guarantee.
              </p>
              <div className="space-y-4">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 mt-1">
                    <Clock size={24} className="text-green-600" />
                  </div>
                  <div>
                    <h4 className="font-black text-zinc-950 mb-1">Fast Response</h4>
                    <p className="text-zinc-600">Most pros respond within 2 hours</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 mt-1">
                    <Star size={24} weight="fill" className="text-green-600" />
                  </div>
                  <div>
                    <h4 className="font-black text-zinc-950 mb-1">Top Rated</h4>
                    <p className="text-zinc-600">Average rating of 4.8/5 stars</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 mt-1">
                    <ShieldCheck size={24} weight="fill" className="text-green-600" />
                  </div>
                  <div>
                    <h4 className="font-black text-zinc-950 mb-1">Fully Verified</h4>
                    <p className="text-zinc-600">ID, certificates, and work history checked</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="relative py-24">
        <div className="max-w-4xl mx-auto px-6">
          <TechCard className="overflow-hidden" hover={false}>
            <div className="relative p-12 text-center">
              <MeshBackground variant="prominent" />
              <div className="relative z-10 space-y-6">
                <h2 className="text-4xl md:text-5xl font-black text-zinc-950">
                  Ready to find your pro?
                </h2>
                <p className="text-xl text-zinc-600 max-w-2xl mx-auto">
                  Join thousands of homeowners finding trusted professionals on Workora.
                </p>
                <Link
                  href="/dashboard/search"
                  className="inline-flex items-center justify-center h-14 px-8 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-xl font-bold hover:shadow-2xl hover:shadow-green-500/30 hover:scale-105 transition-all"
                >
                  Start Searching Now
                </Link>
              </div>
            </div>
          </TechCard>
        </div>
      </section>
    </main>
  );
}
