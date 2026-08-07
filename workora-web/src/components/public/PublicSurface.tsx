'use client';

import Link from 'next/link';
import { ArrowRight, CheckCircle, House, ShieldCheck, Sparkle, UsersThree, VideoCamera } from '@phosphor-icons/react';

import { SafeMediaThumb } from '@/components/SafeMediaThumb';
import { VideoPlayer } from '@/components/VideoPlayer';
import { MeshBackground } from '@/components/MeshBackground';
import { APP_DEFAULTS, PublicGig, PublicSurfaceData, publicSurfaceTheme } from '@/lib/public-surface';

type SurfaceVariant =
  | 'about'
  | 'business'
  | 'careers'
  | 'contact'
  | 'help'
  | 'personal'
  | 'platform'
  | 'privacy'
  | 'safety'
  | 'terms'
  | 'trust';

type SurfaceConfig = {
  title: string;
  subtitle: string;
  kicker: string;
  primaryCta: { label: string; href: string };
  secondaryCta: { label: string; href: string };
  highlights: string[];
  body: string;
};

const SURFACE_CONFIG: Record<SurfaceVariant, SurfaceConfig> = {
  about: {
    kicker: 'About Workora',
    title: 'Built to make proof visible.',
    subtitle: 'Workora turns local work, trust, and reputation into something people can actually inspect.',
    primaryCta: { label: 'Join Workora', href: '/join' },
    secondaryCta: { label: 'See the platform', href: '/platform' },
    highlights: ['Verified profiles', 'Proof-of-work media', 'Live trust signals'],
    body: 'We are building the surface where workers, businesses, and hirers can meet without guesswork.',
  },
  business: {
    kicker: 'For Business',
    title: 'Find the right pro faster.',
    subtitle: 'Browse live work, compare trade specialists, and start with evidence instead of assumptions.',
    primaryCta: { label: 'Search professionals', href: '/dashboard/search' },
    secondaryCta: { label: 'Open analytics', href: '/dashboard/analytics' },
    highlights: ['Trust-first discovery', 'Live availability', 'Actionable analytics'],
    body: 'Business users need short paths to trusted people, clear signals, and fewer dead ends.',
  },
  careers: {
    kicker: 'Careers',
    title: 'Join the team shaping local trust.',
    subtitle: 'We build product, systems, and workflows that help people get seen for their real skills.',
    primaryCta: { label: 'Contact us', href: '/contact' },
    secondaryCta: { label: 'Read about Workora', href: '/about' },
    highlights: ['Product design', 'Backend systems', 'Mobile and web'],
    body: 'If you care about useful software for real users, this is the kind of problem space that matters.',
  },
  contact: {
    kicker: 'Contact',
    title: 'Talk to the team behind the platform.',
    subtitle: 'Support, product questions, partnerships, and verification issues all belong here.',
    primaryCta: { label: 'Open help center', href: '/help' },
    secondaryCta: { label: 'Review safety', href: '/safety' },
    highlights: ['Support routing', 'Partnerships', 'Safety reports'],
    body: 'Contact should be fast, traceable, and clearly routed to the right human.',
  },
  help: {
    kicker: 'Help',
    title: 'Get unstuck without hunting.',
    subtitle: 'Answers, recovery paths, and escalation steps for the most common account and platform issues.',
    primaryCta: { label: 'Reset password', href: '/forgot' },
    secondaryCta: { label: 'Read terms', href: '/terms' },
    highlights: ['Login issues', 'Upload issues', 'Trust questions'],
    body: 'Support content should not waste time. It should get the user to the next safe step.',
  },
  personal: {
    kicker: 'For Hirers',
    title: 'Find a person you can trust.',
    subtitle: 'See work history, proof, and reviews before you commit to a conversation.',
    primaryCta: { label: 'Create account', href: '/join' },
    secondaryCta: { label: 'Browse trust card', href: '/trust' },
    highlights: ['Public profiles', 'Proof-of-work', 'Direct messaging'],
    body: 'This side of the product should feel calm, confident, and easy to compare.',
  },
  platform: {
    kicker: 'Platform',
    title: 'The full Workora system in one place.',
    subtitle: 'Discovery, identity, messaging, uploads, and analytics all sit on the same live platform.',
    primaryCta: { label: 'Open feed', href: '/dashboard/feed' },
    secondaryCta: { label: 'Open search', href: '/dashboard/search' },
    highlights: ['Feed', 'Search', 'Messaging'],
    body: 'The platform page should explain the whole product without drifting into marketing filler.',
  },
  privacy: {
    kicker: 'Privacy',
    title: 'How data is handled.',
    subtitle: 'Clear handling of identity, content, analytics, and support data.',
    primaryCta: { label: 'Read terms', href: '/terms' },
    secondaryCta: { label: 'Contact support', href: '/contact' },
    highlights: ['Access control', 'Data retention', 'Event logging'],
    body: 'Privacy content should be readable, direct, and attached to real behavior in the product.',
  },
  safety: {
    kicker: 'Safety',
    title: 'Trust, reporting, and escalation.',
    subtitle: 'Paths for abuse, scam reports, harmful content, and platform recovery.',
    primaryCta: { label: 'Report an issue', href: '/contact' },
    secondaryCta: { label: 'Read trust', href: '/trust' },
    highlights: ['Report abuse', 'Block users', 'Verification'],
    body: 'Safety content should help users act quickly when something feels wrong.',
  },
  terms: {
    kicker: 'Terms',
    title: 'The rules for using Workora.',
    subtitle: 'Permissions, obligations, and responsibilities for everyone using the platform.',
    primaryCta: { label: 'Read privacy', href: '/privacy' },
    secondaryCta: { label: 'Get help', href: '/help' },
    highlights: ['User obligations', 'Content rules', 'Service limits'],
    body: 'Terms should be organized, clear, and connected to the real flows users take.',
  },
  trust: {
    kicker: 'Trust',
    title: 'What makes a profile believable.',
    subtitle: 'Verification, media, ratings, and consistent activity are what turn a page into evidence.',
    primaryCta: { label: 'Open profile', href: '/profile' },
    secondaryCta: { label: 'Join now', href: '/join' },
    highlights: ['Verified identity', 'Public work history', 'Ratings'],
    body: 'The trust page should show the data model that gives the product its point of view.',
  },
};

