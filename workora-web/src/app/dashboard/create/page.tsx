'use client';

import React, { useState } from 'react';
import { CameraUI } from '@/components/CameraUI';
import { useRouter } from 'next/navigation';
import { fetchCurrentUser } from '@/lib/session';

export default function CreatePage() {
  const router = useRouter();
  const [isUploading, setIsUploading] = useState(false);

  const handleCapture = async (file: File | Blob, type: string) => {
    setIsUploading(true);
    try {
      const user = await fetchCurrentUser();
      if (!user) throw new Error('Not logged in');

      const formData = new FormData();
      formData.append('file', file, type === 'video' ? 'video.webm' : 'photo.jpg');
      formData.append('user_id', user.id);
      formData.append('media_type', type);

      // In a real app we'd fetch workerId if needed, using user.id for now
      const uploadRes = await fetch('/api/upload/gig', {
        method: 'POST',
        body: formData,
      });
      
      const uploadData = await uploadRes.json();
      if (!uploadRes.ok) throw new Error(uploadData.error || 'Upload failed');

      const postRes = await fetch('/api/gigs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user_id: user.id,
          title: 'New Work',
          description: '',
          video_url: uploadData.url,
          thumbnail_url: uploadData.url,
          category: 'work'
        }),
      });

      if (!postRes.ok) throw new Error('Failed to create post record');

      router.push('/dashboard/feed');
    } catch (err: any) {
      alert(err.message || 'Something went wrong');
      setIsUploading(false);
    }
  };

  if (isUploading) {
    return (
      <div className="h-full w-full bg-black flex flex-col items-center justify-center text-white">
        <div className="w-16 h-16 border-4 border-white/20 border-t-[#00D1FF] rounded-full animate-spin mb-4" />
        <h2 className="text-xl font-bold tracking-widest uppercase">Uploading...</h2>
      </div>
    );
  }

  return (
    <div className="h-full w-full bg-black">
      <CameraUI 
        onClose={() => router.push('/dashboard/feed')} 
        onCapture={handleCapture} 
      />
    </div>
  );
}
