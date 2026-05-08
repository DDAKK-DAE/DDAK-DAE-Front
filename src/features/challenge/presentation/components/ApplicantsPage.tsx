'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Users, CheckCircle2, XCircle, Clock, Star } from 'lucide-react';
import { AppShell } from '@/shared/components/layout/AppShell';
import { Button } from '@/shared/components/ui/Button';
import { useApplicants } from '../../application/hooks/useApplicants';
import { PARTICIPATION_STATUS } from '../../domain/entities/Challenge';
import type { ApplicantDetail, ParticipationStatus } from '../../domain/entities/Challenge';
import { cn } from '@/shared/utils/cn';

type FilterTab = 'all' | ParticipationStatus;

const STATUS_LABEL: Record<ParticipationStatus, string> = {
  pending: '대기 중',
  accepted: '수락됨',
  rejected: '거절됨',
};

const CATEGORY_CHIP: Record<string, string> = {
  댄스: 'bg-[#e8356e]/10 text-[#e8356e]',
  일상: 'bg-[#f5a318]/10 text-[#f5a318]',
  스포츠: 'bg-[#07d98a]/10 text-[#07d98a]',
  푸드: 'bg-[#f5a318]/10 text-[#f5a318]',
  기타: 'bg-purple-500/10 text-purple-300',
};

