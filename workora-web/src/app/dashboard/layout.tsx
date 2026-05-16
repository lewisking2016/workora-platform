import { Sidebar } from '@/components/Sidebar';
import { MobileNav } from '@/components/MobileNav';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="h-screen w-full bg-white text-[#1A1A1A] font-display flex flex-col lg:flex-row overflow-hidden">
      <Sidebar />
      <main className="flex-1 h-full overflow-y-auto relative">
        {children}
      </main>
      <MobileNav />
    </div>
  );
}
