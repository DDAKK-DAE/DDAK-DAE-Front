'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Users, CheckCircle2, XCircle, Clock, Sparkles, Lock } from 'lucide-react';
import { AppShell } from '@/shared/components/layout/AppShell';
import { Button } from '@/shared/components/ui/Button';
import { Modal } from '@/shared/components/ui/Modal';
import { useApplicants } from '../../application/hooks/useApplicants';
import { PARTICIPATION_STATUS } from '../../domain/entities/Challenge';
import type { ApplicantDetail, ParticipationStatus } from '../../domain/entities/Challenge';
import type { AnalyzeGroupChemistryResponse } from '@/api/endpoints/ai';
import { cn } from '@/shared/utils/cn';

type FilterTab = 'all' | ParticipationStatus;

const STATUS_LABEL: Record<ParticipationStatus, string> = {
  pending: '대기 중',
  accepted: '수락됨',
  rejected: '거절됨',
};

function ApplicantCard({
  applicant,
  actionLoading,
  chemistryLoading,
  onAccept,
  onReject,
  onAnalyze,
}: {
  applicant: ApplicantDetail;
  actionLoading: string | null;
  chemistryLoading: string | null;
  onAccept: (id: string) => void;
  onReject: (id: string) => void;
  onAnalyze: (applicant: ApplicantDetail) => void;
}) {
  const { participationId, user, introMessage, status } = applicant;
  const isActing = actionLoading === participationId;
  const isAnalyzing = chemistryLoading === user.id;

  return (
    <div className="rounded-2xl bg-surface border border-border p-4 space-y-3">
      <div className="flex items-center gap-3">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary font-bold text-base">
          {user.nickname.slice(0, 1)}
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-semibold text-foreground text-sm truncate">{user.nickname}</p>
        </div>

        {status !== PARTICIPATION_STATUS.PENDING && (
          <div
            className={cn(
              'shrink-0 flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-medium',
              status === PARTICIPATION_STATUS.ACCEPTED
                ? 'bg-primary/10 text-primary'
                : 'bg-red-500/10 text-red-400',
            )}
          >
            {status === PARTICIPATION_STATUS.ACCEPTED ? (
              <CheckCircle2 className="h-3 w-3" />
            ) : (
              <XCircle className="h-3 w-3" />
            )}
            {STATUS_LABEL[status]}
          </div>
        )}
      </div>

      {introMessage && (
        <div className="rounded-xl bg-background border border-border px-3 py-2.5">
          <p className="text-sm text-foreground leading-relaxed">"{introMessage}"</p>
        </div>
      )}

      <div className="flex gap-2 pt-1">
        <button
          onClick={() => onAnalyze(applicant)}
          disabled={isAnalyzing}
          className="flex items-center gap-1 rounded-xl border border-border px-2.5 py-2 text-xs text-muted hover:border-primary/40 hover:text-primary transition-colors disabled:opacity-50 shrink-0"
        >
          <Sparkles className="h-3.5 w-3.5" />
          {isAnalyzing ? '분석 중...' : 'AI 케미'}
        </button>
        {status === PARTICIPATION_STATUS.PENDING && (
          <>
            <button
              onClick={() => onReject(participationId)}
              disabled={isActing}
              className="flex-1 flex items-center justify-center gap-1.5 rounded-xl border border-border py-2 text-sm text-muted hover:border-red-400/50 hover:text-red-400 transition-colors disabled:opacity-50"
            >
              <XCircle className="h-4 w-4" />
              거절
            </button>
            <Button onClick={() => onAccept(participationId)} disabled={isActing} className="flex-1">
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
          </>
        )}
      </div>
    </div>
  );
}

function ScoreRing({ score }: { score: number }) {
  const color =
    score >= 80 ? 'text-primary' : score >= 60 ? 'text-[#f5a318]' : 'text-muted';
  return (
    <div className={cn('text-5xl font-bold tabular-nums', color)}>
      {score}
      <span className="text-lg font-medium text-muted">/100</span>
    </div>
  );
}

