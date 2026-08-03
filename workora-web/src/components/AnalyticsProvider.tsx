'use client';

import React, { useEffect, useRef } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';
import {
  trackAnalyticsEvent,
  trackPageView,
  inferElementLabel,
  inferSection,
  getScreenName,
} from '@/lib/analytics';

declare global {
  interface Window {
    __workoraFetchPatched?: boolean;
    __workoraOriginalFetch?: typeof fetch;
  }
}

const isTrackableTarget = (target: EventTarget | null) => {
  if (!(target instanceof Element)) return null;
  const interactive = target.closest('button, a, [role="button"], input[type="submit"], input[type="button"]');
  return interactive instanceof HTMLElement ? interactive : null;
};

export function AnalyticsProvider({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const firstViewRef = useRef(true);

  useEffect(() => {
    const query = searchParams?.toString() || '';
    const pagePath = query ? `${pathname}?${query}` : pathname;
    const screenName = getScreenName(pathname);

    trackPageView(pagePath, {
      path: pathname,
      query,
      viewport_width: typeof window !== 'undefined' ? window.innerWidth : 0,
      viewport_height: typeof window !== 'undefined' ? window.innerHeight : 0,
      first_view: firstViewRef.current,
    });

    firstViewRef.current = false;
    trackAnalyticsEvent('screen_viewed', {
      path: pathname,
      query,
      screen_name: screenName,
    }, { page_path: pagePath, screen_name: screenName });
  }, [pathname, searchParams]);

  useEffect(() => {
    const handleClick = (event: MouseEvent) => {
      const target = isTrackableTarget(event.target);
      if (!target || target.closest('[data-analytics-ignore="true"]')) return;

      const label = inferElementLabel(target);
      const section = inferSection(target);
      const href = target instanceof HTMLAnchorElement ? target.getAttribute('href') || target.href : target.getAttribute('href') || undefined;
      const elementType = target.tagName.toLowerCase();
      const action = target.getAttribute('data-analytics-event') || (target instanceof HTMLAnchorElement ? 'link_clicked' : 'button_clicked');

      trackAnalyticsEvent(
        action,
        {
          label: label || elementType,
          href,
          element_type: elementType,
          section: section || getScreenName(window.location.pathname),
        },
        {
          section,
          element: label || elementType,
        }
      );
    };

    const handleSubmit = (event: Event) => {
      const form = event.target instanceof HTMLFormElement ? event.target : null;
      if (!form || form.closest('[data-analytics-ignore="true"]')) return;

      const label =
        form.getAttribute('data-analytics-label') ||
        form.getAttribute('aria-label') ||
        form.getAttribute('name') ||
        form.id ||
        form.action ||
        'form';

      trackAnalyticsEvent('form_submitted', {
        label,
        method: form.method || 'get',
        action: form.action || undefined,
      }, {
        section: inferSection(form),
        element: label,
      });
    };

    const handleError = (event: ErrorEvent) => {
      trackAnalyticsEvent('runtime_error', {
        error_name: event.error?.name || 'Error',
        error_message: String(event.error?.message || event.message || 'Unknown error').slice(0, 500),
        source: event.filename || undefined,
        line: event.lineno || undefined,
        column: event.colno || undefined,
      });
    };

    const handleRejection = (event: PromiseRejectionEvent) => {
      const reason = event.reason;
      trackAnalyticsEvent('promise_rejection', {
        error_name: reason?.name || 'UnhandledRejection',
        error_message: String(reason?.message || reason || 'Unknown rejection').slice(0, 500),
      });
    };

    const patchFetch = () => {
      if (window.__workoraFetchPatched || typeof window.fetch !== 'function') return;
      window.__workoraOriginalFetch = window.fetch.bind(window);
      window.fetch = (async (input: RequestInfo | URL, init?: RequestInit) => {
        const method = (init?.method || (input instanceof Request ? input.method : 'GET')).toUpperCase();
        const urlValue = typeof input === 'string' || input instanceof URL ? input.toString() : input.url;
        const parsedUrl = new URL(urlValue, window.location.origin);

        try {
          const response = await window.__workoraOriginalFetch!(input, init);
          if (
            !response.ok &&
            parsedUrl.pathname.startsWith('/api/') &&
            !parsedUrl.pathname.startsWith('/api/analytics/')
          ) {
            trackAnalyticsEvent('api_error', {
              endpoint: parsedUrl.pathname,
              method,
              status: response.status,
              status_text: response.statusText,
            });
          }
          return response;
        } catch (error) {
          if (parsedUrl.pathname.startsWith('/api/') && !parsedUrl.pathname.startsWith('/api/analytics/')) {
            trackAnalyticsEvent('network_error', {
              endpoint: parsedUrl.pathname,
              method,
              error_message: String(error instanceof Error ? error.message : error).slice(0, 500),
            });
          }
          throw error;
        }
      }) as typeof fetch;

      window.__workoraFetchPatched = true;
    };

    document.addEventListener('click', handleClick, true);
    document.addEventListener('submit', handleSubmit, true);
    window.addEventListener('error', handleError);
    window.addEventListener('unhandledrejection', handleRejection);
    patchFetch();

    return () => {
      document.removeEventListener('click', handleClick, true);
      document.removeEventListener('submit', handleSubmit, true);
      window.removeEventListener('error', handleError);
      window.removeEventListener('unhandledrejection', handleRejection);

      if (window.__workoraOriginalFetch && window.__workoraFetchPatched) {
        window.fetch = window.__workoraOriginalFetch;
        window.__workoraFetchPatched = false;
      }
    };
  }, []);

  return <>{children}</>;
}
