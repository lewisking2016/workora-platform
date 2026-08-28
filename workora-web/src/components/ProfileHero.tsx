import React from 'react';
import { SealCheck, MapPin, Gear } from '@phosphor-icons/react';
import { getInitials, getAvatarColor, isValidAvatarUrl } from '@/lib/avatar';
import Link from 'next/link';
import Image from 'next/image';

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
  isVerified = false,
  rating = "0.0",
}: ProfileHeroProps) {
  const showImage = isValidAvatarUrl(imageUrl);
  const initials = getInitials(name);
  const avatarColor = getAvatarColor(name);
  
  return (
    <div className="rounded-xl bg-white p-6 shadow-sm shadow-black/5 dark:bg-zinc-900">
      <div className="flex items-start gap-5">
        <div className="relative">
          <div className="rounded-xl bg-[#0066FF] p-1.5 shadow-[0_16px_30px_-18px_rgba(79,70,229,0.55)]">
            {showImage ? (
              <Image
                src={imageUrl}
                alt={name}
                width={128}
                height={128}
                className="h-28 w-28 rounded-xl object-cover"
              />
            ) : (
              <div className={`flex h-28 w-28 items-center justify-center rounded-xl ${avatarColor}`}>
                <span className="text-white text-5xl font-black">
                  {initials}
                </span>
              </div>
            )}
          </div>
          
          {isVerified && (
            <div className="absolute -bottom-1 -right-1 rounded-xl bg-gradient-to-br from-[#0066FF] p-1.5 shadow-lg">
                <SealCheck size={18} weight="regular" className="text-white" />
            </div>
          )}
        </div>

        {/* Profile info */}
        <div className="flex-1">
          <div className="mb-4 flex items-start justify-between gap-4">
            <div>
              <h1 className="mb-1 text-2xl font-black tracking-tight text-zinc-950 dark:text-white">
                {name}
              </h1>
              <p className="text-sm font-bold text-zinc-500 dark:text-zinc-400">
                {trade}
              </p>
            </div>
            
            <Link 
              href="/profile/edit"
              className="inline-flex h-10 items-center gap-2 rounded-xl bg-zinc-100 px-4 text-sm font-semibold text-zinc-950 transition-colors hover:bg-zinc-200 dark:bg-zinc-800 dark:text-white dark:hover:bg-zinc-700"
            >
              <Gear size={18} weight="regular" />
              Edit
            </Link>
          </div>

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
