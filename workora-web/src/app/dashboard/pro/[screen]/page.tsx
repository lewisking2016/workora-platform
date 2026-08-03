import { redirect } from 'next/navigation';
import { SystemStateScreen } from '@/components/system/StatusScreens';
import { loadSystemStatus } from '@/lib/system-status';

export const dynamic = 'force-dynamic';

type ProScreen =
  | 'overview'
  | 'profile-health'
  | 'booking'
  | 'lead'
  | 'availability'
  | 'pricing'
  | 'services'
  | 'quotes'
  | 'contract'
  | 'invoice'
  | 'payment-status'
  | 'reputation'
  | 'verification'
  | 'tips'
  | 'growth-suggestions';

const COPY: Record<ProScreen, { title: string; description: string; primaryHref: string; primaryLabel: string; secondaryHref?: string; secondaryLabel?: string }> = {
  overview: { title: 'Pro dashboard', description: 'Open the live pro workspace with profile, portfolio, and analytics views.', primaryHref: '/dashboard/pro', primaryLabel: 'Open pro dashboard' },
  'profile-health': { title: 'Pro profile health screen', description: 'Profile quality and completeness are read from the live backend.', primaryHref: '/dashboard/profile', primaryLabel: 'Open profile' },
  booking: { title: 'Pro booking or lead screen', description: 'Bookings and leads stay attached to the live messaging and profile systems.', primaryHref: '/dashboard/messages', primaryLabel: 'Open messages' },
  lead: { title: 'Pro booking or lead screen', description: 'Lead details are handled by the live business workflow.', primaryHref: '/dashboard/messages', primaryLabel: 'Open messages' },
  availability: { title: 'Pro availability screen', description: 'Availability status is synced from the live profile record.', primaryHref: '/profile/edit', primaryLabel: 'Edit availability' },
  pricing: { title: 'Pro pricing screen', description: 'Pricing is connected to the live profile pricing field.', primaryHref: '/profile/edit', primaryLabel: 'Edit pricing' },
  services: { title: 'Pro services screen', description: 'Services and skill coverage are backed by the live profile data.', primaryHref: '/dashboard/profile', primaryLabel: 'Open profile services' },
  quotes: { title: 'Pro quotes screen', description: 'Quotes can be traced through the live business workflow.', primaryHref: '/dashboard/messages', primaryLabel: 'Open conversations' },
  contract: { title: 'Pro contract screen', description: 'Contract status belongs in the live business and messaging flow.', primaryHref: '/dashboard/messages', primaryLabel: 'Open messages' },
  invoice: { title: 'Pro invoice screen', description: 'Invoices connect to the live business and payment state.', primaryHref: '/dashboard/analytics', primaryLabel: 'Open analytics' },
  'payment-status': { title: 'Pro payment status screen', description: 'Payment status should always reflect the live backend state.', primaryHref: '/dashboard/analytics', primaryLabel: 'Open payments' },
  reputation: { title: 'Pro reputation screen', description: 'Trust and reputation are derived from live ratings and proof-of-work.', primaryHref: '/trust', primaryLabel: 'Open trust' },
  verification: { title: 'Pro verification screen', description: 'Identity and verification status are linked to the live profile bundle.', primaryHref: '/dashboard/profile', primaryLabel: 'Open verification' },
  tips: { title: 'Pro tips screen', description: 'Guidance is shown against the live state of the user profile and gigs.', primaryHref: '/dashboard/pro', primaryLabel: 'Open pro dashboard' },
  'growth-suggestions': { title: 'Pro growth suggestions screen', description: 'Growth ideas are built from live content, trust, and profile data.', primaryHref: '/dashboard/analytics', primaryLabel: 'Open analytics' },
};

export default async function ProScreenPage({ params }: { params: Promise<{ screen: string }> }) {
  const [{ screen }, status] = await Promise.all([params, loadSystemStatus()]);
  const key = screen as ProScreen;
  const copy = COPY[key];

  if (!copy) redirect('/dashboard/pro');

  return (
    <SystemStateScreen
      title={copy.title}
      description={copy.description}
      primaryHref={copy.primaryHref}
      primaryLabel={copy.primaryLabel}
      secondaryHref={copy.secondaryHref || '/dashboard/pro'}
      secondaryLabel={copy.secondaryLabel || 'Back to pro dashboard'}
      status={status}
      variant="generic"
    />
  );
}
