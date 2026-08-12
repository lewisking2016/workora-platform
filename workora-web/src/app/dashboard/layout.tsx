import { Sidebar } from '@/components/Sidebar';
import { MobileNav } from '@/components/MobileNav';
import { MobileHeader } from '@/components/MobileHeader';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="h-screen w-full bg-white dark:bg-zinc-950 text-[#1A1A1A] dark:text-zinc-50 font-display flex flex-col lg:flex-row overflow-hidden">
      <Sidebar />
      <div className="flex-1 h-full flex flex-col min-w-0">
        <MobileHeader />
        <main className="flex-1 h-full overflow-y-auto relative">
          {children}
        </main>
      </div>
      <MobileNav />
    </div>
  );
}