function ApplicantCard({
  applicant,
  actionLoading,
  onAccept,
  onReject,
}: {
  applicant: ApplicantDetail;
  actionLoading: string | null;
  onAccept: (id: string) => void;
  onReject: (id: string) => void;
}) {
  const { participation_id, user, intro_message, status, participation_history } = applicant;
  const isActing = actionLoading === participation_id;

  return (
    <div className="rounded-2xl bg-surface border border-border p-4 space-y-3">
      {/* 유저 정보 */}
      <div className="flex items-center gap-3">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary font-bold text-base">
          {user.nickname.slice(0, 1)}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <p className="font-semibold text-foreground text-sm truncate">{user.nickname}</p>
            {user.job && (
              <span className="shrink-0 text-xs text-muted">· {user.job}</span>
            )}
          </div>
          {/* 참여 이력 */}
          <div className="flex items-center gap-1.5 mt-0.5">
            <Star className="h-3 w-3 text-[#f5a318]" />
            <span className="text-xs text-muted">
              챌린지 {participation_history.total_count}회 참여
            </span>
            <div className="flex gap-1 ml-1">
              {participation_history.categories.slice(0, 3).map((cat) => (
                <span
                  key={cat}
                  className={cn('rounded-full px-1.5 py-0.5 text-[10px] font-medium', CATEGORY_CHIP[cat] ?? 'bg-white/10 text-white/60')}
                >
                  {cat}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* 상태 배지 */}
        {status !== PARTICIPATION_STATUS.PENDING && (
          <div className={cn(
            'shrink-0 flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-medium',
            status === PARTICIPATION_STATUS.ACCEPTED
              ? 'bg-primary/10 text-primary'
              : 'bg-red-500/10 text-red-400',
          )}>
            {status === PARTICIPATION_STATUS.ACCEPTED
              ? <CheckCircle2 className="h-3 w-3" />
              : <XCircle className="h-3 w-3" />
            }
            {STATUS_LABEL[status]}
          </div>
        )}
      </div>

      {/* 자기소개 */}
      {intro_message && (
        <div className="rounded-xl bg-background border border-border px-3 py-2.5">
          <p className="text-sm text-foreground leading-relaxed">"{intro_message}"</p>
        </div>
      )}

      {/* 수락/거절 버튼 (대기 중일 때만) */}
      {status === PARTICIPATION_STATUS.PENDING && (
        <div className="flex gap-2 pt-1">
          <button
            onClick={() => onReject(participation_id)}
            disabled={isActing}
            className="flex-1 flex items-center justify-center gap-1.5 rounded-xl border border-border py-2 text-sm text-muted hover:border-red-400/50 hover:text-red-400 transition-colors disabled:opacity-50"
          >
            <XCircle className="h-4 w-4" />
            거절
          </button>
          <Button
            onClick={() => onAccept(participation_id)}
            disabled={isActing}
            className="flex-1"
          >
            {isActing ? (
              <span className="flex items-center gap-1.5">
                <Clock className="h-4 w-4 animate-spin" />
                처리 중
              </span>
            ) : (
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="h-4 w-4" />
                수락
              </span>
            )}
          </Button>
        </div>
      )}
    </div>
  );
}

interface ApplicantsPageProps {
  challengeId: string;
  challengeTitle?: string;
}

export function ApplicantsPage({ challengeId, challengeTitle }: ApplicantsPageProps) {
  const router = useRouter();
  const { applicants, isLoading, actionLoading, accept, reject, pendingCount, acceptedCount } =
    useApplicants(challengeId);
  const [filter, setFilter] = useState<FilterTab>('all');

  const FILTER_TABS: { key: FilterTab; label: string }[] = [
    { key: 'all', label: `전체 ${applicants.length}` },
    { key: 'pending', label: `대기 ${pendingCount}` },
    { key: 'accepted', label: `수락 ${acceptedCount}` },
    { key: 'rejected', label: `거절 ${applicants.length - pendingCount - acceptedCount}` },
  ];

  const filtered =
    filter === 'all' ? applicants : applicants.filter((a) => a.status === filter);

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
      <header className="flex items-center gap-3 border-b border-border bg-background/80 px-4 py-4 backdrop-blur-md shrink-0">
        <button
          onClick={() => router.back()}
          className="flex h-9 w-9 items-center justify-center rounded-xl hover:bg-surface transition-colors"
        >
          <ArrowLeft className="h-5 w-5 text-foreground" />
        </button>
        <div className="flex-1 min-w-0">
          <h1 className="font-bold text-foreground">참여 신청 관리</h1>
          {challengeTitle && (
            <p className="text-xs text-muted truncate mt-0.5">{challengeTitle}</p>
          )}
        </div>
      </header>

      {/* 요약 카드 */}
      <div className="px-5 pt-4 pb-2 shrink-0">
        <div className="grid grid-cols-3 gap-2">
          <div className="rounded-xl bg-surface border border-border p-3 text-center">
            <p className="text-lg font-bold text-[#f5a318]">{pendingCount}</p>
            <p className="text-xs text-muted mt-0.5">대기 중</p>
          </div>
          <div className="rounded-xl bg-surface border border-border p-3 text-center">
            <p className="text-lg font-bold text-primary">{acceptedCount}</p>
            <p className="text-xs text-muted mt-0.5">수락</p>
          </div>
          <div className="rounded-xl bg-surface border border-border p-3 text-center">
            <p className="text-lg font-bold text-red-400">
              {applicants.length - pendingCount - acceptedCount}
            </p>
            <p className="text-xs text-muted mt-0.5">거절</p>
          </div>
        </div>
      </div>

      {/* 필터 탭 */}
      <div className="flex gap-2 overflow-x-auto px-5 py-2 shrink-0 no-scrollbar">
        {FILTER_TABS.map(({ key, label }) => (
          <button
            key={key}
            onClick={() => setFilter(key)}
            className={cn(
              'shrink-0 rounded-full px-3 py-1.5 text-xs font-medium transition-colors',
              filter === key
                ? 'bg-primary text-white'
                : 'bg-surface border border-border text-muted hover:text-foreground',
            )}
          >
            {label}
          </button>
        ))}
      </div>

      {/* 신청자 목록 */}
      <div className="flex-1 overflow-y-auto px-5 pb-6 space-y-3">
        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <Users className="h-12 w-12 text-subtle mb-3" />
            <p className="text-sm text-muted">
              {filter === 'all' ? '아직 신청자가 없어요' : '해당 상태의 신청자가 없어요'}
            </p>
          </div>
        ) : (
          filtered.map((applicant) => (
            <ApplicantCard
              key={applicant.participation_id}
              applicant={applicant}
              actionLoading={actionLoading}
              onAccept={accept}
              onReject={reject}
            />
          ))
        )}
      </div>
    </AppShell>
  );
}
