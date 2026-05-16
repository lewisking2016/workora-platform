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
  Play,
  House,
  MagnifyingGlass,
  PlusSquare,
  BookmarkSimple,
  WhatsappLogo,
  Link as LinkIcon,
  TwitterLogo,
  Copy,
  Check
} from '@phosphor-icons/react';
import Link from 'next/link';

interface Comment {
  id: string;
  username: string;
  text: string;
  created_at: string;
}

interface Post {
  id: string;
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
  name: string;
  trade: string;
  rating: number;
  is_verified: boolean;
  initial?: string;
}

import { Sidebar } from '@/components/Sidebar';

interface User {
  id: string;
  username: string;
  role: string;
}

export default function PersonalDashboard() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [stories, setStories] = useState<Story[]>([]);
  const [suggestedPros, setSuggestedPros] = useState<SuggestedPro[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeComments, setActiveComments] = useState<Post | null>(null);
  const [postComments, setPostComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState('');
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [sharePost, setSharePost] = useState<Post | null>(null);
  const [copied, setCopied] = useState(false);

  const fetchFeed = async () => {
    try {
      const res = await fetch('/api/gigs/feed');
      const data = await res.json();
      if (Array.isArray(data)) {
        setPosts(data);
      } else {
        console.warn('Feed data is not an array:', data);
        setPosts([]);
      }
    } catch (err) {
      console.error('Feed fetch failed:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchStories = async () => {
    try {
      const res = await fetch('/api/gigs/stories');
      const data = await res.json();
      
      if (Array.isArray(data)) {
        // Add UI props for stories
        const enhancedStories = data.map((s: Story, i: number) => ({
          ...s,
          initial: s.name.charAt(0),
          color: i % 2 === 0 ? 'bg-blue-100 text-blue-600' : 'bg-purple-100 text-purple-600'
        }));
        setStories(enhancedStories);
      } else {
        console.warn('Stories data is not an array:', data);
        setStories([]);
      }
    } catch (err) {
      console.error('Stories fetch failed:', err);
    }
  };

  const fetchSuggested = async () => {
    try {
      const res = await fetch('/api/profile/search?q=');
      const data = await res.json();
      if (Array.isArray(data)) {
        setSuggestedPros(data.slice(0, 5).map((p: any) => ({
          id: p.id, name: p.full_name, trade: p.trade,
          rating: parseFloat(p.trust_score || '0'), is_verified: p.is_verified,
          initial: p.full_name?.charAt(0) || '?'
        })));
      }
    } catch (err) {
      console.error('Suggested fetch failed:', err);
    }
  };

  const handleShare = (post: Post) => { setSharePost(post); setCopied(false); };
  const shareUrl = sharePost ? `${typeof window !== 'undefined' ? window.location.origin : ''}/gig/${sharePost.id}` : '';
  const shareText = sharePost ? `Check out this work by ${sharePost.user_name} on Workora!` : '';
  const copyLink = () => { navigator.clipboard.writeText(shareUrl); setCopied(true); setTimeout(() => setCopied(false), 2000); };

  useEffect(() => {
    // Defer the initial initialization to avoid cascading render warning in strict environments
    const timer = setTimeout(() => {
      // Get current user from localStorage
      const userStr = localStorage.getItem('workora_user');
      if (userStr) {
        try {
          setCurrentUser(JSON.parse(userStr));
        } catch {
          console.error('Failed to parse user session');
        }
      }
      
      fetchFeed();
      fetchStories();
      fetchSuggested();
    }, 0);
    return () => clearTimeout(timer);
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
      
      setPosts(prev => prev.map(p => {
        if (p.id === postId) {
          return {
            ...p,
            likes_count: data.liked ? p.likes_count + 1 : p.likes_count - 1,
            liked_by_me: data.liked
          };
        }
        return p;
      }));
    } catch (err) {
      console.error('Like failed:', err);
    }
  };

  const fetchComments = async (post: Post) => {
    setActiveComments(post);
    try {
      const res = await fetch(`/api/gigs/${post.id}/comments`);
      const data = await res.json();
      setPostComments(data);
    } catch (err) {
      console.error('Comments fetch failed:', err);
    }
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
      
      // Update UI
      setPostComments(prev => [{
        id: data.id,
        username: currentUser.username,
        text: newComment,
        created_at: new Date().toISOString()
      }, ...prev]);
      
      setPosts(prev => prev.map(p => {
        if (p.id === activeComments.id) {
          return { ...p, comments_count: p.comments_count + 1 };
        }
        return p;
      }));
      
      setNewComment('');
    } catch (err) {
      console.error('Comment add failed:', err);
    }
  };

  return (
    <div className="h-screen w-full bg-white text-[#1A1A1A] font-display flex overflow-hidden">
      <style jsx global>{`
        ::-webkit-scrollbar { display: none; }
        * { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>

      <Sidebar />

      {/* Share Modal */}
      {sharePost && (
        <div className="fixed inset-0 z-[200] flex items-end sm:items-center justify-center bg-black/50 backdrop-blur-sm" onClick={() => setSharePost(null)}>
          <div className="w-full max-w-md bg-white rounded-t-3xl sm:rounded-3xl p-6 space-y-5" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-black">Share</h3>
              <button onClick={() => setSharePost(null)} className="h-8 w-8 rounded-full bg-zinc-100 flex items-center justify-center"><X size={16} weight="bold" /></button>
            </div>
            <div className="grid grid-cols-4 gap-4">
              <a href={`https://wa.me/?text=${encodeURIComponent(shareText + ' ' + shareUrl)}`} target="_blank" rel="noopener" className="flex flex-col items-center gap-2">
                <div className="h-14 w-14 rounded-2xl bg-green-50 flex items-center justify-center"><WhatsappLogo size={28} weight="fill" className="text-green-600" /></div>
                <span className="text-[9px] font-bold">WhatsApp</span>
              </a>
              <a href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`} target="_blank" rel="noopener" className="flex flex-col items-center gap-2">
                <div className="h-14 w-14 rounded-2xl bg-blue-50 flex items-center justify-center"><TwitterLogo size={28} weight="fill" className="text-blue-500" /></div>
                <span className="text-[9px] font-bold">Twitter</span>
              </a>
              <button onClick={copyLink} className="flex flex-col items-center gap-2">
                <div className="h-14 w-14 rounded-2xl bg-zinc-100 flex items-center justify-center">{copied ? <Check size={28} className="text-green-600" /> : <Copy size={28} className="text-zinc-600" />}</div>
                <span className="text-[9px] font-bold">{copied ? 'Copied!' : 'Copy Link'}</span>
              </button>
              <a href={`https://wa.me/?text=${encodeURIComponent(shareText + ' ' + shareUrl)}`} target="_blank" rel="noopener" className="flex flex-col items-center gap-2">
                <div className="h-14 w-14 rounded-2xl bg-violet-50 flex items-center justify-center"><LinkIcon size={28} className="text-violet-600" /></div>
                <span className="text-[9px] font-bold">Status</span>
              </a>
            </div>
            <div className="flex items-center gap-3 bg-zinc-50 rounded-xl p-3">
              <p className="flex-1 text-xs font-bold text-zinc-500 truncate">{shareUrl}</p>
              <button onClick={copyLink} className="text-[#0066FF] text-xs font-black">{copied ? 'Done' : 'Copy'}</button>
            </div>
          </div>
        </div>
      )}

      {/* 2. Isolated Central Feed - Top-Aligned with Sidebar */}
      <main className="flex-1 h-full overflow-y-auto bg-white flex flex-col items-center pt-8">
        <div className="w-full max-w-[660px] px-6">
          
          {/* Story Navigation */}
          <div className="relative mb-10 group">
            <div className="flex gap-5 overflow-x-auto pb-4 scrollbar-hide">
              {stories.length > 0 ? stories.map((story, i) => (
                <button key={i} className="flex flex-col items-center gap-2.5 min-w-[80px] flex-shrink-0 group/story">
                  <div className={`h-16 w-16 rounded-full flex items-center justify-center bg-gradient-to-tr from-[#FFD600] via-[#FF7A00] to-[#FF0069] p-[2px] transform group-hover/story:scale-105 transition-transform`}>
                    <div className="h-full w-full rounded-full bg-white flex items-center justify-center p-[2px]">
                      <div className={`h-full w-full rounded-full flex items-center justify-center ${story.color} shadow-inner`}>
                        <span className="text-lg font-black">{story.initial}</span>
                      </div>
                    </div>
                  </div>
                  <span className="text-[11px] font-bold text-zinc-400 tracking-tight group-hover/story:text-zinc-900 transition-colors truncate w-full text-center">{story.name}</span>
                </button>
              )) : (
                [1,2,3,4,5].map(i => (
                  <div key={i} className="h-16 w-16 rounded-full bg-zinc-50 animate-pulse flex-shrink-0" />
                ))
              )}
            </div>
          </div>

          {/* Feed Posts */}
          <div className="space-y-16 pb-32">
            {loading ? (
              [1,2].map(i => (
                <div key={i} className="w-full h-[500px] bg-zinc-50 rounded-3xl animate-pulse" />
              ))
            ) : posts.length > 0 ? posts.map((post, i) => (
              <article key={i} className="bg-white">
                <div className="flex items-center justify-between pb-5">
                  <div className="flex items-center gap-3.5">
                    <div className="h-10 w-10 rounded-full bg-zinc-50 flex items-center justify-center text-xs font-black shadow-sm">{post.user_name.charAt(0)}</div>
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="text-[14px] font-black text-zinc-900">{post.user_name}</p>
                        {post.verified && <SealCheck size={16} weight="fill" className="text-[#0066FF]" />}
                        <span className="text-zinc-300 font-bold text-[13px]">&bull; Just now</span>
                      </div>
                      <p className="text-[10px] text-[#0066FF] font-black uppercase tracking-[0.2em]">{post.trade}</p>
                    </div>
                  </div>
                  <button className="text-zinc-300 hover:text-zinc-900"><DotsThree size={32} weight="bold" /></button>
                </div>

                <div className="aspect-square bg-[#F8F9FA] rounded-3xl overflow-hidden group cursor-pointer relative shadow-[0_20px_60px_rgba(0,0,0,0.04)] hover:shadow-[0_30px_80px_rgba(0,0,0,0.08)] transition-all duration-700">
                  <div className="flex flex-col items-center justify-center h-full">
                    <div className="h-20 w-20 rounded-full bg-white flex items-center justify-center shadow-2xl transform group-hover:scale-110 transition-all duration-700">
                      <Play size={36} weight="fill" className="text-[#0066FF] ml-1.5" />
                    </div>
                  </div>
                </div>

                <div className="py-6 space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-7">
                      <Heart 
                        size={28} 
                        weight={post.liked_by_me ? "fill" : "regular"}
                        className={`${post.liked_by_me ? "text-red-500" : "hover:text-red-500"} cursor-pointer transition-colors`} 
                        onClick={() => handleLike(post.id)}
                      />
                      <ChatCircleDots 
                        size={28} 
                        className="hover:text-[#0066FF] cursor-pointer" 
                        onClick={() => fetchComments(post)}
                      />
                      <ShareFat size={28} className="hover:text-[#0066FF] cursor-pointer" onClick={() => handleShare(post)} />
                    </div>
                    <BookmarkSimple size={28} className="hover:text-[#0066FF] cursor-pointer" />
                  </div>
                  <div className="space-y-1.5">
                    <p className="text-[14px] font-black text-zinc-900">{post.likes_count.toLocaleString()} likes</p>
                    <p className="text-[14px] leading-relaxed text-zinc-600">
                      <span className="font-black mr-2 text-zinc-900">@{post.handle}</span>
                      {post.description}
                    </p>
                    <button 
                      className="text-zinc-400 text-[13px] font-bold hover:text-zinc-600 pt-2"
                      onClick={() => fetchComments(post)}
                    >
                      View all {post.comments_count} comments
                    </button>
                  </div>
                </div>
              </article>
            )) : (
              <div className="text-center py-20 text-zinc-400 font-bold uppercase tracking-widest text-xs">
                No proof-of-work in your area yet.
              </div>
            )}
          </div>
        </div>
      </main>

      {/* 3. Right Sidebar */}
      <aside className="hidden xl:flex flex-col w-[420px] h-full flex-shrink-0 bg-white border-l border-zinc-50 space-y-10 pt-8 px-6">
        
        {/* Profile Card */}
        <div className="w-full flex items-center justify-between group cursor-pointer p-4 bg-zinc-50/50 rounded-2xl hover:bg-zinc-50 transition-all">
          <div className="flex items-center gap-5">
            <div className="h-16 w-16 rounded-full bg-gradient-to-br from-[#0066FF] to-[#7000FF] flex items-center justify-center text-white text-xl font-black shadow-xl shadow-blue-50 border-4 border-white uppercase">
              {currentUser?.username?.charAt(0) || 'U'}
            </div>
            <div className="flex flex-col">
              <p className="text-[16px] font-black text-zinc-900 tracking-tight leading-none">
                {currentUser?.username || 'Guest'}
              </p>
              <p className="text-[14px] text-zinc-400 font-bold tracking-wide mt-1 uppercase">
                {currentUser?.role || 'User'}
              </p>
            </div>
          </div>
          <Link href="/login" className="text-[#0066FF] text-[13px] font-black">Switch</Link>
        </div>

        {/* Dynamic Center: Comments vs Suggested */}
        <div className="flex-1 overflow-hidden flex flex-col">
          {activeComments ? (
            <div className="flex-1 flex flex-col bg-zinc-50/50 rounded-[32px] p-6 shadow-inner animate-in fade-in slide-in-from-right-4 overflow-hidden">
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-2">
                  <ChatCircleDots size={24} weight="fill" className="text-[#0066FF]" />
                  <p className="text-[14px] font-black text-zinc-900 uppercase tracking-tight">Post Chat</p>
                </div>
                <button onClick={() => setActiveComments(null)} className="h-10 w-10 rounded-full hover:bg-white flex items-center justify-center transition-all shadow-sm">
                  <X size={20} weight="bold" />
                </button>
              </div>
              
              <div className="flex-1 space-y-6 overflow-y-auto scrollbar-hide pr-2">
                {postComments.map((c: Comment, idx: number) => (
                  <div key={idx} className="flex gap-4 group">
                    <div className="h-10 w-10 rounded-full bg-white flex-shrink-0 flex items-center justify-center text-[10px] font-black shadow-sm uppercase">{c.username.charAt(0)}</div>
                    <div className="space-y-1">
                      <p className="text-[13px] font-black text-zinc-900">@{c.username.toLowerCase()}</p>
                      <p className="text-[13px] text-zinc-600 font-medium leading-snug">{c.text}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-8 pt-6 border-t border-zinc-100 flex items-center gap-4">
                <input 
                  type="text" 
                  placeholder="Reply..." 
                  className="flex-1 text-[13px] bg-white rounded-xl px-4 py-3 shadow-sm border-none focus:ring-1 focus:ring-blue-100 outline-none" 
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleAddComment()}
                />
                <button onClick={handleAddComment} className="text-[#0066FF] font-black text-sm p-2">
                  <PaperPlaneTilt size={24} weight="fill" />
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-10">
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <p className="text-[15px] font-black text-zinc-400 tracking-tight uppercase">Suggested For You</p>
                  <button className="text-[12px] font-black text-zinc-900">See All</button>
                </div>
                <div className="space-y-6">
                  {suggestedPros.map((pro, i) => (
                    <div key={i} className="flex items-center justify-between group">
                      <div className="flex items-center gap-4">
                        <div className="h-12 w-12 rounded-full bg-white border border-zinc-50 flex items-center justify-center text-[11px] font-black text-zinc-400 shadow-sm">{pro.initial}</div>
                        <div className="flex flex-col">
                          <div className="flex items-center gap-2">
                            <p className="text-[15px] font-black text-zinc-900 tracking-tight">{pro.name}</p>
                            {pro.is_verified && <SealCheck size={16} weight="fill" className="text-[#0066FF]" />}
                          </div>
                          <div className="flex items-center gap-2 text-[11px] font-bold text-zinc-400">
                            <span className="flex items-center gap-0.5 text-amber-500"><Star size={12} weight="fill" /> {pro.rating}</span>
                            <span>&bull;</span>
                            <span className="text-[9px] uppercase tracking-tighter">{pro.trade}</span>
                          </div>
                        </div>
                      </div>
                      <button className="text-[#0066FF] text-[13px] font-black">Connect</button>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-6">
                <p className="text-[15px] font-black text-zinc-400 uppercase tracking-tight">Market Pulse</p>
                <div className="grid grid-cols-2 gap-3">
                  {['Electrical', 'Construction', 'Repair', 'Beauty'].map(trade => (
                    <div key={trade} className="bg-zinc-50 hover:bg-white hover:shadow-lg p-4 rounded-2xl transition-all cursor-pointer">
                      <p className="text-[13px] font-black text-zinc-900">{trade}</p>
                      <p className="text-[10px] text-zinc-400 font-bold uppercase">Trending</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Fixed Footer */}
        <div className="pb-10 opacity-40 hover:opacity-100 transition-opacity">
          <div className="text-[11px] text-zinc-400 font-bold flex flex-wrap gap-x-3 gap-y-1.5 uppercase tracking-tighter">
            <a href="#">About</a> <a href="#">Help</a> <a href="#">Privacy</a> <a href="#">Terms</a>
          </div>
          <p className="text-[10px] text-zinc-300 font-black tracking-[0.3em] uppercase pt-4">&copy; 2026 WORKORA BY IMEANTECH</p>
        </div>
      </aside>

      {/* Mobile Nav */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-white/80 backdrop-blur-xl p-4 px-8 flex justify-between items-center z-[100] shadow-[0_-10px_40px_rgba(0,0,0,0.03)]">
        <Link href="/dashboard/feed"><House size={28} weight="fill" className="text-zinc-900" /></Link>
        <Link href="/dashboard/search"><MagnifyingGlass size={28} /></Link>
        <div className="bg-[#0066FF] p-2 rounded-xl shadow-lg">
          <PlusSquare size={28} weight="bold" className="text-white" />
        </div>
        <Link href="/notifications"><Heart size={28} /></Link>
        <Link href="/dashboard/profile" className="h-8 w-8 rounded-full bg-zinc-50 flex items-center justify-center font-black text-[10px] uppercase">{currentUser?.username?.charAt(0) || 'U'}</Link>
      </nav>
    </div>
  );
}
