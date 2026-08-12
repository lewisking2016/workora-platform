'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useRouter, useParams } from 'next/navigation';
import {
  ArrowLeft,
  Heart,
  ChatCircleDots,
  BookmarkSimple,
  ShareFat,
  DotsThree,
  SealCheck,
  Smiley,
  WarningCircle,
  LinkSimple,
  Check,
  UserCircle
} from '@phosphor-icons/react';
import { VideoPlayer } from '@/components/VideoPlayer';
import { fetchCurrentUser, apiFetch } from '@/lib/session';
import { APP_CONFIG } from '@/lib/config';
import { motion, AnimatePresence } from 'framer-motion';

interface Post {
  id: string;
  user_id: string;
  worker_id: string;
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
  real_likes?: number;
  real_comments?: number;
}

interface Comment {
  id: string;
  user_id: string;
  username: string;
  text: string;
  created_at: string;
  role?: string;
}

interface User {
  id: string;
  username: string;
  role: string;
}

export default function PostDetailPage() {
  const router = useRouter();
  const params = useParams();
  const postId = params?.id as string;
  
  const [post, setPost] = useState<Post | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState('');
  const [loading, setLoading] = useState(true);
  const [loadState, setLoadState] = useState<'loading' | 'ready' | 'missing' | 'restricted' | 'error'>('loading');
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [sheetOpen, setSheetOpen] = useState(false);
  const [emojiOpen, setEmojiOpen] = useState(false);
  const [shareCopied, setShareCopied] = useState(false);
  const commentInputRef = useRef<HTMLInputElement>(null);
  const commentsEndRef = useRef<HTMLDivElement>(null);

  const EMOJIS = ['👍', '❤️', '🔥', '👏', '😍', '😂', '🙌', '💯', '🎉', '😮', '🙏', '⭐'];

  const fetchPost = async (): Promise<'ready' | 'missing' | 'restricted' | 'error'> => {
    try {
      const res = await apiFetch(`/api/gigs/${postId}`);
      if (res.status === 404) {
        setLoadState('missing');
        setPost(null);
        return 'missing';
      }
      if (res.status === 403) {
        setLoadState('restricted');
        setPost(null);
        return 'restricted';
      }
      if (!res.ok) {
        setLoadState('error');
        setPost(null);
        return 'error';
      }

      const data = await res.json();
      if (data && !data.message) {
        setPost(data);
        setLoadState('ready');
        return 'ready';
      } else {
        setLoadState('missing');
        return 'missing';
      }
    } catch (err) {
      console.error('Post fetch failed:', err);
      setLoadState('error');
      return 'error';
    }
  };

  const fetchComments = async () => {
    try {
      const res = await apiFetch(`/api/gigs/${postId}/comments`);
      const data = await res.json();
      if (Array.isArray(data)) {
        setComments(data);
      }
    } catch (err) {
      console.error('Comments fetch failed:', err);
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
        router.push('/login');
        return;
      }
      setCurrentUser(user);
      const state = await fetchPost();
      if (state === 'ready') {
        await fetchComments();
      } else {
        setLoading(false);
      }
    };
    bootstrap();
    return () => { mounted = false; };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [postId, router]);

  const handleLike = async () => {
    if (!currentUser || !post) return;
    try {
      const res = await apiFetch(`/api/gigs/${post.id}/like`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user_id: currentUser.id })
      });
      const data = await res.json();
      setPost({
        ...post,
        likes_count: data.liked ? post.likes_count + 1 : post.likes_count - 1,
        liked_by_me: data.liked
      });
    } catch (err) {
      console.error(err);
    }
  };

  const handleSave = async () => {
    if (!currentUser || !post) return;
    try {
      const res = await apiFetch(`/api/gigs/${post.id}/save`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      });
      const data = await res.json();
      setPost({ ...post, saved_by_me: data.saved });
    } catch (err) {
      console.error(err);
    }
  };

  const handleShare = async () => {
    if (!post) return;
    const url = `${window.location.origin}/dashboard/post/${post.id}`;
    const text = `Check out ${post.user_name} on Workora — ${post.description || 'amazing work!'}`;
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
        setShareCopied(true);
        setTimeout(() => setShareCopied(false), 1600);
      } catch {
        window.open(`https://wa.me/?text=${encodeURIComponent(`${text} ${url}`)}`, '_blank');
      }
    }
  };

  const reportPost = async () => {
    if (!post) return;
    try {
      await apiFetch(`/api/gigs/${post.id}/report`, { method: 'POST' });
    } catch { /* silent */ }
    setSheetOpen(false);
  };

  const replyTo = (username: string) => {
    setNewComment(`@${username} `);
    setEmojiOpen(false);
    commentInputRef.current?.focus();
  };

  const handleAddComment = async () => {
    if (!newComment.trim() || !currentUser || !post || submitting) return;
    
    setSubmitting(true);
    try {
      const res = await apiFetch(`/api/gigs/${post.id}/comment`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user_id: currentUser.id, text: newComment })
      });
      const data = await res.json();
      
      const newCommentObj: Comment = {
        id: data.id,
        user_id: currentUser.id,
        username: currentUser.username,
        text: newComment,
        created_at: new Date().toISOString(),
        role: currentUser.role
      };
      
      setComments(prev => [...prev, newCommentObj]);
      setPost({ ...post, comments_count: post.comments_count + 1 });
      setNewComment('');
      
      // Scroll to bottom
      setTimeout(() => commentsEndRef.current?.scrollIntoView({ behavior: 'smooth' }), 100);
    } catch (err) {
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  const timeAgo = (d: string) => {
    const diff = Date.now() - new Date(d).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 1) return 'just now';
    if (mins < 60) return `${mins}m ago`;
    const hrs = Math.floor(mins / 60);
    if (hrs < 24) return `${hrs}h ago`;
    const days = Math.floor(hrs / 24);
    if (days < 7) return `${days}d ago`;
    return new Date(d).toLocaleDateString();
  };

  if (loading || loadState === 'loading') {
    return (
      <div className="h-full w-full bg-white dark:bg-black flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-zinc-200 dark:border-zinc-800 border-t-[#0066FF] rounded-full animate-spin" />
      </div>
    );
  }

  if (loadState === 'missing' || loadState === 'restricted' || loadState === 'error' || !post) {
    const effectiveState = loadState;
    const stateCopy = {
      missing: {
        title: 'Content removed',
        body: 'This post is no longer available on the platform.',
      },
      restricted: {
        title: 'Content restricted',
        body: 'You do not have permission to view this post.',
      },
      error: {
        title: 'Unable to load post',
        body: 'We could not load this post right now.',
      },
    }[effectiveState as 'missing' | 'restricted' | 'error'];

    return (
      <div className="min-h-full w-full bg-white dark:bg-black flex items-center justify-center px-4">
        <div className="w-full max-w-md rounded-3xl bg-zinc-50 p-8 text-center dark:bg-zinc-950">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-zinc-100 dark:bg-zinc-900">
            <WarningCircle size={28} weight="fill" className="text-[#4F46E5]" />
          </div>
          <h1 className="text-2xl font-black text-zinc-950 dark:text-white">{stateCopy.title}</h1>
          <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-400">{stateCopy.body}</p>
          <div className="mt-6 flex flex-col gap-3 sm:flex-row">
            <button
              onClick={() => router.back()}
              className="flex-1 rounded-xl bg-zinc-950 px-4 py-3 text-sm font-semibold text-white dark:bg-white dark:text-zinc-950"
            >
              Go back
            </button>
            <button
              onClick={() => router.push('/dashboard/feed')}
              className="flex-1 rounded-xl bg-zinc-100 px-4 py-3 text-sm font-semibold text-zinc-800 dark:bg-zinc-900 dark:text-zinc-200"
            >
              Open feed
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full w-full flex flex-col bg-white dark:bg-black">
      {/* Header */}
      <div className="sticky top-0 z-50 bg-white dark:bg-black border-b border-zinc-100 dark:border-zinc-900 px-4 py-3 flex items-center gap-3">
        <button onClick={() => router.back()}>
          <ArrowLeft size={28} weight="regular" className="text-zinc-950 dark:text-white" />
        </button>
        <div className="flex-1 flex items-center gap-2">
          <div className="h-8 w-8 rounded-full bg-zinc-100 dark:bg-zinc-900 flex items-center justify-center text-xs font-bold text-zinc-950 dark:text-white uppercase">
            {post.user_name?.charAt(0) || '?'}
          </div>
          <div>
            <div className="flex items-center gap-1">
              <span className="text-sm font-semibold text-zinc-950 dark:text-white">
                {post.user_name}
              </span>
              {post.verified && <SealCheck size={14} weight="fill" className="text-[#0066FF]" />}
            </div>
            <p className="text-xs text-zinc-500">{post.trade}</p>
          </div>
        </div>
          <button onClick={() => setSheetOpen(true)} aria-label="More options">
            <DotsThree size={24} weight="bold" className="text-zinc-950 dark:text-white" />
          </button>
        </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto">
        {/* Media */}
        <div className="w-full aspect-square bg-black">
          <VideoPlayer 
            src={post.video_url}
            poster={post.thumbnail_url || APP_CONFIG.defaults.thumbnail}
            className="w-full h-full object-cover"
            autoPlay
            loop
            muted
          />
        </div>

        {/* Actions Bar */}
        <div className="px-4 py-3 border-b border-zinc-100 dark:border-zinc-900">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-4">
            <button onClick={handleLike}>
            <Heart
                size={28}
                weight={post.liked_by_me ? "fill" : "regular"}
                className={`${post.liked_by_me ? 'text-red-500' : 'text-zinc-950 dark:text-white'} transition-colors`}
              />
              </button>
              <button onClick={() => commentInputRef.current?.focus()}>
                <ChatCircleDots size={28} weight="regular" className="text-zinc-950 dark:text-white" />
              </button>
              <button onClick={handleShare} aria-label="Share">
                {shareCopied ? (
                  <Check size={28} weight="bold" className="text-emerald-500" />
                ) : (
                  <ShareFat size={28} weight="regular" className="text-zinc-950 dark:text-white" />
                )}
              </button>
            </div>
            <button onClick={handleSave}>
              <BookmarkSimple 
                size={28} 
                weight={post.saved_by_me ? "fill" : "regular"}
                className="text-zinc-950 dark:text-white"
              />
            </button>
          </div>

          {/* Likes */}
          <p className="text-sm font-semibold text-zinc-950 dark:text-white mb-2">
            {(post.real_likes || post.likes_count || 0).toLocaleString()} likes
          </p>

          {/* Caption */}
          {post.description && (
            <p className="text-sm text-zinc-950 dark:text-white">
              <span className="font-semibold mr-2">{post.handle || post.user_name}</span>
              <span>{post.description}</span>
            </p>
          )}

          {/* Time */}
          <p className="text-xs text-zinc-400 mt-2 uppercase">
            {timeAgo(post.created_at)}
          </p>
        </div>

        {/* Comments Section */}
        <div className="px-4 py-3 space-y-4">
          <h3 className="text-sm font-semibold text-zinc-950 dark:text-white">
            Comments ({comments.length})
          </h3>
          
          <AnimatePresence>
            {comments.map((comment, idx) => (
              <motion.div 
                key={comment.id || idx}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="flex gap-3"
              >
                <div className="h-9 w-9 rounded-full bg-zinc-100 dark:bg-zinc-900 flex items-center justify-center text-xs font-bold text-zinc-950 dark:text-white uppercase shrink-0">
                  {comment.username?.charAt(0) || '?'}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-baseline gap-2">
                    <span className="text-sm font-semibold text-zinc-950 dark:text-white">
                      {comment.username}
                    </span>
                    <span className="text-xs text-zinc-400">{timeAgo(comment.created_at)}</span>
                  </div>
                  <p className="text-sm text-zinc-950 dark:text-white mt-1">{comment.text}</p>
                  
                  {/* Comment Actions */}
                  <div className="flex items-center gap-4 mt-2">
                    <button
                      onClick={() => replyTo(comment.username)}
                      className="text-xs font-semibold text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300"
                    >
                      Reply
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          {comments.length === 0 && (
            <div className="py-8 text-center">
              <ChatCircleDots size={48} weight="duotone" className="text-zinc-200 dark:text-zinc-800 mx-auto mb-3" />
              <p className="text-sm text-zinc-500 dark:text-zinc-400">No comments yet</p>
              <p className="text-xs text-zinc-400 dark:text-zinc-500 mt-1">Be the first to comment</p>
            </div>
          )}
          
          <div ref={commentsEndRef} />
        </div>
      </div>

      {/* Comment Input */}
      <div className="sticky bottom-[68px] lg:bottom-0 bg-white/95 dark:bg-black/95 backdrop-blur-xl border-t border-zinc-100 dark:border-zinc-900 px-4 py-3">
        <div className="flex items-center gap-3">
          <div className="h-9 w-9 rounded-full bg-zinc-100 dark:bg-zinc-900 flex items-center justify-center text-xs font-bold text-zinc-950 dark:text-white uppercase shrink-0">
            {currentUser?.username?.charAt(0) || 'U'}
          </div>
          <input
            ref={commentInputRef}
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleAddComment()}
            placeholder="Add a comment..."
            className="flex-1 bg-transparent outline-none text-sm text-zinc-950 dark:text-white placeholder:text-zinc-400"
            disabled={submitting}
          />
          <div className="relative">
            <button
              onClick={() => setEmojiOpen((v) => !v)}
              aria-label="Add emoji"
              className="text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300"
            >
              <Smiley size={24} />
            </button>
            <AnimatePresence>
              {emojiOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 8, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 8, scale: 0.95 }}
                  className="absolute bottom-12 left-0 z-50 grid w-[216px] grid-cols-6 gap-1 rounded-2xl border border-zinc-100 bg-white p-2.5 shadow-2xl dark:border-zinc-800 dark:bg-zinc-900"
                >
                  {EMOJIS.map((emoji) => (
                    <button
                      key={emoji}
                      onClick={() => {
                        setNewComment((v) => v + emoji);
                        commentInputRef.current?.focus();
                      }}
                      className="flex h-8 w-8 items-center justify-center rounded-lg text-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
                    >
                      {emoji}
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
          {newComment.trim() && (
            <button 
              onClick={handleAddComment}
              disabled={submitting}
              className="text-[#0066FF] font-semibold text-sm disabled:opacity-50"
            >
              Post
            </button>
          )}
        </div>
      </div>

      {/* ─── Action sheet (⋯) ─── */}
      <AnimatePresence>
        {sheetOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSheetOpen(false)}
              className="fixed inset-0 z-[400] bg-black/60 backdrop-blur-sm"
            />
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', stiffness: 380, damping: 40 }}
              className="fixed bottom-0 left-0 right-0 z-[410] rounded-t-3xl bg-white border-t border-zinc-100 p-4 pb-8 dark:bg-zinc-950 dark:border-zinc-800 safe-area-bottom"
            >
              <div className="mx-auto mb-4 h-1 w-12 rounded-full bg-zinc-200 dark:bg-zinc-800" />
              <p className="mb-2 px-2 text-xs font-black uppercase tracking-widest text-zinc-400">
                {post.user_name}
              </p>
              {[
                { icon: LinkSimple, label: 'Copy link', action: handleShare },
                { icon: UserCircle, label: 'View profile', action: () => router.push(`/profile/${post.user_id || post.worker_id}`) },
                { icon: WarningCircle, label: 'Report', action: reportPost, danger: true },
              ].map((item) => (
                <button
                  key={item.label}
                  onClick={() => { item.action(); setSheetOpen(false); }}
                  className={`flex w-full items-center gap-4 rounded-2xl px-4 py-3.5 text-left transition-colors ${
                    item.danger
                      ? 'text-red-500 hover:bg-red-500/10'
                      : 'text-zinc-900 hover:bg-zinc-100 dark:text-white dark:hover:bg-zinc-900'
                  }`}
                >
                  <item.icon size={20} weight="bold" />
                  <span className="text-sm font-bold">{item.label}</span>
                </button>
              ))}
              <button
                onClick={() => setSheetOpen(false)}
                className="mt-2 w-full rounded-2xl bg-zinc-100 py-3 text-sm font-black text-zinc-500 hover:text-zinc-800 transition-colors dark:bg-zinc-900 dark:text-zinc-400 dark:hover:text-white"
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
