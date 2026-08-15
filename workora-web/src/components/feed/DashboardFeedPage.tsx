'use client';

import React, { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { AnimatePresence, motion } from 'framer-motion';
import {
  ArrowClockwise,
  BookmarkSimple,
  ChatCircleDots,
  Check,
  Copy,
  DotsThree,
  Heart,
  Link as LinkIcon,
  PaperPlaneTilt,
  PlusSquare,
  SealCheck,
  ShareFat,
  Star,
  WarningCircle,
  WhatsappLogo,
  TwitterLogo,
  X,
  EyeSlash,
  Users,
  SpeakerSlash,
  Flag,
  Rewind,
  Sparkle,
} from '@phosphor-icons/react';
import { VideoPlayer } from '@/components/VideoPlayer';
import { apiFetch, fetchCurrentUser } from '@/lib/session';
import { APP_CONFIG } from '@/lib/config';

type FeedScope = 'new' | 'following' | 'recommended' | 'trending' | 'nearby' | 'reels';

interface Comment {
  id: string;
  username: string;
  text: string;
  created_at: string;
}

interface Post {
  id: string;
  user_id: string;
  creator_user_id?: string;
  creator_location?: string;
  creator_trust_score?: string | number;
  worker_id: string;
  user_name: string;
  handle: string;
  trade: string;
  verified: boolean;
  description: string;
  likes_count: number;
  comments_count: number;
  real_likes?: number;
  real_comments?: number;
  view_count: number;
  video_url: string;
  thumbnail_url: string;
  created_at: string;
  liked_by_me?: boolean;
  saved_by_me?: boolean;
  following_by_me?: boolean;
}

interface Story {
  id: string;
  name: string;
  trade: string;
  verified: boolean;
}

interface SuggestedPro {
  id: string;
  user_id: string;
  name: string;
  trade: string;
  rating: number;
  is_verified: boolean;
}

interface CurrentUser {
  id: string;
  username: string;
  role: string;
}

const SCOPES: Array<{ key: FeedScope; label: string; description: string }> = [
  { key: 'new', label: 'New', description: 'Fresh posts in order' },
  { key: 'following', label: 'Following', description: 'Creators you follow' },
  { key: 'recommended', label: 'Recommended', description: 'Trust-led suggestions' },
  { key: 'trending', label: 'Trending', description: 'Most viewed content' },
  { key: 'nearby', label: 'Nearby', description: 'Creators near your profile' },
  { key: 'reels', label: 'Reels', description: 'Fast-moving video posts' },
];

const REPORT_REASONS = [
  { key: 'spam', label: 'Spam or scam' },
  { key: 'harassment', label: 'Harassment' },
  { key: 'copyright', label: 'Copyright issue' },
  { key: 'misleading', label: 'Misleading content' },
  { key: 'other', label: 'Other' },
];

const timeAgo = (value: string) => {
  const diff = Date.now() - new Date(value).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return 'now';
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return `${Math.floor(hrs / 24)}d ago`;
};

const formatCount = (value?: number) => (value || 0).toLocaleString();
const resolveScope = (value: string | null): FeedScope => {
  if (!value) return 'new';
  return SCOPES.some(scope => scope.key === value) ? (value as FeedScope) : 'new';
};

const scopeCopy: Record<FeedScope, { emptyTitle: string; emptyBody: string }> = {
  new: {
    emptyTitle: 'No posts yet',
    emptyBody: 'When creators post new work, it will appear here.',
  },
  following: {
    emptyTitle: 'No followed creators yet',
    emptyBody: 'Follow a creator from the feed to start filling this view.',
  },
  recommended: {
    emptyTitle: 'Nothing to recommend yet',
    emptyBody: 'We need more activity before this view can surface matches.',
  },
  trending: {
    emptyTitle: 'No trending posts yet',
    emptyBody: 'Once posts start earning views, this view will come alive.',
  },
  nearby: {
    emptyTitle: 'No nearby posts yet',
    emptyBody: 'Update your profile location to unlock a location-aware feed.',
  },
  reels: {
    emptyTitle: 'No reels yet',
    emptyBody: 'Video posts will appear here as creators publish them.',
  },
};

export default function DashboardFeedPage() {
  const PAGE_SIZE = 20;
  const router = useRouter();
  const searchParams = useSearchParams();

  const initialScope = useMemo(() => resolveScope(searchParams.get('scope')), [searchParams]);
  const [scope, setScope] = useState<FeedScope>(initialScope);
  const [posts, setPosts] = useState<Post[]>([]);
  const [stories, setStories] = useState<Story[]>([]);
  const [suggestedPros, setSuggestedPros] = useState<SuggestedPro[]>([]);
  const [currentUser, setCurrentUser] = useState<CurrentUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [feedPage, setFeedPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [feedError, setFeedError] = useState<string | null>(null);
  const [activeComments, setActiveComments] = useState<Post | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [commentValue, setCommentValue] = useState('');
  const [replyTo, setReplyTo] = useState<{ username: string } | null>(null);
  const [sharePost, setSharePost] = useState<Post | null>(null);
  const [copied, setCopied] = useState(false);
  const [menuPost, setMenuPost] = useState<Post | null>(null);
  const [reportPost, setReportPost] = useState<Post | null>(null);
  const [reportReason, setReportReason] = useState(REPORT_REASONS[0].key);
  const [reportDetails, setReportDetails] = useState('');
  const [busyId, setBusyId] = useState<string | null>(null);

  const syncScope = (nextScope: FeedScope) => {
    setScope(nextScope);
    router.replace(`/dashboard/feed?scope=${nextScope}`, { scroll: false });
  };

  const fetchFeed = async (nextScope: FeedScope, page = 1, append = false) => {
    try {
      if (page === 1) {
        setLoading(true);
        setFeedError(null);
      } else {
        setLoadingMore(true);
      }

      let res = await apiFetch(`/api/gigs/feed?scope=${nextScope}&page=${page}&limit=${PAGE_SIZE}`);
      if (!res.ok) {
        // Fallback chain so presentation never shows an empty broken feed
        res = await apiFetch(`/api/gigs/feed?scope=new&page=${page}&limit=${PAGE_SIZE}`);
      }
      if (!res.ok) {
        res = await apiFetch(`/api/gigs/explore?limit=${PAGE_SIZE}&page=${page}`);
      }
      if (!res.ok) {
        throw new Error(`Feed request failed with ${res.status}`);
      }

      const data = await res.json();
      const nextPosts = (Array.isArray(data) ? data : []).filter(
        (item: { video_url?: string; id?: string }) => Boolean(item?.id)
      );

      setPosts(prev => append ? [...prev, ...nextPosts] : nextPosts);
      setHasMore(nextPosts.length === PAGE_SIZE);
      setFeedPage(page);
      setFeedError(null);
    } catch (error) {
      console.error('Feed fetch failed:', error);
      setFeedError('We could not load this feed right now.');
      if (page === 1) {
        setPosts([]);
        setHasMore(false);
      }
    } finally {
      if (page === 1) {
        setLoading(false);
      } else {
        setLoadingMore(false);
      }
    }
  };

  const fetchStories = async () => {
    try {
      const res = await apiFetch('/api/gigs/stories');
      const data = await res.json();
      if (Array.isArray(data)) {
        setStories(data);
      }
    } catch (error) {
      console.error('Stories fetch failed:', error);
    }
  };

  const fetchSuggested = async () => {
    try {
      if (typeof window !== 'undefined' && !window.matchMedia('(min-width: 1024px)').matches) {
        return;
      }

      const res = await apiFetch('/api/profile/search?sort=trust');
      const data = await res.json();
      if (Array.isArray(data)) {
        setSuggestedPros(
          data.slice(0, 5).map((profile: { id: string; user_id: string; full_name: string; trade: string; trust_score?: string; is_verified: boolean; }) => ({
            id: profile.id,
            user_id: profile.user_id,
            name: profile.full_name,
            trade: profile.trade,
            rating: parseFloat(profile.trust_score || '0'),
            is_verified: profile.is_verified,
          }))
        );
      }
    } catch (error) {
      console.error('Suggested creators fetch failed:', error);
    }
  };

  useEffect(() => {
    let mounted = true;

    const bootstrap = async () => {
      const user = await fetchCurrentUser();
      if (!mounted) return;

      if (!user) {
        router.replace('/login');
        return;
      }

      setCurrentUser(user);
      void fetchStories();
      void fetchSuggested();
    };

    bootstrap();

    return () => {
      mounted = false;
    };
  }, [router]);

  useEffect(() => {
    if (!currentUser) return;
    void fetchFeed(scope, 1, false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentUser, scope]);

  const loadMore = async () => {
    if (loadingMore || !hasMore) return;
    await fetchFeed(scope, feedPage + 1, true);
  };

  const requireUser = () => {
    if (!currentUser) {
      router.push('/login');
      return false;
    }
    return true;
  };

  const updatePost = (postId: string, updater: (post: Post) => Post) => {
    setPosts(prev => prev.map(post => (post.id === postId ? updater(post) : post)));
  };

  const handleLike = async (postId: string) => {
    if (!requireUser()) return;
    setBusyId(postId);
    try {
      const res = await apiFetch(`/api/gigs/${postId}/like`, { method: 'POST' });
      const data = await res.json();
      updatePost(postId, (post) => ({
        ...post,
        liked_by_me: data.liked,
        likes_count: data.liked ? post.likes_count + 1 : Math.max(0, post.likes_count - 1),
      }));
    } catch (error) {
      console.error(error);
    } finally {
      setBusyId(null);
    }
  };

  const handleSave = async (post: Post) => {
    if (!requireUser()) return;
    setBusyId(post.id);
    try {
      const res = await apiFetch(`/api/gigs/${post.id}/save`, { method: 'POST' });
      const data = await res.json();
      updatePost(post.id, item => ({ ...item, saved_by_me: data.saved }));
    } catch (error) {
      console.error(error);
    } finally {
      setBusyId(null);
    }
  };

  const fetchPostComments = async (post: Post) => {
    setActiveComments(post);
    setReplyTo(null);
    setCommentValue('');
    try {
      const res = await apiFetch(`/api/gigs/${post.id}/comments`);
      const data = await res.json();
      setComments(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error(error);
      setComments([]);
    }
  };

  const handleAddComment = async () => {
    if (!activeComments || !commentValue.trim() || !requireUser()) return;
    setBusyId(activeComments.id);

    try {
      const payload = replyTo ? `@${replyTo.username} ${commentValue}` : commentValue;
      const res = await apiFetch(`/api/gigs/${activeComments.id}/comment`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: payload }),
      });
      const data = await res.json();

      setComments(prev => [{
        id: data.id,
        username: currentUser?.username || 'You',
        text: payload,
        created_at: new Date().toISOString(),
      }, ...prev]);

      updatePost(activeComments.id, post => ({
        ...post,
        comments_count: post.comments_count + 1,
      }));

      setCommentValue('');
      setReplyTo(null);
    } catch (error) {
      console.error(error);
    } finally {
      setBusyId(null);
    }
  };

  const handleFollow = async (post: Post) => {
    if (!requireUser()) return;
    setBusyId(post.id);
    try {
      const res = await apiFetch(`/api/profile/follow/${post.creator_user_id || post.user_id}`, { method: 'POST' });
      const data = await res.json();
      updatePost(post.id, item => ({ ...item, following_by_me: data.following }));
    } catch (error) {
      console.error(error);
    } finally {
      setBusyId(null);
    }
  };

  const handleMute = async (post: Post) => {
    if (!requireUser()) return;
    setBusyId(post.id);
    try {
      await apiFetch(`/api/profile/mute/${post.creator_user_id || post.user_id}`, { method: 'POST' });
      setPosts(prev => prev.filter(item => item.id !== post.id));
      setMenuPost(null);
    } catch (error) {
      console.error(error);
    } finally {
      setBusyId(null);
    }
  };

  const handleBlock = async (post: Post) => {
    if (!requireUser()) return;
    setBusyId(post.id);
    try {
      await apiFetch(`/api/profile/block/${post.creator_user_id || post.user_id}`, { method: 'POST' });
      setPosts(prev => prev.filter(item => item.id !== post.id));
      setMenuPost(null);
    } catch (error) {
      console.error(error);
    } finally {
      setBusyId(null);
    }
  };

  const handleHide = async (post: Post) => {
    if (!requireUser()) return;
    setBusyId(post.id);
    try {
      await apiFetch(`/api/gigs/${post.id}/hide`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reason: 'not interested' }),
      });
      setPosts(prev => prev.filter(item => item.id !== post.id));
      setMenuPost(null);
    } catch (error) {
      console.error(error);
    } finally {
      setBusyId(null);
    }
  };

  const handleReport = async () => {
    if (!reportPost || !requireUser()) return;
    setBusyId(reportPost.id);
    try {
      await apiFetch(`/api/gigs/${reportPost.id}/report`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reason: reportReason, details: reportDetails }),
      });
      setReportPost(null);
      setMenuPost(null);
      setReportDetails('');
      setReportReason(REPORT_REASONS[0].key);
    } catch (error) {
      console.error(error);
    } finally {
      setBusyId(null);
    }
  };

  const openShare = (post: Post) => {
    setSharePost(post);
    setCopied(false);
  };

  const copyLink = async () => {
    if (!sharePost || typeof window === 'undefined') return;
    const url = `${window.location.origin}/dashboard/post/${sharePost.id}`;
    await navigator.clipboard.writeText(url);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1500);
  };

  const shareUrl = useMemo(() => {
    if (!sharePost || typeof window === 'undefined') return '';
    return `${window.location.origin}/dashboard/post/${sharePost.id}`;
  }, [sharePost]);

  const shareText = sharePost ? `Check out this work by ${sharePost.user_name} on Workora` : '';

  const goToCreateFromPost = (post: Post, mode: 'repost' | 'remix') => {
    router.push(`/dashboard/create/new?source=${post.id}&mode=${mode}`);
  };

  const startConversation = async (otherUserId: string) => {
    if (!requireUser()) return;
    try {
      const res = await apiFetch('/api/messages/conversations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user_id: currentUser?.id, other_user_id: otherUserId }),
      });
      if (res.ok) {
        const conv = await res.json();
        router.push(`/dashboard/messages?conversation=${conv.id}`);
        return;
      }
    } catch (error) {
      console.error(error);
    }
    router.push('/dashboard/messages');
  };

  const currentScopeCopy = scopeCopy[scope];

  return (
    <div className="min-h-full bg-[#f6f7fb] text-zinc-950 dark:bg-black dark:text-white">
      <div className="sticky top-0 z-40 border-b border-zinc-200/70 bg-white/95 backdrop-blur-xl dark:border-zinc-900 dark:bg-black/90">
        <div className="mx-auto flex max-w-[1200px] items-center justify-between px-4 pt-3 pb-2 sm:px-6">
          <div>
            <h1 className="text-[22px] font-black tracking-tight sm:text-2xl">Feed</h1>
            <p className="hidden text-[13px] text-zinc-500 dark:text-zinc-400 sm:block">
              Live work from the people you follow and discover.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => router.push('/dashboard/create/new')}
              className="inline-flex h-10 items-center gap-2 rounded-xl bg-[#0057FF] px-4 text-sm font-semibold text-white transition-colors hover:bg-[#0047d1]"
            >
              <PlusSquare size={18} weight="bold" />
              Create
            </button>
          </div>
        </div>

        <div className="mx-auto max-w-[1200px] overflow-x-auto px-2 pb-3 no-scrollbar sm:px-4">
          <div className="flex min-w-max gap-2">
            {SCOPES.map(item => (
              <button
                key={item.key}
                onClick={() => syncScope(item.key)}
                className={`rounded-xl px-4 py-2 text-sm font-semibold transition-colors ${
                  scope === item.key
                    ? 'bg-zinc-950 text-white dark:bg-white dark:text-zinc-950'
                    : 'bg-zinc-100 text-zinc-600 hover:bg-zinc-200 dark:bg-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-800'
                }`}
                title={item.description}
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <main className="mx-auto grid max-w-[1200px] gap-6 px-3 py-4 pb-24 lg:grid-cols-[minmax(0,1fr)_320px] lg:px-6 lg:pb-8">
        <section className="min-w-0">
          <div className="mb-4 overflow-hidden rounded-2xl bg-white shadow-sm shadow-black/5 dark:bg-zinc-950">
            <div className="flex gap-4 overflow-x-auto px-4 py-4 no-scrollbar">
              {stories.length > 0 ? stories.map((story) => (
                <button
                  key={story.id}
                  className="flex shrink-0 flex-col items-center gap-2"
                  onClick={() => router.push(`/dashboard/stories/${story.id}`)}
                >
                  <div className="h-16 w-16 rounded-full bg-gradient-to-tr from-[#0057FF] via-[#4F46E5] to-[#8B5CF6] p-[2px]">
                    <div className="flex h-full w-full items-center justify-center rounded-full bg-white text-zinc-950 dark:bg-black dark:text-white">
                      <span className="text-base font-black">{story.name.charAt(0)}</span>
                    </div>
                  </div>
                  <span className="max-w-[72px] truncate text-[11px] font-medium text-zinc-600 dark:text-zinc-400">
                    {story.name.split(' ')[0]}
                  </span>
                </button>
              )) : (
                <div className="flex items-center gap-3 text-sm text-zinc-400">
                  <Sparkle size={18} />
                  Stories will appear here as people post.
                </div>
              )}
            </div>
          </div>

          {feedError && !loading ? (
            <div className="rounded-2xl bg-white p-8 text-center shadow-sm shadow-black/5 dark:bg-zinc-950">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-zinc-100 dark:bg-zinc-900">
                <WarningCircle size={28} weight="fill" className="text-[#4F46E5]" />
              </div>
              <h2 className="text-xl font-black">{currentScopeCopy.emptyTitle}</h2>
              <p className="mx-auto mt-2 max-w-md text-sm text-zinc-500 dark:text-zinc-400">{feedError}</p>
              <button
                onClick={() => fetchFeed(scope, 1, false)}
                className="mt-5 inline-flex items-center gap-2 rounded-xl bg-zinc-950 px-4 py-2 text-sm font-semibold text-white dark:bg-white dark:text-zinc-950"
              >
                <ArrowClockwise size={16} weight="bold" />
                Retry
              </button>
            </div>
          ) : loading ? (
            <div className="space-y-4">
              {[1, 2].map(item => (
                <div key={item} className="overflow-hidden rounded-2xl bg-white shadow-sm shadow-black/5 dark:bg-zinc-950">
                  <div className="flex items-center gap-3 px-4 py-4">
                    <div className="h-10 w-10 rounded-full bg-zinc-100 dark:bg-zinc-900 animate-pulse" />
                    <div className="h-4 w-36 rounded-full bg-zinc-100 dark:bg-zinc-900 animate-pulse" />
                  </div>
                  <div className="aspect-[4/5] bg-zinc-100 dark:bg-zinc-900 animate-pulse" />
                  <div className="space-y-3 px-4 py-4">
                    <div className="h-4 w-28 rounded-full bg-zinc-100 dark:bg-zinc-900 animate-pulse" />
                    <div className="h-3 w-full rounded-full bg-zinc-100 dark:bg-zinc-900 animate-pulse" />
                    <div className="h-3 w-2/3 rounded-full bg-zinc-100 dark:bg-zinc-900 animate-pulse" />
                  </div>
                </div>
              ))}
            </div>
          ) : posts.length > 0 ? (
            <div className="space-y-4">
              {posts.map(post => (
                <article key={post.id} className="overflow-hidden rounded-2xl bg-white shadow-sm shadow-black/5 dark:bg-zinc-950">
                  <div className="flex items-center justify-between px-4 py-4">
                    <div className="flex items-center gap-3 min-w-0">
                      <Link
                        href={`/profile/${post.creator_user_id || post.user_id}`}
                        className="h-11 w-11 shrink-0 rounded-full bg-gradient-to-tr from-[#0057FF] via-[#4F46E5] to-[#8B5CF6] p-[2px] transition-transform hover:scale-105"
                        aria-label={`View ${post.user_name}'s profile`}
                      >
                        <div className="flex h-full w-full items-center justify-center rounded-full bg-white text-sm font-black text-zinc-950 dark:bg-black dark:text-white">
                          {post.user_name.charAt(0)}
                        </div>
                      </Link>
                      <div className="min-w-0">
                        <Link href={`/profile/${post.creator_user_id || post.user_id}`} className="flex items-center gap-1.5">
                          <p className="truncate text-sm font-semibold hover:text-[#0057FF] dark:hover:text-[#4D9FFF] transition-colors">{post.user_name}</p>
                          {post.verified && <SealCheck size={14} weight="fill" className="text-[#4F46E5]" />}
                        </Link>
                        <p className="truncate text-xs text-zinc-500 dark:text-zinc-400">{post.trade}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleFollow(post)}
                        disabled={busyId === post.id}
                        className={`rounded-xl px-3 py-2 text-xs font-semibold transition-colors ${
                          post.following_by_me
                            ? 'bg-zinc-200 text-zinc-800 dark:bg-zinc-800 dark:text-zinc-200'
                            : 'bg-[#0057FF] text-white hover:bg-[#0047d1]'
                        }`}
                      >
                        {post.following_by_me ? 'Following' : 'Follow'}
                      </button>
                      <button
                        onClick={() => setMenuPost(post)}
                        className="rounded-xl bg-zinc-100 p-2 text-zinc-600 transition-colors hover:bg-zinc-200 dark:bg-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-800"
                      >
                        <DotsThree size={20} weight="bold" />
                      </button>
                    </div>
                  </div>

                  <div
                    className="relative aspect-[4/5] cursor-pointer bg-black"
                    onClick={() => router.push(`/dashboard/post/${post.id}`)}
                  >
                    <VideoPlayer
                      src={post.video_url}
                      poster={post.thumbnail_url || APP_CONFIG.defaults.thumbnail}
                      className="h-full w-full object-cover"
                      autoPlay
                    />
                  </div>

                  <div className="space-y-3 px-4 py-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <button
                          onClick={() => handleLike(post.id)}
                          disabled={busyId === post.id}
                          className={`inline-flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-semibold transition-colors ${
                            post.liked_by_me
                              ? 'bg-[#EEF2FF] text-[#4F46E5] dark:bg-[#1B1F3A] dark:text-[#A5B4FC]'
                              : 'bg-zinc-100 text-zinc-700 hover:bg-zinc-200 dark:bg-zinc-900 dark:text-zinc-300 dark:hover:bg-zinc-800'
                          }`}
                        >
                          <Heart size={18} weight={post.liked_by_me ? 'fill' : 'regular'} />
                          {formatCount(post.likes_count)}
                        </button>
                        <button
                          onClick={() => fetchPostComments(post)}
                          className="inline-flex items-center gap-2 rounded-xl bg-zinc-100 px-3 py-2 text-sm font-semibold text-zinc-700 transition-colors hover:bg-zinc-200 dark:bg-zinc-900 dark:text-zinc-300 dark:hover:bg-zinc-800"
                        >
                          <ChatCircleDots size={18} weight="regular" />
                          {formatCount(post.comments_count)}
                        </button>
                        <button
                          onClick={() => openShare(post)}
                          className="inline-flex items-center gap-2 rounded-xl bg-zinc-100 px-3 py-2 text-sm font-semibold text-zinc-700 transition-colors hover:bg-zinc-200 dark:bg-zinc-900 dark:text-zinc-300 dark:hover:bg-zinc-800"
                        >
                          <ShareFat size={18} weight="regular" />
                          Share
                        </button>
                      </div>
                      <button
                        onClick={() => handleSave(post)}
                        className="rounded-xl bg-zinc-100 p-2 text-zinc-700 transition-colors hover:bg-zinc-200 dark:bg-zinc-900 dark:text-zinc-300 dark:hover:bg-zinc-800"
                      >
                        <BookmarkSimple size={20} weight={post.saved_by_me ? 'fill' : 'regular'} />
                      </button>
                    </div>

                    <div className="space-y-2">
                      <div className="text-sm leading-6 text-zinc-900 dark:text-white">
                        <span className="font-semibold">{post.handle || post.user_name}</span>
                        <span className="ml-2 font-normal text-zinc-600 dark:text-zinc-300">{post.description}</span>
                      </div>
                      <div className="flex items-center gap-4 text-xs text-zinc-500 dark:text-zinc-400">
                        <span>{formatCount(post.view_count)} views</span>
                        <span>{timeAgo(post.created_at)}</span>
                      </div>
                    </div>
                  </div>
                </article>
              ))}

              {hasMore && (
                <div className="flex justify-center py-6">
                  <button
                    onClick={loadMore}
                    disabled={loadingMore}
                    className="rounded-xl bg-zinc-950 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-zinc-800 disabled:opacity-60 dark:bg-white dark:text-zinc-950 dark:hover:bg-zinc-200"
                  >
                    {loadingMore ? 'Loading more' : 'Load more'}
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="rounded-2xl bg-white px-6 py-16 text-center shadow-sm shadow-black/5 dark:bg-zinc-950">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-zinc-100 dark:bg-zinc-900">
                <PlusSquare size={28} weight="regular" className="text-zinc-500 dark:text-zinc-400" />
              </div>
              <h2 className="text-xl font-black">{currentScopeCopy.emptyTitle}</h2>
              <p className="mx-auto mt-2 max-w-md text-sm text-zinc-500 dark:text-zinc-400">{currentScopeCopy.emptyBody}</p>
              <div className="mt-5 flex items-center justify-center gap-3">
                <button
                  onClick={() => fetchFeed(scope, 1, false)}
                  className="rounded-xl bg-zinc-950 px-4 py-2 text-sm font-semibold text-white dark:bg-white dark:text-zinc-950"
                >
                  Refresh feed
                </button>
                <button
                  onClick={() => router.push('/dashboard/create/new')}
                  className="rounded-xl bg-zinc-100 px-4 py-2 text-sm font-semibold text-zinc-800 dark:bg-zinc-900 dark:text-zinc-200"
                >
                  Share work
                </button>
              </div>
            </div>
          )}
        </section>

        <aside className="hidden lg:block space-y-4">
          <div className="rounded-2xl bg-white p-4 shadow-sm shadow-black/5 dark:bg-zinc-950">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-zinc-400 dark:text-zinc-500">Account</p>
                <h3 className="mt-1 text-lg font-black">{currentUser?.username || 'Guest'}</h3>
              </div>
              <Link
                href="/dashboard/profile"
                className="rounded-xl bg-zinc-100 px-3 py-2 text-xs font-semibold text-zinc-700 dark:bg-zinc-900 dark:text-zinc-300"
              >
                Profile
              </Link>
            </div>
            <div className="mt-4 flex items-center gap-3 rounded-xl bg-gradient-to-br from-[#0057FF]/[0.08] to-[#8B5CF6]/[0.08] p-3 dark:from-[#0057FF]/[0.12] dark:to-[#8B5CF6]/[0.12]">
              <div className="flex h-11 w-11 items-center justify-center rounded-full bg-gradient-to-tr from-[#0057FF] via-[#4F46E5] to-[#8B5CF6] text-sm font-black text-white">
                {currentUser?.username?.charAt(0) || 'U'}
              </div>
              <div>
                <p className="text-sm font-semibold">Welcome back 👋</p>
                <p className="text-xs text-zinc-500 dark:text-zinc-400">Post your work, follow creators, and grow your reputation.</p>
              </div>
            </div>
          </div>

          <div className="rounded-2xl bg-white p-4 shadow-sm shadow-black/5 dark:bg-zinc-950">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-sm font-black uppercase tracking-[0.2em] text-zinc-400 dark:text-zinc-500">Suggested creators</h3>
              <Link href="/dashboard/search" className="text-xs font-semibold text-[#0057FF] hover:underline dark:text-[#4D9FFF]">
                See all
              </Link>
            </div>
            <div className="space-y-4">
              {suggestedPros.length > 0 ? suggestedPros.map(pro => (
                <div key={pro.id} className="flex items-center justify-between gap-3">
                  <Link href={`/profile/${pro.user_id}`} className="group flex min-w-0 items-center gap-3">
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-zinc-100 text-sm font-black text-zinc-500 transition-transform group-hover:scale-105 dark:bg-zinc-900 dark:text-zinc-400">
                      {pro.name.charAt(0)}
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5">
                        <p className="truncate text-sm font-semibold group-hover:text-[#0057FF] dark:group-hover:text-[#4D9FFF] transition-colors">{pro.name}</p>
                        {pro.is_verified && <SealCheck size={14} weight="fill" className="text-[#4F46E5]" />}
                      </div>
                      <div className="flex items-center gap-2 text-xs text-zinc-500 dark:text-zinc-400">
                        <span className="inline-flex items-center gap-1">
                          <Star size={12} weight="fill" className="text-amber-500" />
                          {pro.rating.toFixed(1)}
                        </span>
                        <span>{pro.trade}</span>
                      </div>
                    </div>
                  </Link>
                  <button
                    onClick={() => startConversation(pro.user_id)}
                    className="rounded-xl bg-zinc-100 px-3 py-2 text-xs font-semibold text-zinc-700 transition-colors hover:bg-zinc-200 dark:bg-zinc-900 dark:text-zinc-300 dark:hover:bg-zinc-800"
                  >
                    Connect
                  </button>
                </div>
              )) : (
                <p className="text-sm text-zinc-500 dark:text-zinc-400">Creators will show here once the directory has data.</p>
              )}
            </div>
          </div>

          <div className="rounded-2xl bg-gradient-to-br from-[#0057FF] via-[#4F46E5] to-[#8B5CF6] p-[1px]">
            <div className="rounded-2xl bg-white p-4 dark:bg-zinc-950">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-zinc-400 dark:text-zinc-500">Grow your reputation</p>
              <h3 className="mt-1 text-lg font-black">Share proof of work</h3>
              <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
                Post photos or videos of a recent job. Every view, like, and comment builds your trust score.
              </p>
              <button
                onClick={() => router.push('/dashboard/create/new')}
                className="mt-4 w-full rounded-xl bg-gradient-to-r from-[#0057FF] to-[#7000FF] px-4 py-2.5 text-sm font-semibold text-white transition-opacity hover:opacity-90"
              >
                Share your work
              </button>
            </div>
          </div>
        </aside>
      </main>

      <AnimatePresence>
        {activeComments && (
          <div className="fixed inset-0 z-[70] flex items-end justify-center bg-black/60 p-3 backdrop-blur-md sm:items-center">
            <motion.div
              initial={{ y: 80, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 80, opacity: 0 }}
              className="flex max-h-[85vh] w-full max-w-lg flex-col overflow-hidden rounded-3xl bg-white shadow-2xl dark:bg-zinc-950"
            >
              <div className="flex items-center justify-between border-b border-zinc-100 px-5 py-4 dark:border-zinc-900">
                <div>
                  <h3 className="text-lg font-black">Comments</h3>
                  <p className="text-xs text-zinc-500 dark:text-zinc-400">{formatCount(activeComments.comments_count)} total</p>
                </div>
                <button
                  onClick={() => {
                    setActiveComments(null);
                    setReplyTo(null);
                    setCommentValue('');
                  }}
                  className="rounded-xl bg-zinc-100 p-2 text-zinc-600 dark:bg-zinc-900 dark:text-zinc-300"
                >
                  <X size={18} weight="bold" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto px-5 py-4">
                {comments.length > 0 ? comments.map(comment => (
                  <div key={comment.id} className="mb-4 flex gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-zinc-100 text-sm font-black text-zinc-500 dark:bg-zinc-900 dark:text-zinc-300">
                      {comment.username.charAt(0)}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <p className="text-sm font-semibold">{comment.username}</p>
                        <span className="text-xs text-zinc-400">{timeAgo(comment.created_at)}</span>
                      </div>
                      <p className="mt-1 text-sm leading-6 text-zinc-700 dark:text-zinc-300">{comment.text}</p>
                      <div className="mt-2 flex items-center gap-3 text-xs font-semibold text-zinc-500 dark:text-zinc-400">
                        <button onClick={() => setReplyTo({ username: comment.username })} className="hover:text-[#0057FF] dark:hover:text-[#4D9FFF] transition-colors">Reply</button>
                      </div>
                    </div>
                  </div>
                )) : (
                  <div className="flex flex-col items-center justify-center py-20 text-center">
                    <ChatCircleDots size={40} weight="duotone" className="text-zinc-200 dark:text-zinc-800" />
                    <p className="mt-3 text-sm font-medium text-zinc-500 dark:text-zinc-400">No comments yet</p>
                  </div>
                )}
              </div>

              <div className="border-t border-zinc-100 px-4 py-4 dark:border-zinc-900">
                {replyTo && (
                  <div className="mb-3 flex items-center justify-between rounded-xl bg-zinc-50 px-3 py-2 text-xs font-semibold text-zinc-600 dark:bg-zinc-900 dark:text-zinc-300">
                    <span>Replying to @{replyTo.username}</span>
                    <button onClick={() => setReplyTo(null)} className="text-[#4F46E5]">Clear</button>
                  </div>
                )}
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-zinc-100 text-sm font-black text-zinc-500 dark:bg-zinc-900 dark:text-zinc-300">
                    {currentUser?.username?.charAt(0) || 'U'}
                  </div>
                  <input
                    value={commentValue}
                    onChange={(event) => setCommentValue(event.target.value)}
                    onKeyDown={(event) => event.key === 'Enter' && handleAddComment()}
                    placeholder={replyTo ? `Reply to @${replyTo.username}` : 'Add a comment'}
                    className="h-12 flex-1 rounded-xl bg-zinc-100 px-4 text-sm outline-none placeholder:text-zinc-400 dark:bg-zinc-900 dark:text-white"
                  />
                  <button
                    onClick={handleAddComment}
                    disabled={!commentValue.trim() || busyId === activeComments.id}
                    className="inline-flex h-12 items-center justify-center rounded-xl bg-[#0057FF] px-4 text-white disabled:opacity-50"
                  >
                    <PaperPlaneTilt size={18} weight="fill" />
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {sharePost && (
          <div className="fixed inset-0 z-[80] flex items-end justify-center bg-black/60 p-3 backdrop-blur-md sm:items-center">
            <motion.div
              initial={{ y: 100, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 100, opacity: 0 }}
              className="w-full max-w-md rounded-3xl bg-white p-5 shadow-2xl dark:bg-zinc-950"
            >
              <div className="mb-5 flex items-center justify-between">
                <h3 className="text-lg font-black">Share</h3>
                <button onClick={() => setSharePost(null)} className="rounded-xl bg-zinc-100 p-2 text-zinc-600 dark:bg-zinc-900 dark:text-zinc-300">
                  <X size={18} weight="bold" />
                </button>
              </div>

              <div className="grid grid-cols-4 gap-3">
                <a href={`https://wa.me/?text=${encodeURIComponent(`${shareText} ${shareUrl}`)}`} target="_blank" rel="noreferrer" className="flex flex-col items-center gap-2">
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-green-50 text-green-600">
                    <WhatsappLogo size={28} weight="fill" />
                  </div>
                  <span className="text-[10px] font-semibold text-zinc-500">WhatsApp</span>
                </a>
                <a href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`} target="_blank" rel="noreferrer" className="flex flex-col items-center gap-2">
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-sky-50 text-sky-500">
                    <TwitterLogo size={28} weight="fill" />
                  </div>
                  <span className="text-[10px] font-semibold text-zinc-500">X</span>
                </a>
                <button onClick={copyLink} className="flex flex-col items-center gap-2">
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-zinc-100 text-zinc-700 dark:bg-zinc-900 dark:text-zinc-300">
                    {copied ? <Check size={24} weight="bold" /> : <Copy size={24} weight="fill" />}
                  </div>
                  <span className="text-[10px] font-semibold text-zinc-500">{copied ? 'Copied' : 'Copy'}</span>
                </button>
                <a href={`mailto:?subject=${encodeURIComponent(shareText)}&body=${encodeURIComponent(shareUrl)}`} className="flex flex-col items-center gap-2">
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-violet-50 text-violet-600">
                    <LinkIcon size={28} weight="fill" />
                  </div>
                  <span className="text-[10px] font-semibold text-zinc-500">Link</span>
                </a>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {menuPost && (
          <div className="fixed inset-0 z-[85] flex items-end justify-center bg-black/60 p-3 backdrop-blur-md sm:items-center">
            <motion.div
              initial={{ y: 100, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 100, opacity: 0 }}
              className="w-full max-w-md rounded-3xl bg-white p-4 shadow-2xl dark:bg-zinc-950"
            >
              <div className="mb-4 flex items-center justify-between">
                <h3 className="text-lg font-black">Post actions</h3>
                <button onClick={() => setMenuPost(null)} className="rounded-xl bg-zinc-100 p-2 text-zinc-600 dark:bg-zinc-900 dark:text-zinc-300">
                  <X size={18} weight="bold" />
                </button>
              </div>

              <div className="space-y-2">
                <button
                  onClick={() => {
                    handleFollow(menuPost);
                    setMenuPost(null);
                  }}
                  className="flex w-full items-center justify-between rounded-2xl bg-zinc-100 px-4 py-3 text-left text-sm font-semibold dark:bg-zinc-900"
                >
                  <span>{menuPost.following_by_me ? 'Unfollow creator' : 'Follow creator'}</span>
                  <Users size={18} />
                </button>
                <button
                  onClick={() => {
                    goToCreateFromPost(menuPost, 'repost');
                    setMenuPost(null);
                  }}
                  className="flex w-full items-center justify-between rounded-2xl bg-zinc-100 px-4 py-3 text-left text-sm font-semibold dark:bg-zinc-900"
                >
                  <span>Repost work</span>
                  <Rewind size={18} />
                </button>
                <button
                  onClick={() => {
                    goToCreateFromPost(menuPost, 'remix');
                    setMenuPost(null);
                  }}
                  className="flex w-full items-center justify-between rounded-2xl bg-zinc-100 px-4 py-3 text-left text-sm font-semibold dark:bg-zinc-900"
                >
                  <span>Remix or reuse</span>
                  <Sparkle size={18} />
                </button>
                <button
                  onClick={() => {
                    handleMute(menuPost);
                  }}
                  className="flex w-full items-center justify-between rounded-2xl bg-zinc-100 px-4 py-3 text-left text-sm font-semibold dark:bg-zinc-900"
                >
                  <span>Mute creator</span>
                  <SpeakerSlash size={18} />
                </button>
                <button
                  onClick={() => {
                    handleHide(menuPost);
                  }}
                  className="flex w-full items-center justify-between rounded-2xl bg-zinc-100 px-4 py-3 text-left text-sm font-semibold dark:bg-zinc-900"
                >
                  <span>Hide post</span>
                  <EyeSlash size={18} />
                </button>
                <button
                  onClick={() => {
                    setReportPost(menuPost);
                    setMenuPost(null);
                  }}
                  className="flex w-full items-center justify-between rounded-2xl bg-zinc-100 px-4 py-3 text-left text-sm font-semibold dark:bg-zinc-900"
                >
                  <span>Report content</span>
                  <Flag size={18} />
                </button>
                <button
                  onClick={() => {
                    handleBlock(menuPost);
                  }}
                  className="flex w-full items-center justify-between rounded-2xl bg-zinc-100 px-4 py-3 text-left text-sm font-semibold dark:bg-zinc-900"
                >
                  <span>Block creator</span>
                  <WarningCircle size={18} />
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {reportPost && (
          <div className="fixed inset-0 z-[90] flex items-end justify-center bg-black/60 p-3 backdrop-blur-md sm:items-center">
            <motion.div
              initial={{ y: 100, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 100, opacity: 0 }}
              className="w-full max-w-md rounded-3xl bg-white p-5 shadow-2xl dark:bg-zinc-950"
            >
              <div className="mb-4 flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-black">Report content</h3>
                  <p className="text-xs text-zinc-500 dark:text-zinc-400">Help us keep the feed clean.</p>
                </div>
                <button onClick={() => setReportPost(null)} className="rounded-xl bg-zinc-100 p-2 text-zinc-600 dark:bg-zinc-900 dark:text-zinc-300">
                  <X size={18} weight="bold" />
                </button>
              </div>

              <div className="space-y-2">
                {REPORT_REASONS.map(reason => (
                  <button
                    key={reason.key}
                    onClick={() => setReportReason(reason.key)}
                    className={`flex w-full items-center justify-between rounded-2xl px-4 py-3 text-left text-sm font-semibold ${
                      reportReason === reason.key
                        ? 'bg-[#EEF2FF] text-[#4F46E5] dark:bg-[#1B1F3A] dark:text-[#A5B4FC]'
                        : 'bg-zinc-100 text-zinc-700 dark:bg-zinc-900 dark:text-zinc-300'
                    }`}
                  >
                    <span>{reason.label}</span>
                    {reportReason === reason.key && <Check size={18} weight="bold" />}
                  </button>
                ))}
                <textarea
                  value={reportDetails}
                  onChange={(event) => setReportDetails(event.target.value)}
                  rows={3}
                  placeholder="Add details"
                  className="mt-2 w-full rounded-2xl bg-zinc-100 px-4 py-3 text-sm outline-none placeholder:text-zinc-400 dark:bg-zinc-900 dark:text-white"
                />
                <div className="flex gap-3 pt-2">
                  <button
                    onClick={() => setReportPost(null)}
                    className="flex-1 rounded-2xl bg-zinc-100 px-4 py-3 text-sm font-semibold text-zinc-700 dark:bg-zinc-900 dark:text-zinc-300"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleReport}
                    className="flex-1 rounded-2xl bg-[#0057FF] px-4 py-3 text-sm font-semibold text-white"
                  >
                    Send report
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
