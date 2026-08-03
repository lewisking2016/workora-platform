'use client';

import type { ElementType, ReactNode } from 'react';
import Link from 'next/link';
import {
  ArrowClockwise,
  Bell,
  CalendarBlank,
  ChartBar,
  CheckCircle,
  ChatCircleDots,
  Compass,
  Eye,
  House,
  MagnifyingGlass,
  Microphone,
  Paperclip,
  PaperPlaneTilt,
  PushPin,
  LockKey,
  SealQuestion,
  ShieldWarning,
  SpinnerGap,
  Heart,
  UserCircle,
  UserMinus,
  Users,
  WarningCircle,
  WifiSlash,
} from '@phosphor-icons/react';
import { SystemStatus } from '@/lib/system-status';

type AuthErrorCode =
  | 'invalid_credentials'
  | 'too_many_attempts'
  | 'network_error'
  | 'token_refresh_failed'
  | 'access_denied'
  | 'email_already_used'
  | 'phone_already_used'
  | 'verification_expired'
  | 'missing_credentials'
  | 'username_already_used'
  | 'account_already_exists';

const AUTH_COPY: Record<AuthErrorCode, { title: string; body: string; primary: { label: string; href: string }; secondary?: { label: string; href: string } }> = {
  invalid_credentials: {
    title: 'Invalid credentials',
    body: 'The phone number, username, or password did not match a live account.',
    primary: { label: 'Try again', href: '/login' },
    secondary: { label: 'Reset password', href: '/forgot' },
  },
  too_many_attempts: {
    title: 'Too many attempts',
    body: 'This account is temporarily locked after repeated failed sign-ins.',
    primary: { label: 'Try again later', href: '/login' },
    secondary: { label: 'Reset password', href: '/forgot' },
  },
  network_error: {
    title: 'Network error',
    body: 'The request could not reach the backend. Check your connection and try again.',
    primary: { label: 'Retry login', href: '/login' },
    secondary: { label: 'View offline screen', href: '/offline' },
  },
  token_refresh_failed: {
    title: 'Token refresh failed',
    body: 'Your session could not be renewed. Sign in again to continue.',
    primary: { label: 'Sign in again', href: '/login' },
  },
  access_denied: {
    title: 'Access denied',
    body: 'This account does not have permission to open that screen.',
    primary: { label: 'Go to dashboard', href: '/dashboard' },
    secondary: { label: 'Sign out', href: '/login' },
  },
  email_already_used: {
    title: 'Email already used',
    body: 'That email is already attached to another account.',
    primary: { label: 'Use a different email', href: '/join' },
    secondary: { label: 'Sign in', href: '/login' },
  },
  phone_already_used: {
    title: 'Phone already used',
    body: 'That phone number is already attached to another account.',
    primary: { label: 'Use a different phone', href: '/join' },
    secondary: { label: 'Sign in', href: '/login' },
  },
  verification_expired: {
    title: 'Verification expired',
    body: 'The verification window ended. Request a new code to continue.',
    primary: { label: 'Resend verification', href: '/forgot' },
    secondary: { label: 'Return to join', href: '/join' },
  },
  missing_credentials: {
    title: 'Missing credentials',
    body: 'Enter your sign-in details before trying again.',
    primary: { label: 'Back to login', href: '/login' },
  },
  username_already_used: {
    title: 'Username already used',
    body: 'That username is already taken by another account.',
    primary: { label: 'Pick another username', href: '/join' },
    secondary: { label: 'Sign in', href: '/login' },
  },
  account_already_exists: {
    title: 'Account already exists',
    body: 'An account with those details already exists.',
    primary: { label: 'Sign in', href: '/login' },
    secondary: { label: 'Create new account', href: '/join' },
  },
};

type AuthStateCode =
  | 'session_expired'
  | 'account_locked'
  | 'account_disabled'
  | 'suspicious_login'
  | 'verify_email'
  | 'verify_phone'
  | 'otp_entry'
  | 'reset_password'
  | 'password_reset_confirmation'
  | 'magic_link_confirmation'
  | 'recovery_code'
  | 'two_factor_setup'
  | 'two_factor_challenge'
  | 'change_password'
  | 'security_settings'
  | 'active_sessions'
  | 'device_management'
  | 'logout_confirmation'
  | 'sign_out_everywhere';

