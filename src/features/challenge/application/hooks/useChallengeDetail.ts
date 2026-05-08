'use client';

import { useQuery, useMutation } from '@tanstack/react-query';
import { getChallengeByIdApi } from '@/api/endpoints/challenges';
import { applyChallengeApi } from '@/api/endpoints/participations';
import { getChallengeReelsApi } from '@/api/endpoints/reels';
import type { Challenge } from '@/features/challenge/domain/entities/Challenge';
import type { Reel } from '@/features/reel/domain/entities/Reel';

export function useChallengeDetail(challengeId: string) {
  const {
    data: challenge,
    isLoading: isChallengeLoading,
  } = useQuery<Challenge>({
    queryKey: ['challenge', challengeId],
    queryFn: () => getChallengeByIdApi(challengeId),
    enabled: !!challengeId,
  });

  const { data: reelsData, isLoading: isReelsLoading } = useQuery({
    queryKey: ['challenge-reels', challengeId, 'recruitment'],
    queryFn: () => getChallengeReelsApi(challengeId, { type: 'recruitment' }),
    enabled: !!challengeId,
  });

  const recruitmentReels: Reel[] = reelsData?.reels ?? [];
  const isLoading = isChallengeLoading || isReelsLoading;

  const applyMutation = useMutation({
    mutationFn: (introMessage?: string) =>
      applyChallengeApi(challengeId, { introMessage }),
  });

  const applyChallenge = (introMessage?: string) => applyMutation.mutate(introMessage);

  return {
    challenge: challenge ?? null,
    recruitmentReels,
    isLoading,
    isApplying: applyMutation.isPending,
    applySuccess: applyMutation.isSuccess,
    applyError: applyMutation.isError ? '신청 중 오류가 발생했어요. 다시 시도해주세요.' : null,
    applyChallenge,
  };
}
