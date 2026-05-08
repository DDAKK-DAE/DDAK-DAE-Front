'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Plus } from 'lucide-react';

import { cn } from '@/shared/utils/cn';

interface Tab {
  href: string;
  label: string;
  icon: string;
}

const LEFT_TABS: Tab[] = [
  { href: '/feed',  label: '피드', icon: '🎬' },
  { href: '/crews', label: '크루', icon: '👥' },
];

const RIGHT_TABS: Tab[] = [
  { href: '/me', label: '마이', icon: '👤' },
];

export function BottomTabBar() {
  const pathname = usePathname();
  const router = useRouter();

  return (
    <nav
      className="flex w-full items-center border-t border-border bg-surface"
      style={{ paddingBottom: 'var(--safe-area-bottom)' }}
    >
      {LEFT_TABS.map(({ href, label, icon }) => (
        <Link
          key={href}
          href={href}
          className={cn(
            'flex flex-1 flex-col items-center gap-0.5 py-3 text-xs transition-colors',
            pathname === href ? 'text-primary' : 'text-muted',
          )}
        >
          <span className="text-xl leading-none">{icon}</span>
          {label}
        </Link>
      ))}

      {/* 중앙 만들기 버튼 */}
      <div className="flex flex-1 flex-col items-center py-2">
        <button
          onClick={() => router.push('/challenges/new')}
          className="flex h-12 w-12 items-center justify-center rounded-full bg-primary shadow-lg shadow-primary/40 active:scale-95 transition-transform"
        >
          <Plus className="h-6 w-6 text-white" strokeWidth={2.5} />
        </button>
      </div>

      {RIGHT_TABS.map(({ href, label, icon }) => (
        <Link
          key={href}
          href={href}
          className={cn(
            'flex flex-1 flex-col items-center gap-0.5 py-3 text-xs transition-colors',
            pathname === href ? 'text-primary' : 'text-muted',
          )}
        >
          <span className="text-xl leading-none">{icon}</span>
          {label}
        </Link>
      ))}
    </nav>
  );
}
