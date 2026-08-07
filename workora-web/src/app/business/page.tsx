'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { 
  MagnifyingGlass,
  ChartLine,
  UserCheck,
  Clock,
  Shield,
  TrendUp,
  CheckCircle,
  ArrowRight,
  Sparkle
} from '@phosphor-icons/react';
import { MeshBackground } from '@/components/MeshBackground';
import { TechCard } from '@/components/TechCard';

export default function BusinessPage() {
  const benefits = [
    {
      icon: MagnifyingGlass,
      title: 'Advanced Search',
      description: 'Filter by trade, location, rating, availability, and verified status to find the perfect match.',
    },
    {
      icon: ChartLine,
      title: 'Performance Analytics',
      description: 'Track hiring patterns, completion rates, and team performance with detailed dashboards.',
    },
    {
      icon: UserCheck,
      title: 'Verified Professionals',
      description: 'Every profile is verified with government ID, trade certificates, and work history.',
    },
    {
      icon: Clock,
      title: 'Real-Time Availability',
      description: 'See who\'s available now, their response time, and booking calendar instantly.',
    },
    {
      icon: Shield,
      title: 'Trust Guarantee',
      description: 'Platform-backed insurance, secure payments, and dispute resolution included.',
    },
    {
      icon: TrendUp,
      title: 'Growth Insights',
      description: 'Optimize your hiring strategy with AI-powered recommendations and market trends.',
    },
  ];

  const features = [
    'Priority support 24/7',
    'Bulk hiring discounts',
    'Team collaboration tools',
    'Custom invoicing',
    'Advanced reporting',
    'Dedicated account manager',
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
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-50 border border-blue-200 text-xs font-bold uppercase tracking-wider text-blue-700">
              <Sparkle size={16} weight="fill" />
              For Business
            </div>
            
            <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-black tracking-tight leading-none">
              <motion.span 
                initial={{ opacity: 0, y: 15 }} 
                animate={{ opacity: 1, y: 0 }} 
                transition={{ duration: 0.5, delay: 0.1 }}
                className="inline-block"
              >
                Hire faster with
              </motion.span>
              <br />
              <motion.span 
                initial={{ opacity: 0, scale: 0.95 }} 
                animate={{ opacity: 1, scale: 1 }} 
                transition={{ duration: 0.6, delay: 0.3 }}
                className="bg-gradient-to-r from-blue-600 via-purple-600 to-blue-600 bg-clip-text text-transparent animated-text inline-block"
              >
                verified talent
              </motion.span>
            </h1>
            
            <p className="text-xl sm:text-2xl text-zinc-600 max-w-3xl mx-auto leading-relaxed">
              Connect with pre-vetted professionals. See proof of work, read verified reviews, and hire with confidence.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
              <Link
                href="/join?type=business"
                className="group inline-flex items-center justify-center gap-2 h-14 px-8 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-bold text-base hover:shadow-2xl hover:shadow-blue-500/30 hover:scale-105 transition-all btn"
              >
                Start hiring
                <ArrowRight size={20} weight="bold" className="transition-transform group-hover:translate-x-1" />
              </Link>
              <Link
                href="/dashboard/search"
                className="inline-flex items-center justify-center h-14 px-8 bg-white border-2 border-zinc-300 text-zinc-950 rounded-xl font-bold text-base hover:bg-zinc-50 transition-all btn"
              >
                Find helpers
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Benefits Grid */}
      <section className="relative py-24">
        <MeshBackground variant="prominent" />
        <div className="relative z-10 max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-black mb-4">
              Why businesses choose Workora
            </h2>
            <p className="text-xl text-zinc-600 max-w-2xl mx-auto">
              Everything you need to find, hire, and manage professional talent in one platform.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {benefits.map((benefit, i) => (
              <motion.div
                key={benefit.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="h-full"
              >
                <TechCard hover glow className="h-full border border-blue-500/10 hover:border-blue-500/30">
                  <div className="p-8">
                    <div className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 text-blue-600 mb-4">
                      <benefit.icon size={24} weight="bold" />
                    </div>
                    <h3 className="text-xl font-black mb-3 text-zinc-950">
                      {benefit.title}
                    </h3>
                    <p className="text-zinc-600 leading-relaxed">
                      {benefit.description}
                    </p>
                  </div>
                </TechCard>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features List */}
      <section className="relative py-24 bg-zinc-50">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl md:text-5xl font-black mb-6">
                Enterprise-grade features
              </h2>
              <p className="text-xl text-zinc-600 mb-8">
                Built for teams that need reliability, scalability, and support.
              </p>
              <div className="space-y-4">
                {features.map((feature) => (
                  <div key={feature} className="flex items-center gap-3">
                    <div className="flex-shrink-0 h-6 w-6 rounded-full bg-green-100 flex items-center justify-center">
                      <CheckCircle size={16} weight="fill" className="text-green-600" />
                    </div>
                    <span className="text-zinc-700 font-medium">{feature}</span>
                  </div>
                ))}
              </div>
              <Link
                href="/contact"
                className="inline-flex items-center gap-2 mt-8 text-blue-600 font-bold hover:gap-3 transition-all"
              >
                Talk to sales
                <ArrowRight size={20} weight="bold" />
              </Link>
            </div>
            
            <TechCard hover={false}>
              <div className="p-8 space-y-6">
                <div className="text-center">
                  <div className="text-6xl font-black text-zinc-950 mb-2">
                    10K+
                  </div>
                  <div className="text-zinc-600 font-medium">
                    Businesses trust Workora
                  </div>
                </div>
                <div className="border-t border-zinc-200 pt-6">
                  <div className="grid grid-cols-2 gap-6 text-center">
                    <div>
                      <div className="text-3xl font-black text-zinc-950 mb-1">98%</div>
                      <div className="text-sm text-zinc-600">Satisfaction rate</div>
                    </div>
                    <div>
                      <div className="text-3xl font-black text-zinc-950 mb-1">4.9</div>
                      <div className="text-sm text-zinc-600">Average rating</div>
                    </div>
                  </div>
                </div>
              </div>
            </TechCard>
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
                  Ready to transform your hiring?
                </h2>
                <p className="text-xl text-zinc-600 max-w-2xl mx-auto">
                  Join thousands of businesses finding trusted professionals on Workora.
                </p>
                <Link
                  href="/join?type=business"
                  className="inline-flex items-center justify-center h-14 px-8 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-bold hover:shadow-2xl hover:shadow-blue-500/30 hover:scale-105 transition-all"
                >
                  Get Started Now
                </Link>
              </div>
            </div>
          </TechCard>
        </div>
      </section>
    </main>
  );
}
