import { Metadata } from 'next';
import { ReactNode } from 'react';

export const metadata: Metadata = {
  title: 'Transactions Management',
  description: 'View and manage platform transactions, inflow, and outflow.',
};

export default function Layout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
