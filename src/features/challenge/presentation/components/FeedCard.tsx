'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';

import { ChevronRight, Clock, Heart, MapPin, Play, Share2, Users, Volume2, VolumeX } from 'lucide-react';

import {
  isChallengeJoinable,
  getRemainingSlots,
} from '@/features/challenge/domain/services/challengeRules';
import type { Challenge } from '@/features/challenge/domain/entities/Challenge';
import { getChallengeReelsApi } from '@/api/endpoints/reels';
import { useAuth } from '@/features/auth/application/store/AuthContext';
import { Button } from '@/shared/components/ui/Button';
import { Modal } from '@/shared/components/ui/Modal';
import { cn } from '@/shared/utils/cn';

const CARD_GRADIENTS = [
  'from-[#031a0f] via-[#052e1c] to-[#063825]',
  'from-[#1a030d] via-[#2e0519] to-[#38061e]',
  'from-[#030a1a] via-[#05162e] to-[#061a38]',
  'from-[#141003] via-[#251e05] to-[#302507]',
  'from-[#0f031a] via-[#1c052e] to-[#220638]',
  'from-[#031718] via-[#052a2b] to-[#063335]',
];

const CATEGORY_BADGE: Record<string, string> = {
  댄스: 'border-[#e8356e]/50 text-[#e8356e] bg-[#e8356e]/10',
  일상: 'border-[#f5a318]/50 text-[#f5a318] bg-[#f5a318]/10',
  스포츠: 'border-[#07d98a]/50 text-[#07d98a] bg-[#07d98a]/10',
  푸드: 'border-[#f5a318]/50 text-[#f5a318] bg-[#f5a318]/10',
  기타: 'border-purple-400/50 text-purple-300 bg-purple-500/10',
};

function getDeadlineLabel(iso: string): string {
  const diffDays = Math.ceil((new Date(iso).getTime() - Date.now()) / 86_400_000);
  if (diffDays <= 0) return '마감';
  if (diffDays === 1) return 'D-1';
  return `D-${diffDays}`;
}

function deterministicCount(id: string, base: number): number {
  let h = 0;
  for (const c of id) h = (h * 31 + c.charCodeAt(0)) | 0;
  return (Math.abs(h) % 300) + base;
}

interface FeedCardProps {
  challenge: Challenge;
  index: number;
  isActive: boolean;
  reelType?: 'recruitment' | 'completion';
}

