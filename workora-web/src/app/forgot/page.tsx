'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, CheckCircle, UserCircle } from '@phosphor-icons/react';

export default function ForgotPage() {
  const [identifier, setIdentifier] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const handleFindAccount = async () => {
    if (!identifier.trim()) return;

    setLoading(true);
    setMessage(null);

    try {
      const response = await fetch('/api/auth/forgot', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ identifier }),
      });

      const data = await response.json().catch(() => null);

      if (!response.ok) {
        throw new Error(data?.message || 'We could not start account recovery.');
      }

      setSuccess(true);
      setMessage(data?.message || 'Recovery instructions have been queued.');
    } catch (error) {
      setSuccess(false);
      setMessage(error instanceof Error ? error.message : 'We could not start account recovery.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white px-[5%] py-20 font-display text-zinc-950 dark:bg-[#0A0E17] dark:text-zinc-50">
      <div className="mx-auto flex max-w-[560px] flex-col items-center">
        <Link href="/login" className="mb-10 inline-flex h-12 w-12 items-center justify-center rounded-full border border-zinc-200 bg-white text-zinc-950 transition-transform hover:scale-110 dark:border-zinc-800 dark:bg-zinc-950 dark:text-white">
          <ArrowLeft size={20} weight="bold" />
        </Link>

        <div className="w-full rounded-[28px] border border-zinc-200 bg-zinc-50 p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900 md:p-10">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#0066FF]/10 text-[#0066FF]">
              <UserCircle size={24} weight="bold" />
            </div>
            <div>
              <p className="text-[11px] font-black uppercase tracking-[0.24em] text-[#0066FF]">Account recovery</p>
              <h1 className="mt-1 text-2xl font-black tracking-tight">Find your account</h1>
            </div>
          </div>

          <p className="mt-4 text-sm leading-6 text-zinc-600 dark:text-zinc-400">
            Enter a phone number, username, or email address. If the account exists, we will queue recovery instructions without exposing whether it is registered.
          </p>

          <div className="mt-8 space-y-4">
            <input
              type="text"
              placeholder="Phone number, username, or email"
              className="h-12 w-full rounded-xl border border-zinc-200 bg-white px-4 text-sm font-medium outline-none transition-colors placeholder:text-zinc-400 focus:border-[#0066FF] dark:border-zinc-800 dark:bg-zinc-950 dark:text-white"
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
            />

            <button
              disabled={!identifier.trim() || loading}
              onClick={handleFindAccount}
              className="inline-flex h-12 w-full items-center justify-center rounded-xl bg-[#0066FF] px-5 text-sm font-black text-white transition-transform hover:scale-[1.01] disabled:cursor-not-allowed disabled:opacity-50"
            >
              {loading ? 'Checking account' : 'Continue'}
            </button>
          </div>

          {message && (
            <div className={`mt-6 rounded-2xl border p-4 text-sm ${success ? 'border-emerald-200 bg-emerald-50 text-emerald-900 dark:border-emerald-900/60 dark:bg-emerald-950/30 dark:text-emerald-200' : 'border-amber-200 bg-amber-50 text-amber-900 dark:border-amber-900/60 dark:bg-amber-950/30 dark:text-amber-200'}`}>
              <div className="flex items-start gap-3">
                <CheckCircle size={18} weight="bold" className={success ? 'text-emerald-600' : 'text-amber-600'} />
                <p className="leading-6">{message}</p>
              </div>
            </div>
          )}

          <div className="mt-8 flex items-center justify-between text-sm">
            <Link href="/login" className="font-black text-[#0066FF] hover:underline">
              Back to log in
            </Link>
            <Link href="/help" className="font-black text-zinc-500 hover:text-zinc-950 dark:text-zinc-400 dark:hover:text-white">
              Need help?
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
