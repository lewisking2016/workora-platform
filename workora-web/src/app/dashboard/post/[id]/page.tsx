'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useRouter, useParams } from 'next/navigation';
import {
  ArrowLeft,
  Heart,
  ChatCircleDots,
  PaperPlaneTilt,
  BookmarkSimple,
  ShareFat,
  DotsThree,
  SealCheck,
  Smiley
} from '@phosphor-icons/react';
import { VideoPlayer } from '@/components/VideoPlayer';
import { fetchCurrentUser } from '@/lib/session';
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
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const commentInputRef = useRef<HTMLInputElement>(null);
  const commentsEndRef = useRef<HTMLDivElement>(null);

  const fetchPost = async () => {
    try {
      // Fetch from feed and find the post
      const res = await fetch('/api/gigs/feed?page=1&limit=100');
      const data = await res.json();
      if (Array.isArray(data)) {
        const foundPost = data.find((p: Post) => p.id === postId);
        if (foundPost) {
          setPost(foundPost);
        }
      }
    } catch (err) {
      console.error('Post fetch failed:', err);
    }
  };

  const fetchComments = async () => {
    try {
      const res = await fetch(`/api/gigs/${postId}/comments`);
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
      await fetchPost();
      await fetchComments();
    };
    bootstrap();
    return () => { mounted = false; };
  }, [postId, router]);

  const handleLike = async () => {
    if (!currentUser || !post) return;
    try {
      const res = await fetch(`/api/gigs/${post.id}/like`, {
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
      const res = await fetch(`/api/gigs/${post.id}/save`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      });
      const data = await res.json();
      setPost({ ...post, saved_by_me: data.saved });
    } catch (err) {
      console.error(err);
    }
  };

  const handleAddComment = async () => {
    if (!newComment.trim() || !currentUser || !post || submitting) return;
    
    setSubmitting(true);
    try {
      const res = await fetch(`/api/gigs/${post.id}/comment`, {
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

  if (loading || !post) {
    return (
      <div className="h-full w-full bg-white dark:bg-black flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-zinc-200 dark:border-zinc-800 border-t-[#0066FF] rounded-full animate-spin" />
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
        <button>
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
              <button>
                <ShareFat size={28} weight="regular" className="text-zinc-950 dark:text-white" />
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
                    <button className="text-xs font-semibold text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300">
                      Reply
                    </button>
                    <button className="text-xs font-semibold text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300">
                      Like
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
      <div className="sticky bottom-0 bg-white dark:bg-black border-t border-zinc-100 dark:border-zinc-900 px-4 py-3">
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
          <button className="text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300">
            <Smiley size={24} />
          </button>
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
    </div>
  );
}
