'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { fetchCurrentUser } from '@/lib/session';

export default function DashboardPage() {
  const router = useRouter();

  useEffect(() => {
    let mounted = true;

    const bootstrap = async () => {
      const user = await fetchCurrentUser();
      if (!mounted) return;

      if (!user) {
        router.replace('/login');
        return;
      }

      if (user.role === 'hirer') {
        router.replace('/dashboard/feed');
      } else {
        router.replace('/dashboard/pro');
      }
    };

    bootstrap();

    return () => {
      mounted = false;
    };
  }, [router]);

  return (
    <div className="min-h-screen bg-zinc-950 flex items-center justify-center">
      <div className="h-8 w-8 border-2 border-white/20 border-t-white rounded-full animate-spin" />
    </div>
  );
}
