'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  Camera,
  FilmReel,
  Notebook,
  Sparkle,
  UploadSimple,
  Briefcase,
  ShieldCheck,
  ArrowRight,
} from '@phosphor-icons/react';

export default function CreatePage() {
  const router = useRouter();

  return (
    <div className="min-h-full w-full bg-zinc-50 dark:bg-[#0A0E17]">
      <div className="mx-auto flex max-w-6xl flex-col gap-8 px-4 py-8 lg:px-6">
        <div className="rounded-[18px] border border-zinc-100 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-950">
          <p className="text-[11px] font-black uppercase tracking-[0.28em] text-zinc-400">Create hub</p>
          <h1 className="mt-3 text-3xl font-black tracking-tight text-zinc-950 dark:text-white">Create, upload, and publish live work</h1>
          <p className="mt-3 max-w-2xl text-sm leading-7 text-zinc-500 dark:text-zinc-400">
            Every path below opens the live creation flow, so posts, reels, stories, gigs, and proof-of-work stay connected to the backend.
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {[
            { title: 'Create post', desc: 'Publish a live feed post with caption, trade, location, and audience.', icon: Sparkle, href: '/dashboard/create/new?type=post' },
            { title: 'Create reel', desc: 'Open the reel workflow with preview, draft, and publish states.', icon: FilmReel, href: '/dashboard/create/new?type=reel' },
            { title: 'Create story', desc: 'Capture or upload a story and send it straight into the live story tray.', icon: Camera, href: '/dashboard/create/new?type=story' },
            { title: 'Create gig', desc: 'Build a live work post that powers feed, saved, analytics, and pro screens.', icon: Briefcase, href: '/dashboard/create/new?type=gig' },
            { title: 'Drafts', desc: 'Review saved drafts and continue publishing from the live backend.', icon: Notebook, href: '/dashboard/create/drafts' },
            { title: 'Proof of work', desc: 'Upload a verified work clip, document, or portfolio asset from the backend.', icon: ShieldCheck, href: '/dashboard/create/new?type=proof' },
            { title: 'Upload media', desc: 'Open the media picker, camera, gallery, and thumbnail selection states.', icon: UploadSimple, href: '/dashboard/create/new?type=media' },
          ].map((item) => (
            <Link
              key={item.title}
              href={item.href}
              className="group rounded-[18px] border border-zinc-100 bg-white p-5 transition-all hover:-translate-y-0.5 hover:shadow-lg dark:border-zinc-800 dark:bg-zinc-950"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#0066FF]/10 text-[#0066FF]">
                  <item.icon size={22} weight="fill" />
                </div>
                <ArrowRight size={18} className="mt-1 text-zinc-300 transition-colors group-hover:text-[#0066FF]" />
              </div>
              <h2 className="mt-5 text-lg font-black text-zinc-950 dark:text-white">{item.title}</h2>
              <p className="mt-2 text-sm leading-6 text-zinc-500 dark:text-zinc-400">{item.desc}</p>
            </Link>
          ))}
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <button
            onClick={() => router.push('/dashboard/create/new')}
            className="rounded-[18px] border border-zinc-100 bg-white p-6 text-left transition-all hover:shadow-lg dark:border-zinc-800 dark:bg-zinc-950"
          >
            <p className="text-[11px] font-black uppercase tracking-[0.24em] text-zinc-400">Primary flow</p>
            <h3 className="mt-2 text-xl font-black text-zinc-950 dark:text-white">Open the full creation workflow</h3>
            <p className="mt-2 text-sm leading-7 text-zinc-500 dark:text-zinc-400">Use the live upload flow to pick media, choose filters, add details, and publish.</p>
          </button>
          <Link
            href="/dashboard/saved"
            className="rounded-[18px] border border-zinc-100 bg-white p-6 transition-all hover:shadow-lg dark:border-zinc-800 dark:bg-zinc-950"
          >
            <p className="text-[11px] font-black uppercase tracking-[0.24em] text-zinc-400">Library</p>
            <h3 className="mt-2 text-xl font-black text-zinc-950 dark:text-white">Check saved work and collections</h3>
            <p className="mt-2 text-sm leading-7 text-zinc-500 dark:text-zinc-400">Published work and saved collections stay in sync with the backend library model.</p>
          </Link>
        </div>
      </div>
    </div>
  );
}
