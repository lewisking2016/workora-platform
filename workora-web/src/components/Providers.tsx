'use client';

import React from 'react';

import { AnalyticsProvider } from './AnalyticsProvider';
import { ThemeProvider } from './ThemeProvider';
import { ToastProvider } from './Toast';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
      <ToastProvider>
        <AnalyticsProvider>{children}</AnalyticsProvider>
      </ToastProvider>
    </ThemeProvider>
  );
}