function ChemistryResultContent({
  result,
  onClose,
}: {
  result: AnalyzeGroupChemistryResponse;
  onClose: () => void;
}) {
  return (
    <div className="space-y-4">
      <div className="flex flex-col items-center gap-2 py-2">
        <ScoreRing score={result.score} />
        <p className="text-sm font-semibold text-foreground text-center">{result.summary}</p>
      </div>
      <div className="rounded-2xl bg-primary/5 border border-primary/20 p-4">
        <div className="flex items-start gap-2">
          <Sparkles className="h-4 w-4 text-primary shrink-0 mt-0.5" />
          <p className="text-sm text-foreground leading-relaxed">{result.comment}</p>
        </div>
      </div>
      <Button className="w-full" onClick={onClose}>
        확인
      </Button>
    </div>
  );
}

interface ApplicantsPageProps {
  challengeId: string;
  challengeTitle?: string;
}

export function ApplicantsPage({ challengeId, challengeTitle }: ApplicantsPageProps) {
  const router = useRouter();
  const {
    applicants,
    isLoading,
    actionLoading,
    accept,
    reject,
    closeChallenge,
    isClosing,
    pendingCount,
    acceptedCount,
    analyzeChemistry,
    chemistryLoading,
    chemistryAnalyzing,
    chemistryResult,
    clearChemistryResult,
  } = useApplicants(challengeId);
  const [filter, setFilter] = useState<FilterTab>('all');
  const [showCloseConfirm, setShowCloseConfirm] = useState(false);

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
        {acceptedCount > 0 && (
          <button
            onClick={() => setShowCloseConfirm(true)}
            className="flex items-center gap-1.5 rounded-xl border border-[#e8356e]/40 bg-[#e8356e]/5 px-3 py-2 text-xs font-medium text-[#e8356e] hover:bg-[#e8356e]/10 transition-colors"
          >
            <Lock className="h-3.5 w-3.5" />
            모집 마감
          </button>
        )}
      </header>

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
              key={applicant.participationId}
              applicant={applicant}
              actionLoading={actionLoading}
              chemistryLoading={chemistryLoading}
              onAccept={accept}
              onReject={reject}
              onAnalyze={analyzeChemistry}
            />
          ))
        )}
      </div>

      {/* AI 케미 분석 모달 (로딩 중에도 열려 있음) */}
      <Modal
        isOpen={!!chemistryAnalyzing || !!chemistryResult}
        onClose={() => {
          if (chemistryAnalyzing) return;
          clearChemistryResult();
        }}
        title="AI 케미 분석"
      >
        {chemistryAnalyzing && !chemistryResult ? (
          <div className="flex flex-col items-center gap-3 py-8">
            <div className="h-10 w-10 rounded-full border-4 border-primary/20 border-t-primary animate-spin" />
            <p className="text-sm text-muted text-center">
              <span className="text-foreground font-semibold">{chemistryAnalyzing.nickname}</span>
              님과의 케미를 분석 중이에요...
            </p>
          </div>
        ) : chemistryResult ? (
          <ChemistryResultContent result={chemistryResult} onClose={clearChemistryResult} />
        ) : null}
      </Modal>

      {/* 모집 마감 확인 모달 */}
      <Modal
        isOpen={showCloseConfirm}
        onClose={() => setShowCloseConfirm(false)}
        title="모집 마감"
      >
        <div className="space-y-4">
          <p className="text-sm text-foreground">
            수락된 {acceptedCount}명으로 크루를 구성하고 모집을 마감할까요?
          </p>
          <p className="text-xs text-muted">마감 후에는 새로운 신청을 받을 수 없어요.</p>
          <div className="flex gap-3">
            <Button
              variant="secondary"
              className="flex-1"
              onClick={() => setShowCloseConfirm(false)}
            >
              취소
            </Button>
            <Button
              className="flex-1 bg-[#e8356e] hover:bg-[#e8356e]/90 shadow-[#e8356e]/30"
              onClick={() => {
                setShowCloseConfirm(false);
                closeChallenge();
              }}
              disabled={isClosing}
            >
              {isClosing ? '마감 중...' : '마감하기'}
            </Button>
          </div>
        </div>
      </Modal>
    </AppShell>
  );
}
