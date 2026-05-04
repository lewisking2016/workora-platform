import { Search } from 'lucide-react';
import { VideoCard } from '@/components/VideoCard';

const MOCK_GIGS = [
  {
    id: '1',
    workerName: 'John Doe',
    workerAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=100',
    thumbnailUrl: 'https://images.unsplash.com/photo-1504148455328-c376907d081c?auto=format&fit=crop&q=80&w=400',
    title: 'Fixing a burst pipe with seamless finish',
    views: '2.6K',
  },
  {
    id: '2',
    workerName: 'Jane Smith',
    workerAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=100',
    thumbnailUrl: 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&q=80&w=400',
    title: 'Solar panel installation in high-density area',
    views: '1.1K',
  },
  {
    id: '3',
    workerName: 'David K.',
    workerAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=100',
    thumbnailUrl: 'https://images.unsplash.com/photo-1581578731548-c64695ce6958?auto=format&fit=crop&q=80&w=400',
    title: 'Full house deep cleaning and sanitization',
    views: '3.9K',
  },
  {
    id: '4',
    workerName: 'Mary W.',
    workerAvatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=100',
    thumbnailUrl: 'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&q=80&w=400',
    title: 'Custom kitchen cabinet build and installation',
    views: '756',
  },
];

const CATEGORIES = ['For You', 'Trending', 'Plumbers', 'Electricians', 'Solar', 'Cleaning'];

export default function Home() {
  return (
    <div className="flex flex-col gap-6">
      {/* Top Header & Search */}
      <div className="flex items-center gap-4">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand text-white font-bold">
          J
        </div>
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            placeholder="Find a verified professional..."
            className="h-10 w-full rounded-full bg-muted pl-10 pr-4 text-sm outline-none ring-brand focus:ring-2"
          />
        </div>
      </div>

      {/* Horizontal Categories */}
      <div className="no-scrollbar flex gap-2 overflow-x-auto pb-1">
        {CATEGORIES.map((cat, i) => (
          <button
            key={cat}
            className={`whitespace-nowrap rounded-full px-4 py-2 text-xs font-semibold transition-colors ${
              i === 0 ? 'bg-brand text-white' : 'bg-muted text-muted-foreground hover:bg-muted/80'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* 2-Column Video Grid */}
      <div className="grid grid-cols-2 gap-4 pb-20">
        {MOCK_GIGS.map((gig) => (
          <VideoCard key={gig.id} {...gig} />
        ))}
      </div>
    </div>
  );
}
