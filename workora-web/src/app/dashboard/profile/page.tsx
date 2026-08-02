'use client';

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { ProfileHero } from '@/components/ProfileHero';
import { ProfileStats } from '@/components/ProfileStats';
import { UberRating } from '@/components/UberRating';
import { 
  ShieldCheck, 
  SpinnerGap,
  VideoCamera,
  Star,
  MapPin,
  CalendarBlank,
  Clock,
  Medal,
  Certificate,
  Briefcase,
  Wallet,
  TrendUp,
  ChartLine,
  Users,
  Eye,
  Heart,
  ChatCircleDots,
  PencilSimple,
  Share,
  Download
} from '@phosphor-icons/react';
import Link from 'next/link';

import { Sidebar } from '@/components/Sidebar';
import { fetchCurrentUser } from '@/lib/session';
import { APP_CONFIG } from '@/lib/config';

interface User {
  id: string;
  username: string;
  role: string;
}

interface Profile {
  id: string;
  full_name: string;
  trade: string;
  location: string;
  avatar_url: string;
  is_verified: boolean;
  total_gigs: number;
  trust_score: string;
  bio: string;
  total_earnings: number;
  created_at: string;
}

interface Gig {
  id: string;
  title: string;
  thumbnail_url: string;
  view_count: number;
  likes_count: number;
}

interface Rating {
  id: string;
  reviewer_name: string;
  rating: number;
  comment: string;
  created_at: string;
}

interface Breakdown {
  score: number;
  count: number;
}

interface RatingData {
  average: string;
  ratings: Rating[];
  breakdown: Breakdown[];
}

