'use client';

import React, { useState, useEffect } from 'react';
import {
  Heart,
  ChatCircleDots,
  DotsThree,
  ShareFat,
  SealCheck,
  Star,
  X,
  PaperPlaneTilt,
  PlusSquare,
  BookmarkSimple,
  WhatsappLogo,
  Link as LinkIcon,
  TwitterLogo,
  Copy,
  Check
} from '@phosphor-icons/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { VideoPlayer } from '@/components/VideoPlayer';
import { fetchCurrentUser } from '@/lib/session';
import { APP_CONFIG } from '@/lib/config';

interface Comment {
  id: string;
  username: string;
  text: string;
  created_at: string;
}

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
}

interface Story {
  id: string;
  name: string;
  trade: string;
  verified: boolean;
  initial?: string;
  color?: string;
}

interface SuggestedPro {
  id: string;
  user_id: string;
  name: string;
  trade: string;
  rating: number;
  is_verified: boolean;
  initial?: string;
}

interface User {
  id: string;
  username: string;
  role: string;
}

const timeAgo = (d: string) => {
  const diff = Date.now() - new Date(d).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return 'now';
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return `${Math.floor(hrs / 24)}d ago`;
};

export default function PersonalDashboard() {
  const FEED_PAGE_SIZE = 20;
  const [posts, setPosts] = useState<Post[]>([]);
  const [stories, setStories] = useState<Story[]>([]);
  const [suggestedPros, setSuggestedPros] = useState<SuggestedPro[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMoreFeed, setLoadingMoreFeed] = useState(false);
  const [feedPage, setFeedPage] = useState(1);
  const [hasMoreFeed, setHasMoreFeed] = useState(true);
  const [activeComments, setActiveComments] = useState<Post | null>(null);
  const [postComments, setPostComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState('');
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [sharePost, setSharePost] = useState<Post | null>(null);
  const [copied, setCopied] = useState(false);
  const router = useRouter();

  const fetchFeed = async (page = 1, append = false) => {
    try {
      if (page === 1) {
        setLoading(true);
      } else {
        setLoadingMoreFeed(true);
      }

      const res = await fetch(`/api/gigs/feed?page=${page}&limit=${FEED_PAGE_SIZE}`);
      const data = await res.json();
      const nextPosts = Array.isArray(data) ? data : [];
      setPosts(prev => append ? [...prev, ...nextPosts] : nextPosts);
      setHasMoreFeed(nextPosts.length === FEED_PAGE_SIZE);
      setFeedPage(page);
    } catch (err) {
      console.error('Feed fetch failed:', err);
    } finally {
      if (page === 1) {
        setLoading(false);
      } else {
        setLoadingMoreFeed(false);
      }
    }
  };

  const fetchStories = async () => {
    try {
      const res = await fetch('/api/gigs/stories');
      const data = await res.json();
      if (Array.isArray(data)) {
        const enhancedStories = data.map((s: Story, i: number) => ({
          ...s,
          initial: s.name.charAt(0),
          color: i % 2 === 0 ? 'bg-blue-100 text-blue-600' : 'bg-purple-100 text-purple-600'
        }));
        setStories(enhancedStories);
      }
    } catch (err) {
      console.error('Stories fetch failed:', err);
    }
  };

  const fetchSuggested = async () => {
    try {
      if (typeof window !== 'undefined' && !window.matchMedia('(min-width: 1280px)').matches) {
        return;
      }

      const res = await fetch('/api/profile/search?q=');
      const data = await res.json();
      if (Array.isArray(data)) {
        setSuggestedPros(data.slice(0, 5).map((p: { id: string; user_id: string; full_name: string; trade: string; trust_score?: string; is_verified: boolean; }) => ({
          id: p.id, user_id: p.user_id, name: p.full_name, trade: p.trade,
          rating: parseFloat(p.trust_score || '0'), is_verified: p.is_verified,
          initial: p.full_name?.charAt(0) || '?'
        })));
      }
    } catch (err) {
      console.error('Suggested fetch failed:', err);
    }
  };

  useEffect(() => {
    let mounted = true;

    const bootstrap = async () => {
      const user = await fetchCurrentUser();
      if (!mounted) return;

      setCurrentUser(user);
      fetchFeed(1, false);
      fetchStories();
      fetchSuggested();
    };

    bootstrap();

    return () => {
      mounted = false;
    };
  }, []);

  const handleLike = async (postId: string) => {
    if (!currentUser) return;
    try {
      const res = await fetch(`/api/gigs/${postId}/like`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user_id: currentUser.id })
      });
      const data = await res.json();
      setPosts(prev => prev.map(p => p.id === postId ? {
        ...p,
        likes_count: data.liked ? p.likes_count + 1 : p.likes_count - 1,
        liked_by_me: data.liked
      } : p));
    } catch (err) { console.error(err); }
  };

  const handleSave = async (post: Post) => {
    if (!currentUser) return;

    try {
      const res = await fetch(`/api/gigs/${post.id}/save`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      });
      const data = await res.json();

      setPosts(prev => prev.map(p => p.id === post.id ? { ...p, saved_by_me: data.saved } : p));
    } catch (err) {
      console.error(err);
    }
  };

  const loadMoreFeed = async () => {
    if (loadingMoreFeed || !hasMoreFeed) return;
    await fetchFeed(feedPage + 1, true);
  };

  const fetchComments = async (post: Post) => {
    setActiveComments(post);
    try {
      const res = await fetch(`/api/gigs/${post.id}/comments`);
      const data = await res.json();
      setPostComments(data);
    } catch (err) { console.error(err); }
  };

  const handleAddComment = async () => {
    if (!activeComments || !newComment || !currentUser) return;
    try {
      const res = await fetch(`/api/gigs/${activeComments.id}/comment`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user_id: currentUser.id, text: newComment })
      });
      const data = await res.json();
      setPostComments(prev => [{
        id: data.id,
        username: currentUser.username,
        text: newComment,
        created_at: new Date().toISOString()
      }, ...prev]);
      setPosts(prev => prev.map(p => p.id === activeComments.id ? { ...p, comments_count: p.comments_count + 1 } : p));
      setNewComment('');
    } catch (err) { console.error(err); }
  };

  const handleShare = (post: Post) => { setSharePost(post); setCopied(false); };
  const shareUrl = sharePost ? `${typeof window !== 'undefined' ? window.location.origin : ''}/gig/${sharePost.id}` : '';
  const shareText = sharePost ? `Check out this work by ${sharePost.user_name} on Workora!` : '';
  const copyLink = () => { navigator.clipboard.writeText(shareUrl); setCopied(true); setTimeout(() => setCopied(false), 2000); };

  const startConversation = async (otherUserId: string) => {
    if (!currentUser) { router.push('/login'); return; }
    try {
      const res = await fetch('/api/messages/conversations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user_id: currentUser.id, other_user_id: otherUserId })
      });
      await res.json();
      router.push('/dashboard/messages');
    } catch (err) { console.error(err); }
  };

  return (
    <div className="h-full w-full flex flex-col lg:flex-row overflow-hidden">

      {sharePost && (
        <div className="fixed inset-0 z-[200] flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-md" onClick={() => setSharePost(null)}>
          <motion.div initial={{ y: "100%" }} animate={{ y: 0 }} className="w-full max-w-md bg-white dark:bg-zinc-900 rounded-t-[32px] sm:rounded-[32px] p-6 sm:p-8 space-y-6 shadow-2xl border border-white/10" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-black tracking-tight text-zinc-950 dark:text-white">Share</h3>
              <button onClick={() => setSharePost(null)} className="h-10 w-10 rounded-full bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center transition-transform hover:scale-110 shadow-sm text-zinc-950 dark:text-white"><X size={20} weight="bold" /></button>
            </div>
            <div className="grid grid-cols-4 gap-4">
              <a href={`https://wa.me/?text=${encodeURIComponent(shareText + ' ' + shareUrl)}`} target="_blank" rel="noopener" className="flex flex-col items-center gap-2">
                <div className="h-14 w-14 rounded-2xl bg-green-50 flex items-center justify-center transition-transform hover:scale-110 shadow-sm"><WhatsappLogo size={28} weight="fill" className="text-green-600" /></div>
                <span className="text-[10px] font-black uppercase tracking-wider opacity-60">WhatsApp</span>
              </a>
              <a href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`} target="_blank" rel="noopener" className="flex flex-col items-center gap-2">
                <div className="h-14 w-14 rounded-2xl bg-sky-50 flex items-center justify-center transition-transform hover:scale-110 shadow-sm"><TwitterLogo size={28} weight="fill" className="text-sky-500" /></div>
                <span className="text-[10px] font-black uppercase tracking-wider opacity-60">Twitter</span>
              </a>
              <button onClick={copyLink} className="flex flex-col items-center gap-2">
                <div className="h-14 w-14 rounded-2xl bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center transition-transform hover:scale-110 shadow-sm text-zinc-950 dark:text-white">{copied ? <Check size={28} weight="bold" /> : <Copy size={28} weight="fill" />}</div>
                <span className="text-[10px] font-black uppercase tracking-wider opacity-60 text-zinc-950 dark:text-white">{copied ? 'Copied' : 'Copy'}</span>
              </button>
              <a href={`https://wa.me/?text=${encodeURIComponent(shareText + ' ' + shareUrl)}`} target="_blank" rel="noopener" className="flex flex-col items-center gap-2">
                <div className="h-14 w-14 rounded-2xl bg-violet-50 flex items-center justify-center transition-transform hover:scale-110 shadow-sm"><LinkIcon size={28} weight="fill" className="text-violet-600" /></div>
                <span className="text-[10px] font-black uppercase tracking-wider opacity-60">Status</span>
              </a>
            </div>
            <div className="bg-zinc-50 dark:bg-zinc-950 rounded-2xl p-4 border border-zinc-100 dark:border-zinc-800 flex items-center gap-3">
              <p className="flex-1 text-[13px] font-bold text-zinc-500 dark:text-zinc-400 truncate">{shareUrl}</p>
              <button onClick={copyLink} className="text-[#0066FF] text-[13px] font-black uppercase tracking-widest">{copied ? 'Done' : 'Copy'}</button>
            </div>
          </motion.div>
        </div>
      )}

      {/* Comments Drawer */}
      <AnimatePresence>
        {activeComments && (
          <div className="fixed inset-0 z-[250] flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-md" onClick={() => setActiveComments(null)}>
            <motion.div 
              initial={{ y: "100%" }} animate={{ y: 0 }} exit={{ y: "100%" }}
              className="w-full max-w-lg bg-white dark:bg-zinc-900 rounded-t-[32px] sm:rounded-[32px] h-[80vh] sm:h-[600px] flex flex-col shadow-2xl overflow-hidden border border-white/10"
              onClick={e => e.stopPropagation()}
            >
              <div className="p-6 border-b border-zinc-50 dark:border-zinc-800 flex items-center justify-between shrink-0">
                <h3 className="text-xl font-black tracking-tight text-zinc-950 dark:text-white">Comments</h3>
                <button onClick={() => setActiveComments(null)} className="h-10 w-10 rounded-full bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors text-zinc-950 dark:text-white">
                  <X size={20} weight="bold" />
                </button>
              </div>
              
              <div className="flex-1 overflow-y-auto p-6 space-y-6">
                {postComments.length > 0 ? postComments.map((c, i) => (
                  <div key={i} className="flex gap-4 group">
                    <div className="h-9 w-9 rounded-full bg-zinc-100 dark:bg-zinc-800 text-zinc-950 dark:text-white flex items-center justify-center text-[10px] font-black shrink-0 uppercase">{c.username.charAt(0)}</div>
                    <div className="flex flex-col gap-1">
                      <div className="flex items-center gap-2">
                        <span className="text-[13px] font-black text-zinc-950 dark:text-white">{c.username}</span>
                        <span className="text-[9px] font-bold text-zinc-400">{timeAgo(c.created_at)}</span>
                      </div>
                      <p className="text-[13px] text-zinc-600 dark:text-zinc-300 font-medium leading-relaxed">{c.text}</p>
                    </div>
                  </div>
                )) : (
                  <div className="h-full flex flex-col items-center justify-center text-center gap-4 py-20">
                    <ChatCircleDots size={48} weight="duotone" className="text-zinc-200" />
                    <p className="text-sm font-bold text-zinc-400">No comments yet. Be the first to share your thoughts!</p>
                  </div>
                )}
              </div>

              <div className="p-6 border-t border-zinc-50 dark:border-zinc-800 flex items-center gap-3 shrink-0">
                <div className="h-9 w-9 rounded-full bg-zinc-100 dark:bg-zinc-800 text-zinc-950 dark:text-white flex items-center justify-center text-[10px] font-black shrink-0 uppercase">{currentUser?.username?.charAt(0) || 'U'}</div>
                <input 
                  value={newComment} onChange={e => setNewComment(e.target.value)}
                  placeholder="Add a comment..."
                  className="flex-1 h-12 bg-zinc-50 dark:bg-zinc-950 rounded-2xl px-4 text-xs font-bold outline-none text-zinc-950 dark:text-white dark:placeholder-zinc-500 focus:bg-white dark:focus:bg-zinc-900 border border-transparent dark:border-zinc-800 focus:border-[#0066FF] transition-all"
                  onKeyDown={e => e.key === 'Enter' && handleAddComment()}
                />
                <button 
                  onClick={handleAddComment}
                  disabled={!newComment.trim()}
                  className="h-12 w-12 bg-[#0066FF] text-white rounded-2xl flex items-center justify-center shadow-lg shadow-blue-500/20 hover:brightness-110 transition-all disabled:opacity-50"
                >
                  <PaperPlaneTilt size={20} weight="fill" />
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <main className="flex-1 h-full overflow-y-auto bg-white dark:bg-[#0A0E17] flex flex-col items-center pt-4 lg:pt-8 w-full">
        <div className="w-full max-w-[660px] px-4 lg:px-6 pb-20">
          
          <div className="relative mb-6 lg:mb-10 group overflow-hidden">
            <div className="flex gap-5 overflow-x-auto pb-4 no-scrollbar">
              {stories.map((story, i) => (
                <button key={i} className="flex flex-col items-center gap-2.5 min-w-[80px] flex-shrink-0 group/story">
                  <div className="h-16 w-16 rounded-full flex items-center justify-center bg-gradient-to-tr from-[#FFD600] via-[#FF7A00] to-[#FF0069] p-[2px] transform group-hover/story:scale-105 transition-transform">
                    <div className="h-full w-full rounded-full bg-white flex items-center justify-center p-[2px]">
                      <div className={`h-full w-full rounded-full flex items-center justify-center ${story.color} shadow-inner`}>
                        <span className="text-lg font-black">{story.initial}</span>
                      </div>
                    </div>
                  </div>
                  <span className="text-[11px] font-bold text-zinc-400 tracking-tight text-center truncate w-full">{story.name}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-12 lg:space-y-16">
            {loading ? (
              <div className="space-y-10">
                {[1, 2].map((item) => (
                  <div key={item} className="space-y-4">
                    <div className="flex items-center justify-between pb-4">
                      <div className="flex items-center gap-3.5">
                        <div className="h-10 w-10 rounded-full bg-zinc-100 dark:bg-zinc-900 animate-pulse" />
                        <div className="space-y-2">
                          <div className="h-4 w-28 bg-zinc-100 dark:bg-zinc-900 rounded-full animate-pulse" />
                          <div className="h-3 w-16 bg-zinc-100 dark:bg-zinc-900 rounded-full animate-pulse" />
                        </div>
                      </div>
                      <div className="h-8 w-8 bg-zinc-100 dark:bg-zinc-900 rounded-full animate-pulse" />
                    </div>
                    <div className="aspect-[4/5] sm:aspect-square bg-zinc-100 dark:bg-zinc-900 rounded-2xl sm:rounded-3xl animate-pulse" />
                    <div className="space-y-3">
                      <div className="h-5 w-32 bg-zinc-100 dark:bg-zinc-900 rounded-full animate-pulse" />
                      <div className="h-4 w-full bg-zinc-100 dark:bg-zinc-900 rounded-full animate-pulse" />
                      <div className="h-4 w-3/4 bg-zinc-100 dark:bg-zinc-900 rounded-full animate-pulse" />
                    </div>
                  </div>
                ))}
              </div>
            ) : posts.length > 0 ? posts.map((post, i) => (
              <article key={i} className="bg-white dark:bg-[#0A0E17]">
                <div className="flex items-center justify-between pb-4">
                  <div className="flex items-center gap-3.5">
                    <div className="h-10 w-10 rounded-full bg-zinc-50 dark:bg-zinc-900 text-zinc-950 dark:text-white flex items-center justify-center text-xs font-black shadow-sm cursor-pointer" onClick={() => startConversation(post.user_id || post.worker_id)}>{post.user_name.charAt(0)}</div>
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="text-[14px] font-black text-zinc-900 dark:text-white cursor-pointer" onClick={() => startConversation(post.user_id || post.worker_id)}>{post.user_name}</p>
                        {post.verified && <SealCheck size={16} weight="fill" className="text-[#0066FF]" />}
                      </div>
                      <p className="text-[10px] text-[#0066FF] font-black uppercase tracking-[0.2em]">{post.trade}</p>
                    </div>
                  </div>
                  <button className="text-zinc-300 dark:text-zinc-600 hover:text-zinc-900 dark:hover:text-white"><DotsThree size={32} weight="bold" /></button>
                </div>

                <div className="aspect-[4/5] sm:aspect-square bg-zinc-100 dark:bg-zinc-900 rounded-2xl sm:rounded-3xl overflow-hidden shadow-[0_20px_60px_rgba(0,0,0,0.04)] dark:shadow-[0_20px_60px_rgba(0,0,0,0.5)]">
                  <VideoPlayer 
                    src={post.video_url} 
                    poster={post.thumbnail_url || APP_CONFIG.defaults.thumbnail} 
                    className="w-full h-full" 
                  />
                </div>

                <div className="py-6 space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-7 text-zinc-950 dark:text-white">
                      <Heart size={28} weight={post.liked_by_me ? "fill" : "regular"} className={`${post.liked_by_me ? "text-red-500" : "hover:text-red-500"} cursor-pointer transition-colors`} onClick={() => handleLike(post.id)} />
                      <ChatCircleDots size={28} className="hover:text-[#0066FF] cursor-pointer" onClick={() => fetchComments(post)} />
                      <ShareFat size={28} className="hover:text-[#0066FF] cursor-pointer" onClick={() => handleShare(post)} />
                    </div>
                    <BookmarkSimple 
                      size={28} 
                      weight={post.saved_by_me ? "fill" : "regular"} 
                      className={`${post.saved_by_me ? 'text-[#0066FF]' : 'hover:text-[#0066FF] text-zinc-950 dark:text-white'} cursor-pointer`} 
                      onClick={() => handleSave(post)} 
                    />
                  </div>
                  <div className="space-y-1.5">
                    <p className="text-[14px] font-black text-zinc-900 dark:text-white">{post.likes_count.toLocaleString()} likes</p>
                    <p className="text-[14px] leading-relaxed text-zinc-600 dark:text-zinc-300">
                      <span className="font-black mr-2 text-zinc-900 dark:text-white">@{post.handle}</span>
                      {post.description}
                    </p>
                    <button className="text-zinc-400 text-[13px] font-bold hover:text-zinc-600 dark:hover:text-zinc-300 pt-2" onClick={() => fetchComments(post)}>
                      View all {post.comments_count} comments
                    </button>
                  </div>
                </div>
              </article>
            )) : (
              <div className="py-20 flex flex-col items-center text-center gap-6">
                <div className="h-24 w-24 rounded-[32px] bg-zinc-50 dark:bg-zinc-900 flex items-center justify-center text-zinc-200 dark:text-zinc-700">
                  <PlusSquare size={48} weight="duotone" />
                </div>
                <div className="space-y-2">
                  <h3 className="text-xl font-black tracking-tight text-zinc-950 dark:text-white">Your Feed is Empty</h3>
                  <p className="text-zinc-400 font-bold text-sm max-w-[280px] mx-auto">Start following pros or share your own work to see content here.</p>
                </div>
                <Link href="/dashboard/create" className="px-8 h-12 bg-[#0066FF] text-white rounded-full font-black text-[13px] uppercase tracking-widest shadow-xl shadow-blue-500/20 hover:scale-105 transition-all flex items-center justify-center">
                  Create First Post
                </Link>
              </div>
            )}
            {posts.length > 0 && hasMoreFeed && (
              <div className="flex justify-center pt-4">
                <button
                  onClick={loadMoreFeed}
                  disabled={loadingMoreFeed}
                  className="h-12 px-6 rounded-full bg-zinc-950 dark:bg-white text-white dark:text-zinc-950 text-[12px] font-black uppercase tracking-[0.2em] shadow-lg shadow-black/10 disabled:opacity-50"
                >
                  {loadingMoreFeed ? 'Loading more' : 'Load more posts'}
                </button>
              </div>
            )}
          </div>
        </div>
      </main>

      <aside className="hidden xl:flex flex-col w-[400px] h-full flex-shrink-0 bg-white dark:bg-[#0A0E17] border-l border-zinc-50 dark:border-zinc-800 space-y-10 pt-8 px-6 overflow-y-auto">
        <div className="w-full flex items-center justify-between group cursor-pointer p-4 bg-zinc-50/50 dark:bg-zinc-900/50 rounded-2xl hover:bg-zinc-50 dark:hover:bg-zinc-900 transition-all">
          <div className="flex items-center gap-5">
            <div className="h-16 w-16 rounded-full bg-gradient-to-br from-[#0066FF] to-[#7000FF] flex items-center justify-center text-white text-xl font-black shadow-xl shadow-blue-50 dark:shadow-blue-900/20 border-4 border-white dark:border-zinc-800 uppercase">
              {currentUser?.username?.charAt(0) || 'U'}
            </div>
            <div className="flex flex-col">
              <p className="text-[16px] font-black text-zinc-900 dark:text-white tracking-tight leading-none">{currentUser?.username || 'Guest'}</p>
              <p className="text-[14px] text-zinc-400 font-bold tracking-wide mt-1 uppercase">{currentUser?.role || 'User'}</p>
            </div>
          </div>
          <Link href="/login" className="text-[#0066FF] text-[13px] font-black">Switch</Link>
        </div>

        <div className="space-y-10">
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <p className="text-[15px] font-black text-zinc-400 dark:text-zinc-500 tracking-tight uppercase">Suggested For You</p>
              <button className="text-[12px] font-black text-zinc-900 dark:text-white">See All</button>
            </div>
            <div className="space-y-6">
              {suggestedPros.map((pro, i) => (
                <div key={i} className="flex items-center justify-between group">
                  <div className="flex items-center gap-4">
                    <div className="h-12 w-12 rounded-full bg-white dark:bg-zinc-900 border border-zinc-50 dark:border-zinc-800 flex items-center justify-center text-[11px] font-black text-zinc-400 dark:text-zinc-500 shadow-sm">{pro.initial}</div>
                    <div className="flex flex-col">
                      <div className="flex items-center gap-2">
                        <p className="text-[15px] font-black text-zinc-900 dark:text-white tracking-tight">{pro.name}</p>
                        {pro.is_verified && <SealCheck size={16} weight="fill" className="text-[#0066FF]" />}
                      </div>
                      <div className="flex items-center gap-2 text-[11px] font-bold text-zinc-400">
                        <span className="flex items-center gap-0.5 text-amber-500"><Star size={12} weight="fill" /> {pro.rating}</span>
                        <span>&bull;</span>
                        <span className="text-[9px] uppercase tracking-tighter">{pro.trade}</span>
                      </div>
                    </div>
                  </div>
                  <button className="text-[#0066FF] text-[13px] font-black" onClick={() => startConversation(pro.user_id || pro.id)}>Connect</button>
                </div>
              ))}
            </div>
          </div>
          <p className="text-[10px] text-zinc-300 font-black tracking-[0.3em] uppercase">&copy; 2026 WORKORA BY IMEANTECH</p>
        </div>
      </aside>
    </div>
  );
}
