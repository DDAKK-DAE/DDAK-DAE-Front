'use client';

import { useQuery } from '@tanstack/react-query';
import { getChallengeReelsApi, type GetChallengeReelsParams } from '@/api/endpoints/reels';
import type { Reel } from '@/features/reel/domain/entities/Reel';

export function useReelFeed(challengeId: string, type?: GetChallengeReelsParams['type']) {
  const { data, isLoading } = useQuery({
    queryKey: ['challenge-reels', challengeId, type],
    queryFn: () => getChallengeReelsApi(challengeId, type ? { type } : undefined),
    enabled: !!challengeId,
  });

  const reels: Reel[] = data?.reels ?? [];
  const audioUrl: string | null = data?.audioUrl ?? null;
  const crewId: string | null = data?.crewId ?? null;

  return { reels, audioUrl, crewId, isLoading };
}
