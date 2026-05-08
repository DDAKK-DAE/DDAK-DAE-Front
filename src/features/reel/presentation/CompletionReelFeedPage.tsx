'use client';

import { useRef, useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { Play, Volume2, VolumeX, Users, Heart, Share2 } from 'lucide-react';
import { useCompletionReels } from '../application/useCompletionReels';
import type { Reel } from '../domain/entities/Reel';
import { cn } from '@/shared/utils/cn';
import { formatRelativeTime } from '@/shared/utils/formatDate';

function ReelItem({
  reel,
  isActive,
  isMuted,
  onMuteToggle,
  liked,
  likeCount,
  onLike,
  onShare,
}: {
  reel: Reel;
  isActive: boolean;
  isMuted: boolean;
  onMuteToggle: () => void;
  liked: boolean;
  likeCount: number;
  onLike: () => void;
  onShare: () => void;
}) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    if (isActive) {
      video.currentTime = 0;
      video.play().catch(() => setIsPaused(true));
    } else {
      video.pause();
      video.currentTime = 0;
    }
  }, [isActive]);

  useEffect(() => {
    if (videoRef.current) videoRef.current.muted = isMuted;
  }, [isMuted]);

  const togglePlay = () => {
    const video = videoRef.current;
    if (!video) return;
    if (video.paused) { void video.play(); setIsPaused(false); }
    else { video.pause(); setIsPaused(true); }
  };

  return (
    <div className="relative h-full w-full flex-shrink-0 bg-black" onClick={togglePlay}>
      <video
        ref={videoRef}
        src={reel.video_url}
        loop
        muted={isMuted}
        playsInline
        className="h-full w-full object-cover"
      />

      {isPaused && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-black/40 backdrop-blur-sm">
            <Play className="h-8 w-8 fill-white text-white ml-1" />
          </div>
        </div>
      )}

      <div className="absolute top-0 left-0 right-0 h-24 bg-gradient-to-b from-black/60 to-transparent pointer-events-none" />
      <div className="absolute bottom-0 left-0 right-0 h-48 bg-gradient-to-t from-black/80 to-transparent pointer-events-none" />

      {/* 음소거 버튼 */}
      <button
        onClick={(e) => { e.stopPropagation(); onMuteToggle(); }}
        className="absolute top-14 right-4 flex h-9 w-9 items-center justify-center rounded-full bg-black/40 backdrop-blur-sm"
      >
        {isMuted ? <VolumeX className="h-4 w-4 text-white" /> : <Volume2 className="h-4 w-4 text-white" />}
      </button>

      {/* 우측 액션 버튼 */}
      <div className="absolute right-4 top-1/2 -translate-y-1/2 flex flex-col items-center gap-5">
        <button
          onClick={(e) => { e.stopPropagation(); onLike(); }}
          className="flex flex-col items-center gap-1"
        >
          <div className="flex h-11 w-11 items-center justify-center rounded-full bg-black/40 backdrop-blur-sm transition-transform active:scale-90">
            <Heart className={cn('h-5 w-5 transition-colors', liked ? 'fill-red-500 text-red-500' : 'text-white')} />
          </div>
          <span className="text-xs text-white/80 font-medium">{likeCount}</span>
        </button>
        <button
          onClick={(e) => { e.stopPropagation(); onShare(); }}
          className="flex flex-col items-center gap-1"
        >
          <div className="flex h-11 w-11 items-center justify-center rounded-full bg-black/40 backdrop-blur-sm">
            <Share2 className="h-5 w-5 text-white" />
          </div>
          <span className="text-xs text-white/80 font-medium">공유</span>
        </button>
      </div>

      {/* 하단 참여자 정보 */}
      <div className="absolute bottom-4 left-4 right-20 pointer-events-none space-y-2">
        <div className="flex items-center gap-2">
          <div className="flex -space-x-2">
            {reel.participants.slice(0, 4).map((p) => (
              <div key={p.id} className="flex h-9 w-9 items-center justify-center rounded-full border-2 border-black bg-primary/40 text-xs font-bold text-white">
                {p.nickname.slice(0, 1)}
              </div>
            ))}
          </div>
          <div>
            <p className="text-sm font-semibold text-white leading-tight">
              {reel.participants.length <= 2
                ? reel.participants.map((p) => p.nickname).join(', ')
                : `${reel.participants[0].nickname} 외 ${reel.participants.length - 1}명`}
            </p>
            <p className="text-xs text-white/60">{formatRelativeTime(reel.created_at)}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export function CompletionReelFeedPage() {
  const router = useRouter();
  const { reels, isLoading } = useCompletionReels();
  const [activeIndex, setActiveIndex] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [likedMap, setLikedMap] = useState<Record<string, boolean>>({});
  const [likeCountMap, setLikeCountMap] = useState<Record<string, number>>({});
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (reels.length > 0) {
      setLikeCountMap((prev) => {
        const next = { ...prev };
        reels.forEach((r) => { if (!(r.id in next)) next[r.id] = Math.floor(Math.random() * 80 + 10); });
        return next;
      });
    }
  }, [reels]);

  const handleLike = (reelId: string) => {
    setLikedMap((prev) => {
      const nowLiked = !prev[reelId];
      setLikeCountMap((c) => ({ ...c, [reelId]: (c[reelId] ?? 0) + (nowLiked ? 1 : -1) }));
      return { ...prev, [reelId]: nowLiked };
    });
  };

  const handleShare = (reelId: string) => {
    void navigator.share?.({ title: '딱대 완료 릴스', url: window.location.href }).catch(() => {});
  };

  const handleScroll = useCallback(() => {
    const container = containerRef.current;
    if (!container) return;
    setActiveIndex(Math.round(container.scrollTop / container.clientHeight));
  }, []);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    container.addEventListener('scroll', handleScroll, { passive: true });
    return () => container.removeEventListener('scroll', handleScroll);
  }, [handleScroll]);

  if (isLoading) {
    return (
      <div className="flex h-full w-full items-center justify-center bg-black">
        <p className="text-white/60 text-sm">불러오는 중...</p>
      </div>
    );
  }

  if (reels.length === 0) {
    return (
      <div className="flex h-full w-full flex-col items-center justify-center gap-4 bg-black">
        <Users className="h-12 w-12 text-white/30" />
        <p className="text-white/60 text-sm">아직 완료 릴스가 없어요</p>
      </div>
    );
  }

  return (
    <div className="relative h-full w-full overflow-hidden bg-black">
      {/* 릴스 스크롤 */}
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
              liked={likedMap[reel.id] ?? false}
              likeCount={likeCountMap[reel.id] ?? 0}
              onLike={() => handleLike(reel.id)}
              onShare={() => handleShare(reel.id)}
            />
          </div>
        ))}
      </div>

    </div>
  );
}
