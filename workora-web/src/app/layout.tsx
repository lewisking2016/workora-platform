import type { Metadata, Viewport } from 'next';
import { Inter, Space_Grotesk } from 'next/font/google';
import './globals.css';
import { Providers } from '@/components/Providers';
import { BottomNav } from '@/components/BottomNav';
import { TopNav } from '@/components/TopNav';

const inter = Inter({ 
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

const spaceGrotesk = Space_Grotesk({ 
  subsets: ['latin'],
  variable: '--font-space-grotesk',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Workora | Your Work. Your Reputation. Your Key.',
  description: 'The digital Trust Passport for Africa\'s informal workforce. Verify skills, build reputation, and access opportunities.',
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'Workora',
  },
  other: {
    'content-security-policy': "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline'; img-src 'self' data: blob: https:; font-src 'self' data:; connect-src 'self' https: http://4.221.170.153:3001 ws://4.221.170.153:3001; frame-src 'self';",
  },
};

export const viewport: Viewport = {
  themeColor: '#0066FF',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning className={`${inter.variable} ${spaceGrotesk.variable}`}>
      <body className="min-h-screen bg-white font-display text-foreground pb-20 lg:pb-0">
        {/* Radiant Top Progress Bar (Pulse Effect) */}
        <div className="fixed top-0 left-0 right-0 h-[3px] z-[9999] overflow-hidden">
          <div className="w-full h-full bg-gradient-to-r from-[#0066FF] via-[#7000FF] to-[#0066FF] shadow-[0_0_15px_rgba(0,102,255,0.8)] animate-pulse" />
        </div>
        <Providers>
          <TopNav />
          <main>
            {children}
          </main>
          <BottomNav />
        </Providers>
      </body>
    </html>
  );
}
