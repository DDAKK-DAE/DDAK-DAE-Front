'use client';

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import {
  getApplicantsApi,
  acceptParticipationApi,
  rejectParticipationApi,
} from '@/api/endpoints/participations';
import { closeChallengeApi } from '@/api/endpoints/challenges';
import { analyzeGroupChemistryApi } from '@/api/endpoints/ai';
import type { ApplicantDetail } from '@/features/challenge/domain/entities/Challenge';

const MOCK_CHEMISTRY_ANALYSIS = '이 멤버와 기존 크루원들은 비슷한 챌린지 경험을 가지고 있어 좋은 케미가 예상돼요!';

export function useApplicants(challengeId: string) {
  const queryClient = useQueryClient();
  const router = useRouter();
  const queryKey = ['applicants', challengeId];

  const { data: applicants = [], isLoading } = useQuery<ApplicantDetail[]>({
    queryKey,
    queryFn: () => getApplicantsApi(challengeId),
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
  const [chemistryResult, setChemistryResult] = useState<string | null>(null);

  const analyzeChemistry = async (candidateUserId: string) => {
    const acceptedIds = applicants
      .filter((a) => a.status === 'accepted')
      .map((a) => a.user.id);
    setChemistryLoading(candidateUserId);
    try {
      const result = await analyzeGroupChemistryApi({
        challengeId,
        acceptedUserIds: acceptedIds,
        candidateUserId,
      });
      setChemistryResult(result.analysis);
    } catch {
      setChemistryResult(MOCK_CHEMISTRY_ANALYSIS);
    } finally {
      setChemistryLoading(null);
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
    chemistryResult,
    clearChemistryResult: () => setChemistryResult(null),
  };
}
