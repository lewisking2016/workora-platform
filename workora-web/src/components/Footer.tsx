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
    <footer className="bg-zinc-50 border-t border-zinc-200 py-16 lg:py-24 px-[5%]">
      <div className="mx-auto max-w-screen-2xl">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-10 lg:gap-16 mb-12 lg:mb-20">
          <div className="sm:col-span-2 flex flex-col gap-6">
            <Link href="/" className="relative flex items-center transition-transform hover:scale-105 origin-left">
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
            <p className="text-zinc-600 text-lg max-w-md leading-relaxed">
              Empowering Africa&apos;s informal workforce through the Digital Trust Passport. 
              Reputation is the new currency.
            </p>
          </div>
          <div>
            <h4 className="font-black mb-6 text-zinc-950 uppercase tracking-widest text-xs">Product</h4>
            <ul className="flex flex-col gap-4 text-sm text-zinc-600 font-medium">
              <li><Link href="/explore" className="hover:text-zinc-950 transition-colors">Explore Pros</Link></li>
              <li><Link href="/trust" className="hover:text-zinc-950 transition-colors">Trust Passport</Link></li>
              <li><Link href="/safety" className="hover:text-zinc-950 transition-colors">Safety First</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-black mb-6 text-zinc-950 uppercase tracking-widest text-xs">Company</h4>
            <ul className="flex flex-col gap-4 text-sm text-zinc-600 font-medium">
              <li><Link href="/about" className="hover:text-zinc-950 transition-colors">About Us</Link></li>
              <li><Link href="/careers" className="hover:text-zinc-950 transition-colors">Careers</Link></li>
              <li><Link href="/contact" className="hover:text-zinc-950 transition-colors">Contact</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-black mb-6 text-zinc-950 uppercase tracking-widest text-xs">Legal</h4>
            <ul className="flex flex-col gap-4 text-sm text-zinc-600 font-medium">
              <li><Link href="/help" className="hover:text-zinc-950 transition-colors">Help Center</Link></li>
              <li><Link href="/terms" className="hover:text-zinc-950 transition-colors">Terms of Service</Link></li>
              <li><Link href="/privacy" className="hover:text-zinc-950 transition-colors">Privacy Policy</Link></li>
            </ul>
          </div>
        </div>
        <div className="pt-8 border-t border-zinc-200 flex flex-col md:flex-row justify-between items-center gap-6 text-xs font-bold text-zinc-500 uppercase tracking-wider">
          <p>© 2026 Workora Platform. A subsidiary of ImeanTech.</p>
          <div className="flex gap-8">
            <Link href="#" className="hover:text-zinc-950 transition-colors">Twitter</Link>
            <Link href="#" className="hover:text-zinc-950 transition-colors">LinkedIn</Link>
            <Link href="#" className="hover:text-zinc-950 transition-colors">Instagram</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
