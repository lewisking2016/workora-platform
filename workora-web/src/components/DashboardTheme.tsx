'use client';

import { useEffect } from 'react';

/**
 * Forces the dark design language for the dashboard regardless of OS theme,
 * and restores the OS-driven theme when leaving dashboard routes.
 */
export function DashboardTheme() {
  useEffect(() => {
    const el = document.documentElement;
    const wasDark = el.classList.contains('dark');
    el.classList.add('dark');
    return () => {
      if (!wasDark) el.classList.remove('dark');
    };
  }, []);

  return null;
}
