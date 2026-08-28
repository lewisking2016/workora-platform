'use client';

import React, { Component, type ReactNode } from 'react';
import { WarningCircle, ArrowClockwise } from '@phosphor-icons/react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('ErrorBoundary caught:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) return this.props.fallback;

      return (
        <div className="flex flex-col items-center justify-center rounded-2xl bg-white p-8 text-center shadow-sm dark:bg-zinc-950">
          <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-red-50 dark:bg-red-950/30">
            <WarningCircle size={28} weight="fill" className="text-red-500" />
          </div>
          <h2 className="text-lg font-black text-zinc-950 dark:text-white">Something went wrong</h2>
          <p className="mt-2 max-w-sm text-sm text-zinc-500 dark:text-zinc-400">
            {this.state.error?.message || 'An unexpected error occurred. Please try again.'}
          </p>
          <button
            onClick={() => {
              this.setState({ hasError: false, error: null });
              window.location.reload();
            }}
            className="mt-5 inline-flex items-center gap-2 rounded-xl bg-zinc-950 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-zinc-800 dark:bg-white dark:text-zinc-950 dark:hover:bg-zinc-200"
          >
            <ArrowClockwise size={16} weight="bold" />
            Reload page
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