const AUTH_STATE_COPY: Record<AuthStateCode, { title: string; body: string; icon: ElementType; primary: { label: string; href: string }; secondary?: { label: string; href: string } }> = {
  session_expired: {
    title: 'Session expired',
    body: 'Your session ended. Sign in again to continue with live backend access.',
    icon: ArrowClockwise,
    primary: { label: 'Sign in again', href: '/login' },
    secondary: { label: 'View login', href: '/login' },
  },
  account_locked: {
    title: 'Account locked',
    body: 'Too many failed attempts or a security review has temporarily locked this account.',
    icon: LockKey,
    primary: { label: 'Return to login', href: '/login' },
    secondary: { label: 'Reset password', href: '/forgot' },
  },
  account_disabled: {
    title: 'Account disabled',
    body: 'This account is currently disabled in the live backend and cannot sign in.',
    icon: ShieldWarning,
    primary: { label: 'Contact support', href: '/help' },
    secondary: { label: 'Back to login', href: '/login' },
  },
  suspicious_login: {
    title: 'Suspicious login',
    body: 'A security event was detected. Confirm your identity before continuing.',
    icon: ShieldWarning,
    primary: { label: 'Verify identity', href: '/auth/verify/email' },
    secondary: { label: 'Back to login', href: '/login' },
  },
  verify_email: {
    title: 'Verify email address',
    body: 'Confirm the email tied to this account so notifications and recovery can proceed.',
    icon: Bell,
    primary: { label: 'Open inbox', href: '/auth/otp' },
    secondary: { label: 'Resend code', href: '/auth/error/verification_expired' },
  },
  verify_phone: {
    title: 'Verify phone number',
    body: 'Confirm the phone number tied to this account so sign-in and recovery can proceed.',
    icon: Bell,
    primary: { label: 'Enter code', href: '/auth/otp' },
    secondary: { label: 'Back to join', href: '/join' },
  },
  otp_entry: {
    title: 'Enter one-time code',
    body: 'Use the live code sent by the backend to finish sign-in or verification.',
    icon: CheckCircle,
    primary: { label: 'Submit code', href: '/dashboard' },
    secondary: { label: 'Resend code', href: '/auth/error/verification_expired' },
  },
  reset_password: {
    title: 'Reset password',
    body: 'Request a password reset from the live backend and continue back to login.',
    icon: ArrowClockwise,
    primary: { label: 'Request reset', href: '/forgot' },
    secondary: { label: 'Back to login', href: '/login' },
  },
  password_reset_confirmation: {
    title: 'Password reset confirmed',
    body: 'Your password has been updated and the account can now sign in again.',
    icon: CheckCircle,
    primary: { label: 'Sign in', href: '/login' },
    secondary: { label: 'Open dashboard', href: '/dashboard' },
  },
  magic_link_confirmation: {
    title: 'Magic link confirmed',
    body: 'The live link was accepted and the session can continue.',
    icon: CheckCircle,
    primary: { label: 'Open dashboard', href: '/dashboard' },
    secondary: { label: 'Back to login', href: '/login' },
  },
  recovery_code: {
    title: 'Recovery code',
    body: 'Store or use a recovery code to regain access when primary verification is unavailable.',
    icon: SealQuestion,
    primary: { label: 'Generate new code', href: '/settings/security' },
    secondary: { label: 'Back to security', href: '/settings/security' },
  },
  two_factor_setup: {
    title: 'Set up two-factor authentication',
    body: 'Finish the live two-factor setup to protect the account and future sign-ins.',
    icon: ShieldWarning,
    primary: { label: 'Continue setup', href: '/auth/two-factor/challenge' },
    secondary: { label: 'Back to security', href: '/settings/security' },
  },
  two_factor_challenge: {
    title: 'Two-factor challenge',
    body: 'Enter the code from your trusted device or authenticator app.',
    icon: LockKey,
    primary: { label: 'Verify now', href: '/dashboard' },
    secondary: { label: 'Use recovery code', href: '/auth/recovery-code' },
  },
  change_password: {
    title: 'Change password',
    body: 'Update the password from the live security settings and keep the session secure.',
    icon: LockKey,
    primary: { label: 'Open security settings', href: '/settings/security' },
    secondary: { label: 'Manage sessions', href: '/settings/sessions' },
  },
  security_settings: {
    title: 'Security settings',
    body: 'Review passwords, sessions, devices, and recovery options from the live account settings.',
    icon: ShieldWarning,
    primary: { label: 'Active sessions', href: '/settings/sessions' },
    secondary: { label: 'Device management', href: '/settings/devices' },
  },
  active_sessions: {
    title: 'Active sessions',
    body: 'See and manage the live sessions that are currently signed in to this account.',
    icon: CalendarBlank,
    primary: { label: 'Sign out everywhere', href: '/settings/sign-out-everywhere' },
    secondary: { label: 'Back to security', href: '/settings/security' },
  },
  device_management: {
    title: 'Device management',
    body: 'Review trusted devices and remove anything that no longer belongs to you.',
    icon: UserCircle,
    primary: { label: 'Open sessions', href: '/settings/sessions' },
    secondary: { label: 'Back to security', href: '/settings/security' },
  },
  logout_confirmation: {
    title: 'Log out confirmation',
    body: 'Confirm that you want to end the live session on this device.',
    icon: ArrowClockwise,
    primary: { label: 'Log out now', href: '/login' },
    secondary: { label: 'Keep me signed in', href: '/dashboard' },
  },
  sign_out_everywhere: {
    title: 'Sign out everywhere',
    body: 'End all live sessions across every signed-in device for this account.',
    icon: WifiSlash,
    primary: { label: 'Sign out everywhere', href: '/login' },
    secondary: { label: 'Back to security', href: '/settings/security' },
  },
};

const shellLabels = [
  { icon: House, label: 'Home' },
  { icon: MagnifyingGlass, label: 'Search' },
  { icon: Compass, label: 'Explore' },
  { icon: Eye, label: 'Works' },
  { icon: Bell, label: 'Alerts' },
];

function SurfaceCard({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="rounded-[16px] border border-zinc-200 bg-white p-5 shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-sm font-black uppercase tracking-[0.22em] text-zinc-500 dark:text-zinc-400">{title}</h3>
      </div>
      {children}
    </section>
  );
}

type ProfileStateCode =
  | 'loading'
  | 'empty'
  | 'not_found'
  | 'private'
  | 'restricted'
  | 'suspended'
  | 'verification_pending';

const PROFILE_COPY: Record<Exclude<ProfileStateCode, 'loading'>, { title: string; body: string; icon: ElementType; primary: { label: string; href: string }; secondary?: { label: string; href: string } }> = {
  empty: {
    title: 'Profile is empty',
    body: 'This profile is live, but it has not published work, skills, or supporting details yet.',
    icon: UserCircle,
    primary: { label: 'Return to explore', href: '/explore' },
    secondary: { label: 'Open dashboard', href: '/dashboard/profile' },
  },
  not_found: {
    title: 'Profile not found',
    body: 'The profile you are looking for does not exist or has been removed from the system.',
    icon: WarningCircle,
    primary: { label: 'Back to explore', href: '/explore' },
    secondary: { label: 'Search professionals', href: '/dashboard/search' },
  },
  private: {
    title: 'Profile is private',
    body: 'The owner has made this profile private, so only approved viewers can open it.',
    icon: LockKey,
    primary: { label: 'Search professionals', href: '/dashboard/search' },
    secondary: { label: 'Back to dashboard', href: '/dashboard' },
  },
  restricted: {
    title: 'Profile is restricted',
    body: 'This profile is visible to the system, but public access is limited by trust or safety settings.',
    icon: ShieldWarning,
    primary: { label: 'Back to explore', href: '/explore' },
    secondary: { label: 'Open support', href: '/help' },
  },
  suspended: {
    title: 'Profile is suspended',
    body: 'This account has been suspended and is not available for public viewing right now.',
    icon: UserMinus,
    primary: { label: 'Back to explore', href: '/explore' },
    secondary: { label: 'Open support', href: '/help' },
  },
  verification_pending: {
    title: 'Verification pending',
    body: 'The profile is live, but identity verification is still in progress.',
    icon: SealQuestion,
    primary: { label: 'Open dashboard', href: '/dashboard/profile' },
    secondary: { label: 'View trust info', href: '/trust' },
  },
};

