import { Header } from '@/components/layout/header';
import { ResetFooter } from '@/components/layout/reset-footer';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-[#F4F6F8] flex flex-col">
      <Header />
      <main className="mx-auto px-6 py-8 flex-1 w-full">
        {children}
      </main>
      <ResetFooter />
    </div>
  );
}
