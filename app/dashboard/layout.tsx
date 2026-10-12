import { ReactNode } from 'react';
import { Metadata } from 'next';
import NavBar from '@/components/NavBar';
import DashboardTopBar from '@/components/Topbar';
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar';

export const metadata: Metadata = {
  title: 'Dashboard Overview',
  description: 'Overview of the Jaiz Admin Dashboard metrics and reports.',
};

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <SidebarProvider>
      <NavBar />
      <SidebarInset className="h-svh min-w-0 overflow-hidden bg-[#F4F5F7]">
        <DashboardTopBar />
        <main className="flex-1 overflow-y-auto bg-[#F4F5F7] p-4 sm:p-6">
          <section className="max-w-[90rem] mx-auto">{children}</section>
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
