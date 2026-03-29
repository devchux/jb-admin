import { ReactNode } from 'react';
import { Metadata } from 'next';
import NavBar from '@/components/NavBar';
import DashboardTopBar from '@/components/Topbar';

export const metadata: Metadata = {
  title: 'Dashboard Overview',
  description: 'Overview of the Jaiz Admin Dashboard metrics and reports.',
};

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex flex-col h-screen bg-[#F4F5F7]">
      <DashboardTopBar />
      <NavBar />
      <div
        className="flex-1 flex flex-col
      "
      >
        <main className="p-4 overflow-y-auto flex-1 bg-[#F4F5F7]">
          {children}
        </main>
      </div>
    </div>
  );
}
