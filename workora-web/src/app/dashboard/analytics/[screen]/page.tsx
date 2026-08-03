import { redirect } from 'next/navigation';
import { SystemStateScreen } from '@/components/system/StatusScreens';
import { loadSystemStatus } from '@/lib/system-status';

export const dynamic = 'force-dynamic';

type AnalyticsScreen =
  | 'overview'
  | 'traffic'
  | 'engagement'
  | 'content-performance'
  | 'conversion'
  | 'audience'
  | 'geography'
  | 'device-breakdown'
  | 'retention'
  | 'funnel'
  | 'event-detail'
  | 'screen-inventory'
  | 'business-dashboard'
  | 'business-performance'
  | 'business-leads'
  | 'business-inquiries'
  | 'campaign-performance'
  | 'saved-leads'
  | 'exports';

const COPY: Record<AnalyticsScreen, { title: string; description: string; primaryHref: string; primaryLabel: string; secondaryHref?: string; secondaryLabel?: string }> = {
  overview: { title: 'Analytics overview', description: 'Review the live dashboard analytics summary from the backend.', primaryHref: '/dashboard/analytics', primaryLabel: 'Open analytics' },
  traffic: { title: 'Analytics traffic screen', description: 'Traffic, reach, and exposure data from live content is visible here.', primaryHref: '/dashboard/analytics', primaryLabel: 'Open traffic view' },
  engagement: { title: 'Analytics engagement screen', description: 'Likes, comments, shares, and saves stay connected to live posts.', primaryHref: '/dashboard/analytics', primaryLabel: 'Open engagement view' },
  'content-performance': { title: 'Analytics content performance screen', description: 'View live post and portfolio performance details.', primaryHref: '/dashboard/analytics', primaryLabel: 'Open performance view' },
  conversion: { title: 'Analytics conversion screen', description: 'Track live activity that leads to profile visits, messages, and hires.', primaryHref: '/dashboard/analytics', primaryLabel: 'Open conversion view' },
  audience: { title: 'Analytics audience screen', description: 'Audience composition is derived from the live backend data model.', primaryHref: '/dashboard/analytics', primaryLabel: 'Open audience view' },
  geography: { title: 'Analytics geography screen', description: 'Location-aware patterns are surfaced from the live discovery system.', primaryHref: '/dashboard/analytics', primaryLabel: 'Open geography view' },
  'device-breakdown': { title: 'Analytics device breakdown screen', description: 'Device distribution can be layered on top of live analytics events.', primaryHref: '/dashboard/analytics', primaryLabel: 'Open device view' },
  retention: { title: 'Analytics retention screen', description: 'Retention and repeat activity are based on live session and content signals.', primaryHref: '/dashboard/analytics', primaryLabel: 'Open retention view' },
  funnel: { title: 'Analytics funnel screen', description: 'The funnel view maps live discovery to messages and publishing.', primaryHref: '/dashboard/analytics', primaryLabel: 'Open funnel view' },
  'event-detail': { title: 'Analytics event detail screen', description: 'Inspect individual analytics events and their live payloads.', primaryHref: '/dashboard/analytics', primaryLabel: 'Open event view' },
  'screen-inventory': { title: 'Analytics screen inventory screen', description: 'Track which screens and flows are present across the platform.', primaryHref: '/dashboard/shell', primaryLabel: 'Open shell screens' },
  'business-dashboard': { title: 'Business dashboard', description: 'Open the live business workspace from the backend.', primaryHref: '/dashboard/pro', primaryLabel: 'Open business dashboard' },
  'business-performance': { title: 'Business performance overview', description: 'Live business performance is summarized here for quick review.', primaryHref: '/dashboard/pro', primaryLabel: 'Open business performance' },
  'business-leads': { title: 'Business leads screen', description: 'Lead and inquiry surfaces connect to the live business flow.', primaryHref: '/dashboard/pro', primaryLabel: 'Open business leads' },
  'business-inquiries': { title: 'Business inquiries screen', description: 'Inquiries are tied to the live backend messaging and profile state.', primaryHref: '/dashboard/messages', primaryLabel: 'Open messages' },
  'campaign-performance': { title: 'Business campaign performance screen', description: 'Campaign performance can be layered on live analytics events.', primaryHref: '/dashboard/analytics', primaryLabel: 'Open campaign performance' },
  'saved-leads': { title: 'Business saved leads screen', description: 'Saved lead items can be reviewed from the live business workspace.', primaryHref: '/dashboard/saved', primaryLabel: 'Open saved library' },
  exports: { title: 'Business exports screen', description: 'Export actions are anchored to the live analytics and business data.', primaryHref: '/dashboard/analytics', primaryLabel: 'Open exports' },
};

export default async function AnalyticsScreenPage({ params }: { params: Promise<{ screen: string }> }) {
  const [{ screen }, status] = await Promise.all([params, loadSystemStatus()]);
  const key = screen as AnalyticsScreen;
  const copy = COPY[key];

  if (!copy) redirect('/dashboard/analytics');

  return (
    <SystemStateScreen
      title={copy.title}
      description={copy.description}
      primaryHref={copy.primaryHref}
      primaryLabel={copy.primaryLabel}
      secondaryHref={copy.secondaryHref || '/dashboard/analytics'}
      secondaryLabel={copy.secondaryLabel || 'Back to analytics'}
      status={status}
      variant="generic"
    />
  );
}
