import React from 'react';
import { SealCheck, MapPin, Star, Gear } from '@phosphor-icons/react';
import { getInitials, getAvatarColor, isValidAvatarUrl } from '@/lib/avatar';
import Link from 'next/link';

interface ProfileHeroProps {
  name: string;
  trade: string;
  location: string;
  imageUrl: string;
  isVerified?: boolean;
  rating?: string;
}

export function ProfileHero({
  name,
  trade,
  location,
  imageUrl,
  isVerified = true,
  rating = "0.0",
}: ProfileHeroProps) {
  const showImage = isValidAvatarUrl(imageUrl);
  const initials = getInitials(name);
  const avatarColor = getAvatarColor(name);
  
  return (
    <div className="bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 rounded-[32px] p-8">
      <div className="flex items-start gap-6">
        {/* Instagram-style circular avatar */}
        <div className="relative">
          {/* Gradient ring like Instagram stories */}
          <div className="p-1 rounded-full bg-gradient-to-tr from-[#f09433] via-[#e6683c] via-[#dc2743] via-[#cc2366] to-[#bc1888]">
            {showImage ? (
              <img
                src={imageUrl}
                alt={name}
                className="w-32 h-32 rounded-full object-cover border-4 border-white dark:border-zinc-900"
              />
            ) : (
              <div className={`w-32 h-32 rounded-full ${avatarColor} flex items-center justify-center border-4 border-white dark:border-zinc-900`}>
                <span className="text-white text-5xl font-black">
                  {initials}
                </span>
              </div>
            )}
          </div>
          
          {/* Verified badge */}
          {isVerified && (
            <div className="absolute -bottom-1 -right-1 bg-white dark:bg-zinc-900 rounded-full p-1">
              <div className="bg-[#0066FF] rounded-full p-1.5">
                <SealCheck size={20} weight="fill" className="text-white" />
              </div>
            </div>
          )}
        </div>

        {/* Profile info */}
        <div className="flex-1">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h1 className="text-2xl font-black text-zinc-950 dark:text-white tracking-tight mb-1">
                {name}
              </h1>
              <p className="text-sm font-bold text-zinc-500 dark:text-zinc-400">
                {trade}
              </p>
            </div>
            
            <Link 
              href="/profile/edit"
              className="h-10 px-4 bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 rounded-xl flex items-center gap-2 font-bold text-sm text-zinc-950 dark:text-white transition-colors"
            >
              <Gear size={18} weight="bold" />
              Edit
            </Link>
          </div>

          {/* Instagram-style stats row */}
          <div className="flex items-center gap-8 mb-4">
            <div className="text-center">
              <div className="text-xl font-black text-zinc-950 dark:text-white">
                {rating}
              </div>
              <div className="text-xs font-bold text-zinc-500 dark:text-zinc-400">
                rating
              </div>
            </div>
            <div className="h-8 w-px bg-zinc-200 dark:bg-zinc-800" />
            <div className="flex items-center gap-2 text-zinc-600 dark:text-zinc-400">
              <MapPin size={16} weight="fill" className="text-zinc-400 dark:text-zinc-500" />
              <span className="text-sm font-bold">{location}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