export function ProfileStateScreen({
  state,
  title,
  description,
}: {
  state: ProfileStateCode;
  title?: string;
  description?: string;
}) {
  if (state === 'loading') {
    return (
      <main className="min-h-[70vh] bg-zinc-50 px-6 py-14 dark:bg-[#0A0E17]">
        <div className="mx-auto flex max-w-3xl flex-col items-center gap-5 rounded-[20px] border border-zinc-200 bg-white p-8 text-center shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[#0066FF]/10 text-[#0066FF]">
            <SpinnerGap size={24} weight="bold" className="animate-spin" />
          </div>
          <div>
            <p className="text-[11px] font-black uppercase tracking-[0.24em] text-zinc-400">Profile loading state</p>
            <h1 className="mt-3 text-2xl font-black tracking-tight text-zinc-950 dark:text-white">{title || 'Loading live profile'}</h1>
          </div>
          <p className="max-w-xl text-sm leading-7 text-zinc-600 dark:text-zinc-400">
            {description || 'We are pulling the latest profile data from the backend.'}
          </p>
        </div>
      </main>
    );
  }

  const copy = PROFILE_COPY[state];
  const Icon = copy.icon;

  return (
    <main className="min-h-[70vh] bg-zinc-50 px-6 py-14 dark:bg-[#0A0E17]">
      <div className="mx-auto flex max-w-3xl flex-col items-center gap-6 rounded-[20px] border border-zinc-200 bg-white p-8 text-center shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[#0066FF]/10 text-[#0066FF]">
          <Icon size={30} weight="fill" />
        </div>
        <div>
          <p className="text-[11px] font-black uppercase tracking-[0.24em] text-zinc-400">Profile state</p>
          <h1 className="mt-3 text-3xl font-black tracking-tight text-zinc-950 dark:text-white">
            {title || copy.title}
          </h1>
        </div>
        <p className="max-w-2xl text-sm leading-7 text-zinc-600 dark:text-zinc-400">
          {description || copy.body}
        </p>
        <div className="flex flex-wrap justify-center gap-3">
          <Link href={copy.primary.href} className="inline-flex h-12 items-center justify-center rounded-xl bg-[#0066FF] px-5 text-sm font-black text-white">
            {copy.primary.label}
          </Link>
          {copy.secondary ? (
            <Link href={copy.secondary.href} className="inline-flex h-12 items-center justify-center rounded-xl border border-zinc-200 px-5 text-sm font-black text-zinc-950 dark:border-zinc-800 dark:text-white">
              {copy.secondary.label}
            </Link>
          ) : null}
        </div>
      </div>
    </main>
  );
}

export function AuthErrorScreen({ code, retryAfterMinutes, status }: { code: string; retryAfterMinutes?: number; status?: SystemStatus | null }) {
  const copy = AUTH_COPY[code as AuthErrorCode] || AUTH_COPY.access_denied;

  return (
    <main className="min-h-[80vh] bg-zinc-50 px-6 py-14 dark:bg-[#0A0E17]">
      <div className="mx-auto flex max-w-3xl flex-col gap-6 rounded-[20px] border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-rose-50 text-rose-600 dark:bg-rose-500/10 dark:text-rose-300">
              <WarningCircle size={24} weight="fill" />
            </div>
            <div>
              <p className="text-[11px] font-black uppercase tracking-[0.24em] text-zinc-400">Authentication error</p>
              <h1 className="text-2xl font-black tracking-tight text-zinc-950 dark:text-white">{copy.title}</h1>
            </div>
          </div>
          <div className={`inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-black ${status?.healthy ? 'border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-400/20 dark:bg-emerald-400/10 dark:text-emerald-300' : 'border-zinc-200 bg-zinc-50 text-zinc-600 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-400'}`}>
            {status?.healthy ? <CheckCircle size={14} weight="fill" /> : <WifiSlash size={14} weight="fill" />}
            {status?.healthy ? 'Backend live' : 'Backend unavailable'}
          </div>
        </div>

        <p className="max-w-2xl text-sm leading-7 text-zinc-600 dark:text-zinc-400">{copy.body}</p>

        {typeof retryAfterMinutes === 'number' ? (
          <div className="rounded-[16px] border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900 dark:border-amber-400/20 dark:bg-amber-400/10 dark:text-amber-200">
            Try again in about {retryAfterMinutes} minute{retryAfterMinutes === 1 ? '' : 's'}.
          </div>
        ) : null}

        <div className="flex flex-wrap gap-3">
          <Link href={copy.primary.href} className="inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-[#0066FF] px-5 text-sm font-black text-white">
            <ArrowClockwise size={16} weight="bold" />
            {copy.primary.label}
          </Link>
          {copy.secondary ? (
            <Link href={copy.secondary.href} className="inline-flex h-12 items-center justify-center gap-2 rounded-xl border border-zinc-200 px-5 text-sm font-black text-zinc-950 dark:border-zinc-800 dark:text-white">
              {copy.secondary.label}
            </Link>
          ) : null}
        </div>
      </div>
    </main>
  );
}

export function AuthStateScreen({
  state,
  title,
  description,
  primaryHref,
  primaryLabel,
  secondaryHref,
  secondaryLabel,
  status,
}: {
  state: AuthStateCode;
  title?: string;
  description?: string;
  primaryHref?: string;
  primaryLabel?: string;
  secondaryHref?: string;
  secondaryLabel?: string;
  status?: SystemStatus | null;
}) {
  const copy = AUTH_STATE_COPY[state];
  const Icon = copy.icon;

  return (
    <main className="min-h-[80vh] bg-zinc-50 px-6 py-14 dark:bg-[#0A0E17]">
      <div className="mx-auto flex max-w-3xl flex-col gap-6 rounded-[20px] border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#0066FF]/10 text-[#0066FF]">
              <Icon size={24} weight="fill" />
            </div>
            <div>
              <p className="text-[11px] font-black uppercase tracking-[0.24em] text-zinc-400">Account state</p>
              <h1 className="text-2xl font-black tracking-tight text-zinc-950 dark:text-white">{title || copy.title}</h1>
            </div>
          </div>
          <div className={`inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-black ${status?.healthy ? 'border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-400/20 dark:bg-emerald-400/10 dark:text-emerald-300' : 'border-zinc-200 bg-zinc-50 text-zinc-600 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-400'}`}>
            {status?.healthy ? <CheckCircle size={14} weight="fill" /> : <WifiSlash size={14} weight="fill" />}
            {status?.service || 'workora-backend'}
          </div>
        </div>

        <p className="max-w-2xl text-sm leading-7 text-zinc-600 dark:text-zinc-400">
          {description || copy.body}
        </p>

        <div className="flex flex-wrap gap-3">
          <Link href={primaryHref || copy.primary.href} className="inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-[#0066FF] px-5 text-sm font-black text-white">
            {primaryLabel || copy.primary.label}
          </Link>
          <Link href={secondaryHref || copy.secondary?.href || '/dashboard'} className="inline-flex h-12 items-center justify-center gap-2 rounded-xl border border-zinc-200 px-5 text-sm font-black text-zinc-950 dark:border-zinc-800 dark:text-white">
            {secondaryLabel || copy.secondary?.label || 'Back'}
          </Link>
        </div>
      </div>
    </main>
  );
}

