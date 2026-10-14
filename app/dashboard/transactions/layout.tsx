import { Metadata } from 'next';
import { ReactNode } from 'react';
import PermissionGuard from '@/components/PermissionGuard';

export const metadata: Metadata = {
  title: 'Transactions Management',
  description: 'View and manage platform transactions, inflow, and outflow.',
};

export default function Layout({ children }: { children: ReactNode }) {
  return <PermissionGuard permissions={["transaction:read"]}>{children}</PermissionGuard>;
}