export default function DashboardProfile() {
  const [profile, setProfile] = useState<{ profile: Profile } | null>(null);
  const [gigs, setGigs] = useState<Gig[]>([]);
  const [ratingData, setRatingData] = useState<RatingData | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  const fetchData = async (userId: string) => {
    try {
      const profileRes = await fetch(`/api/profile/me/${userId}`);
      const profileData = await profileRes.json();
      setProfile(profileData);

      if (profileData.profile) {
        const profileId = profileData.profile.id;
        
        const ratingsRes = await fetch(`/api/profile/ratings/${profileId}`);
        const ratingsData = await ratingsRes.json();
        setRatingData(ratingsData);

        const gigsRes = await fetch(`/api/gigs/worker/${profileId}`);
        const gigsData = await gigsRes.json();
        setGigs(gigsData);
      }
    } catch (err) {
      console.error('Failed to fetch dashboard data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let mounted = true;

    const bootstrap = async () => {
      const user = await fetchCurrentUser();
      if (!mounted) return;

      if (!user) {
        window.location.href = '/login';
        return;
      }

      setCurrentUser(user);
      fetchData(user.id);
    };

    bootstrap();

    return () => {
      mounted = false;
    };
  }, []);

  if (loading) {
    return (
      <div className="h-screen w-full flex items-center justify-center bg-white dark:bg-[#0A0E17]">
        <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: "linear" }} className="text-[#0066FF]">
          <SpinnerGap size={48} weight="bold" />
        </motion.div>
      </div>
    );
  }

  const totalViews = gigs.reduce((sum, gig) => sum + (gig.view_count || 0), 0);
  const totalLikes = gigs.reduce((sum, gig) => sum + (gig.likes_count || 0), 0);
  const memberSince = profile?.profile?.created_at ? new Date(profile.profile.created_at).toLocaleDateString('en-US', { month: 'short', year: 'numeric' }) : 'Recently';

  return (
    <div className="h-full bg-zinc-50 dark:bg-[#0A0E17] overflow-y-auto">
      <div className="max-w-7xl mx-auto px-[5%] lg:px-8 py-8 flex flex-col gap-8 pb-32">
        
        <div className="flex items-center justify-between">
          <h1 className="text-4xl font-black tracking-tighter text-zinc-950 dark:text-white">My Profile</h1>
          <div className="flex items-center gap-3">
            <button className="h-12 px-6 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl flex items-center gap-2 font-black text-sm text-zinc-950 dark:text-white hover:shadow-lg transition-all">
              <Share size={20} weight="bold" /> Share
            </button>
            <Link href="/dashboard/profile/edit" className="h-12 px-6 bg-[#0066FF] text-white rounded-2xl flex items-center gap-2 font-black text-sm hover:brightness-110 transition-all shadow-lg">
              <PencilSimple size={20} weight="bold" /> Edit Profile
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          <div className="lg:col-span-2 space-y-6">
            
            <ProfileHero
              name={profile?.profile?.full_name || currentUser?.username || ''}
              trade={profile?.profile?.trade || 'Workora Pro'}
              location={profile?.profile?.location || APP_CONFIG.defaults.location}
              imageUrl={profile?.profile?.avatar_url || APP_CONFIG.defaults.avatar}
              isVerified={profile?.profile?.is_verified || false}
              rating={ratingData?.average || profile?.profile?.trust_score || '0.0'}
            />

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { icon: Briefcase, label: 'Jobs Done', value: profile?.profile?.total_gigs || 0, color: 'text-[#0066FF]', bg: 'bg-blue-50 dark:bg-blue-950/20' },
                { icon: Wallet, label: 'Total Earned', value: `KSh ${(profile?.profile?.total_earnings || 0).toLocaleString()}`, color: 'text-green-500', bg: 'bg-green-50 dark:bg-green-950/20' },
                { icon: Eye, label: 'Profile Views', value: totalViews, color: 'text-purple-500', bg: 'bg-purple-50 dark:bg-purple-950/20' },
                { icon: Heart, label: 'Total Likes', value: totalLikes, color: 'text-red-500', bg: 'bg-red-50 dark:bg-red-950/20' },
              ].map((stat, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className="bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 rounded-[24px] p-6 flex flex-col items-center gap-3"
                >
                  <div className={`h-12 w-12 rounded-2xl ${stat.bg} flex items-center justify-center ${stat.color}`}>
                    <stat.icon size={24} weight="fill" />
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-black text-zinc-950 dark:text-white">{stat.value}</p>
                    <p className="text-[10px] font-black text-zinc-400 uppercase tracking-wider mt-1">{stat.label}</p>
                  </div>
                </motion.div>
              ))}
            </div>

            <div className="bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 rounded-[32px] p-8 space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-black text-zinc-900 dark:text-white tracking-tight">About Me</h2>
                <Link href="/dashboard/profile/edit" className="text-[#0066FF] text-sm font-black hover:underline">
                  Edit
                </Link>
              </div>
              <p className="text-base leading-relaxed text-zinc-600 dark:text-zinc-400 font-medium">
                {profile?.profile?.bio || 'No bio provided yet. Add a bio to help hirers understand your expertise and experience.'}
              </p>
            </div>

            <div className="bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 rounded-[32px] p-8 space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-black text-zinc-900 dark:text-white tracking-tight">Portfolio</h2>
                  <p className="text-sm font-bold text-zinc-400 mt-1">{gigs.length} proof-of-work videos</p>
                </div>
                <Link href="/dashboard/create" className="h-10 px-5 bg-zinc-950 dark:bg-white text-white dark:text-zinc-950 rounded-xl font-black text-xs uppercase tracking-widest hover:scale-105 transition-all flex items-center gap-2">
                  <VideoCamera size={16} weight="fill" /> Upload
                </Link>
              </div>
              
              {gigs.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {gigs.slice(0, 6).map((gig) => (
                    <div key={gig.id} className="group relative aspect-video bg-zinc-100 dark:bg-zinc-900 rounded-[24px] overflow-hidden shadow-sm border border-zinc-100 dark:border-zinc-800">
                      <Image 
                        src={gig.thumbnail_url || APP_CONFIG.defaults.thumbnail}
                        alt={gig.title}
                        fill
                        className="object-cover transition-transform duration-700 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex flex-col justify-end p-5 opacity-0 group-hover:opacity-100 transition-opacity">
                         <p className="text-white text-sm font-black truncate mb-2">{gig.title}</p>
                         <div className="flex items-center gap-4 text-white/80 text-xs font-bold">
                            <span className="flex items-center gap-1"><Eye size={14} weight="fill" /> {gig.view_count}</span>
                            <span className="flex items-center gap-1"><Heart size={14} weight="fill" /> {gig.likes_count}</span>
                         </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="h-48 border-2 border-dashed border-zinc-200 dark:border-zinc-800 rounded-[24px] flex flex-col items-center justify-center gap-4 text-zinc-300 dark:text-zinc-700">
                   <VideoCamera size={48} weight="duotone" />
                   <div className="text-center">
                     <p className="text-sm font-black text-zinc-400 mb-1">No portfolio items yet</p>
                     <p className="text-xs font-medium text-zinc-400">Upload your first proof-of-work video</p>
                   </div>
                </div>
              )}
              
              {gigs.length > 6 && (
                <Link href="/dashboard/works" className="w-full h-12 bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-2xl flex items-center justify-center font-black text-sm text-zinc-950 dark:text-white hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-all">
                  View All {gigs.length} Items
                </Link>
              )}
            </div>
          </div>

          <div className="space-y-6">
            
            <UberRating 
              average={ratingData?.average || '0.0'}
              totalReviews={ratingData?.ratings?.length || 0}
              breakdown={ratingData?.breakdown || []}
            />

            <div className="bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 rounded-[32px] p-6 space-y-5">
              <div className="flex items-center gap-3">
                <div className="h-12 w-12 rounded-2xl bg-gradient-to-br from-[#0066FF] to-[#0052CC] flex items-center justify-center shadow-lg">
                  <ShieldCheck size={24} weight="fill" className="text-white" />
                </div>
                <div>
                  <p className="text-xs font-black uppercase tracking-wider text-zinc-400">Trust Status</p>
                  <p className="text-lg font-black text-zinc-950 dark:text-white">Verified Professional</p>
                </div>
              </div>
              
              <div className="h-px bg-zinc-100 dark:bg-zinc-800" />
              
              <div className="space-y-3">
                {[
                  { icon: Certificate, label: 'ID Verified', status: 'Approved', color: 'text-green-500' },
                  { icon: Medal, label: 'Skill Badge', status: profile?.profile?.trade || 'None', color: 'text-[#0066FF]' },
                  { icon: ShieldCheck, label: 'Background Check', status: profile?.profile?.is_verified ? 'Passed' : 'Pending', color: profile?.profile?.is_verified ? 'text-green-500' : 'text-amber-500' },
                ].map((item, i) => (
                  <div key={i} className="flex items-center justify-between p-3 rounded-xl hover:bg-zinc-50 dark:hover:bg-zinc-950 transition-all">
                    <div className="flex items-center gap-3">
                      <item.icon size={18} weight="fill" className={item.color} />
                      <span className="text-sm font-bold text-zinc-600 dark:text-zinc-300">{item.label}</span>
                    </div>
                    <span className={`text-xs font-black ${item.color}`}>{item.status}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-gradient-to-br from-zinc-950 to-zinc-900 rounded-[32px] p-6 text-white space-y-4">
              <div className="flex items-center gap-3">
                <div className="h-12 w-12 rounded-2xl bg-white/10 flex items-center justify-center">
                  <ChartLine size={24} weight="duotone" className="text-[#0066FF]" />
                </div>
                <div>
                  <p className="text-xs font-black uppercase tracking-wider text-white/60">Quick Stats</p>
                  <p className="text-lg font-black">Performance</p>
                </div>
              </div>
              
              <div className="space-y-3">
                {[
                  { label: 'Response Time', value: '< 2h' },
                  { label: 'Completion Rate', value: '98%' },
                  { label: 'Member Since', value: memberSince },
                ].map((stat, i) => (
                  <div key={i} className="flex items-center justify-between py-2">
                    <span className="text-sm font-medium text-white/70">{stat.label}</span>
                    <span className="text-sm font-black text-white">{stat.value}</span>
                  </div>
                ))}
              </div>
              
              <Link href="/dashboard/analytics" className="w-full h-12 bg-gradient-to-r from-[#0066FF] to-[#7000FF] rounded-xl flex items-center justify-center gap-2 font-black text-sm hover:brightness-110 transition-all shadow-lg mt-4">
                <ChartLine size={20} weight="bold" /> View Full Analytics
              </Link>
            </div>

            <div className="bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 rounded-[32px] p-6 space-y-4">
              <h3 className="text-lg font-black text-zinc-950 dark:text-white">Quick Actions</h3>
              <div className="space-y-2">
                {[
                  { icon: VideoCamera, label: 'Upload Work', href: '/dashboard/create', color: 'text-[#0066FF]' },
                  { icon: Share, label: 'Share Profile', href: '#', color: 'text-[#7000FF]' },
                  { icon: Download, label: 'Download Certificate', href: '#', color: 'text-green-500' },
                ].map((action, i) => (
                  <Link
                    key={i}
                    href={action.href}
                    className="flex items-center gap-3 p-3 rounded-xl hover:bg-zinc-50 dark:hover:bg-zinc-950 transition-all group"
                  >
                    <action.icon size={20} weight="bold" className={action.color} />
                    <span className="text-sm font-bold text-zinc-600 dark:text-zinc-300 group-hover:text-zinc-950 dark:group-hover:text-white">{action.label}</span>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
