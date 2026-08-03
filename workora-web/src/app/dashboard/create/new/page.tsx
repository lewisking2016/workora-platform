'use client';

import React, { useState, useRef, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { useSearchParams } from 'next/navigation';
import {
  X,
  ArrowLeft,
  ArrowRight,
  Smiley,
  MapPin,
  Users,
  MusicNotes,
  Sparkle,
  Check
} from '@phosphor-icons/react';
import { fetchCurrentUser } from '@/lib/session';

interface Filter {
  name: string;
  css: string;
}

const FILTERS: Filter[] = [
  { name: 'Normal', css: 'none' },
  { name: 'Clarendon', css: 'contrast(1.2) saturate(1.35)' },
  { name: 'Gingham', css: 'brightness(1.05) hue-rotate(-10deg)' },
  { name: 'Moon', css: 'grayscale(1) contrast(1.1) brightness(1.1)' },
  { name: 'Lark', css: 'contrast(0.9) brightness(1.1)' },
  { name: 'Reyes', css: 'sepia(0.22) brightness(1.1) contrast(0.85)' },
  { name: 'Juno', css: 'sepia(0.35) contrast(1.15) brightness(1.15) saturate(1.8)' },
  { name: 'Slumber', css: 'sepia(0.35) saturate(1.2)' },
  { name: 'Crema', css: 'sepia(0.5) contrast(1.25)' },
  { name: 'Ludwig', css: 'sepia(0.25) contrast(1.05) brightness(1.05) saturate(1.2)' },
  { name: 'Aden', css: 'sepia(0.2) brightness(1.15) saturate(0.85) hue-rotate(-10deg)' },
  { name: 'Perpetua', css: 'contrast(1.1) brightness(1.25)' },
];

export default function NewPostPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const mode = useMemo(() => {
    const value = searchParams.get('type') || 'post';
    return ['post', 'reel', 'story', 'gig', 'proof', 'media'].includes(value) ? value : 'post';
  }, [searchParams]);
  const [step, setStep] = useState<'upload' | 'filter' | 'details'>('upload');
  const [mediaFile, setMediaFile] = useState<File | null>(null);
  const [mediaPreview, setMediaPreview] = useState<string>('');
  const [mediaType, setMediaType] = useState<'image' | 'video'>('image');
  const [selectedFilter, setSelectedFilter] = useState(0);
  const [caption, setCaption] = useState('');
  const [location, setLocation] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [trade, setTrade] = useState('');
  const [fileError, setFileError] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (videoRef.current && mediaPreview && mediaType === 'video') {
      videoRef.current.load();
    }
  }, [selectedFilter, mediaPreview, mediaType]);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setFileError('');

    const isVideo = file.type.startsWith('video/');
    const isImage = file.type.startsWith('image/');
    if (!isVideo && !isImage) {
      setFileError('Only image and video files are supported.');
      return;
    }

    const maxSize = 250 * 1024 * 1024;
    if (file.size > maxSize) {
      setFileError('That file is too large for the live upload limit.');
      return;
    }

    setMediaType(isVideo ? 'video' : 'image');
    setMediaFile(file);

    const reader = new FileReader();
    reader.onloadend = () => {
      setMediaPreview(reader.result as string);
      setStep('filter');
    };
    reader.readAsDataURL(file);
  };

  const handlePost = async () => {
    if (!mediaFile) return;
    
    setIsUploading(true);
    try {
      const { url, user, profile } = await uploadMedia();
      if (!profile?.id) throw new Error('Profile not found');

      const postRes = await fetch('/api/gigs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          worker_id: profile.id,
          user_id: user.id,
          title: caption.substring(0, 50) || 'New Work',
          description: caption,
          video_url: url,
          thumbnail_url: url,
          category: trade || 'work'
        }),
      });

      if (!postRes.ok) throw new Error('Failed to create post');

      router.push('/dashboard/create/published-success');
    } catch (err: unknown) {
      setFileError(err instanceof Error ? err.message : 'Something went wrong');
      setIsUploading(false);
    }
  };

  const uploadMedia = async () => {
    const user = await fetchCurrentUser();
    if (!user) throw new Error('Not logged in');
    const profileRes = await fetch('/api/profile/me');
    const profileData = await profileRes.json().catch(() => ({}));

    const formData = new FormData();
    formData.append('file', mediaFile as File);
    formData.append('user_id', user.id);
    formData.append('media_type', mediaType);

    const uploadRes = await fetch('/api/upload/gig', {
      method: 'POST',
      body: formData,
    });

    const uploadData = await uploadRes.json();
    if (!uploadRes.ok) throw new Error(uploadData.error || 'Upload failed');

    return { ...uploadData, user, profile: profileData?.profile || null };
  };

  const handleSaveDraft = async () => {
    if (!mediaFile) return;

    setIsUploading(true);
    try {
      const { url, user, profile } = await uploadMedia();
      const draftRes = await fetch('/api/profile/drafts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          draft_type: mode === 'reel' ? 'reel' : mode === 'story' ? 'story' : mode === 'gig' ? 'gig' : mode === 'proof' ? 'proof' : 'post',
          title: caption.substring(0, 60) || `Draft ${mode}`,
          description: caption,
          media_url: url,
          thumbnail_url: url,
          profile_id: profile?.id || null,
          trade: trade || null,
          location: location || null,
          audience: 'public',
          status: 'draft',
          metadata: {
            user_id: user.id,
            media_type: mediaType,
            selected_filter: FILTERS[selectedFilter]?.name || 'Normal',
          },
        }),
      });

      if (!draftRes.ok) throw new Error('Failed to save draft');
      router.push('/dashboard/create/drafts');
    } catch (err: unknown) {
      setFileError(err instanceof Error ? err.message : 'Could not save draft');
      setIsUploading(false);
    }
  };

  if (isUploading) {
    return (
      <div className="h-full w-full bg-white dark:bg-black flex flex-col items-center justify-center">
        <div className="w-16 h-16 border-4 border-zinc-200 dark:border-zinc-800 border-t-[#0066FF] rounded-full animate-spin mb-4" />
        <p className="text-zinc-950 dark:text-white font-semibold">Sharing...</p>
      </div>
    );
  }

  return (
    <div className="h-full w-full flex flex-col bg-white dark:bg-black">
      {/* Header */}
      <div className="sticky top-0 z-50 bg-white dark:bg-black border-b border-zinc-100 dark:border-zinc-900 px-4 py-3 flex items-center justify-between">
        <button onClick={() => step === 'upload' ? router.back() : setStep(step === 'details' ? 'filter' : 'upload')}>
          {step === 'upload' ? (
            <X size={28} weight="regular" className="text-zinc-950 dark:text-white" />
          ) : (
            <ArrowLeft size={28} weight="regular" className="text-zinc-950 dark:text-white" />
          )}
        </button>
        <h1 className="text-base font-semibold text-zinc-950 dark:text-white">
          {mode === 'post' ? 'New post' : mode === 'reel' ? 'New reel' : mode === 'story' ? 'New story' : mode === 'gig' ? 'New gig' : 'New proof'}
        </h1>
        <button 
          onClick={() => {
            if (step === 'upload') {
              router.push('/dashboard/create');
              return;
            }
            if (step === 'filter') setStep('details');
            else handlePost();
          }}
          disabled={!mediaPreview}
          className="text-[#0066FF] font-semibold text-sm disabled:opacity-50"
        >
          {step === 'details' ? 'Share' : 'Next'}
        </button>
      </div>

      <div className="flex-1 overflow-y-auto">
        {/* UPLOAD STEP */}
        {step === 'upload' && (
          <div className="h-full flex flex-col items-center justify-center p-8">
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*,video/*"
              onChange={handleFileSelect}
              className="hidden"
            />
            
            {!mediaPreview ? (
              <div className="flex flex-col items-center gap-6 text-center">
                <div className="h-24 w-24 rounded-full bg-zinc-100 dark:bg-zinc-900 flex items-center justify-center">
                  <Sparkle size={48} weight="duotone" className="text-zinc-400" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-zinc-950 dark:text-white mb-2">
                    {mode === 'post' ? 'Create new post' : mode === 'reel' ? 'Create new reel' : mode === 'story' ? 'Create new story' : mode === 'gig' ? 'Create new gig' : 'Upload proof of work'}
                  </h2>
                  <p className="text-zinc-500 dark:text-zinc-400 text-sm">Share live work with the Workora community.</p>
                </div>
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="h-12 px-6 bg-[#0066FF] text-white rounded-xl font-semibold"
                >
                  {mode === 'story' ? 'Capture or upload' : 'Select from device'}
                </button>
              </div>
            ) : (
              <div className="w-full max-w-md aspect-square bg-black rounded-lg overflow-hidden">
                {mediaType === 'image' ? (
                  <img src={mediaPreview} alt="Preview" className="w-full h-full object-cover" />
                ) : (
                  <video src={mediaPreview} controls className="w-full h-full object-cover" />
                )}
              </div>
            )}
          </div>
        )}

        {fileError ? (
          <div className="mx-4 mt-4 rounded-[16px] border border-rose-200 bg-rose-50 p-4 text-sm font-medium text-rose-700 dark:border-rose-400/20 dark:bg-rose-400/10 dark:text-rose-200">
            {fileError}
          </div>
        ) : null}

        {/* FILTER STEP */}
        {step === 'filter' && (
          <div className="flex flex-col">
            {/* Preview */}
            <div className="w-full aspect-square bg-black relative">
              {mediaType === 'image' ? (
                <img 
                  src={mediaPreview} 
                  alt="Preview" 
                  className="w-full h-full object-cover"
                  style={{ filter: FILTERS[selectedFilter].css }}
                />
              ) : (
                <video 
                  ref={videoRef}
                  src={mediaPreview}
                  controls
                  loop
                  muted
                  autoPlay
                  playsInline
                  className="w-full h-full object-cover"
                  style={{ filter: FILTERS[selectedFilter].css }}
                />
              )}
            </div>

            {/* Filter List */}
            <div className="border-t border-zinc-100 dark:border-zinc-900 p-4">
              <div className="flex gap-3 overflow-x-auto scrollbar-hide pb-2">
                {FILTERS.map((filter, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedFilter(idx)}
                    className="flex flex-col items-center gap-2 min-w-[80px] shrink-0"
                  >
                    <div className={`relative w-20 h-20 rounded-lg overflow-hidden border-2 ${selectedFilter === idx ? 'border-[#0066FF]' : 'border-zinc-200 dark:border-zinc-800'}`}>
                      {mediaType === 'image' ? (
                        <img 
                          src={mediaPreview} 
                          alt={filter.name}
                          className="w-full h-full object-cover"
                          style={{ filter: filter.css }}
                        />
                      ) : (
                        <video 
                          src={mediaPreview}
                          className="w-full h-full object-cover"
                          style={{ filter: filter.css }}
                          muted
                        />
                      )}
                      {selectedFilter === idx && (
                        <div className="absolute inset-0 flex items-center justify-center bg-black/20">
                          <div className="h-6 w-6 rounded-full bg-[#0066FF] flex items-center justify-center">
                            <Check size={14} weight="bold" className="text-white" />
                          </div>
                        </div>
                      )}
                    </div>
                    <span className={`text-xs font-medium ${selectedFilter === idx ? 'text-zinc-950 dark:text-white' : 'text-zinc-500'}`}>
                      {filter.name}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* DETAILS STEP */}
        {step === 'details' && (
          <div className="flex flex-col">
            {/* Small Preview */}
              <div className="p-4 border-b border-zinc-100 dark:border-zinc-900">
                <div className="flex gap-3">
                <div className="w-24 h-24 bg-black rounded-lg overflow-hidden shrink-0">
                  {mediaType === 'image' ? (
                    <img 
                      src={mediaPreview} 
                      alt="Preview" 
                      className="w-full h-full object-cover"
                      style={{ filter: FILTERS[selectedFilter].css }}
                    />
                  ) : (
                    <video 
                      src={mediaPreview}
                      className="w-full h-full object-cover"
                      style={{ filter: FILTERS[selectedFilter].css }}
                      muted
                    />
                  )}
                </div>
                <div className="flex-1">
                  <textarea
                    value={caption}
                    onChange={(e) => setCaption(e.target.value)}
                    placeholder="Write a caption..."
                    className="w-full h-full bg-transparent outline-none text-sm text-zinc-950 dark:text-white placeholder:text-zinc-400 resize-none"
                    maxLength={2200}
                  />
                </div>
              </div>
              <div className="flex items-center justify-between mt-2">
                <button className="text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300">
                  <Smiley size={20} />
                </button>
                <span className="text-xs text-zinc-400">{caption.length}/2,200</span>
                </div>
              </div>

            {/* Options */}
            <div className="divide-y divide-zinc-100 dark:divide-zinc-900">
              <div className="w-full px-4 py-4 flex items-center justify-between gap-3 hover:bg-zinc-50 dark:hover:bg-zinc-900 transition-colors">
                <div className="flex items-center gap-3 flex-1">
                  <MapPin size={24} className="text-zinc-950 dark:text-white" />
                  <div className="text-left flex-1">
                    <p className="text-sm font-medium text-zinc-950 dark:text-white">Add location</p>
                    <input
                      type="text"
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                      placeholder="Where was this created?"
                      className="mt-1 w-full bg-transparent text-xs text-zinc-500 outline-none placeholder:text-zinc-400"
                    />
                  </div>
                </div>
              </div>

              <div className="px-4 py-4">
                <div className="flex items-center gap-3">
                  <Users size={24} className="text-zinc-950 dark:text-white" />
                  <input
                    type="text"
                    value={trade}
                    onChange={(e) => setTrade(e.target.value)}
                    placeholder="Add trade/category (e.g., Plumber, Electrician)"
                    className="flex-1 bg-transparent outline-none text-sm text-zinc-950 dark:text-white placeholder:text-zinc-400"
                  />
                </div>
              </div>

              <button className="w-full px-4 py-4 flex items-center justify-between hover:bg-zinc-50 dark:hover:bg-zinc-900 transition-colors">
                <div className="flex items-center gap-3">
                  <MusicNotes size={24} className="text-zinc-950 dark:text-white" />
                  <span className="text-sm font-medium text-zinc-950 dark:text-white">Add music</span>
                </div>
                <ArrowRight size={20} className="text-zinc-400" />
              </button>
            </div>

            {/* Advanced Settings */}
            <div className="p-4 space-y-3">
              <h3 className="text-sm font-semibold text-zinc-950 dark:text-white">Advanced settings</h3>
              
              <label className="flex items-center justify-between py-2">
                <span className="text-sm text-zinc-950 dark:text-white">Hide like and view counts on this post</span>
                <input type="checkbox" className="w-5 h-5" />
              </label>

              <label className="flex items-center justify-between py-2">
                <span className="text-sm text-zinc-950 dark:text-white">Turn off commenting</span>
                <input type="checkbox" className="w-5 h-5" />
              </label>
            </div>

            <div className="sticky bottom-0 grid grid-cols-2 gap-3 border-t border-zinc-100 bg-white p-4 dark:border-zinc-900 dark:bg-black">
              <button
                onClick={handleSaveDraft}
                className="h-12 rounded-xl border border-zinc-200 text-sm font-black text-zinc-950 dark:border-zinc-800 dark:text-white"
              >
                Save draft
              </button>
              <button
                onClick={handlePost}
                className="h-12 rounded-xl bg-[#0066FF] text-sm font-black text-white"
              >
                Publish now
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
