'use client';

import { useState, useEffect, useCallback } from 'react';
import { getChallengeByIdApi } from '@/api/endpoints/challenges';
import { applyChallengeApi } from '@/api/endpoints/participations';
import type { ChallengeDetail } from '@/features/challenge/domain/entities/Challenge';

const MOCK_DETAIL: ChallengeDetail = {
  id: 'ch1',
  title: '장원영 챌린지 같이 찍어요 ✨',
  description: '아이브 장원영의 최신 댄스 챌린지를 함께 찍을 크루원을 모집합니다. 홍대 야외 공간에서 촬영 예정이에요!',
  category: '댄스',
  location_text: '서울 홍대',
  max_participants: 6,
  current_participants: 4,
  status: 'open',
  host: { id: 'u0', nickname: '크루장김' },
  deadline_at: new Date(Date.now() + 3 * 24 * 3600000).toISOString(),
  created_at: new Date(Date.now() - 2 * 24 * 3600000).toISOString(),
  hashtags: ['아이브', '댄스챌린지', '홍대'],
  recruitment_reel_url: undefined,
  recruitment_reels: [],
  completion_reels: [],
};

export function useChallengeDetail(challengeId: string) {
  const [challenge, setChallenge] = useState<ChallengeDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isApplying, setIsApplying] = useState(false);
  const [applySuccess, setApplySuccess] = useState(false);
  const [applyError, setApplyError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchChallenge() {
      try {
        setIsLoading(true);
        if (!process.env.NEXT_PUBLIC_API_BASE_URL) throw new Error('no api url');
        const data = await getChallengeByIdApi(challengeId);
        setChallenge(data);
      } catch {
        setChallenge(MOCK_DETAIL);
      } finally {
        setIsLoading(false);
      }
    }

    fetchChallenge();
  }, [challengeId]);

  const applyChallenge = useCallback(async (introMessage?: string) => {
    setIsApplying(true);
    setApplyError(null);
    try {
      if (!process.env.NEXT_PUBLIC_API_BASE_URL) {
        await new Promise((r) => setTimeout(r, 600));
        setApplySuccess(true);
        return;
      }
      await applyChallengeApi(challengeId, { intro_message: introMessage });
      setApplySuccess(true);
    } catch {
      setApplyError('신청 중 오류가 발생했어요. 다시 시도해주세요.');
    } finally {
      setIsApplying(false);
    }
  }, [challengeId]);

  return { challenge, isLoading, isApplying, applySuccess, applyError, applyChallenge };
}
