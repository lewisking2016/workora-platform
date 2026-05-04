import React from 'react';
import Image from 'next/image';
import { ProfileHero } from '@/components/ProfileHero';
import { ProfileStats } from '@/components/ProfileStats';
import { MessageSquare, ShieldCheck, ChevronRight } from 'lucide-react';

export default function ProfilePage() {
  return (
    <div className="flex flex-col gap-8 pb-32">
      {/* 1. Hero Section (Happn/Airbnb Mix) */}
      <ProfileHero
        name="Alex Ndungu"
        trade="Master Electrician & Solar Specialist"
        location="Nairobi, Kenya"
        imageUrl="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=800"
      />

      {/* 2. Stats Bar (Upwork Style) */}
      <ProfileStats />

      {/* 3. About Section */}
      <div className="flex flex-col gap-3">
        <h2 className="text-xl">About Alex</h2>
        <p className="text-sm leading-relaxed text-muted-foreground">
          Specialized in high-voltage industrial installations and residential solar systems. 
          Over 10 years of experience serving the Eastleigh and Westlands areas. 
          Verified by ImeanTech with a 100% job success rate.
        </p>
      </div>

      {/* 4. Verified Gigs / Featured Section (LinkedIn Style) */}
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl">Verified Gigs</h2>
          <button className="text-sm font-bold text-brand">View All</button>
        </div>
        <div className="no-scrollbar flex gap-4 overflow-x-auto pb-2">
          {[1, 2, 3].map((i) => (
            <div key={i} className="min-w-[280px] overflow-hidden rounded-2xl border bg-card dark:border-white/10">
              <div className="relative aspect-video w-full bg-muted">
                <Image 
                  src={`https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&q=80&w=400&sig=${i}`} 
                  alt="Verified Gig Thumbnail"
                  fill
                  className="h-full w-full object-cover" 
                />
              </div>
              <div className="p-4">
                <h3 className="text-sm font-bold">Industrial Fusebox Upgrade</h3>
                <p className="mt-1 text-xs text-muted-foreground">Completed April 2026</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 5. Trust & Safety (Airbnb Style List) */}
      <div className="flex flex-col gap-4">
        <h2 className="text-xl">Trust & Safety</h2>
        <div className="divide-y rounded-2xl border bg-card dark:divide-white/10 dark:border-white/10">
          {[
            { icon: ShieldCheck, label: 'Verified Identity', detail: 'National ID Verified' },
            { icon: ShieldCheck, label: 'Skills Certified', detail: 'Electrical Safety Level 3' },
          ].map((item, i) => (
            <div key={i} className="flex items-center justify-between p-4">
              <div className="flex items-center gap-3">
                <item.icon className="h-5 w-5 text-brand" />
                <div>
                  <p className="text-sm font-bold">{item.label}</p>
                  <p className="text-xs text-muted-foreground">{item.detail}</p>
                </div>
              </div>
              <ChevronRight className="h-4 w-4 text-muted-foreground" />
            </div>
          ))}
        </div>
      </div>

      {/* 6. Sticky Bottom Action Bar */}
      <div className="fixed bottom-20 left-0 right-0 z-50 px-4 lg:bottom-4">
        <div className="mx-auto flex max-w-screen-xl gap-3 rounded-3xl border bg-background/80 p-3 shadow-2xl backdrop-blur-xl dark:border-white/10">
          <button className="flex h-12 flex-1 items-center justify-center gap-2 rounded-2xl bg-brand font-bold text-white transition-transform active:scale-95">
            Hire Alex
          </button>
          <button className="flex h-12 w-12 items-center justify-center rounded-2xl bg-muted text-foreground transition-transform active:scale-95">
            <MessageSquare className="h-5 w-5" />
          </button>
        </div>
      </div>
    </div>
  );
}
