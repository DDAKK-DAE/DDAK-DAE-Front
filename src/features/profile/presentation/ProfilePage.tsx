'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { LogOut, ChevronRight, MapPin, Clock, Users, ClipboardList } from 'lucide-react';
import { AppShell } from '@/shared/components/layout/AppShell';
import { useProfile } from '../application/useProfile';
import { cn } from '@/shared/utils/cn';

const CATEGORY_COLOR: Record<string, string> = {
  댄스: 'text-[#e8356e] bg-[#e8356e]/10',
  일상: 'text-[#f5a318] bg-[#f5a318]/10',
  스포츠: 'text-[#07d98a] bg-[#07d98a]/10',
  푸드: 'text-[#f5a318] bg-[#f5a318]/10',
  기타: 'text-purple-300 bg-purple-500/10',
};

function getDeadlineDays(iso: string) {
  const d = Math.ceil((new Date(iso).getTime() - Date.now()) / 86_400_000);
  if (d <= 0) return '마감';
  return `D-${d}`;
}

export function ProfilePage() {
  const router = useRouter();
  const { currentUser, crews, myChallenges, isLoading, signOut } = useProfile();

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
      {/* 헤더 */}
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
            <p className="text-2xl font-bold text-primary">{myChallenges.length}</p>
            <p className="text-xs text-muted mt-1">내가 만든 챌린지</p>
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
                key={crew.crew_id}
                href={`/crews/${crew.crew_id}`}
                className="flex items-center gap-3 rounded-2xl bg-surface border border-border p-4 hover:border-primary/30 transition-colors active:scale-[0.98]"
              >
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10">
                  <Users className="h-5 w-5 text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-foreground truncate text-sm">
                    {crew.challenge_title}
                  </p>
                  <p className="text-xs text-muted mt-0.5">{crew.member_count}명의 크루원</p>
                </div>
                <ChevronRight className="h-4 w-4 text-subtle shrink-0" />
              </Link>
            ))
          )}
        </section>

        {/* 내가 만든 챌린지 */}
        <section className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-semibold text-foreground">내가 만든 챌린지</h2>
            <Link
              href="/challenges/new"
              className="text-xs text-primary font-medium hover:underline"
            >
              + 새 챌린지
            </Link>
          </div>
          {myChallenges.length === 0 ? (
            <div className="rounded-2xl bg-surface border border-border p-6 text-center">
              <p className="text-sm text-muted">아직 만든 챌린지가 없어요</p>
            </div>
          ) : (
            myChallenges.map((ch) => (
              <div
                key={ch.id}
                className="rounded-2xl bg-surface border border-border p-4 space-y-2.5"
              >
                <Link href={`/challenges/${ch.id}`} className="block space-y-2.5">
                  <div className="flex items-start gap-2">
                    <span
                      className={cn(
                        'shrink-0 rounded-full px-2.5 py-0.5 text-xs font-semibold',
                        CATEGORY_COLOR[ch.category] ?? 'text-white bg-white/10',
                      )}
                    >
                      {ch.category}
                    </span>
                    <p className="flex-1 font-semibold text-foreground text-sm leading-snug">
                      {ch.title}
                    </p>
                  </div>
                  <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted">
                    <span className="flex items-center gap-1">
                      <MapPin className="h-3 w-3 text-primary" />
                      {ch.location_text}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="h-3 w-3 text-[#f5a318]" />
                      {getDeadlineDays(ch.deadline_at)}
                    </span>
                    <span className="flex items-center gap-1">
                      <Users className="h-3 w-3 text-[#07d98a]" />
                      {ch.current_participants}/{ch.max_participants}명
                    </span>
                  </div>
                </Link>
                <Link
                  href={`/challenges/${ch.id}/applicants`}
                  className="flex items-center justify-center gap-1.5 rounded-xl border border-border py-2 text-xs text-muted hover:border-primary/40 hover:text-primary transition-colors"
                >
                  <ClipboardList className="h-3.5 w-3.5" />
                  신청자 관리
                </Link>
              </div>
            ))
          )}
        </section>

      </div>
    </AppShell>
  );
}
