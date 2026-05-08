'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, MapPin, Clock, Users, Play, CheckCircle2, ClipboardList } from 'lucide-react';
import { AppShell } from '@/shared/components/layout/AppShell';
import { Button } from '@/shared/components/ui/Button';
import { useChallengeDetail } from '../../application/hooks/useChallengeDetail';
import { isChallengeJoinable, getRemainingSlots } from '../../domain/services/challengeRules';
import { useAuth } from '@/features/auth/application/store/AuthContext';
import { cn } from '@/shared/utils/cn';

const CATEGORY_BADGE: Record<string, string> = {
  댄스: 'border-[#e8356e]/50 text-[#e8356e] bg-[#e8356e]/10',
  일상: 'border-[#f5a318]/50 text-[#f5a318] bg-[#f5a318]/10',
  스포츠: 'border-[#07d98a]/50 text-[#07d98a] bg-[#07d98a]/10',
  푸드: 'border-[#f5a318]/50 text-[#f5a318] bg-[#f5a318]/10',
  기타: 'border-purple-400/50 text-purple-300 bg-purple-500/10',
};

function getDeadlineLabel(iso: string): string {
  const diffDays = Math.ceil((new Date(iso).getTime() - Date.now()) / 86_400_000);
  if (diffDays <= 0) return '마감됨';
  if (diffDays === 1) return 'D-1 · 내일 마감';
  return `D-${diffDays} · ${new Date(iso).toLocaleDateString('ko-KR', { month: 'long', day: 'numeric' })} 마감`;
}

interface ChallengeDetailPageProps {
  challengeId: string;
}

