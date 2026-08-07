import type { Metadata, Viewport } from 'next';
import { Suspense } from 'react';
import { Inter, Space_Grotesk } from 'next/font/google';
import './globals.css';
import { Providers } from '@/components/Providers';
import { MeshBackground } from '@/components/MeshBackground';
import { BottomNav } from '@/components/BottomNav';
import { TopNav } from '@/components/TopNav';
import { Footer } from '@/components/Footer';
import Script from 'next/script';

const inter = Inter({ 
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
  weight: ['400', '500', '600', '700', '800', '900'],
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
    <html lang="en" className={inter.variable} suppressHydrationWarning>
      <body className="min-h-screen bg-white text-foreground pb-20 lg:pb-0 font-sans" suppressHydrationWarning>
        <div className="mesh-glow" />
        {/* Elegant Top Progress Bar */}
        <div className="fixed top-0 left-0 right-0 h-[2px] z-[9999] overflow-hidden">
          <div className="w-full h-full bg-gradient-to-r from-[#0066FF] via-[#00D1FF] to-[#7000FF] shadow-lg shadow-blue-500/20" />
        </div>
        <Suspense fallback={null}>
          <Providers>
            <MeshBackground variant="subtle" className="fixed inset-0 pointer-events-none -z-20" />
            <TopNav />
            <main>
              {children}
            </main>
            <Footer />
            <BottomNav />
          </Providers>
        </Suspense>

        <div id="google_translate_element" style={{ display: 'none' }}></div>
        <Script
          src="https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit"
          strategy="afterInteractive"
        />
        <Script id="google-translate-init" strategy="afterInteractive">
          {`
            function googleTranslateElementInit() {
              new google.translate.TranslateElement({
                pageLanguage: 'en',
                includedLanguages: 'en,sw',
                autoDisplay: false
              }, 'google_translate_element');
            }
          `}
        </Script>
      </body>
    </html>
  );
}