export function FeedCard({ challenge, index, isActive, reelType }: FeedCardProps) {
  const router = useRouter();
  const { currentUser } = useAuth();
  const videoRef = useRef<HTMLVideoElement>(null);
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(() => deterministicCount(challenge.id, 50));
  const [showDetail, setShowDetail] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [isPaused, setIsPaused] = useState(false);

  // 활성화된 카드일 때만 릴스 fetch
  const { data: reelData } = useQuery({
    queryKey: ['challenge-reels', challenge.id, reelType],
    queryFn: () => getChallengeReelsApi(challenge.id, { type: reelType }),
    enabled: isActive,
    staleTime: 5 * 60 * 1000,
  });
  const videoUrl = reelData?.reels[0]?.videoUrl ?? null;

  // 활성/비활성에 따라 재생/정지
  useEffect(() => {
    const video = videoRef.current;
    if (!video || !videoUrl) return;
    if (isActive) {
      video.currentTime = 0;
      video.play().catch(() => setIsPaused(true));
      setIsPaused(false);
    } else {
      video.pause();
    }
  }, [isActive, videoUrl]);

  const togglePlay = () => {
    const video = videoRef.current;
    if (!video) return;
    if (video.paused) {
      void video.play();
      setIsPaused(false);
    } else {
      video.pause();
      setIsPaused(true);
    }
  };

  const joinable = isChallengeJoinable(challenge);
  const isHost = currentUser?.id === challenge.host.id;
  const remaining = getRemainingSlots(challenge);
  const gradient = CARD_GRADIENTS[index % CARD_GRADIENTS.length];
  const badgeClass =
    CATEGORY_BADGE[challenge.category] ?? 'border-white/30 text-white/70 bg-white/10';
  const deadlineLabel = getDeadlineLabel(challenge.deadlineAt);

  return (
    <>
      <div
        className={cn(
          'relative h-full w-full flex-shrink-0 snap-start overflow-hidden bg-gradient-to-b',
          gradient,
        )}
        onClick={videoUrl ? togglePlay : undefined}
      >
        {/* 실제 영상 */}
        {videoUrl && (
          <video
            ref={videoRef}
            src={videoUrl}
            loop
            muted={isMuted}
            playsInline
            className="absolute inset-0 h-full w-full object-cover"
          />
        )}

        {/* top vignette */}
        <div className="absolute inset-x-0 top-0 h-52 bg-gradient-to-b from-black/50 to-transparent pointer-events-none" />
        {/* bottom vignette */}
        <div className="absolute inset-x-0 bottom-0 h-72 bg-gradient-to-t from-black/85 to-transparent pointer-events-none" />

        {/* Ambient glow (영상 없을 때만) */}
        {!videoUrl && (
          <div
            className="absolute inset-0 opacity-30 pointer-events-none"
            style={{
              background: `radial-gradient(ellipse at 30% 40%, ${index % 2 === 0 ? 'rgba(5,166,107,0.25)' : 'rgba(232,53,110,0.25)'} 0%, transparent 60%)`,
            }}
          />
        )}

        {/* 일시정지 아이콘 */}
        {isPaused && videoUrl && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-black/40 backdrop-blur-sm">
              <Play className="ml-1 h-8 w-8 fill-white text-white" />
            </div>
          </div>
        )}

        {/* 영상 없을 때 플레이 아이콘 플레이스홀더 */}
        {!videoUrl && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="flex h-20 w-20 items-center justify-center rounded-full border border-white/20 bg-white/10 backdrop-blur-sm">
              <Play className="ml-1 h-8 w-8 fill-white/80 text-white/80" />
            </div>
          </div>
        )}

        {/* Top badges */}
        <div className="absolute left-4 right-16 top-14 z-10 flex flex-wrap gap-2">
          <span
            className={cn(
              'rounded-full border px-3 py-1 text-xs font-semibold backdrop-blur-sm',
              badgeClass,
            )}
          >
            {challenge.category}
          </span>
          {challenge.hashtags?.slice(0, 2).map((tag) => (
            <span
              key={tag}
              className="rounded-full bg-white/10 px-3 py-1 text-xs text-white/70 backdrop-blur-sm"
            >
              #{tag}
            </span>
          ))}
        </div>

        {/* Right action bar */}
        <div
          className="absolute right-4 z-10 flex flex-col items-center gap-5"
          style={{ bottom: '196px' }}
        >
          {/* Host avatar */}
          <div className="flex flex-col items-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-full border-2 border-primary bg-primary/30">
              <span className="text-base font-bold text-white">
                {challenge.host.nickname[0]}
              </span>
            </div>
            <div className="-mt-2.5 flex h-5 w-5 items-center justify-center rounded-full bg-primary">
              <span className="text-[10px] font-bold text-white leading-none">+</span>
            </div>
          </div>

          {/* Like */}
          <button
            onClick={(e) => { e.stopPropagation(); setLiked((p) => !p); setLikeCount((p) => p + (liked ? -1 : 1)); }}
            className="flex flex-col items-center gap-1"
          >
            <div className={cn('flex h-12 w-12 items-center justify-center rounded-full transition-all', liked ? 'bg-[#e8356e]/20' : 'bg-white/10 backdrop-blur-sm')}>
              <Heart className={cn('h-6 w-6 transition-all duration-200', liked ? 'fill-[#e8356e] text-[#e8356e] scale-110' : 'text-white')} />
            </div>
            <span className="text-xs text-white/70">{likeCount}</span>
          </button>

          {/* 음소거 토글 (영상 있을 때만) */}
          {videoUrl && (
            <button
              onClick={(e) => { e.stopPropagation(); setIsMuted((m) => !m); }}
              className="flex flex-col items-center gap-1"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white/10 backdrop-blur-sm">
                {isMuted ? <VolumeX className="h-6 w-6 text-white" /> : <Volume2 className="h-6 w-6 text-white" />}
              </div>
              <span className="text-xs text-white/70">{isMuted ? '음소거' : '소리 켜짐'}</span>
            </button>
          )}

          {/* Share */}
          <button onClick={(e) => e.stopPropagation()} className="flex flex-col items-center gap-1">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white/10 backdrop-blur-sm">
              <Share2 className="h-6 w-6 text-white" />
            </div>
            <span className="text-xs text-white/70">공유</span>
          </button>
        </div>

        {/* Bottom info overlay */}
        <div className="absolute bottom-0 left-0 right-16 z-10 px-4 pb-5">
          <p className="mb-0.5 text-sm text-white/60">@{challenge.host.nickname}</p>
          <h2 className="mb-2.5 pr-2 text-lg font-bold leading-snug text-white">{challenge.title}</h2>

          <div className="mb-4 flex flex-wrap gap-x-4 gap-y-1">
            <div className="flex items-center gap-1.5 text-sm text-white/70">
              <MapPin className="h-3.5 w-3.5 flex-shrink-0 text-[#07d98a]" />
              <span>{challenge.locationText}</span>
            </div>
            <div className="flex items-center gap-1.5 text-sm text-white/70">
              <Clock className="h-3.5 w-3.5 flex-shrink-0 text-[#f5a318]" />
              <span>{deadlineLabel}</span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <div className="flex gap-1">
                {Array.from({ length: challenge.maxParticipants }).map((_, i) => (
                  <div
                    key={i}
                    className={cn('h-1.5 w-1.5 rounded-full transition-colors', i < challenge.currentParticipants ? 'bg-primary' : 'bg-white/30')}
                  />
                ))}
              </div>
              <span className="text-xs text-white/55">{remaining > 0 ? `${remaining}자리` : '마감'}</span>
            </div>

            <button
              onClick={(e) => { e.stopPropagation(); setShowDetail(true); }}
              disabled={isHost || !joinable}
              className={cn(
                'ml-auto flex items-center gap-1.5 rounded-full px-5 py-2.5 text-sm font-semibold transition-all duration-200',
                isHost
                  ? 'cursor-default bg-white/10 text-white/40'
                  : joinable
                  ? 'bg-primary text-white shadow-lg shadow-primary/40 active:scale-95'
                  : 'cursor-not-allowed bg-white/10 text-white/40',
              )}
            >
              {isHost ? '내 챌린지' : joinable ? '참여 신청' : '마감'}
              {!isHost && joinable && <ChevronRight className="h-4 w-4" />}
            </button>
          </div>
        </div>
      </div>

      <Modal isOpen={showDetail} onClose={() => setShowDetail(false)} title={challenge.title}>
        <div className="space-y-4">
          <span className={cn('inline-block rounded-full border px-3 py-1 text-xs font-semibold', badgeClass)}>
            {challenge.category}
          </span>

          {challenge.description && (
            <p className="text-sm leading-relaxed text-muted">{challenge.description}</p>
          )}

          <div className="space-y-3 rounded-2xl bg-secondary p-4">
            <div className="flex items-center gap-3 text-sm">
              <MapPin className="h-4 w-4 flex-shrink-0 text-primary" />
              <span className="text-foreground">{challenge.locationText}</span>
            </div>
            <div className="flex items-center gap-3 text-sm">
              <Clock className="h-4 w-4 flex-shrink-0 text-primary" />
              <span className="text-foreground">
                마감{' '}
                {new Date(challenge.deadlineAt).toLocaleDateString('ko-KR', { month: 'long', day: 'numeric' })}
              </span>
            </div>
            <div className="flex items-center gap-3 text-sm">
              <Users className="h-4 w-4 flex-shrink-0 text-primary" />
              <span className="text-foreground">
                {challenge.currentParticipants}/{challenge.maxParticipants}명
                {remaining > 0 && <span className="ml-1.5 text-primary font-medium">· {remaining}자리 남음</span>}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3 rounded-2xl bg-secondary p-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/20">
              <span className="text-sm font-bold text-primary">{challenge.host.nickname[0]}</span>
            </div>
            <div>
              <p className="text-xs text-muted">주최자</p>
              <p className="text-sm font-medium text-foreground">{challenge.host.nickname}</p>
            </div>
          </div>

          {challenge.hashtags && challenge.hashtags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {challenge.hashtags.map((tag) => (
                <span key={tag} className="rounded-full bg-primary/10 px-3 py-1 text-xs text-primary">
                  #{tag}
                </span>
              ))}
            </div>
          )}

          <Button
            className="w-full"
            size="lg"
            disabled={isHost || !joinable}
            onClick={() => {
              setShowDetail(false);
              router.push(`/challenges/${challenge.id}`);
            }}
          >
            {isHost ? '내 챌린지' : joinable ? '참여 신청하기' : '모집 마감'}
          </Button>
        </div>
      </Modal>
    </>
  );
}
