import { Metadata } from 'next';
import { ReactNode } from 'react';

export const metadata: Metadata = {
  title: 'Configurations',
  description: 'System configurations and settings.',
};

export default function Layout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