export function SystemStateScreen({
  title,
  description,
  primaryHref,
  primaryLabel,
  secondaryHref,
  secondaryLabel,
  status,
  variant,
  icon: Icon,
}: {
  title: string;
  description: string;
  primaryHref: string;
  primaryLabel: string;
  secondaryHref?: string;
  secondaryLabel?: string;
  status?: SystemStatus | null;
  variant?: 'maintenance' | 'offline' | 'generic';
  icon?: ElementType;
}) {
  const ResolvedIcon = Icon || (variant === 'offline' ? WifiSlash : ShieldWarning);

  return (
    <main className="min-h-[80vh] bg-zinc-50 px-6 py-14 dark:bg-[#0A0E17]">
      <div className="mx-auto flex max-w-3xl flex-col gap-6 rounded-[20px] border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#0066FF]/10 text-[#0066FF]">
              <ResolvedIcon size={24} weight="fill" />
            </div>
            <div>
              <p className="text-[11px] font-black uppercase tracking-[0.24em] text-zinc-400">System state</p>
              <h1 className="text-2xl font-black tracking-tight text-zinc-950 dark:text-white">{title}</h1>
            </div>
          </div>
          <div className="inline-flex items-center gap-2 rounded-full border border-zinc-200 px-3 py-1 text-xs font-black text-zinc-600 dark:border-zinc-800 dark:text-zinc-400">
            {status?.healthy ? <CheckCircle size={14} weight="fill" /> : <WifiSlash size={14} weight="fill" />}
            {status?.service || 'workora-backend'}
          </div>
        </div>

        <p className="max-w-2xl text-sm leading-7 text-zinc-600 dark:text-zinc-400">{description}</p>

        {status?.maintenanceMode ? (
          <div className="rounded-[16px] border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900 dark:border-amber-400/20 dark:bg-amber-400/10 dark:text-amber-200">
            {status.maintenanceMessage || 'Maintenance mode is enabled from live system settings.'}
          </div>
        ) : null}

        <div className="flex flex-wrap gap-3">
          <Link href={primaryHref} className="inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-[#0066FF] px-5 text-sm font-black text-white">
            {primaryLabel}
          </Link>
          {secondaryHref && secondaryLabel ? (
            <Link href={secondaryHref} className="inline-flex h-12 items-center justify-center gap-2 rounded-xl border border-zinc-200 px-5 text-sm font-black text-zinc-950 dark:border-zinc-800 dark:text-white">
              {secondaryLabel}
            </Link>
          ) : null}
        </div>
      </div>
    </main>
  );
}

export function DashboardShellShowcase({
  status,
  liveFeedCount,
}: {
  status?: SystemStatus | null;
  liveFeedCount: number;
}) {
  return (
    <main className="min-h-screen bg-zinc-50 px-4 py-8 dark:bg-[#0A0E17] md:px-6 lg:px-8">
      <div className="mx-auto flex max-w-7xl flex-col gap-6">
        <section className="rounded-[20px] border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-950">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="text-[11px] font-black uppercase tracking-[0.24em] text-zinc-400">Dashboard shell</p>
              <h1 className="mt-2 text-3xl font-black tracking-tight text-zinc-950 dark:text-white">Workspace frame and live shell states</h1>
              <p className="mt-2 max-w-2xl text-sm leading-7 text-zinc-600 dark:text-zinc-400">
                These shells are driven by the live backend and the actual dashboard layout, not mock counts or fabricated modules.
              </p>
            </div>
            <div className="inline-flex items-center gap-2 rounded-full border border-zinc-200 bg-zinc-50 px-3 py-2 text-xs font-black text-zinc-600 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-400">
              <ShieldWarning size={14} weight="fill" />
              {status?.healthy ? 'Backend healthy' : 'Backend offline'}
            </div>
          </div>
        </section>

        <div className="grid gap-6 lg:grid-cols-[240px_1fr]">
          <SurfaceCard title="Left navigation shell">
            <div className="space-y-2">
              {shellLabels.map((item) => (
                <div key={item.label} className="flex items-center gap-3 rounded-[14px] px-3 py-2 text-sm text-zinc-600 dark:text-zinc-400">
                  <item.icon size={18} weight="regular" className="text-[#0066FF]" />
                  {item.label}
                </div>
              ))}
            </div>
          </SurfaceCard>

          <div className="grid gap-6">
            <SurfaceCard title="Top navigation shell">
              <div className="flex flex-wrap items-center gap-3">
                <div className="h-10 w-28 rounded-xl bg-zinc-100 dark:bg-zinc-900" />
                <div className="h-10 w-20 rounded-xl bg-zinc-100 dark:bg-zinc-900" />
                <div className="h-10 w-20 rounded-xl bg-zinc-100 dark:bg-zinc-900" />
                <div className="ml-auto h-10 w-24 rounded-xl bg-[#0066FF]/10" />
              </div>
            </SurfaceCard>

            <div className="grid gap-6 md:grid-cols-2">
              <SurfaceCard title="Mobile header shell">
                <div className="flex items-center justify-between">
                  <div className="h-10 w-28 rounded-xl bg-zinc-100 dark:bg-zinc-900" />
                  <div className="h-10 w-10 rounded-xl bg-zinc-100 dark:bg-zinc-900" />
                </div>
              </SurfaceCard>
              <SurfaceCard title="Tablet navigation shell">
                <div className="flex flex-wrap gap-2">
                  {shellLabels.slice(0, 4).map((item) => (
                    <span key={item.label} className="rounded-full border border-zinc-200 px-3 py-2 text-xs font-black text-zinc-500 dark:border-zinc-800 dark:text-zinc-400">
                      {item.label}
                    </span>
                  ))}
                </div>
              </SurfaceCard>
            </div>

            <SurfaceCard title="Desktop workspace shell">
              <div className="grid gap-4 lg:grid-cols-[1.2fr_0.8fr]">
                <div className="space-y-3 rounded-[16px] border border-zinc-200 bg-zinc-50 p-4 dark:border-zinc-800 dark:bg-zinc-900">
                  <div className="h-5 w-32 rounded bg-zinc-200 dark:bg-zinc-800" />
                  <div className="h-4 w-3/4 rounded bg-zinc-200 dark:bg-zinc-800" />
                  <div className="h-4 w-2/3 rounded bg-zinc-200 dark:bg-zinc-800" />
                  <div className="grid grid-cols-2 gap-3 pt-3">
                    <div className="h-20 rounded-[14px] bg-zinc-200 dark:bg-zinc-800" />
                    <div className="h-20 rounded-[14px] bg-zinc-200 dark:bg-zinc-800" />
                  </div>
                </div>
                <div className="space-y-3 rounded-[16px] border border-zinc-200 bg-zinc-50 p-4 dark:border-zinc-800 dark:bg-zinc-900">
                  <div className="flex items-center gap-2 text-sm font-black text-zinc-950 dark:text-white">
                    <CalendarBlank size={16} weight="fill" className="text-[#0066FF]" />
                    Live feed count
                  </div>
                  <p className="text-3xl font-black text-zinc-950 dark:text-white">{liveFeedCount.toLocaleString()}</p>
                  <p className="text-sm leading-6 text-zinc-500 dark:text-zinc-400">This value comes from the live feed query for the current workspace.</p>
                </div>
              </div>
            </SurfaceCard>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          <SurfaceCard title="Empty shell state">
            {liveFeedCount > 0 ? (
              <div className="space-y-3">
                <p className="text-sm font-medium text-zinc-600 dark:text-zinc-400">
                  The live feed already has {liveFeedCount.toLocaleString()} posts, so this state is showing the empty-shell pattern without pretending the data is empty.
                </p>
                <div className="rounded-[16px] border border-dashed border-zinc-200 bg-zinc-50 p-5 dark:border-zinc-800 dark:bg-zinc-900">
                  <p className="text-sm font-black text-zinc-950 dark:text-white">No results yet</p>
                  <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">Use filters or create new work to populate this space.</p>
                </div>
              </div>
            ) : (
              <div className="rounded-[16px] border border-dashed border-zinc-200 bg-zinc-50 p-5 dark:border-zinc-800 dark:bg-zinc-900">
                <p className="text-sm font-black text-zinc-950 dark:text-white">No content yet</p>
                <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">The backend returned no items, so the empty state is live.</p>
              </div>
            )}
          </SurfaceCard>

          <SurfaceCard title="Skeleton shell state">
            <div className="space-y-3">
              <div className="h-4 w-2/5 rounded bg-zinc-200 dark:bg-zinc-800" />
              <div className="h-4 w-3/4 rounded bg-zinc-200 dark:bg-zinc-800" />
              <div className="h-4 w-1/2 rounded bg-zinc-200 dark:bg-zinc-800" />
              <div className="grid grid-cols-3 gap-3 pt-2">
                <div className="h-16 rounded-[14px] bg-zinc-200 dark:bg-zinc-800" />
                <div className="h-16 rounded-[14px] bg-zinc-200 dark:bg-zinc-800" />
                <div className="h-16 rounded-[14px] bg-zinc-200 dark:bg-zinc-800" />
              </div>
            </div>
          </SurfaceCard>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <SurfaceCard title="Bottom navigation shell">
            <div className="flex items-center justify-between">
              {shellLabels.slice(0, 5).map((item) => (
                <div key={item.label} className="flex flex-col items-center gap-1 text-zinc-500 dark:text-zinc-400">
                  <item.icon size={18} weight="regular" />
                  <span className="text-[10px] font-black uppercase tracking-[0.2em]">{item.label}</span>
                </div>
              ))}
            </div>
          </SurfaceCard>

          <SurfaceCard title="Live backend status">
            <div className="flex items-center gap-3">
              <div className={`h-3 w-3 rounded-full ${status?.healthy ? 'bg-emerald-500' : 'bg-rose-500'}`} />
              <div>
                <p className="text-sm font-black text-zinc-950 dark:text-white">{status?.service || 'workora-backend'}</p>
                <p className="text-sm text-zinc-500 dark:text-zinc-400">
                  {status?.healthy ? 'Healthy and answering requests' : 'Unavailable at the moment'}
                </p>
              </div>
            </div>
          </SurfaceCard>
        </div>
      </div>
    </main>
  );
}

