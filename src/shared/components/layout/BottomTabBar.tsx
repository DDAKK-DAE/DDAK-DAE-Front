'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

import { cn } from '@/shared/utils/cn';

interface Tab {
  href: string;
  label: string;
  icon: string;
}

const TABS: Tab[] = [
  { href: '/',      label: '피드', icon: '🎬' },
  { href: '/crews', label: '크루', icon: '👥' },
  { href: '/me',    label: '마이', icon: '👤' },
];

export function BottomTabBar() {
  const pathname = usePathname();

  return (
    <nav
      className="flex w-full items-center justify-around border-t border-border bg-surface"
      style={{ paddingBottom: 'var(--safe-area-bottom)' }}
    >
      {TABS.map(({ href, label, icon }) => {
        const isActive = pathname === href;
        return (
          <Link
            key={href}
            href={href}
            className={cn(
              'flex flex-1 flex-col items-center gap-0.5 py-3 text-xs transition-colors',
              isActive ? 'text-primary' : 'text-muted',
            )}
          >
            <span className="text-xl leading-none">{icon}</span>
            {label}
          </Link>
        );
      })}
    </nav>
  );
}