function countByTrade(items: PublicGig[]) {
  const counts = new Map<string, number>();
  items.forEach((item) => {
    const key = item.trade || item.category || 'Other';
    counts.set(key, (counts.get(key) || 0) + 1);
  });
  return Array.from(counts.entries())
    .map(([trade, count]) => ({ trade, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 6);
}

function StatCard({ label, value }: { label: string; value: string }) {
  return (
    <div className={`border ${publicSurfaceTheme.border} ${publicSurfaceTheme.panel} p-5 tech-card`}>
      <p className={`text-[10px] font-black uppercase tracking-[0.2em] ${publicSurfaceTheme.soft}`}>{label}</p>
      <p className={`mt-3 text-2xl font-black tracking-tighter ${publicSurfaceTheme.text}`}>{value}</p>
    </div>
  );
}

function GigPreview({ gig }: { gig: PublicGig }) {
  return (
    <article className={`border ${publicSurfaceTheme.border} ${publicSurfaceTheme.surface} tech-card`}>
      <div className="relative aspect-[4/3] bg-zinc-100">
        {gig.video_url ? (
          <VideoPlayer src={gig.video_url} poster={gig.thumbnail_url || undefined} className="h-full w-full" autoPlay={false} />
        ) : (
          <SafeMediaThumb src={gig.thumbnail_url || APP_DEFAULTS.thumbnail} alt={gig.title || 'Workora post'} className="h-full w-full object-cover" />
        )}
      </div>
      <div className="p-5">
        <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-[#0066FF]">
          <ShieldCheck size={14} weight="bold" />
          {gig.trade || gig.category || 'Member'}
        </div>
        <h3 className={`mt-3 text-lg font-black leading-tight uppercase tracking-tight ${publicSurfaceTheme.text}`}>{gig.title || 'Live proof-of-work post'}</h3>
        <p className={`mt-2 text-sm leading-relaxed ${publicSurfaceTheme.muted}`}>{gig.description || 'A live post from the feed gives this screen real platform context.'}</p>
        <div className="mt-4 flex items-center justify-between text-[10px] font-bold uppercase tracking-widest text-zinc-400">
          <span>{gig.user_name || gig.handle || 'Member'}</span>
          <span>{Number(gig.likes_count || 0)} likes</span>
        </div>
      </div>
    </article>
  );
}

function LegalPanel({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className={`border ${publicSurfaceTheme.border} ${publicSurfaceTheme.surface} p-6 md:p-8 tech-card`}>
      <h2 className={`text-2xl font-black tracking-tighter uppercase ${publicSurfaceTheme.text}`}>{title}</h2>
      <div className={`mt-4 space-y-4 text-sm leading-relaxed ${publicSurfaceTheme.muted}`}>{children}</div>
    </section>
  );
}

export function PublicSurface({ variant, data }: { variant: SurfaceVariant; data: PublicSurfaceData }) {
  const config = SURFACE_CONFIG[variant];
  const topTrades = countByTrade(data.feed.length ? data.feed : data.explore);
  const spotlight = (data.feed.length ? data.feed : data.explore).slice(0, 4);
  const supportMode = ['help', 'contact', 'careers'].includes(variant);
  const legalMode = ['privacy', 'terms', 'safety'].includes(variant);

  return (
    <main className={`relative mx-auto max-w-screen-2xl px-5 py-12 md:px-8 lg:px-10 ${publicSurfaceTheme.surface} pt-24`}>
      <MeshBackground />
      <section className="relative z-10 grid gap-12 lg:grid-cols-[1.2fr_0.8fr] lg:items-start mb-24">
        <div className="space-y-8">
          <div className="inline-flex items-center gap-2 border border-black/10 px-3 py-1 text-[10px] font-black uppercase tracking-widest text-black">
            <Sparkle size={14} weight="bold" />
            {config.kicker}
          </div>
          <h1 className={`max-w-3xl text-5xl font-black tracking-tighter md:text-7xl uppercase leading-[0.9] ${publicSurfaceTheme.text}`}>{config.title}</h1>
          <p className={`max-w-2xl text-lg leading-relaxed md:text-xl ${publicSurfaceTheme.muted}`}>{config.subtitle}</p>
          <p className={`max-w-2xl text-sm leading-relaxed ${publicSurfaceTheme.muted}`}>{config.body}</p>
          <div className="flex flex-wrap gap-4 pt-4">
            <Link href={config.primaryCta.href} className="inline-flex h-14 items-center justify-center gap-3 bg-black px-8 text-xs font-black uppercase tracking-widest text-white transition-all hover:bg-[#0066FF]">
              {config.primaryCta.label}
              <ArrowRight size={16} weight="bold" />
            </Link>
            <Link href={config.secondaryCta.href} className={`inline-flex h-14 items-center justify-center gap-3 border border-black/10 px-8 text-xs font-black uppercase tracking-widest ${publicSurfaceTheme.text} transition-colors hover:bg-zinc-50`}>
              {config.secondaryCta.label}
            </Link>
          </div>
        </div>

        <div className={`border ${publicSurfaceTheme.border} ${publicSurfaceTheme.panel} p-8 tech-card`}>
          <div className="flex items-center justify-between gap-3 mb-8">
            <div>
              <p className="text-[10px] font-black uppercase tracking-widest text-[#0066FF]">System Snapshot</p>
              <p className={`mt-1 text-xs uppercase font-bold tracking-tight ${publicSurfaceTheme.muted}`}>Real-time platform data</p>
            </div>
            <div className="border border-black/5 p-3 text-black">
              <VideoCamera size={20} weight="thin" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-px bg-black/5 border border-black/5">
            <StatCard label="Trades" value={String(data.stats.tradeCount)} />
            <StatCard label="Feed posts" value={String(data.stats.feedCount)} />
            <StatCard label="Explore posts" value={String(data.stats.exploreCount)} />
            <StatCard label="Verified posts" value={String(data.stats.verifiedCount)} />
          </div>
        </div>
      </section>

      <section className="relative z-10 grid gap-12 lg:grid-cols-[1fr_0.8fr] mb-24">
        <div className={`border ${publicSurfaceTheme.border} ${publicSurfaceTheme.surface} p-8 tech-card`}>
          <div className="flex items-center justify-between gap-3 mb-8">
            <div>
              <p className="text-[10px] font-black uppercase tracking-widest text-[#0066FF]">Active Nodes</p>
              <h2 className={`mt-2 text-3xl font-black tracking-tighter uppercase ${publicSurfaceTheme.text}`}>Verified Capabilities</h2>
            </div>
            <UsersThree size={24} weight="thin" className="text-black" />
          </div>
          <div className="flex flex-wrap gap-2 mb-12">
            {data.trades.length > 0 ? data.trades.slice(0, 12).map((trade) => (
              <span key={trade} className={`inline-flex items-center border border-black/10 px-4 py-2 text-[10px] font-bold uppercase tracking-widest ${publicSurfaceTheme.text}`}>
                {trade}
              </span>
            )) : (
              <span className={`text-xs uppercase font-bold ${publicSurfaceTheme.muted}`}>Scanning network for active nodes...</span>
            )}
          </div>

          <div className="grid gap-px bg-black/5 border border-black/5 sm:grid-cols-2">
            {topTrades.map((item) => (
              <div key={item.trade} className={`bg-white p-6`}>
                <p className={`text-xs font-black uppercase tracking-widest ${publicSurfaceTheme.text}`}>{item.trade}</p>
                <p className={`mt-2 text-xs font-bold uppercase tracking-tight ${publicSurfaceTheme.soft}`}>{item.count} active entries</p>
              </div>
            ))}
          </div>
        </div>

        <div className={`border ${publicSurfaceTheme.border} ${publicSurfaceTheme.surface} p-8 tech-card`}>
          <div className="flex items-center justify-between gap-3 mb-8">
            <div>
              <p className="text-[10px] font-black uppercase tracking-widest text-[#0066FF]">Data Stream</p>
              <h2 className={`mt-2 text-3xl font-black tracking-tighter uppercase ${publicSurfaceTheme.text}`}>Proof of Work</h2>
            </div>
            <House size={24} weight="thin" className="text-black" />
          </div>
          <div className="grid gap-6">
            {spotlight.length > 0 ? spotlight.map((gig) => <GigPreview key={gig.id} gig={gig} />) : (
              <div className={`p-8 border border-dashed border-black/10 text-center`}>
                <p className={`text-xs uppercase font-bold tracking-widest ${publicSurfaceTheme.muted}`}>Waiting for live data transmission...</p>
              </div>
            )}
          </div>
        </div>
      </section>

      {supportMode && (
        <section className="relative z-10 grid gap-6 lg:grid-cols-3 mb-24">
          {config.highlights.map((item) => (
            <div key={item} className={`border ${publicSurfaceTheme.border} ${publicSurfaceTheme.surface} p-8 tech-card`}>
              <div className="flex items-center gap-2 text-[#0066FF] mb-4">
                <CheckCircle size={18} weight="bold" />
                <p className="text-[10px] font-black uppercase tracking-widest">{item}</p>
              </div>
              <p className={`text-sm leading-relaxed ${publicSurfaceTheme.muted}`}>
                {variant === 'help' && 'Technical resolution paths and direct human escalation protocols.'}
                {variant === 'contact' && 'Direct communication interface for verified platform support.'}
                {variant === 'careers' && "Join the engineering team building Africa's trust infrastructure."}
              </p>
            </div>
          ))}
        </section>
      )}

      {legalMode && (
        <section className="relative z-10 grid gap-12 lg:grid-cols-[1.2fr_0.8fr] mb-24">
          <LegalPanel title={config.title}>
            <p>{config.body}</p>
            <p className="font-bold">
              SYSTEM PROTOCOL: Data is processed in accordance with privacy-first standards.
            </p>
          </LegalPanel>

          <div className={`border ${publicSurfaceTheme.border} ${publicSurfaceTheme.panel} p-8 tech-card`}>
            <p className="text-[10px] font-black uppercase tracking-widest text-[#0066FF] mb-6">Linked Protocols</p>
            <div className="space-y-3">
              {config.highlights.map((item) => (
                <div key={item} className={`border border-black/5 bg-white p-4`}>
                  <p className={`text-xs font-black uppercase tracking-widest ${publicSurfaceTheme.text}`}>{item}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      <section className="relative z-10 border border-black/10 bg-zinc-50 p-12 lg:p-16">
        <div className="flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-[10px] font-black uppercase tracking-widest text-[#0066FF]">System Ready</p>
            <h2 className={`mt-2 text-4xl font-black tracking-tighter uppercase leading-none ${publicSurfaceTheme.text}`}>Execute <br /> Platform Initialization</h2>
          </div>
          <div className="flex flex-wrap gap-4">
            <Link href="/dashboard/feed" className="inline-flex h-14 items-center justify-center bg-black px-8 text-xs font-black uppercase tracking-widest text-white hover:bg-[#0066FF] transition-all">
              Initialize Feed
            </Link>
            <Link href="/login" className={`inline-flex h-14 items-center justify-center border border-black/10 px-8 text-xs font-black uppercase tracking-widest ${publicSurfaceTheme.text} hover:bg-white transition-all`}>
              System Sign-in
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