type ShellMode = 'mobile' | 'tablet' | 'desktop' | 'empty' | 'skeleton' | 'maintenance' | 'offline';

export function DashboardShellVariantScreen({
  mode,
  status,
  liveFeedCount,
  liveTradeCount,
}: {
  mode: ShellMode;
  status?: SystemStatus | null;
  liveFeedCount: number;
  liveTradeCount: number;
}) {
  const titleMap: Record<ShellMode, string> = {
    mobile: 'Mobile header shell',
    tablet: 'Tablet navigation shell',
    desktop: 'Desktop workspace shell',
    empty: 'Empty shell state',
    skeleton: 'Skeleton shell state',
    maintenance: 'Maintenance shell state',
    offline: 'Offline shell state',
  };

  const descriptionMap: Record<ShellMode, string> = {
    mobile: 'Compact rails and headers for smaller screens, driven by the live dashboard structure.',
    tablet: 'A medium-density workspace with stronger content grouping and more breathing room.',
    desktop: 'The full workspace frame with side navigation, content, and supporting panels.',
    empty: 'When live data is missing, the empty shell still explains the next action.',
    skeleton: 'Loading placeholders that match the real dashboard geometry without fake data.',
    maintenance: 'A status-first shell that surfaces live backend maintenance messaging.',
    offline: 'A recovery shell that explains the outage and offers a live retry path.',
  };

  return (
    <main className="min-h-screen bg-zinc-50 px-4 py-8 dark:bg-[#0A0E17] md:px-6 lg:px-8">
      <div className="mx-auto flex max-w-7xl flex-col gap-6">
        <section className="rounded-[20px] border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-950">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="text-[11px] font-black uppercase tracking-[0.24em] text-zinc-400">Core app shell</p>
              <h1 className="mt-2 text-3xl font-black tracking-tight text-zinc-950 dark:text-white">{titleMap[mode]}</h1>
              <p className="mt-2 max-w-2xl text-sm leading-7 text-zinc-600 dark:text-zinc-400">{descriptionMap[mode]}</p>
            </div>
            <div className="inline-flex items-center gap-2 rounded-full border border-zinc-200 bg-zinc-50 px-3 py-2 text-xs font-black text-zinc-600 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-400">
              <CheckCircle size={14} weight="fill" />
              {liveFeedCount.toLocaleString()} live posts
            </div>
          </div>
        </section>

        {mode === 'mobile' && (
          <section className="mx-auto w-full max-w-sm rounded-[28px] border border-zinc-200 bg-white p-4 shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
            <div className="mb-4 flex items-center justify-between">
              <div className="h-10 w-24 rounded-xl bg-zinc-100 dark:bg-zinc-900" />
              <div className="h-10 w-10 rounded-xl bg-zinc-100 dark:bg-zinc-900" />
            </div>
            <div className="rounded-[20px] border border-zinc-200 bg-zinc-50 p-4 dark:border-zinc-800 dark:bg-zinc-900">
              <div className="h-4 w-32 rounded bg-zinc-200 dark:bg-zinc-800" />
              <div className="mt-3 space-y-2">
                <div className="h-3 w-full rounded bg-zinc-200 dark:bg-zinc-800" />
                <div className="h-3 w-5/6 rounded bg-zinc-200 dark:bg-zinc-800" />
              </div>
              <div className="mt-4 grid grid-cols-2 gap-3">
                <div className="h-24 rounded-[16px] bg-zinc-200 dark:bg-zinc-800" />
                <div className="h-24 rounded-[16px] bg-zinc-200 dark:bg-zinc-800" />
              </div>
            </div>
            <div className="mt-4 flex items-center justify-around border-t border-zinc-200 pt-4 text-zinc-500 dark:border-zinc-800 dark:text-zinc-400">
              {shellLabels.slice(0, 4).map((item) => (
                <div key={item.label} className="flex flex-col items-center gap-1">
                  <item.icon size={18} weight="regular" />
                  <span className="text-[9px] font-black uppercase tracking-[0.2em]">{item.label}</span>
                </div>
              ))}
            </div>
          </section>
        )}

        {mode === 'tablet' && (
          <section className="rounded-[20px] border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-950">
            <div className="grid gap-4 md:grid-cols-[220px_1fr]">
              <div className="rounded-[18px] border border-zinc-200 bg-zinc-50 p-4 dark:border-zinc-800 dark:bg-zinc-900">
                <div className="space-y-2">
                  {shellLabels.slice(0, 4).map((item) => (
                    <div key={item.label} className="flex items-center gap-3 rounded-[14px] px-3 py-2 text-sm text-zinc-600 dark:text-zinc-400">
                      <item.icon size={18} weight="regular" className="text-[#0066FF]" />
                      {item.label}
                    </div>
                  ))}
                </div>
              </div>
              <div className="rounded-[18px] border border-zinc-200 bg-zinc-50 p-4 dark:border-zinc-800 dark:bg-zinc-900">
                <div className="h-5 w-48 rounded bg-zinc-200 dark:bg-zinc-800" />
                <div className="mt-4 grid gap-3 md:grid-cols-2">
                  <div className="h-28 rounded-[16px] bg-zinc-200 dark:bg-zinc-800" />
                  <div className="h-28 rounded-[16px] bg-zinc-200 dark:bg-zinc-800" />
                </div>
              </div>
            </div>
          </section>
        )}

        {mode === 'desktop' && (
          <section className="grid gap-4 lg:grid-cols-[240px_1fr_320px]">
            <div className="rounded-[20px] border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-950">
              <div className="space-y-2">
                {shellLabels.map((item) => (
                  <div key={item.label} className="flex items-center gap-3 rounded-[14px] px-3 py-2 text-sm text-zinc-600 dark:text-zinc-400">
                    <item.icon size={18} weight="regular" className="text-[#0066FF]" />
                    {item.label}
                  </div>
                ))}
              </div>
            </div>
            <div className="rounded-[20px] border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-950">
              <div className="h-5 w-48 rounded bg-zinc-200 dark:bg-zinc-800" />
              <div className="mt-4 grid gap-3 md:grid-cols-2 xl:grid-cols-3">
                <div className="h-24 rounded-[16px] bg-zinc-200 dark:bg-zinc-800" />
                <div className="h-24 rounded-[16px] bg-zinc-200 dark:bg-zinc-800" />
                <div className="h-24 rounded-[16px] bg-zinc-200 dark:bg-zinc-800" />
              </div>
              <div className="mt-4 rounded-[16px] border border-zinc-200 bg-zinc-50 p-4 dark:border-zinc-800 dark:bg-zinc-900">
                <p className="text-sm font-black text-zinc-950 dark:text-white">{liveFeedCount.toLocaleString()} live posts</p>
                <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">{liveTradeCount.toLocaleString()} live trades available to drive the workspace.</p>
              </div>
            </div>
            <div className="rounded-[20px] border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-950">
              <div className="space-y-3">
                <div className="h-4 w-40 rounded bg-zinc-200 dark:bg-zinc-800" />
                <div className="h-4 w-full rounded bg-zinc-200 dark:bg-zinc-800" />
                <div className="h-4 w-5/6 rounded bg-zinc-200 dark:bg-zinc-800" />
                <div className="grid grid-cols-2 gap-3 pt-2">
                  <div className="h-20 rounded-[16px] bg-zinc-200 dark:bg-zinc-800" />
                  <div className="h-20 rounded-[16px] bg-zinc-200 dark:bg-zinc-800" />
                </div>
              </div>
            </div>
          </section>
        )}

        {mode === 'empty' && (
          <SurfaceCard title="Empty shell state">
            <div className="rounded-[16px] border border-dashed border-zinc-200 bg-zinc-50 p-5 dark:border-zinc-800 dark:bg-zinc-900">
              <p className="text-sm font-black text-zinc-950 dark:text-white">
                {liveFeedCount > 0 ? 'No results yet' : 'No content yet'}
              </p>
              <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
                {liveFeedCount > 0
                  ? `The backend already has ${liveFeedCount.toLocaleString()} posts, so this is the empty state for a filtered view.`
                  : 'The backend returned no items, so the empty shell is live.'}
              </p>
            </div>
          </SurfaceCard>
        )}

        {mode === 'skeleton' && (
          <SurfaceCard title="Skeleton shell state">
            <div className="space-y-3">
              <div className="h-4 w-2/5 rounded bg-zinc-200 dark:bg-zinc-800" />
              <div className="h-4 w-3/4 rounded bg-zinc-200 dark:bg-zinc-800" />
              <div className="h-4 w-1/2 rounded bg-zinc-200 dark:bg-zinc-800" />
              <div className="grid grid-cols-3 gap-3 pt-2">
                <div className="h-16 rounded-[14px] bg-zinc-200 dark:bg-zinc-800" />
                <div className="h-16 rounded-[14px] bg-zinc-200 dark:bg-zinc-800" />
                <div className="h-16 rounded-[14px] bg-zinc-200 dark:bg-zinc-800" />
              </div>
            </div>
          </SurfaceCard>
        )}

        {(mode === 'maintenance' || mode === 'offline') && (
          <SystemStateScreen
            title={mode === 'maintenance' ? 'Maintenance shell state' : 'Offline shell state'}
            description={mode === 'maintenance'
              ? 'The live backend status says maintenance is active, so the shell prioritizes messaging and a return path.'
              : 'The live backend status says the service cannot be reached, so the shell prioritizes recovery and retry.'}
            primaryHref={mode === 'maintenance' ? '/maintenance' : '/offline'}
            primaryLabel={mode === 'maintenance' ? 'Open maintenance page' : 'Open offline page'}
            secondaryHref="/dashboard"
            secondaryLabel="Back to dashboard"
            status={status}
            variant={mode}
          />
        )}

        <div className="grid gap-6 md:grid-cols-2">
          <SurfaceCard title="Bottom navigation shell">
            <div className="flex items-center justify-between">
              {shellLabels.slice(0, 5).map((item) => (
                <div key={item.label} className="flex flex-col items-center gap-1 text-zinc-500 dark:text-zinc-400">
                  <item.icon size={18} weight="regular" />
                  <span className="text-[10px] font-black uppercase tracking-[0.2em]">{item.label}</span>
                </div>
              ))}
            </div>
          </SurfaceCard>

          <SurfaceCard title="Live backend status">
            <div className="flex items-center gap-3">
              <div className={`h-3 w-3 rounded-full ${status?.healthy ? 'bg-emerald-500' : 'bg-rose-500'}`} />
              <div>
                <p className="text-sm font-black text-zinc-950 dark:text-white">{status?.service || 'workora-backend'}</p>
                <p className="text-sm text-zinc-500 dark:text-zinc-400">
                  {status?.healthy ? 'Healthy and answering requests' : 'Unavailable at the moment'}
                </p>
              </div>
            </div>
          </SurfaceCard>
        </div>
      </div>
    </main>
  );
}

