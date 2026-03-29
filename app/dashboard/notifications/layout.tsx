import { Metadata } from 'next';
import { ReactNode } from 'react';

export const metadata: Metadata = {
  title: 'Notifications',
  description: 'Manage user and system notifications.',
};

export default function Layout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
