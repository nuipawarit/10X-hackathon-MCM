import { Header } from '@/components/layout/header';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-[#F4F6F8]">
      <Header />
      <main className="mx-auto px-6 py-8">{children}</main>
    </div>
  );
}
