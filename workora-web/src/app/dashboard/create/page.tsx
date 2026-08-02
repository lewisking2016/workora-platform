'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function CreatePage() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to the new post creation flow
    router.replace('/dashboard/create/new');
  }, [router]);

  return (
    <div className="h-full w-full bg-white dark:bg-black flex items-center justify-center">
      <div className="w-12 h-12 border-4 border-zinc-200 dark:border-zinc-800 border-t-[#0066FF] rounded-full animate-spin" />
    </div>
  );
}