export function InlineLoadingState() {
  return (
    <div className="flex items-center gap-2 text-sm font-semibold text-zinc-500 dark:text-zinc-400">
      <SpinnerGap size={16} weight="bold" className="animate-spin text-[#0066FF]" />
      Loading live data
    </div>
  );
}

type MessageStateCode =
  | 'loading'
  | 'conversations'
  | 'conversation_detail'
  | 'new_conversation'
  | 'new_message'
  | 'reply_composer'
  | 'message_edit'
  | 'message_delete'
  | 'message_read'
  | 'message_unread'
  | 'message_delivered'
  | 'message_failed'
  | 'message_retry'
  | 'attachments'
  | 'voice_note'
  | 'media_preview'
  | 'search'
  | 'pinned'
  | 'archived'
  | 'muted'
  | 'blocked'
  | 'no_conversation';

const MESSAGE_COPY: Record<MessageStateCode, { title: string; body: string; icon: ElementType; primary: { label: string; href: string }; secondary?: { label: string; href: string } }> = {
  loading: {
    title: 'Message loading state',
    body: 'The conversation list is loading from the live backend.',
    icon: SpinnerGap,
    primary: { label: 'Open messages', href: '/dashboard/messages' },
  },
  conversations: {
    title: 'Conversations list',
    body: 'Open live conversations, recent threads, and unread states from the backend.',
    icon: ChatCircleDots,
    primary: { label: 'Open inbox', href: '/dashboard/messages' },
  },
  conversation_detail: {
    title: 'Conversation detail',
    body: 'Open a live message thread to read and reply in context.',
    icon: ChatCircleDots,
    primary: { label: 'Open inbox', href: '/dashboard/messages' },
  },
  new_conversation: {
    title: 'New conversation screen',
    body: 'Start a new live conversation from your network or search results.',
    icon: Users,
    primary: { label: 'Open inbox', href: '/dashboard/messages' },
    secondary: { label: 'Open search', href: '/dashboard/search' },
  },
  new_message: {
    title: 'New message composer',
    body: 'Compose a live direct message and send it to the selected person.',
    icon: PaperPlaneTilt,
    primary: { label: 'Open inbox', href: '/dashboard/messages' },
  },
  reply_composer: {
    title: 'Message reply composer',
    body: 'Reply directly inside a live thread with the current conversation state.',
    icon: ChatCircleDots,
    primary: { label: 'Open inbox', href: '/dashboard/messages' },
  },
  message_edit: {
    title: 'Message edit screen',
    body: 'Edit an earlier message while keeping the live thread in sync.',
    icon: ArrowClockwise,
    primary: { label: 'Open inbox', href: '/dashboard/messages' },
  },
  message_delete: {
    title: 'Message delete confirmation',
    body: 'Confirm deletion of a message in a live conversation.',
    icon: WarningCircle,
    primary: { label: 'Open inbox', href: '/dashboard/messages' },
  },
  message_read: {
    title: 'Message read receipt state',
    body: 'The backend has marked this message as read.',
    icon: CheckCircle,
    primary: { label: 'Open inbox', href: '/dashboard/messages' },
  },
  message_unread: {
    title: 'Message unread state',
    body: 'This message still needs attention in the live thread.',
    icon: Bell,
    primary: { label: 'Open inbox', href: '/dashboard/messages' },
  },
  message_delivered: {
    title: 'Message delivered state',
    body: 'The message reached the live conversation successfully.',
    icon: CheckCircle,
    primary: { label: 'Open inbox', href: '/dashboard/messages' },
  },
  message_failed: {
    title: 'Message failed state',
    body: 'The message could not be delivered and should be retried.',
    icon: WarningCircle,
    primary: { label: 'Open inbox', href: '/dashboard/messages' },
  },
  message_retry: {
    title: 'Message retry state',
    body: 'Retry a failed live message send.',
    icon: ArrowClockwise,
    primary: { label: 'Open inbox', href: '/dashboard/messages' },
  },
  attachments: {
    title: 'Message attachments screen',
    body: 'Attach live media, files, or documents before sending a message.',
    icon: Paperclip,
    primary: { label: 'Open inbox', href: '/dashboard/messages' },
  },
  voice_note: {
    title: 'Voice note screen',
    body: 'Record a voice note for the current conversation.',
    icon: Microphone,
    primary: { label: 'Open inbox', href: '/dashboard/messages' },
  },
  media_preview: {
    title: 'Media message preview',
    body: 'Preview the media before it is sent in the live thread.',
    icon: Eye,
    primary: { label: 'Open inbox', href: '/dashboard/messages' },
  },
  search: {
    title: 'Message search screen',
    body: 'Search across live conversations and messages.',
    icon: MagnifyingGlass,
    primary: { label: 'Open inbox', href: '/dashboard/messages' },
  },
  pinned: {
    title: 'Pinned conversation state',
    body: 'This conversation is pinned for quick access.',
    icon: PushPin,
    primary: { label: 'Open inbox', href: '/dashboard/messages' },
  },
  archived: {
    title: 'Archived conversation state',
    body: 'This conversation has been archived from the primary inbox.',
    icon: CalendarBlank,
    primary: { label: 'Open inbox', href: '/dashboard/messages' },
  },
  muted: {
    title: 'Muted conversation state',
    body: 'Notifications for this conversation are muted in the live system.',
    icon: Bell,
    primary: { label: 'Open inbox', href: '/dashboard/messages' },
  },
  blocked: {
    title: 'Blocked conversation state',
    body: 'This conversation is blocked or restricted by live safety settings.',
    icon: LockKey,
    primary: { label: 'Open inbox', href: '/dashboard/messages' },
  },
  no_conversation: {
    title: 'No conversation state',
    body: 'You do not have any conversations yet, so the inbox is empty.',
    icon: ChatCircleDots,
    primary: { label: 'Open search', href: '/dashboard/search' },
    secondary: { label: 'Create post', href: '/dashboard/create/new' },
  },
};

