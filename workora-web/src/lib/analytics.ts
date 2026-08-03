'use client';

export type AnalyticsValue = string | number | boolean | null | undefined;
export type AnalyticsProperties = Record<string, AnalyticsValue | AnalyticsValue[] | Record<string, AnalyticsValue>>;

export interface AnalyticsEventPayload {
  event_name: string;
  session_id: string;
  page_path: string;
  screen_name?: string;
  section?: string;
  element?: string;
  referrer?: string;
  properties?: AnalyticsProperties;
}

const SESSION_KEY = 'workora_analytics_session_id';
const ENDPOINT = '/api/analytics/events';
const MAX_EVENT_NAME = 64;
const MAX_PATH = 255;

const safeTrim = (value: string | null | undefined, max: number) => {
  if (!value) return undefined;
  const trimmed = value.trim();
  if (!trimmed) return undefined;
  return trimmed.slice(0, max);
};

export function getAnalyticsSessionId() {
  if (typeof window === 'undefined') return 'server';

  const existing = window.localStorage.getItem(SESSION_KEY);
  if (existing) return existing;

  const generated = globalThis.crypto?.randomUUID?.() || `wk_${Date.now()}_${Math.random().toString(36).slice(2, 10)}`;
  window.localStorage.setItem(SESSION_KEY, generated);
  return generated;
}

export function getScreenName(pathname: string) {
  if (!pathname || pathname === '/') return 'home';
  if (pathname === '/login') return 'login';
  if (pathname === '/join') return 'join';
  if (pathname === '/forgot') return 'forgot_password';
  if (pathname === '/platform') return 'platform';
  if (pathname === '/business') return 'business';
  if (pathname === '/personal') return 'personal';
  if (pathname === '/profile') return 'public_profile';
  if (pathname.startsWith('/dashboard/feed')) return 'feed';
  if (pathname.startsWith('/dashboard/analytics')) return 'analytics';
  if (pathname.startsWith('/dashboard/profile')) return 'dashboard_profile';
  if (pathname.startsWith('/dashboard/messages')) return 'messages';
  if (pathname.startsWith('/dashboard/notifications')) return 'notifications';
  if (pathname.startsWith('/dashboard/saved')) return 'saved';
  if (pathname.startsWith('/dashboard/search')) return 'search';
  if (pathname.startsWith('/dashboard/works')) return 'works';
  if (pathname.startsWith('/dashboard/create')) return 'create';
  if (pathname.startsWith('/dashboard/pro')) return 'pro_dashboard';
  if (pathname.startsWith('/dashboard/post/')) return 'post_detail';
  if (pathname.startsWith('/dashboard')) return 'dashboard';
  return pathname.replace(/^\//, '').replace(/\//g, '_') || 'unknown';
}

export function inferSection(target: Element | null) {
  const section = target?.closest?.('[data-analytics-section]')?.getAttribute('data-analytics-section');
  return safeTrim(section, 120);
}

export function inferElementLabel(target: Element | null) {
  if (!target) return undefined;

  const typedTarget = target as HTMLElement;
  const explicit =
    typedTarget.getAttribute('data-analytics-label') ||
    typedTarget.getAttribute('aria-label') ||
    typedTarget.getAttribute('title');

  const text = typedTarget.textContent?.replace(/\s+/g, ' ').trim();
  const href = typedTarget.getAttribute?.('href');

  return safeTrim(explicit || text || href || typedTarget.tagName.toLowerCase(), 120);
}

export function buildAnalyticsPayload(
  eventName: string,
  properties: AnalyticsProperties = {},
  pagePath = typeof window !== 'undefined' ? `${window.location.pathname}${window.location.search}` : '/',
  screenName = typeof window !== 'undefined' ? getScreenName(window.location.pathname) : 'unknown'
): AnalyticsEventPayload {
  const safeEventName = safeTrim(eventName.toLowerCase().replace(/[^a-z0-9_]/g, '_'), MAX_EVENT_NAME) || 'unknown_event';

  return {
    event_name: safeEventName,
    session_id: getAnalyticsSessionId(),
    page_path: safeTrim(pagePath, MAX_PATH) || '/',
    screen_name: safeTrim(screenName, 120),
    referrer: typeof document !== 'undefined' ? safeTrim(document.referrer, MAX_PATH) : undefined,
    properties,
  };
}

async function sendViaFetch(payload: AnalyticsEventPayload) {
  try {
    await fetch(ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
      keepalive: true,
    });
  } catch {
    // Swallow telemetry failures; analytics must never break UX.
  }
}

function sendViaBeacon(payload: AnalyticsEventPayload) {
  if (typeof navigator === 'undefined' || typeof navigator.sendBeacon !== 'function') return false;

  try {
    const blob = new Blob([JSON.stringify(payload)], { type: 'application/json' });
    return navigator.sendBeacon(ENDPOINT, blob);
  } catch {
    return false;
  }
}

export function trackAnalyticsEvent(
  eventName: string,
  properties: AnalyticsProperties = {},
  override?: Partial<Pick<AnalyticsEventPayload, 'page_path' | 'screen_name' | 'section' | 'element' | 'referrer'>>
) {
  if (typeof window === 'undefined') return;

  const payload = {
    ...buildAnalyticsPayload(
      eventName,
      properties,
      override?.page_path || `${window.location.pathname}${window.location.search}`,
      override?.screen_name || getScreenName(window.location.pathname)
    ),
    section: override?.section,
    element: override?.element,
    referrer: override?.referrer || document.referrer || undefined,
  };

  if (!sendViaBeacon(payload)) {
    void sendViaFetch(payload);
  }
}

export function trackPageView(pathname: string, properties: AnalyticsProperties = {}) {
  trackAnalyticsEvent('page_view', properties, {
    page_path: pathname,
    screen_name: getScreenName(pathname.split('?')[0]),
  });
}

export function trackError(errorName: string, errorMessage: string, properties: AnalyticsProperties = {}) {
  trackAnalyticsEvent('client_error', {
    error_name: errorName.slice(0, 120),
    error_message: errorMessage.slice(0, 500),
    ...properties,
  });
}
