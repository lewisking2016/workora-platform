'use client';

import React, { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { AnimatePresence, motion } from 'framer-motion';
import {
  ArrowLeft,
  BookmarkSimple,
  ChatCircleDots,
  Check,
  Copy,
  DotsThree,
  Heart,
  Link as LinkIcon,
  PaperPlaneTilt,
  Pause,
  Play,
  SpeakerHigh,
  SpeakerSlash,
  Star,
  WarningCircle,
  WhatsappLogo,
  TwitterLogo,
  X,
} from '@phosphor-icons/react';
import { VideoPlayer } from '@/components/VideoPlayer';
import { apiFetch, fetchCurrentUser } from '@/lib/session';
import { APP_CONFIG } from '@/lib/config';

type ViewerMode = 'story' | 'reel';

interface ShortVideoItem {
  id: string;
  user_id: string;
  creator_user_id?: string;
  worker_id?: string;
  user_name: string;
  handle: string;
  trade: string;
  verified: boolean;
  description: string;
  likes_count: number;
  comments_count: number;
  view_count: number;
  video_url: string;
  thumbnail_url: string;
  created_at: string;
  liked_by_me?: boolean;
  saved_by_me?: boolean;
  following_by_me?: boolean;
}

interface Comment {
  id: string;
  username: string;
  text: string;
  created_at: string;
}

interface LikeRow {
  id: string;
  username: string;
  trade: string;
  verified: boolean;
  created_at: string;
}

interface ShortVideoViewerProps {
  mode: ViewerMode;
  creatorId?: string;
}

const REASON_TEXT = {
  story: {
    title: 'Story viewer',
    emptyTitle: 'Story expired',
    emptyBody: 'We could not find a recent post for this creator.',
  },
  reel: {
    title: 'Reels',
    emptyTitle: 'No reels yet',
    emptyBody: 'This feed has no reels to show right now.',
  },
} as const;

const formatCount = (value?: number) => (value || 0).toLocaleString();

export default function ShortVideoViewer({ mode, creatorId }: ShortVideoViewerProps) {
  const router = useRouter();
  const [currentUser, setCurrentUser] = useState<{ id: string; username: string; role: string } | null>(null);
  const [items, setItems] = useState<ShortVideoItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadState, setLoadState] = useState<'ready' | 'empty' | 'error'>('ready');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const [muted, setMuted] = useState(true);
  const [captionExpanded, setCaptionExpanded] = useState(false);
  const [showComments, setShowComments] = useState(false);
  const [showLikes, setShowLikes] = useState(false);
  const [showShare, setShowShare] = useState(false);
  const [comments, setComments] = useState<Comment[]>([]);
  const [likes, setLikes] = useState<LikeRow[]>([]);
  const [reply, setReply] = useState('');
  const [shareCopied, setShareCopied] = useState(false);
  const [saveToast, setSaveToast] = useState(false);
  const [busy, setBusy] = useState(false);
  const [completion, setCompletion] = useState(false);

  const currentItem = items[currentIndex] || null;

  const loadItems = async () => {
    setLoading(true);
    setLoadState('ready');
    try {
      if (mode === 'story') {
        const storiesRes = await fetch('/api/gigs/stories');
        const stories = await storiesRes.json();
        const story = Array.isArray(stories) ? stories.find((entry: any) => String(entry.id) === String(creatorId)) : null;

        if (!story?.worker_id) {
          setItems([]);
          setLoadState('empty');
          return;
        }

        const postsRes = await fetch(`/api/gigs/worker/${story.worker_id}`);
        const posts = await postsRes.json();
        const nextItems = Array.isArray(posts) ? posts : [];
        setItems(nextItems);
        setLoadState(nextItems.length > 0 ? 'ready' : 'empty');
      } else {
        const res = await fetch('/api/gigs/feed?scope=reels&limit=20');
        const data = await res.json();
        const nextItems = Array.isArray(data) ? data : [];
        setItems(nextItems);
        setLoadState(nextItems.length > 0 ? 'ready' : 'empty');
      }
    } catch (error) {
      console.error(error);
      setLoadState('error');
      setItems([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let mounted = true;
    const bootstrap = async () => {
      const user = await fetchCurrentUser();
      if (!mounted) return;
      setCurrentUser(user);
      await loadItems();
    };
    bootstrap();
    return () => {
      mounted = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mode, creatorId]);

  useEffect(() => {
    setCaptionExpanded(false);
    setShowComments(false);
    setShowLikes(false);
    setShowShare(false);
    setReply('');
    setComments([]);
    setLikes([]);
    setPaused(false);
  }, [currentIndex]);

  useEffect(() => {
    if (mode !== 'story' || !currentItem || paused) return;
    const timer = window.setTimeout(() => {
      if (currentIndex >= items.length - 1) {
        setCompletion(true);
      } else {
        setCurrentIndex(index => index + 1);
      }
    }, 7000);

    return () => window.clearTimeout(timer);
  }, [mode, currentItem, currentIndex, items.length, paused]);

  const toggleLike = async () => {
    if (!currentItem || !currentUser) return router.push('/login');
    setBusy(true);
    try {
      const res = await apiFetch(`/api/gigs/${currentItem.id}/like`, { method: 'POST' });
      const data = await res.json();
      setItems(prev => prev.map(item => item.id === currentItem.id ? {
        ...item,
        liked_by_me: data.liked,
        likes_count: data.liked ? item.likes_count + 1 : Math.max(0, item.likes_count - 1),
      } : item));
    } finally {
      setBusy(false);
    }
  };

  const toggleSave = async () => {
    if (!currentItem || !currentUser) return router.push('/login');
    setBusy(true);
    try {
      const res = await apiFetch(`/api/gigs/${currentItem.id}/save`, { method: 'POST' });
      const data = await res.json();
      setItems(prev => prev.map(item => item.id === currentItem.id ? { ...item, saved_by_me: data.saved } : item));
      setSaveToast(true);
      window.setTimeout(() => setSaveToast(false), 1600);
    } finally {
      setBusy(false);
    }
  };

  const loadComments = async () => {
    if (!currentItem) return;
    const res = await apiFetch(`/api/gigs/${currentItem.id}/comments`);
    const data = await res.json();
    setComments(Array.isArray(data) ? data : []);
    setShowComments(true);
  };

  const loadLikes = async () => {
    if (!currentItem) return;
    const res = await apiFetch(`/api/gigs/${currentItem.id}/likes`);
    const data = await res.json();
    setLikes(Array.isArray(data) ? data : []);
    setShowLikes(true);
  };

  const sendReply = async () => {
    if (!currentItem || !reply.trim()) return;
    if (!currentUser) return router.push('/login');

    setBusy(true);
    try {
      await apiFetch(`/api/gigs/${currentItem.id}/comment`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: reply }),
      });
      setReply('');
      await loadComments();
    } finally {
      setBusy(false);
    }
  };

  const shareUrl = useMemo(() => {
    if (!currentItem || typeof window === 'undefined') return '';
    return `${window.location.origin}/dashboard/post/${currentItem.id}`;
  }, [currentItem]);

  const copyShare = async () => {
    if (!shareUrl) return;
    await navigator.clipboard.writeText(shareUrl);
    setShareCopied(true);
    window.setTimeout(() => setShareCopied(false), 1500);
  };

  const finishViewer = () => {
    if (mode === 'story') {
      setCompletion(true);
      return;
    }

    if (currentIndex >= items.length - 1) {
      setCurrentIndex(0);
      return;
    }

    setCurrentIndex(index => index + 1);
  };

  if (loading) {
    return (
      <div className="min-h-full bg-black flex items-center justify-center text-white">
        <div className="h-12 w-12 rounded-full border-4 border-white/20 border-t-white animate-spin" />
      </div>
    );
  }

  if (loadState === 'empty' || loadState === 'error' || !currentItem) {
    const copy = loadState === 'error'
      ? {
          title: 'Unable to load short video',
          body: 'We could not fetch this live feed right now.',
        }
      : {
          title: REASON_TEXT[mode].emptyTitle,
          body: REASON_TEXT[mode].emptyBody,
        };

    return (
      <div className="min-h-full bg-black text-white flex items-center justify-center px-4">
        <div className="w-full max-w-md rounded-[24px] bg-zinc-950 p-8 text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-white/5">
            <WarningCircle size={28} weight="fill" className="text-[#0066FF]" />
          </div>
          <h1 className="text-2xl font-black">{copy.title}</h1>
          <p className="mt-2 text-sm text-white/70">{copy.body}</p>
          <div className="mt-6 flex gap-3">
            <button
              onClick={() => router.back()}
              className="flex-1 rounded-xl bg-white px-4 py-3 text-sm font-semibold text-zinc-950"
            >
              Go back
            </button>
            <button
              onClick={loadItems}
              className="flex-1 rounded-xl bg-white/10 px-4 py-3 text-sm font-semibold text-white"
            >
              Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (completion && mode === 'story') {
    return (
      <div className="min-h-full bg-black text-white flex items-center justify-center px-4">
        <div className="w-full max-w-md rounded-[24px] bg-zinc-950 p-8 text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-white/5">
            <Check size={28} weight="bold" className="text-[#0066FF]" />
          </div>
          <h1 className="text-2xl font-black">Story complete</h1>
          <p className="mt-2 text-sm text-white/70">You reached the end of this creator&apos;s recent stories.</p>
          <div className="mt-6 flex gap-3">
            <button
              onClick={() => router.push('/dashboard/feed')}
              className="flex-1 rounded-xl bg-white px-4 py-3 text-sm font-semibold text-zinc-950"
            >
              Back to feed
            </button>
            <button
              onClick={() => {
                setCompletion(false);
                setCurrentIndex(0);
              }}
              className="flex-1 rounded-xl bg-white/10 px-4 py-3 text-sm font-semibold text-white"
            >
              Replay
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-full bg-black text-white">
      <div className="relative mx-auto flex min-h-full w-full max-w-[560px] flex-col bg-black">
        <div className="absolute left-0 right-0 top-0 z-20 px-3 pt-3">
          <div className="flex gap-1">
            {items.map((item, index) => (
              <button
                key={item.id}
                onClick={() => setCurrentIndex(index)}
                className="h-1 flex-1 overflow-hidden rounded-full bg-white/20"
                aria-label={`Open item ${index + 1}`}
              >
                <span
                  className={`block h-full rounded-full bg-white transition-all ${
                    index < currentIndex ? 'w-full' : index === currentIndex ? 'w-1/2' : 'w-0'
                  }`}
                />
              </button>
            ))}
          </div>
          <div className="mt-3 flex items-center justify-between rounded-[20px] bg-black/35 px-3 py-2 backdrop-blur-xl">
            <button onClick={() => router.back()} className="rounded-xl bg-white/10 p-2">
              <ArrowLeft size={20} weight="bold" />
            </button>
            <div className="min-w-0 text-center">
              <p className="truncate text-sm font-semibold">{currentItem.user_name}</p>
              <p className="truncate text-[11px] text-white/60">{currentItem.trade}</p>
            </div>
            <button onClick={() => setPaused(value => !value)} className="rounded-xl bg-white/10 p-2">
              {paused ? <Play size={20} weight="fill" /> : <Pause size={20} weight="fill" />}
            </button>
          </div>
        </div>

        <div className="relative flex-1 bg-black">
          <VideoPlayer
            key={currentItem.id}
            src={currentItem.video_url}
            poster={currentItem.thumbnail_url || APP_CONFIG.defaults.thumbnail}
            className="h-screen w-full object-cover"
            autoPlay
            loop={mode === 'reel'}
            muted={muted}
            paused={paused}
            onEnded={finishViewer}
          />

          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />

          <div className="absolute inset-x-0 bottom-0 z-10 flex items-end justify-between gap-4 p-4 sm:p-6">
            <div className="max-w-[72%]">
              <button
                onClick={() => setCaptionExpanded(value => !value)}
                className="mb-3 inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-2 text-xs font-semibold text-white backdrop-blur-xl"
              >
                <DotsThree size={16} weight="bold" />
                {captionExpanded ? 'Collapse caption' : 'Expand caption'}
              </button>
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-xs text-white/70">
                  <span>{formatCount(currentItem.view_count)} views</span>
                  <span>•</span>
                  <span>{currentItem.trade}</span>
                </div>
                <p className={`text-sm leading-6 text-white ${captionExpanded ? '' : 'line-clamp-3'}`}>
                  <span className="font-semibold">{currentItem.user_name}</span>
                  <span className="ml-2 font-normal text-white/85">{currentItem.description}</span>
                </p>
              </div>
            </div>

            <div className="flex flex-col items-center gap-3">
              <button
                onClick={toggleLike}
                disabled={busy}
                className="flex h-12 w-12 items-center justify-center rounded-full bg-white/10 backdrop-blur-xl"
              >
                <Heart size={22} weight={currentItem.liked_by_me ? 'fill' : 'regular'} className={currentItem.liked_by_me ? 'text-[#0066FF]' : 'text-white'} />
              </button>
              <button onClick={loadComments} className="flex h-12 w-12 items-center justify-center rounded-full bg-white/10 backdrop-blur-xl">
                <ChatCircleDots size={22} className="text-white" />
              </button>
              <button onClick={loadLikes} className="flex h-12 w-12 items-center justify-center rounded-full bg-white/10 backdrop-blur-xl">
                <Star size={22} weight="fill" className="text-amber-400" />
              </button>
              <button onClick={() => setShowShare(true)} className="flex h-12 w-12 items-center justify-center rounded-full bg-white/10 backdrop-blur-xl">
                <LinkIcon size={22} className="text-white" />
              </button>
              <button onClick={toggleSave} className="flex h-12 w-12 items-center justify-center rounded-full bg-white/10 backdrop-blur-xl">
                <BookmarkSimple size={22} weight={currentItem.saved_by_me ? 'fill' : 'regular'} className={currentItem.saved_by_me ? 'text-[#0066FF]' : 'text-white'} />
              </button>
              <button onClick={() => setMuted(value => !value)} className="flex h-12 w-12 items-center justify-center rounded-full bg-white/10 backdrop-blur-xl">
                {muted ? <SpeakerSlash size={22} className="text-white" /> : <SpeakerHigh size={22} className="text-white" />}
              </button>
            </div>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {showComments && (
          <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/60 p-3 backdrop-blur-md sm:items-center">
            <motion.div
              initial={{ y: 100, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 100, opacity: 0 }}
              className="w-full max-w-lg rounded-[24px] bg-white text-zinc-950 shadow-2xl dark:bg-zinc-950 dark:text-white"
            >
              <div className="flex items-center justify-between border-b border-zinc-100 px-5 py-4 dark:border-zinc-900">
                <div>
                  <h3 className="text-lg font-black">Comments</h3>
                  <p className="text-xs text-zinc-500 dark:text-zinc-400">{formatCount(currentItem?.comments_count)} total</p>
                </div>
                <button onClick={() => setShowComments(false)} className="rounded-xl bg-zinc-100 p-2 dark:bg-zinc-900">
                  <X size={18} weight="bold" />
                </button>
              </div>
              <div className="max-h-[50vh] overflow-y-auto px-5 py-4">
                {comments.length > 0 ? comments.map(comment => (
                  <div key={comment.id} className="mb-4 flex gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-zinc-100 text-sm font-black dark:bg-zinc-900">
                      {comment.username.charAt(0)}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="text-sm font-semibold">{comment.username}</p>
                        <span className="text-xs text-zinc-400">{comment.created_at ? new Date(comment.created_at).toLocaleDateString() : ''}</span>
                      </div>
                      <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-300">{comment.text}</p>
                    </div>
                  </div>
                )) : (
                  <p className="py-10 text-center text-sm text-zinc-500 dark:text-zinc-400">No comments yet.</p>
                )}
              </div>
              <div className="border-t border-zinc-100 px-4 py-4 dark:border-zinc-900">
                <div className="flex items-center gap-3">
                  <input
                    value={reply}
                    onChange={(event) => setReply(event.target.value)}
                    onKeyDown={(event) => event.key === 'Enter' && sendReply()}
                    placeholder="Add a comment"
                    className="h-12 flex-1 rounded-xl bg-zinc-100 px-4 text-sm outline-none placeholder:text-zinc-400 dark:bg-zinc-900 dark:text-white"
                  />
                  <button onClick={sendReply} className="inline-flex h-12 items-center justify-center rounded-xl bg-[#0057FF] px-4 text-white">
                    <PaperPlaneTilt size={18} weight="fill" />
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showLikes && (
          <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/60 p-3 backdrop-blur-md sm:items-center">
            <motion.div
              initial={{ y: 100, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 100, opacity: 0 }}
              className="w-full max-w-lg rounded-[24px] bg-white text-zinc-950 shadow-2xl dark:bg-zinc-950 dark:text-white"
            >
              <div className="flex items-center justify-between border-b border-zinc-100 px-5 py-4 dark:border-zinc-900">
                <h3 className="text-lg font-black">Likes</h3>
                <button onClick={() => setShowLikes(false)} className="rounded-xl bg-zinc-100 p-2 dark:bg-zinc-900">
                  <X size={18} weight="bold" />
                </button>
              </div>
              <div className="max-h-[50vh] overflow-y-auto px-5 py-4">
                {likes.length > 0 ? likes.map(like => (
                  <div key={like.id} className="mb-3 flex items-center justify-between rounded-2xl bg-zinc-50 px-4 py-3 dark:bg-zinc-900">
                    <div>
                      <p className="text-sm font-semibold">{like.username}</p>
                      <p className="text-xs text-zinc-500 dark:text-zinc-400">{like.trade}</p>
                    </div>
                    {like.verified && <Check size={16} weight="bold" className="text-[#0066FF]" />}
                  </div>
                )) : (
                  <p className="py-10 text-center text-sm text-zinc-500 dark:text-zinc-400">No likes yet.</p>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showShare && (
          <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/60 p-3 backdrop-blur-md sm:items-center">
            <motion.div
              initial={{ y: 100, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 100, opacity: 0 }}
              className="w-full max-w-md rounded-[24px] bg-white p-5 text-zinc-950 shadow-2xl dark:bg-zinc-950 dark:text-white"
            >
              <div className="mb-4 flex items-center justify-between">
                <h3 className="text-lg font-black">Share</h3>
                <button onClick={() => setShowShare(false)} className="rounded-xl bg-zinc-100 p-2 dark:bg-zinc-900">
                  <X size={18} weight="bold" />
                </button>
              </div>
              <div className="grid grid-cols-4 gap-3">
                <a href={`https://wa.me/?text=${encodeURIComponent(shareUrl)}`} target="_blank" rel="noreferrer" className="flex flex-col items-center gap-2">
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-green-50 text-green-600">
                    <WhatsappLogo size={28} weight="fill" />
                  </div>
                  <span className="text-[10px] font-semibold text-zinc-500">WhatsApp</span>
                </a>
                <a href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(shareUrl)}`} target="_blank" rel="noreferrer" className="flex flex-col items-center gap-2">
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-sky-50 text-sky-500">
                    <TwitterLogo size={28} weight="fill" />
                  </div>
                  <span className="text-[10px] font-semibold text-zinc-500">X</span>
                </a>
                <button onClick={copyShare} className="flex flex-col items-center gap-2">
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-zinc-100 dark:bg-zinc-900">
                    {shareCopied ? <Check size={24} weight="bold" /> : <Copy size={24} weight="fill" />}
                  </div>
                  <span className="text-[10px] font-semibold text-zinc-500">{shareCopied ? 'Copied' : 'Copy'}</span>
                </button>
                <button onClick={() => window.open(shareUrl, '_blank')} className="flex flex-col items-center gap-2">
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-violet-50 text-violet-600">
                    <LinkIcon size={28} weight="fill" />
                  </div>
                  <span className="text-[10px] font-semibold text-zinc-500">Open</span>
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {saveToast && (
          <div className="fixed inset-x-0 bottom-6 z-[60] flex justify-center px-4">
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 12 }}
              className="rounded-full bg-white px-4 py-3 text-sm font-semibold text-zinc-950 shadow-2xl dark:bg-zinc-950 dark:text-white"
            >
              Saved to your collection
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
