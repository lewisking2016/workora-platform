'use client';

import React, { useEffect, useState, useRef, useCallback } from 'react';
import {
  Heart,
  ChatCircleDots,
  BookmarkSimple,
  ShareFat,
  DotsThree,
  PaperPlaneTilt,
  UserCircle,
  LinkSimple,
  WarningCircle,
  Check,
  SealCheck,
  SpeakerHigh,
  SpeakerSlash,
  X,
  ArrowClockwise,
} from '@phosphor-icons/react';
import { fetchCurrentUser, apiFetch, getSessionId } from '@/lib/session';
import { VideoPlayer } from '@/components/VideoPlayer';
import { APP_CONFIG } from '@/lib/config';
import { useRouter } from 'next/navigation';
import { AnimatePresence, motion } from 'framer-motion';

interface User {
  id: string;
  username: string;
  role: string;
}

interface Work {
  id: string;
  user_name: string;
  user_id?: string;
  worker_id?: string;
  creator_user_id?: string;
  handle?: string;
  trade: string;
  description?: string;
  video_url: string;
  thumbnail_url?: string;
  likes_count: number;
  real_likes?: number;
  comments_count: number;
  real_comments?: number;
  view_count: number;
  liked_by_me?: boolean;
  saved_by_me?: boolean;
  verified?: boolean;
}

interface WorkComment {
  id: string;
  user_name?: string;
  username?: string;
  text: string;
  created_at?: string;
}

type FeedMode = 'forYou' | 'following';

