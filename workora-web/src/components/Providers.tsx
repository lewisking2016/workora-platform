'use client';

import React from 'react';

import { AnalyticsProvider } from './AnalyticsProvider';
import { ThemeProvider } from './ThemeProvider';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
      <AnalyticsProvider>{children}</AnalyticsProvider>
    </ThemeProvider>
  );
}
