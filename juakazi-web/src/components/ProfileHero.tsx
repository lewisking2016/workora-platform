import React from 'react';
import Image from 'next/image';
import { BadgeCheck, MapPin, Share2 } from 'lucide-react';

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
      <div className="relative aspect-square w-full overflow-hidden md:aspect-video md:rounded-3xl">
        <Image
          src={imageUrl}
          alt={name}
          fill
          className="object-cover"
          priority
        />
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
        
        {/* Bottom-left Info Overlay */}
        <div className="absolute bottom-6 left-6 text-white">
          <div className="flex items-center gap-2">
            <h1 className="text-3xl font-bold">{name}</h1>
            {isVerified && <BadgeCheck className="h-6 w-6 text-brand-light" />}
          </div>
          <p className="text-lg opacity-90">{trade}</p>
        </div>

        {/* Top-right Share Button */}
        <button className="absolute right-6 top-6 rounded-full bg-black/20 p-2 text-white backdrop-blur-md hover:bg-black/40 transition-colors">
          <Share2 className="h-5 w-5" />
        </button>
      </div>

      {/* Floating Meta Info (Location & Availability) */}
      <div className="mt-4 flex items-center justify-between px-2">
        <div className="flex items-center gap-1.5 text-muted-foreground">
          <MapPin className="h-4 w-4" />
          <span className="text-sm font-medium">{location}</span>
        </div>
        <div className="flex items-center gap-2 rounded-full bg-brand/10 px-3 py-1 text-xs font-bold text-brand">
          <span className="h-2 w-2 rounded-full bg-brand animate-pulse" />
          Available Now
        </div>
      </div>
    </div>
  );
}
