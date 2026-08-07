'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { 
  MagnifyingGlass,
  ChatCircleDots,
  TrendUp,
  UploadSimple,
  ShieldCheck,
  Lightning,
  Users,
  Sparkle,
  ArrowRight
} from '@phosphor-icons/react';
import { MeshBackground } from '@/components/MeshBackground';
import { TechCard } from '@/components/TechCard';

export default function PlatformPage() {
  const features = [
    {
      icon: MagnifyingGlass,
      title: 'Smart Discovery',
      description: 'Find verified professionals through intelligent search powered by trust scores and real work history.',
      color: 'from-blue-500 to-cyan-500'
    },
    {
      icon: ChatCircleDots,
      title: 'Direct Messaging',
      description: 'Connect instantly with professionals. Real-time chat with attachment support and read receipts.',
      color: 'from-purple-500 to-pink-500'
    },
    {
      icon: TrendUp,
      title: 'Live Analytics',
      description: 'Track profile views, engagement metrics, and trust score evolution in real-time dashboards.',
      color: 'from-orange-500 to-red-500'
    },
    {
      icon: UploadSimple,
      title: 'Media Upload',
      description: 'Share proof-of-work with video, images, and documents. Cloudflare R2-powered storage.',
      color: 'from-green-500 to-emerald-500'
    },
    {
      icon: ShieldCheck,
      title: 'Trust Passport',
      description: 'Verified identity, skills validation, and reputation scoring built on blockchain principles.',
      color: 'from-indigo-500 to-blue-500'
    },
    {
      icon: Lightning,
      title: 'Instant Verification',
      description: 'Fast-track professional verification with government ID, trade certificates, and peer reviews.',
      color: 'from-yellow-500 to-orange-500'
    }
  ];

  const stats = [
    { value: '10K+', label: 'Verified Professionals' },
    { value: '50K+', label: 'Projects Completed' },
    { value: '4.9/5', label: 'Average Rating' },
    { value: '24/7', label: 'Platform Uptime' }
  ];

  return (
    <main className="min-h-screen bg-white text-zinc-950">
      {/* Hero Section with Mesh */}
      <section className="relative min-h-[80vh] flex items-center justify-center overflow-hidden pt-20">
        <MeshBackground variant="hero" />
        
        <div className="relative z-10 max-w-6xl mx-auto px-6 py-20 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="space-y-8"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-zinc-100 border border-zinc-200 text-xs font-bold uppercase tracking-wider">
              <Sparkle size={16} weight="fill" className="text-blue-600" />
              The Complete Platform
            </div>
            
            <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-black tracking-tight leading-none">
              Everything you need <br />
              <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-blue-600 bg-clip-text text-transparent">
                in one platform
              </span>
            </h1>
            
            <p className="text-xl sm:text-2xl text-zinc-600 max-w-3xl mx-auto leading-relaxed">
              Discovery, verification, messaging, analytics, and payments. All synchronized in real-time.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
              <Link
                href="/join"
                className="group inline-flex items-center justify-center gap-2 h-14 px-8 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-bold text-base hover:shadow-2xl hover:shadow-blue-500/30 hover:scale-105 transition-all"
              >
                Get Started
                <ArrowRight size={20} weight="bold" className="transition-transform group-hover:translate-x-1" />
              </Link>
              <Link
                href="/dashboard/feed"
                className="inline-flex items-center justify-center h-14 px-8 bg-white border-2 border-zinc-300 text-zinc-950 rounded-xl font-bold text-base hover:bg-zinc-50 transition-all"
              >
                Explore Platform
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="relative py-20 border-y border-zinc-200">
        <MeshBackground variant="subtle" />
        <div className="relative z-10 max-w-6xl mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="text-center"
              >
                <div className="text-4xl md:text-5xl font-black text-zinc-950 mb-2">
                  {stat.value}
                </div>
                <div className="text-sm font-medium text-zinc-500 uppercase tracking-wider">
                  {stat.label}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="relative py-24">
        <MeshBackground variant="prominent" />
        <div className="relative z-10 max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-black mb-4">
              Powerful features for everyone
            </h2>
            <p className="text-xl text-zinc-600 max-w-2xl mx-auto">
              Built for professionals, businesses, and hirers. Every feature works together seamlessly.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, i) => (
              <TechCard key={feature.title} hover glow>
                <div className="p-8">
                  <div className={`inline-flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-br ${feature.color} text-white mb-6 shadow-lg`}>
                    <feature.icon size={28} weight="bold" />
                  </div>
                  <h3 className="text-2xl font-black mb-3 text-zinc-950">
                    {feature.title}
                  </h3>
                  <p className="text-zinc-600 leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              </TechCard>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative py-24">
        <div className="max-w-4xl mx-auto px-6">
          <TechCard className="overflow-hidden" hover={false}>
            <div className="relative p-12 text-center">
              <MeshBackground variant="prominent" />
              <div className="relative z-10 space-y-6">
                <h2 className="text-4xl md:text-5xl font-black text-zinc-950">
                  Ready to get started?
                </h2>
                <p className="text-xl text-zinc-600 max-w-2xl mx-auto">
                  Join thousands of professionals already using Workora to grow their business.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
                  <Link
                    href="/join"
                    className="inline-flex items-center justify-center h-14 px-8 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-bold hover:shadow-2xl hover:shadow-blue-500/30 hover:scale-105 transition-all"
                  >
                    Create Account
                  </Link>
                  <Link
                    href="/contact"
                    className="inline-flex items-center justify-center h-14 px-8 bg-white border-2 border-zinc-300 text-zinc-950 rounded-xl font-bold hover:bg-zinc-50 transition-all"
                  >
                    Contact Sales
                  </Link>
                </div>
              </div>
            </div>
          </TechCard>
        </div>
      </section>
    </main>
  );
}
