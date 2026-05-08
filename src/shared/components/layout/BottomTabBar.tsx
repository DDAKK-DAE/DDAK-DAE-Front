'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Clapperboard, Users, Plus, User, Film } from 'lucide-react';

import { cn } from '@/shared/utils/cn';

interface Tab {
  href: string;
  label: string;
  icon: React.ReactNode;
}

export function BottomTabBar() {
  const pathname = usePathname();
  const router = useRouter();

  const TABS: Tab[] = [
    { href: '/feed',  label: '피드',  icon: <Clapperboard className="h-5 w-5" /> },
    { href: '/crews', label: '크루',  icon: <Users className="h-5 w-5" /> },
  ];

  const RIGHT_TABS: Tab[] = [
    { href: '/me', label: '마이', icon: <User className="h-5 w-5" /> },
  ];

  return (
    <nav
      className="flex w-full items-center bg-[#c0ddb8] shadow-[0_-1px_0_rgba(0,0,0,0.08)]"
      style={{ paddingBottom: 'var(--safe-area-bottom)' }}
    >
      {/* 피드 */}
      {(() => {
        const { href, label, icon } = TABS[0];
        const isActive = pathname === href;
        return (
          <Link key={href} href={href} className="flex flex-1 flex-col items-center gap-0.5 py-3 text-xs font-medium">
            <span className={cn('flex flex-col items-center gap-0.5 rounded-2xl px-4 py-1.5 transition-all', isActive ? 'bg-white/60 text-primary shadow-sm' : 'text-primary/40')}>
              {icon}{label}
            </span>
          </Link>
        );
      })()}

      {/* 피드/크루 구분선 */}
      <div className="h-8 w-px bg-primary/20 shrink-0" />

      {/* 크루 */}
      {(() => {
        const { href, label, icon } = TABS[1];
        const isActive = pathname === href;
        return (
          <Link key={href} href={href} className="flex flex-1 flex-col items-center gap-0.5 py-3 text-xs font-medium">
            <span className={cn('flex flex-col items-center gap-0.5 rounded-2xl px-4 py-1.5 transition-all', isActive ? 'bg-white/60 text-primary shadow-sm' : 'text-primary/40')}>
              {icon}{label}
            </span>
          </Link>
        );
      })()}

      {/* 중앙 만들기 버튼 */}
      <div className="flex flex-1 flex-col items-center py-2">
        <button
          onClick={() => router.push('/challenges/new')}
          className="flex h-12 w-12 items-center justify-center rounded-full bg-primary shadow-lg shadow-primary/40 active:scale-95 transition-transform"
        >
          <Plus className="h-6 w-6 text-white" strokeWidth={2.5} />
        </button>
      </div>

      {/* 완료 릴스 */}
      {(() => {
        const isActive = pathname === '/reels';
        return (
          <Link href="/reels" className="flex flex-1 flex-col items-center gap-0.5 py-3 text-xs font-medium">
            <span className={cn('flex flex-col items-center gap-0.5 rounded-2xl px-4 py-1.5 transition-all', isActive ? 'bg-white/60 text-primary shadow-sm' : 'text-primary/40')}>
              <Film className="h-5 w-5" />
              릴스
            </span>
          </Link>
        );
      })()}

      {/* 릴스/마이 구분선 */}
      <div className="h-8 w-px bg-primary/20 shrink-0" />

      {/* 마이 */}
      {RIGHT_TABS.map(({ href, label, icon }) => {
        const isActive = pathname === href;
        return (
          <Link key={href} href={href} className="flex flex-1 flex-col items-center gap-0.5 py-3 text-xs font-medium">
            <span className={cn('flex flex-col items-center gap-0.5 rounded-2xl px-4 py-1.5 transition-all', isActive ? 'bg-white/60 text-primary shadow-sm' : 'text-primary/40')}>
              {icon}{label}
            </span>
          </Link>
        );
      })}
    </nav>
  );
}
