'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  PenSquare,
  Calendar,
  Image as ImageIcon,
  BarChart,
  TrendingUp,
  Settings,
  CreditCard,
  PanelLeftClose,
  Plus
} from 'lucide-react';

import { cn } from '@/lib/utils';

const NAV_ITEMS = [
  { label: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { label: 'Create Post', href: '/create-post', icon: PenSquare },
  { label: 'Calendar', href: '/calendar', icon: Calendar },
  { label: 'Media Library', href: '/media-library', icon: ImageIcon },
  { label: 'Analytics', href: '/analytics', icon: BarChart },
  { label: 'Insights', href: '/insights', icon: TrendingUp },
  { label: 'Settings', href: '/settings', icon: Settings },
  { label: 'Billing', href: '/billing', icon: CreditCard },
];

export default function Sidebar() {
  const pathname = usePathname();
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <aside
      className={cn(
        "hidden h-screen flex-shrink-0 border-r border-neutral-200 bg-white py-6 md:flex md:flex-col transition-[width] duration-300 ease-in-out overflow-hidden",
        isCollapsed ? "w-[72px]" : "w-[240px]"
      )}
    >
      <div className="flex flex-col px-4 h-full">
        {/* Header */}
        <div className="mb-8 flex h-10 items-center whitespace-nowrap">
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="flex w-10 shrink-0 items-center justify-center hover:opacity-80 transition-opacity outline-none"
            title={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            <Image src="/postday-icon.svg" alt="Postday" width={40} height={40} className="h-10 w-10 object-contain" />
          </button>

          <div className={cn(
            "flex items-center justify-between transition-all duration-300 ease-in-out overflow-hidden",
            isCollapsed ? "w-0 opacity-0" : "w-full opacity-100"
          )}>
            <Image src="/postday-typography.png" alt="Postday" width={180} height={40} className="h-8 w-auto object-contain ml-2 shrink-0" />
            <button
              onClick={() => setIsCollapsed(true)}
              className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-neutral-500 hover:bg-neutral-100 hover:text-neutral-900 transition-colors"
            >
              <PanelLeftClose className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex flex-1 flex-col gap-2">
          {NAV_ITEMS.map((item) => {
            const active = pathname === item.href || pathname.startsWith(`${item.href}/`);
            const Icon = item.icon;

            return (
              <Link
                key={item.href}
                href={item.href}
                title={isCollapsed ? item.label : undefined}
                className={cn(
                  'flex items-center rounded-lg h-10 transition-colors overflow-hidden whitespace-nowrap',
                  active ? 'bg-orange-light text-brand-primary' : 'text-neutral-600 hover:bg-neutral-100 hover:text-neutral-900'
                )}
              >
                <div className="flex w-10 shrink-0 items-center justify-center">
                  <Icon className={cn("h-5 w-5 transition-colors", active ? "text-brand-primary" : "text-neutral-500")} />
                </div>
                <span className={cn(
                  "text-sm font-medium transition-all duration-300 ease-in-out",
                  isCollapsed ? "w-0 opacity-0" : "w-[140px] opacity-100 ml-2"
                )}>
                  {item.label}
                </span>
              </Link>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="mt-6 flex flex-col gap-2">
          <Link
            href="/create-post"
            title={isCollapsed ? "Buat Post" : undefined}
            className={cn(
              "flex h-11 items-center rounded-lg bg-brand-gradient text-white shadow-sm hover:shadow transition-all overflow-hidden whitespace-nowrap"
            )}
          >
            <div className="flex w-10 shrink-0 items-center justify-center">
              <Plus className="h-5 w-5" />
            </div>
            <span className={cn(
              "text-sm font-semibold transition-all duration-300 ease-in-out",
              isCollapsed ? "w-0 opacity-0" : "w-[120px] opacity-100 ml-1"
            )}>
              Buat Post
            </span>
          </Link>
        </div>
      </div>
    </aside>
  );
}
