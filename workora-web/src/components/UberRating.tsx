import React from 'react';
import { Star, ShieldCheck, Info } from '@phosphor-icons/react';
import { motion } from 'framer-motion';

interface RatingBreakdown {
  score: number;
  count: number;
}

interface UberRatingProps {
  average: string;
  totalReviews: number;
  breakdown: RatingBreakdown[];
}

export function UberRating({ average, totalReviews, breakdown }: UberRatingProps) {
  // Normalize breakdown to 5-star order
  const scores = [5, 4, 3, 2, 1];
  const totalCount = totalReviews || 1;

  return (
    <div className="flex flex-col gap-6 rounded-xl bg-zinc-50 p-6 shadow-sm dark:bg-zinc-900">
      <div className="flex items-start justify-between">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-3">
            <span className="text-5xl font-black tracking-tighter text-zinc-950 dark:text-white">{average}</span>
            <div className="flex flex-col">
              <div className="flex text-yellow-500">
                {[1, 2, 3, 4, 5].map((i) => (
                  <Star key={i} size={16} weight="fill" />
                ))}
              </div>
              <span className="text-[10px] font-black uppercase tracking-widest text-zinc-400">{totalReviews} ratings</span>
            </div>
          </div>
        </div>
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white text-[#0066FF] shadow-sm dark:bg-zinc-950">
           <ShieldCheck size={28} weight="fill" />
        </div>
      </div>

      {/* Star Bars */}
      <div className="flex flex-col gap-3">
        {scores.map((score) => {
          const item = breakdown.find((b) => b.score === score);
          const count = item ? parseInt(item.count.toString()) : 0;
          const percentage = (count / totalCount) * 100;

          return (
            <div key={score} className="flex items-center gap-4">
              <span className="text-[10px] font-black text-zinc-400 w-2">{score}</span>
              <div className="flex-1 h-2 bg-zinc-200 rounded-full overflow-hidden">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: `${percentage}%` }}
                  transition={{ duration: 1, delay: 0.2 }}
                  className="h-full bg-zinc-950 rounded-full"
                />
              </div>
            </div>
          );
        })}
      </div>

        <div className="flex items-start gap-3 border-t border-zinc-200 pt-5 dark:border-zinc-800">
          <div className="mt-0.5 text-zinc-400">
            <Info size={18} weight="bold" />
          </div>
          <p className="text-[11px] font-medium text-zinc-500 leading-relaxed">
          Your rating is a weighted average of your most recent trips. We use a moving average to ensure your profile reflects your current quality of service.
        </p>
      </div>
    </div>
  );
}