export default function WorksPage() {
  const [works, setWorks] = useState<Work[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [menuFor, setMenuFor] = useState<Work | null>(null);
  const [shareFeedback, setShareFeedback] = useState<string | null>(null);
  const [feedMode, setFeedMode] = useState<FeedMode>('forYou');
  const [activeTrade, setActiveTrade] = useState('All');
  const [trades, setTrades] = useState<string[]>([]);
  const [soundOn, setSoundOn] = useState(false);
  const [commentsFor, setCommentsFor] = useState<Work | null>(null);
  const [comments, setComments] = useState<WorkComment[]>([]);
  const [commentValue, setCommentValue] = useState('');
  const [postingComment, setPostingComment] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  const fetchWorks = useCallback(async (mode: FeedMode) => {
    if (mode === 'forYou') setLoading(true);
    else setRefreshing(true);
    try {
      const scope = mode === 'following' ? 'following' : 'reels';
      const endpoints = [
        `/api/gigs/feed?scope=${scope}&page=1&limit=50`,
        '/api/gigs/feed?scope=new&page=1&limit=50',
        '/api/gigs/explore?limit=50&page=1',
      ];
      let worksList: Work[] = [];
      for (const endpoint of endpoints) {
        const res = await apiFetch(endpoint);
        if (!res.ok) continue;
        const data = await res.json();
        if (Array.isArray(data) && data.length > 0) {
          worksList = data.filter((item: Work) => Boolean(item.video_url));
          if (worksList.length > 0) break;
        }
      }
      setWorks(worksList);
    } catch (err) {
      console.error('Works fetch failed:', err);
      setWorks([]);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  const fetchTrades = useCallback(async () => {
    try {
      const res = await apiFetch('/api/trades');
      const data = await res.json();
      if (Array.isArray(data)) setTrades(data);
    } catch (err) {
      console.error('Trades fetch failed:', err);
    }
  }, []);

  useEffect(() => {
    let mounted = true;
    const bootstrap = async () => {
      const user = await fetchCurrentUser();
      if (!mounted) return;
      setCurrentUser(user);
      void fetchWorks('forYou');
      void fetchTrades();
    };
    bootstrap();
    return () => { mounted = false; };
  }, [fetchWorks, fetchTrades]);

  const switchFeed = (mode: FeedMode) => {
    if (mode === feedMode) return;
    setFeedMode(mode);
    setActiveTrade('All');
    setCurrentIndex(0);
    void fetchWorks(mode);
  };

  const handleLike = async (work: Work) => {
    if (!currentUser) return;
    try {
      const res = await apiFetch(`/api/gigs/${work.id}/like`, { method: 'POST' });
      const data = await res.json();
      setWorks(prev => prev.map(item => item.id === work.id ? {
        ...item,
        likes_count: data.liked ? item.likes_count + 1 : Math.max(0, item.likes_count - 1),
        real_likes: data.liked ? (item.real_likes ?? item.likes_count) + 1 : Math.max(0, (item.real_likes ?? item.likes_count) - 1),
        liked_by_me: data.liked,
      } : item));
    } catch (err) {
      console.error(err);
    }
  };

  const handleSave = async (work: Work) => {
    if (!currentUser) return;
    try {
      const res = await apiFetch(`/api/gigs/${work.id}/save`, { method: 'POST' });
      const data = await res.json();
      setWorks(prev => prev.map(item => item.id === work.id ? { ...item, saved_by_me: data.saved } : item));
    } catch (err) {
      console.error(err);
    }
  };

  const handleShare = async (work: Work) => {
    const url = `${window.location.origin}/dashboard/post/${work.id}`;
    const text = `Check out ${work.user_name} on Workora — ${work.description || 'amazing work!'}`;
    try {
      if (navigator.share) {
        await navigator.share({ title: 'Workora', text, url });
        return;
      }
      throw new Error('no-share');
    } catch (err) {
      if (err instanceof Error && err.name === 'AbortError') return;
      try {
        await navigator.clipboard.writeText(url);
        setShareFeedback(work.id);
        setTimeout(() => setShareFeedback(null), 1600);
      } catch {
        window.open(`https://wa.me/?text=${encodeURIComponent(`${text} ${url}`)}`, '_blank');
      }
    }
  };

  const creatorId = (work: Work) => work.creator_user_id || work.user_id || work.worker_id || '';

  const openProfile = (work: Work) => {
    router.push(`/profile/${creatorId(work)}`);
  };

  const reportWork = async (work: Work) => {
    try {
      await apiFetch(`/api/gigs/${work.id}/report`, { method: 'POST' });
    } catch { /* report errors are silent */ }
    setMenuFor(null);
  };

  const startConversation = async (otherUserId: string) => {
    if (!currentUser) {
      router.push('/login');
      return;
    }
    try {
      const res = await apiFetch('/api/messages/conversations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ other_user_id: otherUserId }),
      });
      if (res.ok) {
        const conv = await res.json();
        router.push(`/dashboard/messages?conversation=${conv.id}`);
        return;
      }
      router.push('/dashboard/messages');
    } catch (err) {
      console.error(err);
      router.push('/dashboard/messages');
    }
  };

  const loadComments = async (work: Work) => {
    setCommentsFor(work);
    setComments([]);
    setCommentValue('');
    try {
      const res = await apiFetch(`/api/gigs/${work.id}/comments`);
      const data = await res.json();
      setComments(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);
    }
  };

  const postComment = async () => {
    const text = commentValue.trim();
    if (!text || !commentsFor) return;
    setPostingComment(true);
    try {
      const res = await apiFetch(`/api/gigs/${commentsFor.id}/comment`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text }),
      });
      if (res.ok) {
        setCommentValue('');
        await loadComments(commentsFor);
        setWorks(prev => prev.map(item => item.id === commentsFor.id ? {
          ...item,
          comments_count: item.comments_count + 1,
          real_comments: (item.real_comments || item.comments_count) + 1,
        } : item));
      }
    } catch (err) {
      console.error(err);
    } finally {
      setPostingComment(false);
    }
  };

  useEffect(() => {
    if (!works.length) return;
    const work = works[currentIndex];
    if (!work) return;
    apiFetch(`/api/gigs/${work.id}/view`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ session_id: getSessionId() }),
    }).catch(() => {});
  }, [currentIndex, works]);

  useEffect(() => {
    const handleScroll = () => {
      if (!containerRef.current) return;
      const scrollTop = containerRef.current.scrollTop;
      const windowHeight = window.innerHeight;
      const newIndex = Math.round(scrollTop / windowHeight);
      setCurrentIndex(newIndex);
    };

    const container = containerRef.current;
    if (container) {
      container.addEventListener('scroll', handleScroll);
      return () => container.removeEventListener('scroll', handleScroll);
    }
  }, []);

  const activeWorks = activeTrade === 'All'
    ? works
    : works.filter(work => work.trade?.toLowerCase() === activeTrade.toLowerCase());

  if (loading) {
    return (
      <div className="h-full w-full bg-black flex items-center justify-center">
        <div className="h-10 w-10 border-4 border-white/20 border-t-white rounded-full animate-spin" />
      </div>
    );
  }

  if (works.length === 0) {
    return (
      <div className="h-full w-full bg-black flex flex-col items-center justify-center text-white gap-4 px-8">
        <Heart size={48} weight="duotone" className="text-white/20" />
        <p className="text-sm font-medium text-center text-white/60">
          {feedMode === 'following'
            ? 'Nothing from the people you follow yet. Follow creators to fill this feed.'
            : 'No videos available yet. Check back soon!'}
        </p>
        {feedMode === 'following' && (
          <button
            onClick={() => switchFeed('forYou')}
            className="rounded-full bg-white px-5 py-2.5 text-sm font-bold text-zinc-950"
          >
            Browse For You
          </button>
        )}
      </div>
    );
  }

  if (activeWorks.length === 0) {
    return (
      <div className="h-full w-full bg-black flex flex-col items-center justify-center text-white gap-4 px-8">
        <WarningCircle size={48} weight="duotone" className="text-white/20" />
        <p className="text-sm font-medium text-center text-white/60">
          No {activeTrade} videos yet — try another trade.
        </p>
        <button
          onClick={() => setActiveTrade('All')}
          className="rounded-full bg-white px-5 py-2.5 text-sm font-bold text-zinc-950"
        >
          Show all trades
        </button>
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className="relative h-full w-full bg-black overflow-y-scroll snap-y snap-mandatory scrollbar-hide"
    >
      {/* ─── Top overlay: feed toggle + trade chips ─── */}
      <div className="absolute top-0 left-0 right-0 z-20 pointer-events-none">
        <div className="pt-[max(env(safe-area-inset-top),14px)] px-3">
          <div className="flex justify-center pointer-events-auto">
            <div className="flex items-center gap-1 rounded-full bg-black/45 backdrop-blur-md p-1">
              {(['forYou', 'following'] as FeedMode[]).map(mode => (
                <button
                  key={mode}
                  onClick={() => switchFeed(mode)}
                  className={`rounded-full px-4 py-1.5 text-xs font-bold transition-colors ${
                    feedMode === mode ? 'bg-white text-zinc-950' : 'text-white/70'
                  }`}
                >
                  {mode === 'forYou' ? 'For You' : 'Following'}
                </button>
              ))}
            </div>
          </div>
          {refreshing && (
            <div className="mt-2 flex justify-center">
              <div className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            </div>
          )}
          <div className="mt-3 overflow-x-auto no-scrollbar pointer-events-auto">
            <div className="flex gap-2 w-max px-1">
              {['All', ...trades].map(trade => (
                <button
                  key={trade}
                  onClick={() => {
                    setActiveTrade(trade);
                    setCurrentIndex(0);
                    if (containerRef.current) containerRef.current.scrollTop = 0;
                  }}
                  className={`shrink-0 rounded-full px-3.5 py-1.5 text-xs font-semibold backdrop-blur-md transition-colors ${
                    activeTrade === trade
                      ? 'bg-[#0066FF] text-white'
                      : 'bg-black/40 text-white/80 hover:bg-black/60'
                  }`}
                >
                  {trade}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {activeWorks.map((work, idx) => (
        <section
          key={work.id}
          className="h-screen w-full snap-start relative flex items-center justify-center overflow-hidden"
        >
          {/* Video Background */}
          <div className="absolute inset-0">
            <VideoPlayer
              src={work.video_url}
              poster={work.thumbnail_url || APP_CONFIG.defaults.thumbnail}
              className="w-full h-full object-cover"
              autoPlay={idx === currentIndex}
              loop
              muted={!soundOn}
            />
          </div>

          {/* Gradient Overlays */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/80 pointer-events-none" />

          {/* Top Header */}
          <div className="absolute top-4 left-4 right-4 flex items-center justify-between pointer-events-auto z-10">
            <button
              onClick={() => openProfile(work)}
              className="flex items-center gap-2 active:scale-95 transition-transform"
            >
              <div className="h-10 w-10 rounded-full bg-zinc-900/60 backdrop-blur-sm flex items-center justify-center text-sm font-bold text-white">
                {work.user_name?.charAt(0) || '?'}
              </div>
              <div className="text-left">
                <div className="flex items-center gap-1.5">
                  <span className="text-white font-semibold text-sm">{work.user_name}</span>
                  {work.verified && <SealCheck size={14} weight="fill" className="text-[#0066FF]" />}
                </div>
                <p className="text-white/70 text-xs">{work.trade}</p>
              </div>
            </button>
            <button
              onClick={() => setMenuFor(work)}
              aria-label="More options"
              className="flex h-9 w-9 items-center justify-center rounded-full bg-black/30 backdrop-blur-sm active:scale-90 transition-transform"
            >
              <DotsThree size={24} weight="bold" className="text-white" />
            </button>
          </div>

          {/* Right Side Actions */}
          <div className="absolute right-4 bottom-32 flex flex-col items-center gap-6 pointer-events-auto z-10">
            {/* Profile → message */}
            <button
              onClick={() => startConversation(creatorId(work))}
              className="relative group"
            >
              <div className="h-12 w-12 rounded-full border-2 border-white bg-zinc-800 flex items-center justify-center text-xs font-bold text-white">
                {work.user_name?.charAt(0) || '?'}
              </div>
              <div className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 h-6 w-6 rounded-full bg-[#FF0050] flex items-center justify-center">
                <PaperPlaneTilt size={12} weight="fill" className="text-white" />
              </div>
            </button>

            {/* Sound toggle */}
            <button
              onClick={() => setSoundOn(prev => !prev)}
              aria-label={soundOn ? 'Mute' : 'Unmute'}
              className="flex h-11 w-11 items-center justify-center rounded-full bg-black/30 backdrop-blur-sm active:scale-90 transition-transform"
            >
              {soundOn
                ? <SpeakerHigh size={22} weight="fill" className="text-white" />
                : <SpeakerSlash size={22} weight="fill" className="text-white/80" />}
            </button>

            {/* Like */}
            <button onClick={() => handleLike(work)} className="flex flex-col items-center gap-1">
              <Heart
                size={32}
                weight={work.liked_by_me ? "fill" : "regular"}
                className={`${work.liked_by_me ? 'text-red-500' : 'text-white'} transition-colors`}
              />
              <span className="text-white text-xs font-semibold">
                {(work.real_likes || work.likes_count || 0).toLocaleString()}
              </span>
            </button>

            {/* Comment */}
            <button
              onClick={() => void loadComments(work)}
              className="flex flex-col items-center gap-1 active:scale-90 transition-transform"
            >
              <ChatCircleDots size={32} weight="regular" className="text-white" />
              <span className="text-white text-xs font-semibold">
                {(work.real_comments || work.comments_count || 0).toLocaleString()}
              </span>
            </button>

            {/* Save */}
            <button onClick={() => handleSave(work)} className="flex flex-col items-center gap-1">
              <BookmarkSimple
                size={32}
                weight={work.saved_by_me ? "fill" : "regular"}
                className={`${work.saved_by_me ? 'text-yellow-400' : 'text-white'} transition-colors`}
              />
            </button>

            {/* Share */}
            <button onClick={() => handleShare(work)} className="flex flex-col items-center gap-1 active:scale-90 transition-transform">
              {shareFeedback === work.id ? (
                <Check size={32} weight="bold" className="text-emerald-400" />
              ) : (
                <ShareFat size={32} weight="regular" className="text-white" />
              )}
              {shareFeedback === work.id && (
                <span className="text-[10px] font-semibold text-emerald-400">Copied</span>
              )}
            </button>
          </div>

          {/* Bottom Content */}
          <div className="absolute left-4 bottom-10 right-20 pointer-events-none z-10">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-white font-semibold text-base">{work.handle || work.user_name}</span>
              {work.verified && <SealCheck size={16} weight="fill" className="text-[#0066FF]" />}
            </div>
            <p className="text-white text-sm font-normal leading-relaxed line-clamp-2">
              {work.description || 'Check out this amazing work!'}
            </p>
            <div className="mt-3 text-white/60 text-xs">
              #{work.trade.toLowerCase().replace(' ', '')} #workora #professional
            </div>
          </div>
        </section>
      ))}

      {/* ─── Share feedback toast ─── */}
      <AnimatePresence>
        {shareFeedback && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="absolute bottom-24 left-1/2 -translate-x-1/2 z-50 flex items-center gap-2 rounded-full bg-white/95 px-4 py-2 text-xs font-black text-zinc-900 shadow-2xl"
          >
            <Check size={14} weight="bold" className="text-emerald-500" />
            Link copied to clipboard
          </motion.div>
        )}
      </AnimatePresence>

      {/* ─── Comments sheet ─── */}
      <AnimatePresence>
        {commentsFor && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setCommentsFor(null)}
              className="fixed inset-0 z-[400] bg-black/70 backdrop-blur-sm"
            />
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', stiffness: 380, damping: 40 }}
              className="fixed bottom-0 left-0 right-0 z-[410] rounded-t-3xl bg-[#141821] border-t border-white/10 p-4 pb-8 safe-area-bottom flex flex-col max-h-[70vh]"
            >
              <div className="mx-auto mb-4 h-1 w-12 rounded-full bg-white/15" />
              <div className="mb-3 flex items-center justify-between px-2">
                <div>
                  <p className="text-sm font-black text-white">Comments</p>
                  <p className="text-xs text-white/40">{comments.length} total</p>
                </div>
                <button
                  onClick={() => setCommentsFor(null)}
                  className="flex h-9 w-9 items-center justify-center rounded-full bg-white/[0.06] text-white"
                >
                  <X size={18} weight="bold" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto px-2 space-y-4 mb-4">
                {comments.length > 0 ? comments.map(comment => (
                  <div key={comment.id} className="flex gap-3">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white/10 text-xs font-bold text-white">
                      {(comment.user_name || comment.username || '?').charAt(0).toUpperCase()}
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-white">
                        {comment.user_name || comment.username || 'Member'}
                      </p>
                      <p className="text-sm text-white/80">{comment.text}</p>
                    </div>
                  </div>
                )) : (
                  <div className="py-8 text-center">
                    <ChatCircleDots size={28} className="mx-auto mb-2 text-white/20" />
                    <p className="text-sm text-white/50">No comments yet — start the conversation.</p>
                  </div>
                )}
              </div>

              <div className="flex items-center gap-2 border-t border-white/10 pt-3">
                <input
                  value={commentValue}
                  onChange={(event) => setCommentValue(event.target.value)}
                  onKeyDown={(event) => { if (event.key === 'Enter') void postComment(); }}
                  placeholder="Add a comment"
                  className="h-11 flex-1 rounded-full bg-white/[0.08] px-4 text-sm text-white outline-none placeholder:text-white/40"
                />
                <button
                  onClick={() => void postComment()}
                  disabled={postingComment || !commentValue.trim()}
                  className="flex h-11 w-11 items-center justify-center rounded-full bg-[#0066FF] text-white disabled:opacity-40"
                >
                  {postingComment ? (
                    <ArrowClockwise size={18} weight="bold" className="animate-spin" />
                  ) : (
                    <PaperPlaneTilt size={18} weight="fill" />
                  )}
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* ─── Action sheet (⋯) ─── */}
      <AnimatePresence>
        {menuFor && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMenuFor(null)}
              className="fixed inset-0 z-[400] bg-black/70 backdrop-blur-sm"
            />
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', stiffness: 380, damping: 40 }}
              className="fixed bottom-0 left-0 right-0 z-[410] rounded-t-3xl bg-[#141821] border-t border-white/10 p-4 pb-8 safe-area-bottom"
            >
              <div className="mx-auto mb-4 h-1 w-12 rounded-full bg-white/15" />
              <p className="mb-2 px-2 text-xs font-black uppercase tracking-widest text-white/40">
                {menuFor.user_name} · {menuFor.trade}
              </p>
              {[
                { icon: LinkSimple, label: 'Copy link', action: () => handleShare(menuFor) },
                { icon: PaperPlaneTilt, label: 'Send message', action: () => startConversation(creatorId(menuFor)) },
                { icon: UserCircle, label: 'View profile', action: () => openProfile(menuFor) },
                { icon: WarningCircle, label: 'Report', action: () => reportWork(menuFor), danger: true },
              ].map((item) => (
                <button
                  key={item.label}
                  onClick={() => { item.action(); setMenuFor(null); }}
                  className={`flex w-full items-center gap-4 rounded-2xl px-4 py-3.5 text-left transition-colors ${
                    item.danger
                      ? 'text-red-400 hover:bg-red-500/10'
                      : 'text-white hover:bg-white/[0.06]'
                  }`}
                >
                  <item.icon size={20} weight="bold" />
                  <span className="text-sm font-bold">{item.label}</span>
                </button>
              ))}
              <button
                onClick={() => setMenuFor(null)}
                className="mt-2 w-full rounded-2xl bg-white/[0.06] py-3 text-sm font-black text-white/60 hover:text-white transition-colors"
              >
                Cancel
              </button>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
