'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { LogOut, ChevronRight, Users, Play } from 'lucide-react';
import { AppShell } from '@/shared/components/layout/AppShell';
import { useProfile } from '../application/useProfile';
import { formatRelativeTime } from '@/shared/utils/formatDate';
import { cn } from '@/shared/utils/cn';

const REEL_TYPE_LABEL = {
  recruitment: '모집 릴스',
  completion: '완료 릴스',
} as const;

const REEL_TYPE_COLOR = {
  recruitment: 'bg-primary/10 text-primary',
  completion: 'bg-[#07d98a]/10 text-[#07d98a]',
} as const;

export function ProfilePage() {
  const router = useRouter();
  const { currentUser, crews, myReels, isLoading, signOut } = useProfile();

  const handleSignOut = () => {
    signOut();
    router.replace('/login');
  };

  if (isLoading) {
    return (
      <AppShell className="bg-background">
        <div className="flex h-full items-center justify-center text-muted">로딩 중...</div>
      </AppShell>
    );
  }

  return (
    <AppShell className="bg-background">
      <header className="flex items-center justify-between px-5 py-5 shrink-0">
        <h1 className="text-xl font-bold text-foreground">마이페이지</h1>
        <button
          onClick={handleSignOut}
          className="flex items-center gap-1.5 rounded-xl px-3 py-2 text-sm text-muted hover:bg-surface hover:text-foreground transition-colors"
        >
          <LogOut className="h-4 w-4" />
          로그아웃
        </button>
      </header>

      <div className="flex-1 overflow-y-auto px-5 pb-24 space-y-7">

        {/* 프로필 카드 */}
        <div className="rounded-2xl bg-surface border border-border p-5 flex items-center gap-4">
          <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-primary/20 text-primary text-2xl font-bold">
            {currentUser?.nickname?.slice(0, 1) ?? '?'}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-lg font-bold text-foreground truncate">
              {currentUser?.nickname ?? '닉네임 없음'}
            </p>
            {currentUser?.job && (
              <p className="text-sm text-muted mt-0.5">{currentUser.job}</p>
            )}
            {currentUser?.bio && (
              <p className="mt-1.5 text-sm text-foreground/70 leading-snug line-clamp-2">
                {currentUser.bio}
              </p>
            )}
          </div>
        </div>

        {/* 통계 */}
        <div className="grid grid-cols-2 gap-3">
          <div className="rounded-2xl bg-surface border border-border p-4 text-center">
            <p className="text-2xl font-bold text-primary">{crews.length}</p>
            <p className="text-xs text-muted mt-1">참여 중인 크루</p>
          </div>
          <div className="rounded-2xl bg-surface border border-border p-4 text-center">
            <p className="text-2xl font-bold text-primary">{myReels.length}</p>
            <p className="text-xs text-muted mt-1">내 릴스</p>
          </div>
        </div>

        {/* 참여 중인 크루 */}
        <section className="space-y-3">
          <h2 className="text-sm font-semibold text-foreground">참여 중인 크루</h2>
          {crews.length === 0 ? (
            <div className="rounded-2xl bg-surface border border-border p-6 text-center">
              <p className="text-sm text-muted">아직 참여 중인 크루가 없어요</p>
              <Link href="/feed" className="mt-2 inline-block text-sm text-primary font-medium">
                피드에서 챌린지 찾기 →
              </Link>
            </div>
          ) : (
            crews.map((crew) => (
              <Link
                key={crew.crewId}
                href={`/crews/${crew.crewId}`}
                className="flex items-center gap-3 rounded-2xl bg-surface border border-border p-4 hover:border-primary/30 transition-colors active:scale-[0.98]"
              >
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10">
                  <Users className="h-5 w-5 text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-foreground truncate text-sm">
                    {crew.challengeTitle}
                  </p>
                  <p className="text-xs text-muted mt-0.5">{crew.memberCount}명의 크루원</p>
                </div>
                <ChevronRight className="h-4 w-4 text-subtle shrink-0" />
              </Link>
            ))
          )}
        </section>

        {/* 내 릴스 이력 */}
        <section className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-semibold text-foreground">내 릴스 이력</h2>
            <Link href="/challenges/new" className="text-xs text-primary font-medium hover:underline">
              + 새 챌린지
            </Link>
          </div>
          {myReels.length === 0 ? (
            <div className="rounded-2xl bg-surface border border-border p-6 text-center">
              <p className="text-sm text-muted">아직 올린 릴스가 없어요</p>
            </div>
          ) : (
            <div className="space-y-3">
              {myReels.map((reel) => (
                <Link
                  key={reel.id}
                  href={`/challenges/${reel.challengeId}/reels`}
                  className="flex items-center gap-3 rounded-2xl bg-surface border border-border p-4 hover:border-primary/30 transition-colors active:scale-[0.98]"
                >
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-surface border border-border">
                    <Play className="h-4 w-4 text-muted" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-0.5">
                      <span
                        className={cn(
                          'shrink-0 rounded-full px-2 py-0.5 text-[10px] font-semibold',
                          REEL_TYPE_COLOR[reel.reelType],
                        )}
                      >
                        {REEL_TYPE_LABEL[reel.reelType]}
                      </span>
                    </div>
                    <p className="text-xs text-muted">
                      {reel.participants.map((p) => p.nickname).join(', ')}
                    </p>
                  </div>
                  <p className="text-xs text-subtle shrink-0">{formatRelativeTime(reel.createdAt)}</p>
                </Link>
              ))}
            </div>
          )}
        </section>

      </div>
    </AppShell>
  );
}