export function MessageStateScreen({
  state,
  title,
  description,
  primaryHref,
  primaryLabel,
  secondaryHref,
  secondaryLabel,
  status,
}: {
  state: MessageStateCode;
  title?: string;
  description?: string;
  primaryHref?: string;
  primaryLabel?: string;
  secondaryHref?: string;
  secondaryLabel?: string;
  status?: SystemStatus | null;
}) {
  const copy = MESSAGE_COPY[state];
  const Icon = copy.icon;

  return (
    <main className="min-h-[80vh] bg-zinc-50 px-6 py-14 dark:bg-[#0A0E17]">
      <div className="mx-auto flex max-w-3xl flex-col gap-6 rounded-[20px] border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#0066FF]/10 text-[#0066FF]">
              <Icon size={24} weight="fill" />
            </div>
            <div>
              <p className="text-[11px] font-black uppercase tracking-[0.24em] text-zinc-400">Messaging state</p>
              <h1 className="text-2xl font-black tracking-tight text-zinc-950 dark:text-white">{title || copy.title}</h1>
            </div>
          </div>
          <div className={`inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-black ${status?.healthy ? 'border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-400/20 dark:bg-emerald-400/10 dark:text-emerald-300' : 'border-zinc-200 bg-zinc-50 text-zinc-600 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-400'}`}>
            {status?.healthy ? <CheckCircle size={14} weight="fill" /> : <WifiSlash size={14} weight="fill" />}
            {status?.service || 'workora-backend'}
          </div>
        </div>

        <p className="max-w-2xl text-sm leading-7 text-zinc-600 dark:text-zinc-400">
          {description || copy.body}
        </p>

        <div className="flex flex-wrap gap-3">
          <Link href={primaryHref || copy.primary.href} className="inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-[#0066FF] px-5 text-sm font-black text-white">
            {primaryLabel || copy.primary.label}
          </Link>
          <Link href={secondaryHref || copy.secondary?.href || '/dashboard/messages'} className="inline-flex h-12 items-center justify-center gap-2 rounded-xl border border-zinc-200 px-5 text-sm font-black text-zinc-950 dark:border-zinc-800 dark:text-white">
            {secondaryLabel || copy.secondary?.label || 'Back'}
          </Link>
        </div>
      </div>
    </main>
  );
}

