// components/sidebar/Sidebar.tsx
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Home,
  Users,
  CreditCard,
  Settings,
  HelpCircle,
  Megaphone,
} from 'lucide-react';

const navItems = [
  { label: 'Dashboard', href: '/dashboard', icon: Home },
  { label: 'User Management', href: '/dashboard/users', icon: Users },
  { label: 'Transactions', href: '/dashboard/transactions', icon: CreditCard },
  {
    label: 'System Configurations',
    href: '/dashboard/configuarations',
    icon: Settings,
  },
  { label: 'Help and Support', href: '/dashboard/help', icon: HelpCircle },
  {
    label: 'Broadcast Notifications',
    href: '/dashboard/notifications',
    icon: Megaphone,
  },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <nav className="flex w-full border-0 gap-6 items-center justify-between px-6 py-4 pt-8 bg-white  rounded-b-4xl shadow-mild">
      {navItems.map(({ label, href, icon: Icon }) => {
        // const isActive = pathname.startsWith(href);
        const isActive = pathname === href;

        return (
          <Link key={href} href={href}>
            <div
              className={`flex items-center justify-between pb-2 border-b-2 font-sans ${
                isActive
                  ? 'text-[#193F7F] font-medium border-[#193F7F]'
                  : 'text-gray-600 font-light border-transparent'
              } hover:text-[#193F7F] transition-colors duration-200 cursor-pointer`}
            >
              <Icon size={18} />
              <span className="text-sm pl-1.5 ">{label}</span>
            </div>
          </Link>
        );
      })}
    </nav>
  );
}
