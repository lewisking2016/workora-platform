'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function DashboardPage() {
  const router = useRouter();

  useEffect(() => {
    // Check stored role and redirect accordingly
    const role = localStorage.getItem('workora_role') || 'pro';
    if (role === 'client') {
      router.replace('/dashboard/feed');
    } else {
      router.replace('/dashboard/pro');
    }
  }, [router]);

  return (
    <div className="min-h-screen bg-zinc-950 flex items-center justify-center">
      <div className="h-8 w-8 border-2 border-white/20 border-t-white rounded-full animate-spin" />
    </div>
  );
}