type NotificationStateCode =
  | 'inbox'
  | 'detail'
  | 'settings'
  | 'push_permission'
  | 'empty'
  | 'read'
  | 'unread'
  | 'filtered'
  | 'like'
  | 'comment'
  | 'follow'
  | 'mention'
  | 'message'
  | 'trust_update'
  | 'system';

const NOTIFICATION_COPY: Record<NotificationStateCode, { title: string; body: string; icon: ElementType; primary: { label: string; href: string }; secondary?: { label: string; href: string } }> = {
  inbox: {
    title: 'Notification inbox',
    body: 'Live likes, comments, follows, ratings, and system updates appear here.',
    icon: Bell,
    primary: { label: 'Open notifications', href: '/notifications' },
  },
  detail: {
    title: 'Notification detail',
    body: 'Open a live notification to see the actor, type, and related content.',
    icon: Bell,
    primary: { label: 'Open inbox', href: '/notifications' },
  },
  settings: {
    title: 'Notification settings',
    body: 'Control how live notifications are delivered and grouped.',
    icon: Bell,
    primary: { label: 'Open inbox', href: '/notifications' },
    secondary: { label: 'Open settings', href: '/settings/security' },
  },
  push_permission: {
    title: 'Push permission prompt',
    body: 'Allow push notifications so live updates can reach your device.',
    icon: Bell,
    primary: { label: 'Open inbox', href: '/notifications' },
  },
  empty: {
    title: 'Notification empty state',
    body: 'There are no live notifications right now.',
    icon: Bell,
    primary: { label: 'Open inbox', href: '/notifications' },
  },
  read: {
    title: 'Notification read state',
    body: 'This item has already been read in the live inbox.',
    icon: CheckCircle,
    primary: { label: 'Open inbox', href: '/notifications' },
  },
  unread: {
    title: 'Notification unread state',
    body: 'This item still needs attention in the live inbox.',
    icon: Bell,
    primary: { label: 'Open inbox', href: '/notifications' },
  },
  filtered: {
    title: 'Notification filtered by type',
    body: 'The inbox is filtered to only show one notification type.',
    icon: MagnifyingGlass,
    primary: { label: 'Open inbox', href: '/notifications' },
  },
  like: {
    title: 'Like notification detail',
    body: 'Someone liked one of your live posts.',
    icon: Heart,
    primary: { label: 'Open inbox', href: '/notifications' },
  },
  comment: {
    title: 'Comment notification detail',
    body: 'Someone commented on one of your live posts.',
    icon: ChatCircleDots,
    primary: { label: 'Open inbox', href: '/notifications' },
  },
  follow: {
    title: 'Follow notification detail',
    body: 'A live user followed your profile.',
    icon: UserCircle,
    primary: { label: 'Open inbox', href: '/notifications' },
  },
  mention: {
    title: 'Mention notification detail',
    body: 'You were mentioned in a live notification thread.',
    icon: ChatCircleDots,
    primary: { label: 'Open inbox', href: '/notifications' },
  },
  message: {
    title: 'Message notification detail',
    body: 'A new direct message arrived from your live inbox.',
    icon: PaperPlaneTilt,
    primary: { label: 'Open inbox', href: '/dashboard/messages' },
  },
  trust_update: {
    title: 'Trust update notification detail',
    body: 'Your trust score or trust status changed in the live system.',
    icon: SealQuestion,
    primary: { label: 'Open trust', href: '/trust' },
  },
  system: {
    title: 'System notification detail',
    body: 'A platform status or system notice needs your attention.',
    icon: Bell,
    primary: { label: 'Open inbox', href: '/notifications' },
  },
};

export function NotificationStateScreen({
  state,
  title,
  description,
  primaryHref,
  primaryLabel,
  secondaryHref,
  secondaryLabel,
  status,
}: {
  state: NotificationStateCode;
  title?: string;
  description?: string;
  primaryHref?: string;
  primaryLabel?: string;
  secondaryHref?: string;
  secondaryLabel?: string;
  status?: SystemStatus | null;
}) {
  const copy = NOTIFICATION_COPY[state];
  const Icon = copy.icon;

  return (
    <main className="min-h-[80vh] bg-zinc-50 px-6 py-14 dark:bg-[#0A0E17]">
      <div className="mx-auto flex max-w-3xl flex-col gap-6 rounded-[20px] border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#0066FF]/10 text-[#0066FF]">
              <Icon size={24} weight="fill" />
            </div>
            <div>
              <p className="text-[11px] font-black uppercase tracking-[0.24em] text-zinc-400">Notification state</p>
              <h1 className="text-2xl font-black tracking-tight text-zinc-950 dark:text-white">{title || copy.title}</h1>
            </div>
          </div>
          <div className={`inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-black ${status?.healthy ? 'border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-400/20 dark:bg-emerald-400/10 dark:text-emerald-300' : 'border-zinc-200 bg-zinc-50 text-zinc-600 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-400'}`}>
            {status?.healthy ? <CheckCircle size={14} weight="fill" /> : <WifiSlash size={14} weight="fill" />}
            {status?.service || 'workora-backend'}
          </div>
        </div>

        <p className="max-w-2xl text-sm leading-7 text-zinc-600 dark:text-zinc-400">
          {description || copy.body}
        </p>

        <div className="flex flex-wrap gap-3">
          <Link href={primaryHref || copy.primary.href} className="inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-[#0066FF] px-5 text-sm font-black text-white">
            {primaryLabel || copy.primary.label}
          </Link>
          <Link href={secondaryHref || copy.secondary?.href || '/notifications'} className="inline-flex h-12 items-center justify-center gap-2 rounded-xl border border-zinc-200 px-5 text-sm font-black text-zinc-950 dark:border-zinc-800 dark:text-white">
            {secondaryLabel || copy.secondary?.label || 'Back'}
          </Link>
        </div>
      </div>
    </main>
  );
}
