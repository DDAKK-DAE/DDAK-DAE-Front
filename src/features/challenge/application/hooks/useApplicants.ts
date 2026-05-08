'use client';

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import {
  getApplicantsApi,
  acceptParticipationApi,
  rejectParticipationApi,
} from '@/api/endpoints/participations';
import { closeChallengeApi, getChallengeByIdApi } from '@/api/endpoints/challenges';
import { getUserReelsApi } from '@/api/endpoints/reels';
import {
  analyzeGroupChemistryApi,
  type AnalyzeGroupChemistryResponse,
  type ParticipationHistoryItem,
} from '@/api/endpoints/ai';
import type { ApplicantDetail } from '@/features/challenge/domain/entities/Challenge';

const MOCK_CHEMISTRY_RESULT: AnalyzeGroupChemistryResponse = {
  score: 75,
  summary: '비슷한 챌린지 경험이 있어 케미가 잘 맞을 것 같아요',
  comment: '이 멤버와 기존 크루원들은 비슷한 챌린지 경험을 가지고 있어 좋은 케미가 예상돼요!',
};

export function useApplicants(challengeId: string) {
  const queryClient = useQueryClient();
  const router = useRouter();
  const queryKey = ['applicants', challengeId];

  const { data: applicants = [], isLoading } = useQuery<ApplicantDetail[]>({
    queryKey,
    queryFn: () => getApplicantsApi(challengeId),
    enabled: !!challengeId,
  });

  const { data: challenge } = useQuery({
    queryKey: ['challenge', challengeId],
    queryFn: () => getChallengeByIdApi(challengeId),
    enabled: !!challengeId,
  });

  const acceptMutation = useMutation({
    mutationFn: (participationId: string) => acceptParticipationApi(participationId),
    onSuccess: () => queryClient.invalidateQueries({ queryKey }),
  });

  const rejectMutation = useMutation({
    mutationFn: (participationId: string) => rejectParticipationApi(participationId),
    onSuccess: () => queryClient.invalidateQueries({ queryKey }),
  });

  const closeMutation = useMutation({
    mutationFn: () => closeChallengeApi(challengeId),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['my-crews'] });
      router.push(`/crews/${data.crewId}`);
    },
  });

  const [chemistryLoading, setChemistryLoading] = useState<string | null>(null);
  const [chemistryAnalyzing, setChemistryAnalyzing] = useState<{ nickname: string } | null>(null);
  const [chemistryResult, setChemistryResult] = useState<AnalyzeGroupChemistryResponse | null>(null);

  async function buildHistory(userId: string): Promise<ParticipationHistoryItem[]> {
    let reels;
    try {
      reels = await queryClient.fetchQuery({
        queryKey: ['user-reels', userId],
        queryFn: () => getUserReelsApi(userId),
      });
    } catch {
      return [];
    }
    const seen = new Set<string>();
    const items: ParticipationHistoryItem[] = [];
    for (const reel of reels) {
      if (seen.has(reel.challengeId)) continue;
      seen.add(reel.challengeId);
      try {
        const ch = await queryClient.fetchQuery({
          queryKey: ['challenge', reel.challengeId],
          queryFn: () => getChallengeByIdApi(reel.challengeId),
        });
        items.push({ category: ch.category, title: ch.title });
      } catch {
        // 개별 챌린지 조회 실패 시 건너뜀
      }
    }
    return items;
  }

  const analyzeChemistry = async (applicant: ApplicantDetail) => {
    setChemistryLoading(applicant.user.id);
    setChemistryAnalyzing({ nickname: applicant.user.nickname });
    try {
      const accepted = applicants.filter((a) => a.status === 'accepted');
      const currentMembers = await Promise.all(
        accepted.map(async (a) => ({
          nickname: a.user.nickname,
          participationHistory: await buildHistory(a.user.id),
        })),
      );
      const result = await analyzeGroupChemistryApi({
        challengeTitle: challenge?.title ?? '',
        currentMembers,
        applicant: {
          nickname: applicant.user.nickname,
          introMessage: applicant.introMessage ?? undefined,
          participationHistory: await buildHistory(applicant.user.id),
        },
      });
      setChemistryResult(result);
    } catch {
      setChemistryResult(MOCK_CHEMISTRY_RESULT);
    } finally {
      setChemistryLoading(null);
      setChemistryAnalyzing(null);
    }
  };

  const pendingCount = applicants.filter((a) => a.status === 'pending').length;
  const acceptedCount = applicants.filter((a) => a.status === 'accepted').length;

  return {
    applicants,
    isLoading,
    actionLoading: acceptMutation.isPending
      ? acceptMutation.variables
      : rejectMutation.isPending
        ? rejectMutation.variables
        : null,
    accept: acceptMutation.mutate,
    reject: rejectMutation.mutate,
    closeChallenge: closeMutation.mutate,
    isClosing: closeMutation.isPending,
    pendingCount,
    acceptedCount,
    analyzeChemistry,
    chemistryLoading,
    chemistryAnalyzing,
    chemistryResult,
    clearChemistryResult: () => setChemistryResult(null),
  };
}
