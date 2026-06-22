'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

import { cn } from '@/lib/utils';

const NAV_ITEMS = [
  { label: 'Dashboard', href: '/dashboard' },
  { label: 'Create Post', href: '/create-post' },
  { label: 'Calendar', href: '/calendar' },
  { label: 'Media Library', href: '/media-library' },
  { label: 'Analytics', href: '/analytics' },
  { label: 'Insights', href: '/insights' },
  { label: 'Settings', href: '/settings' },
  { label: 'Billing', href: '/billing' },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="fixed left-0 top-0 z-40 hidden h-screen w-sidebar border-r border-neutral-200 bg-white px-4 py-6 md:flex md:flex-col">
      <div className="mb-8">
        <p className="text-xs uppercase tracking-[0.2em] text-neutral-500">Postday</p>
        <h2 className="text-xl font-semibold text-neutral-900">Panel</h2>
      </div>

      <nav className="flex flex-1 flex-col gap-1">
        {NAV_ITEMS.map((item) => {
          const active = pathname === item.href || pathname.startsWith(`${item.href}/`);

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'rounded-lg px-3 py-2 text-sm font-medium transition-colors',
                active ? 'bg-orange-light text-brand-primary' : 'text-neutral-600 hover:bg-neutral-100 hover:text-neutral-900'
              )}
            >
              {item.label}
            </Link>
          );
        })}
      </nav>

      <Link
        href="/create-post"
        className="mt-6 inline-flex h-11 items-center justify-center rounded-lg bg-brand-gradient px-4 text-sm font-semibold text-white"
      >
        Buat Post
      </Link>
    </aside>
  );
}
