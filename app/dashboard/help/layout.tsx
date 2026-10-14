import { Metadata } from 'next';
import { ReactNode } from 'react';
import PermissionGuard from '@/components/PermissionGuard';

export const metadata: Metadata = {
  title: 'Help & Support',
  description: 'Review and manage support tickets and complaints.',
};

export default function Layout({ children }: { children: ReactNode }) {
  return <PermissionGuard permissions={["ticket:read"]}>{children}</PermissionGuard>;
}
