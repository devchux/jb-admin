import { Metadata } from 'next';
import { ReactNode } from 'react';
import PermissionGuard from '@/components/PermissionGuard';

export const metadata: Metadata = {
  title: 'Users Management',
  description: 'Manage users, admins, roles and permissions, and view audit logs',
};

export default function Layout({ children }: { children: ReactNode }) {
  return <PermissionGuard permissions={["user:read", "audit:read", "role:read", "permission:read"]}>{children}</PermissionGuard>;
}
