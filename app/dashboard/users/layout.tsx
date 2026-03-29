import { Metadata } from 'next';
import { ReactNode } from 'react';

export const metadata: Metadata = {
  title: 'Users Management',
  description: 'Manage users, roles and permissions, and view audit logs',
};

export default function Layout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
