import { Metadata } from 'next';
import { ReactNode } from 'react';

export const metadata: Metadata = {
  title: 'Help & Support',
  description: 'Review and manage support tickets and complaints.',
};

export default function Layout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
