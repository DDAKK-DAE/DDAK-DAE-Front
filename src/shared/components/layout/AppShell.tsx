import { type ReactNode } from 'react';

import { cn } from '@/shared/utils/cn';

interface AppShellProps {
  children: ReactNode;
  className?: string;
}

/**
 * 모바일 풀스크린 셸.
 * safe-area inset을 padding으로 흡수해 노치/홈바 영역을 보호.
 * overflow-hidden은 각 화면(피드, 크루 등)에서 직접 제어.
 */
export function AppShell({ children, className }: AppShellProps) {
  return (
    <main
      className={cn('relative flex h-full w-full flex-col bg-background', className)}
      style={{
        paddingTop: 'var(--safe-area-top)',
        paddingBottom: 'var(--safe-area-bottom)',
      }}
    >
      {children}
    </main>
  );
}