export function ChallengeDetailPage({ challengeId }: ChallengeDetailPageProps) {
  const router = useRouter();
  const { currentUser } = useAuth();
  const { challenge, isLoading, isApplying, applySuccess, applyError, applyChallenge } =
    useChallengeDetail(challengeId);
  const [introMessage, setIntroMessage] = useState('');
  const [showApplyForm, setShowApplyForm] = useState(false);

  if (isLoading || !challenge) {
    return (
      <AppShell className="bg-background">
        <div className="flex h-full items-center justify-center text-muted">로딩 중...</div>
      </AppShell>
    );
  }

  const joinable = isChallengeJoinable(challenge);
  const remaining = getRemainingSlots(challenge);
  const badgeClass = CATEGORY_BADGE[challenge.category] ?? 'border-white/30 text-white/70 bg-white/10';
  const filledSlots = challenge.current_participants;
  const isHost = currentUser?.id === challenge.host.id;

  const handleApply = async () => {
    await applyChallenge(introMessage.trim() || undefined);
  };

  return (
    <AppShell className="bg-background">
      {/* Header */}
      <header className="flex items-center gap-3 border-b border-border bg-background/80 px-4 py-4 backdrop-blur-md">
        <button
          onClick={() => router.back()}
          className="flex h-9 w-9 items-center justify-center rounded-xl hover:bg-surface transition-colors"
        >
          <ArrowLeft className="h-5 w-5 text-foreground" />
        </button>
        <h1 className="flex-1 truncate font-bold text-foreground">챌린지 상세</h1>
        {isHost && (
          <button
            onClick={() => router.push(`/challenges/${challengeId}/applicants`)}
            className="flex items-center gap-1.5 rounded-xl border border-border px-3 py-2 text-xs text-foreground hover:bg-surface transition-colors"
          >
            <ClipboardList className="h-4 w-4 text-primary" />
            신청자 보기
          </button>
        )}
      </header>

      <div className="flex-1 overflow-y-auto pb-32">
        {/* Reel preview area */}
        <button
          onClick={() => router.push(`/challenges/${challengeId}/reels`)}
          className="relative flex h-56 w-full items-center justify-center bg-gradient-to-b from-[#031a0f] to-[#052e1c] active:brightness-90 transition-all"
        >
          <div className="flex h-20 w-20 items-center justify-center rounded-full border border-white/20 bg-white/10 backdrop-blur-sm">
            <Play className="ml-1 h-8 w-8 fill-white/80 text-white/80" />
          </div>
          <span className="absolute bottom-3 left-4 rounded-full bg-black/50 px-2 py-1 text-xs text-white">
            탭하여 릴스 보기
          </span>
          {challenge.recruitment_reels.length > 0 && (
            <span className="absolute bottom-3 right-4 rounded-full bg-black/50 px-2 py-1 text-xs text-white">
              모집 릴스 {challenge.recruitment_reels.length}개
            </span>
          )}
        </button>

        <div className="px-5 pt-5 space-y-5">
          {/* Category + title */}
          <div>
            <span className={cn('inline-block rounded-full border px-3 py-1 text-xs font-semibold mb-3', badgeClass)}>
              {challenge.category}
            </span>
            <h2 className="text-xl font-bold text-foreground leading-snug">{challenge.title}</h2>
          </div>

          {/* Info cards */}
          <div className="rounded-2xl bg-surface border border-border divide-y divide-border overflow-hidden">
            <div className="flex items-center gap-3 px-4 py-3">
              <MapPin className="h-4 w-4 shrink-0 text-primary" />
              <span className="text-sm text-foreground">{challenge.location_text}</span>
            </div>
            <div className="flex items-center gap-3 px-4 py-3">
              <Clock className="h-4 w-4 shrink-0 text-[#f5a318]" />
              <span className="text-sm text-foreground">{getDeadlineLabel(challenge.deadline_at)}</span>
            </div>
            <div className="flex items-center gap-3 px-4 py-3">
              <Users className="h-4 w-4 shrink-0 text-[#07d98a]" />
              <div className="flex-1 flex items-center gap-3">
                <div className="flex gap-1">
                  {Array.from({ length: challenge.max_participants }).map((_, i) => (
                    <div
                      key={i}
                      className={cn(
                        'h-2 w-2 rounded-full transition-colors',
                        i < filledSlots ? 'bg-primary' : 'bg-border',
                      )}
                    />
                  ))}
                </div>
                <span className="text-sm text-foreground">
                  {filledSlots}/{challenge.max_participants}명
                  {remaining > 0 && (
                    <span className="ml-1.5 font-medium text-primary">· {remaining}자리 남음</span>
                  )}
                </span>
              </div>
            </div>
          </div>

          {/* Host */}
          <div className="flex items-center gap-3 rounded-2xl bg-surface border border-border p-4">
            <div className="flex h-11 w-11 items-center justify-center rounded-full bg-primary/10 text-primary font-bold text-base">
              {challenge.host.nickname.slice(0, 1)}
            </div>
            <div>
              <p className="text-xs text-muted">주최자</p>
              <p className="text-sm font-semibold text-foreground">{challenge.host.nickname}</p>
            </div>
          </div>

          {/* Description */}
          {challenge.description && (
            <div className="rounded-2xl bg-surface border border-border p-4">
              <p className="text-sm text-foreground leading-relaxed whitespace-pre-wrap">
                {challenge.description}
              </p>
            </div>
          )}

          {/* Hashtags */}
          {challenge.hashtags && challenge.hashtags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {challenge.hashtags.map((tag) => (
                <span key={tag} className="rounded-full bg-primary/10 px-3 py-1 text-xs text-primary">
                  #{tag}
                </span>
              ))}
            </div>
          )}

          {/* Apply form (inline expand) */}
          {showApplyForm && joinable && !applySuccess && (
            <div className="rounded-2xl border border-primary/30 bg-primary/5 p-4 space-y-3">
              <p className="text-sm font-medium text-foreground">한 줄 자기소개 (선택)</p>
              <textarea
                value={introMessage}
                onChange={(e) => setIntroMessage(e.target.value)}
                placeholder="나를 소개해봐요! (최대 100자)"
                maxLength={100}
                rows={3}
                className="w-full resize-none rounded-xl bg-surface border border-border px-3 py-2.5 text-sm text-foreground placeholder:text-subtle outline-none focus:border-primary transition-colors"
              />
              <div className="flex items-center justify-between text-xs text-muted">
                <span>빈칸이어도 신청 가능해요</span>
                <span>{introMessage.length}/100</span>
              </div>
              {applyError && <p className="text-xs text-red-400">{applyError}</p>}
            </div>
          )}

          {/* Success state */}
          {applySuccess && (
            <div className="flex items-center gap-3 rounded-2xl bg-primary/10 border border-primary/30 p-4">
              <CheckCircle2 className="h-5 w-5 text-primary shrink-0" />
              <p className="text-sm text-primary font-medium">신청 완료! 주최자 수락을 기다려봐요 🎉</p>
            </div>
          )}
        </div>
      </div>

      {/* Bottom CTA */}
      {!applySuccess && (
        <div className="absolute bottom-0 left-0 right-0 border-t border-border bg-background/90 backdrop-blur-md px-5 py-4">
          {joinable ? (
            showApplyForm ? (
              <div className="flex gap-3">
                <Button
                  variant="secondary"
                  className="flex-1"
                  onClick={() => setShowApplyForm(false)}
                >
                  취소
                </Button>
                <Button
                  className="flex-1"
                  onClick={() => void handleApply()}
                  disabled={isApplying}
                >
                  {isApplying ? '신청 중...' : '신청하기'}
                </Button>
              </div>
            ) : (
              <Button className="w-full" size="lg" onClick={() => setShowApplyForm(true)}>
                참여 신청하기
              </Button>
            )
          ) : (
            <Button className="w-full" size="lg" disabled>
              모집 마감
            </Button>
          )}
        </div>
      )}
    </AppShell>
  );
}
