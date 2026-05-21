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
    <footer className="bg-white dark:bg-[#0A0E17] border-t border-zinc-100 dark:border-zinc-800 py-16 lg:py-40 px-[5%]">
      <div className="mx-auto max-w-screen-2xl">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-10 lg:gap-20 mb-16 lg:mb-32">
          <div className="sm:col-span-2 flex flex-col gap-8">
            <Link href="/" className="relative flex items-center transition-transform hover:scale-105 origin-left">
              <div className="relative h-16 w-48 md:h-20 md:w-56">
                <Image 
                  src="/logo/workora_logo.png"
                  alt="Workora Logo"
                  fill
                  className="object-contain drop-shadow-sm dark:brightness-0 dark:invert"
                  priority
                />
              </div>
            </Link>
            <p className="text-zinc-600 dark:text-zinc-400 text-xl max-w-sm leading-relaxed font-medium">
              Empowering Africa&apos;s informal workforce through the Digital Trust Passport. 
              Reputation is the new currency.
            </p>
          </div>
          <div>
            <h4 className="font-black mb-10 text-zinc-950 dark:text-white uppercase tracking-[0.3em] text-[12px]">Product</h4>
            <ul className="flex flex-col gap-6 text-base text-zinc-500 dark:text-zinc-400 font-bold">
              <li><Link href="/explore" className="hover:text-zinc-950 dark:hover:text-white transition-colors">Explore Pros</Link></li>
              <li><Link href="/trust" className="hover:text-zinc-950 dark:hover:text-white transition-colors">Trust Passport</Link></li>
              <li><Link href="/safety" className="hover:text-zinc-950 dark:hover:text-white transition-colors">Safety First</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-black mb-10 text-zinc-950 dark:text-white uppercase tracking-[0.3em] text-[12px]">Company</h4>
            <ul className="flex flex-col gap-6 text-base text-zinc-500 dark:text-zinc-400 font-bold">
              <li><Link href="/about" className="hover:text-zinc-950 dark:hover:text-white transition-colors">About Us</Link></li>
              <li><Link href="/careers" className="hover:text-zinc-950 dark:hover:text-white transition-colors">Careers</Link></li>
              <li><Link href="/contact" className="hover:text-zinc-950 dark:hover:text-white transition-colors">Contact</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-black mb-10 text-zinc-950 dark:text-white uppercase tracking-[0.3em] text-[12px]">Legal</h4>
            <ul className="flex flex-col gap-6 text-base text-zinc-500 dark:text-zinc-400 font-bold">
              <li><Link href="/help" className="hover:text-zinc-950 dark:hover:text-white transition-colors">Help Center</Link></li>
              <li><Link href="/terms" className="hover:text-zinc-950 dark:hover:text-white transition-colors">Terms of Service</Link></li>
              <li><Link href="/privacy" className="hover:text-zinc-950 dark:hover:text-white transition-colors">Privacy Policy</Link></li>
            </ul>
          </div>
        </div>
        <div className="pt-16 border-t border-zinc-100 dark:border-zinc-800 flex flex-col md:flex-row justify-between items-center gap-8 text-[12px] font-black text-zinc-400 uppercase tracking-[0.4em]">
          <p>© 2026 Workora Platform. A subsidiary of ImeanTech.</p>
          <div className="flex gap-12">
            <Link href="#" className="hover:text-zinc-950 dark:hover:text-white transition-colors">Twitter</Link>
            <Link href="#" className="hover:text-zinc-950 dark:hover:text-white transition-colors">LinkedIn</Link>
            <Link href="#" className="hover:text-zinc-950 dark:hover:text-white transition-colors">Instagram</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
