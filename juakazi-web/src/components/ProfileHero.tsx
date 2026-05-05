import React from 'react';
import Image from 'next/image';
import { SealCheck, MapPin, ShareNetwork, Star, Lightning } from '@phosphor-icons/react';

interface ProfileHeroProps {
  name: string;
  trade: string;
  location: string;
  imageUrl: string;
  isVerified?: boolean;
}

export function ProfileHero({
  name,
  trade,
  location,
  imageUrl,
  isVerified = true,
}: ProfileHeroProps) {
  return (
    <div className="relative">
      {/* Background Banner / Large Image (Happn style) */}
      <div className="relative aspect-square w-full overflow-hidden md:aspect-video md:rounded-[40px] shadow-2xl border-4 border-zinc-50">
        <Image
          src={imageUrl}
          alt={name}
          fill
          className="object-cover"
          priority
        />
        {/* Cinematic Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />
        
        {/* Bottom-left Info Overlay */}
        <div className="absolute bottom-8 left-8 text-white">
          <div className="flex items-center gap-3 mb-2">
            <h1 className="text-4xl font-black tracking-tighter leading-none">{name}</h1>
            {isVerified && (
              <div className="text-[#0066FF] drop-shadow-lg">
                <SealCheck size={32} weight="fill" />
              </div>
            )}
          </div>
          <div className="flex items-center gap-3">
             <div className="px-3 py-1 bg-white/10 backdrop-blur-md rounded-full text-xs font-black uppercase tracking-widest border border-white/20">
               {trade}
             </div>
             <div className="flex items-center gap-1 text-yellow-400">
               <Star size={16} weight="fill" />
               <span className="text-xs font-black uppercase tracking-widest text-white">4.9 (Verified)</span>
             </div>
          </div>
        </div>

        {/* Top-right Share Button */}
        <button className="absolute right-8 top-8 h-12 w-12 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-white hover:bg-white/20 transition-all active:scale-95 shadow-xl">
          <ShareNetwork size={24} weight="bold" />
        </button>
      </div>

      {/* Floating Meta Info (Location & Availability) */}
      <div className="mt-8 flex items-center justify-between px-4">
        <div className="flex items-center gap-2 text-zinc-500 font-bold tracking-tight">
          <MapPin size={20} weight="duotone" className="text-[#7000FF]" />
          <span className="text-sm">{location}</span>
        </div>
        <div className="flex items-center gap-2 rounded-full bg-zinc-50 border border-zinc-100 px-5 py-2 text-[10px] font-black uppercase tracking-widest text-zinc-950 shadow-sm">
          <span className="h-2 w-2 rounded-full bg-[#0066FF] animate-pulse" />
          <Lightning size={14} weight="fill" className="text-[#0066FF]" />
          Available Now
        </div>
      </div>
    </div>
  );
}
