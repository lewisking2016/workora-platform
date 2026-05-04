import React from 'react';
import Image from 'next/image';
import { Eye } from 'lucide-react';

interface VideoCardProps {
  id: string;
  thumbnailUrl: string;
  workerAvatar: string;
  workerName: string;
  title: string;
  views: string;
}

export function VideoCard({
  thumbnailUrl,
  title,
  workerAvatar,
  views,
}: VideoCardProps) {
  return (
    <div className="group relative aspect-[3/4] overflow-hidden rounded-2xl bg-muted transition-transform active:scale-[0.98]">
      {/* Background Image/Thumbnail */}
      <Image
        src={thumbnailUrl}
        alt={title}
        fill
        className="object-cover"
        sizes="(max-width: 768px) 50vw, 33vw"
      />

      {/* Top Overlay: Avatar & Views */}
      <div className="absolute inset-x-0 top-0 flex items-center justify-between p-3 z-10">
        <div className="relative h-8 w-8 overflow-hidden rounded-full border-2 border-white/20">
          <Image
            src={workerAvatar}
            alt="Worker"
            fill
            className="object-cover"
          />
        </div>
        <div className="flex items-center gap-1 rounded-full bg-black/40 px-2 py-1 text-[10px] font-medium text-white backdrop-blur-sm">
          <Eye className="h-3 w-3" />
          {views}
        </div>
      </div>

      {/* Bottom Overlay: Title */}
      <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent p-4 pt-10 z-10">
        <h3 className="line-clamp-2 text-xs font-bold leading-tight text-white drop-shadow-sm">
          {title}
        </h3>
      </div>
    </div>
  );
}
