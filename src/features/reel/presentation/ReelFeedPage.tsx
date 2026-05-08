'use client';

import { useRef, useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Play, Pause, Volume2, VolumeX } from 'lucide-react';
import { useReelFeed } from '../application/useReelFeed';
import type { Reel } from '../domain/entities/Reel';
import { cn } from '@/shared/utils/cn';
import { formatRelativeTime } from '@/shared/utils/formatDate';

const REEL_TYPE_LABEL = {
  recruitment: '모집 릴스',
  completion: '완료 릴스',
} as const;

const REEL_TYPE_COLOR = {
  recruitment: 'bg-primary/80',
  completion: 'bg-[#07d98a]/80',
} as const;

function ReelItem({
  reel,
  isActive,
  isMuted,
  onMuteToggle,
}: {
  reel: Reel;
  isActive: boolean;
  isMuted: boolean;
  onMuteToggle: () => void;
}) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    if (isActive) {
      video.currentTime = 0;
      video.play().catch(() => {
        setIsPaused(true);
      });
    } else {
      video.pause();
      video.currentTime = 0;
    }
  }, [isActive]);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.muted = isMuted;
    }
  }, [isMuted]);

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

  return (
    <div className="relative h-full w-full flex-shrink-0 bg-black" onClick={togglePlay}>
      <video
        ref={videoRef}
        src={reel.videoUrl}
        loop
        muted={isMuted}
        playsInline
        className="h-full w-full object-cover"
      />

      {/* 일시정지 아이콘 */}
      {isPaused && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-black/40 backdrop-blur-sm">
            <Play className="h-8 w-8 fill-white text-white ml-1" />
          </div>
        </div>
      )}

      {/* 상단 오버레이 */}
      <div className="absolute top-0 left-0 right-0 h-24 bg-gradient-to-b from-black/60 to-transparent pointer-events-none" />

      {/* 하단 오버레이 */}
      <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-black/80 to-transparent pointer-events-none" />

      {/* 타입 배지 */}
      <div className="absolute top-4 left-4">
        <span className={cn('rounded-full px-2.5 py-1 text-xs font-semibold text-white', REEL_TYPE_COLOR[reel.reelType])}>
          {REEL_TYPE_LABEL[reel.reelType]}
        </span>
      </div>

      {/* 음소거 버튼 */}
      <button
        onClick={(e) => { e.stopPropagation(); onMuteToggle(); }}
        className="absolute top-4 right-4 flex h-9 w-9 items-center justify-center rounded-full bg-black/40 backdrop-blur-sm"
      >
        {isMuted
          ? <VolumeX className="h-4 w-4 text-white" />
          : <Volume2 className="h-4 w-4 text-white" />
        }
      </button>

      {/* 하단 참여자 정보 */}
      <div className="absolute bottom-6 left-4 right-4 pointer-events-none">
        <div className="flex items-center gap-2">
          <div className="flex -space-x-2">
            {reel.participants.slice(0, 3).map((p) => (
              <div
                key={p.userId}
                className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-black bg-primary/30 text-xs font-bold text-white"
              >
                {p.nickname.slice(0, 1)}
              </div>
            ))}
          </div>
          <div>
            <p className="text-sm font-semibold text-white">
              {reel.participants.map((p) => p.nickname).join(', ')}
            </p>
            <p className="text-xs text-white/60">{formatRelativeTime(reel.createdAt)}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

interface ReelFeedPageProps {
  challengeId: string;
  challengeTitle?: string;
}

export function ReelFeedPage({ challengeId, challengeTitle }: ReelFeedPageProps) {
  const router = useRouter();
  const { reels, isLoading } = useReelFeed(challengeId);
  const [activeIndex, setActiveIndex] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleScroll = useCallback(() => {
    const container = containerRef.current;
    if (!container) return;
    const index = Math.round(container.scrollTop / container.clientHeight);
    setActiveIndex(index);
  }, []);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    container.addEventListener('scroll', handleScroll, { passive: true });
    return () => container.removeEventListener('scroll', handleScroll);
  }, [handleScroll]);

  if (isLoading) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-black">
        <div className="text-white/60 text-sm">릴스 불러오는 중...</div>
      </div>
    );
  }

  if (reels.length === 0) {
    return (
      <div className="flex h-screen w-full flex-col items-center justify-center gap-4 bg-black">
        <p className="text-white/60 text-sm">아직 릴스가 없어요</p>
        <button
          onClick={() => router.back()}
          className="text-primary text-sm font-medium"
        >
          돌아가기
        </button>
      </div>
    );
  }

  return (
    <div className="relative h-screen w-full overflow-hidden bg-black">
      {/* 헤더 */}
      <div className="absolute top-0 left-0 right-0 z-10 flex items-center gap-3 px-4 pt-12 pb-4">
        <button
          onClick={() => router.back()}
          className="flex h-9 w-9 items-center justify-center rounded-full bg-black/40 backdrop-blur-sm"
        >
          <ArrowLeft className="h-5 w-5 text-white" />
        </button>
        <div className="flex-1 min-w-0">
          <p className="text-xs text-white/60">릴스</p>
          {challengeTitle && (
            <p className="text-sm font-semibold text-white truncate">{challengeTitle}</p>
          )}
        </div>
      </div>

      {/* 릴스 스크롤 컨테이너 */}
      <div
        ref={containerRef}
        className="h-full w-full overflow-y-scroll snap-y snap-mandatory"
        style={{ scrollbarWidth: 'none' }}
      >
        {reels.map((reel, index) => (
          <div key={reel.id} className="h-full w-full snap-start snap-always">
            <ReelItem
              reel={reel}
              isActive={index === activeIndex}
              isMuted={isMuted}
              onMuteToggle={() => setIsMuted((m) => !m)}
            />
          </div>
        ))}
      </div>

      {/* 인디케이터 */}
      <div className="absolute right-3 top-1/2 -translate-y-1/2 z-10 flex flex-col gap-1.5">
        {reels.map((_, i) => (
          <div
            key={i}
            className={cn(
              'rounded-full transition-all duration-200',
              i === activeIndex ? 'h-4 w-1.5 bg-white' : 'h-1.5 w-1.5 bg-white/40',
            )}
          />
        ))}
      </div>
    </div>
  );
}
