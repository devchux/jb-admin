import { Metadata } from 'next';
import { ReactNode } from 'react';
import PermissionGuard from '@/components/PermissionGuard';

export const metadata: Metadata = {
  title: 'Notifications',
  description: 'Manage user and system notifications.',
};

export default function Layout({ children }: { children: ReactNode }) {
  return <PermissionGuard permissions={["notification:read", "image:read"]}>{children}</PermissionGuard>;
}
