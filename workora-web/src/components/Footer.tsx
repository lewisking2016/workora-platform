'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';

export function Footer() {
  const pathname = usePathname();

  // Hide the marketing footer on auth and dashboard pages
  if (['/login', '/join', '/forgot'].includes(pathname) || pathname.startsWith('/dashboard')) {
    return null;
  }

  return (
    <footer className="bg-white border-t border-black/10 py-24 px-[5%] relative overflow-hidden">
      <div className="mx-auto max-w-screen-2xl relative z-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-12 lg:gap-20 mb-20">
          <div className="sm:col-span-2 flex flex-col gap-8">
            <Link href="/" className="relative flex items-center transition-transform hover:opacity-80 origin-left">
              <div className="relative h-12 w-40 md:h-14 md:w-44">
                <Image 
                  src="/logo/workora_logo.png"
                  alt="Workora Logo"
                  fill
                  className="object-contain"
                  priority
                />
              </div>
            </Link>
            <p className="text-zinc-500 text-lg max-w-md leading-relaxed">
              The digital trust layer for Africa&apos;s informal workforce. <br />
              Reputation is the protocol.
            </p>
          </div>
          <div>
            <h4 className="font-black mb-8 text-black uppercase tracking-[0.2em] text-[10px]">Infrastructure</h4>
            <ul className="flex flex-col gap-5 text-[10px] font-black uppercase tracking-widest text-zinc-400">
              <li><Link href="/explore" className="hover:text-black transition-colors">Nodes Explorer</Link></li>
              <li><Link href="/trust" className="hover:text-black transition-colors">Trust Ledger</Link></li>
              <li><Link href="/safety" className="hover:text-black transition-colors">Security Protocol</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-black mb-8 text-black uppercase tracking-[0.2em] text-[10px]">Company</h4>
            <ul className="flex flex-col gap-5 text-[10px] font-black uppercase tracking-widest text-zinc-400">
              <li><Link href="/about" className="hover:text-black transition-colors">About System</Link></li>
              <li><Link href="/careers" className="hover:text-black transition-colors">Engineering</Link></li>
              <li><Link href="/contact" className="hover:text-black transition-colors">Interface</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-black mb-8 text-black uppercase tracking-[0.2em] text-[10px]">Legal</h4>
            <ul className="flex flex-col gap-5 text-[10px] font-black uppercase tracking-widest text-zinc-400">
              <li><Link href="/help" className="hover:text-black transition-colors">Documentation</Link></li>
              <li><Link href="/terms" className="hover:text-black transition-colors">Terms of Use</Link></li>
              <li><Link href="/privacy" className="hover:text-black transition-colors">Privacy Policy</Link></li>
            </ul>
          </div>
        </div>
        <div className="pt-12 border-t border-black/5 flex flex-col md:flex-row justify-between items-center gap-8 text-[10px] font-black text-zinc-400 uppercase tracking-[0.2em]">
          <p>© 2026 WORKORA OS. POWERED BY IMEANTECH CORE.</p>
          <div className="flex gap-10">
            <Link href="#" className="hover:text-black transition-colors">Terminal</Link>
            <Link href="#" className="hover:text-black transition-colors">Network</Link>
            <Link href="#" className="hover:text-black transition-colors">Status</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
