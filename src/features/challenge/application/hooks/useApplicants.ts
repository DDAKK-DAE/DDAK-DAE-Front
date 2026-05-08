'use client';

import { useState, useEffect, useCallback } from 'react';
import {
  getApplicantsApi,
  acceptParticipationApi,
  rejectParticipationApi,
} from '@/api/endpoints/participations';
import type { ApplicantDetail } from '@/features/challenge/domain/entities/Challenge';

const MOCK_APPLICANTS: ApplicantDetail[] = [
  {
    participation_id: 'p1',
    user: { id: 'u1', email: 'a@a.com', nickname: '댄서김민준', job: '댄서', bio: '춤추는 게 세상에서 제일 좋아요' },
    intro_message: '아이브 팬이에요! 같이 찍고 싶어요 🙌',
    status: 'pending',
    participation_history: { total_count: 5, categories: ['댄스', '일상'] },
  },
  {
    participation_id: 'p2',
    user: { id: 'u2', email: 'b@b.com', nickname: '이수진', job: '대학생' },
    intro_message: '챌린지 처음 도전해봐요!',
    status: 'pending',
    participation_history: { total_count: 1, categories: ['댄스'] },
  },
  {
    participation_id: 'p3',
    user: { id: 'u3', email: 'c@c.com', nickname: '박지훈크루', job: '유튜버', bio: '크루 챌린지 전문' },
    status: 'accepted',
    participation_history: { total_count: 12, categories: ['댄스', '스포츠', '일상'] },
  },
  {
    participation_id: 'p4',
    user: { id: 'u4', email: 'd@d.com', nickname: '최예린', job: '직장인' },
    intro_message: '퇴근 후 취미로 댄스 배우고 있어요',
    status: 'rejected',
    participation_history: { total_count: 3, categories: ['댄스', '푸드'] },
  },
];

export function useApplicants(challengeId: string) {
  const [applicants, setApplicants] = useState<ApplicantDetail[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  useEffect(() => {
    async function fetchApplicants() {
      try {
        setIsLoading(true);
        if (!process.env.NEXT_PUBLIC_API_BASE_URL) throw new Error('no api url');
        const data = await getApplicantsApi(challengeId);
        setApplicants(data);
      } catch {
        setApplicants(MOCK_APPLICANTS);
      } finally {
        setIsLoading(false);
      }
    }

    fetchApplicants();
  }, [challengeId]);

  const accept = useCallback(async (participationId: string) => {
    setActionLoading(participationId);
    try {
      if (!process.env.NEXT_PUBLIC_API_BASE_URL) {
        await new Promise((r) => setTimeout(r, 400));
      } else {
        await acceptParticipationApi(participationId);
      }
      setApplicants((prev) =>
        prev.map((a) =>
          a.participation_id === participationId ? { ...a, status: 'accepted' } : a,
        ),
      );
    } finally {
      setActionLoading(null);
    }
  }, []);

  const reject = useCallback(async (participationId: string) => {
    setActionLoading(participationId);
    try {
      if (!process.env.NEXT_PUBLIC_API_BASE_URL) {
        await new Promise((r) => setTimeout(r, 400));
      } else {
        await rejectParticipationApi(participationId);
      }
      setApplicants((prev) =>
        prev.map((a) =>
          a.participation_id === participationId ? { ...a, status: 'rejected' } : a,
        ),
      );
    } finally {
      setActionLoading(null);
    }
  }, []);

  const pendingCount = applicants.filter((a) => a.status === 'pending').length;
  const acceptedCount = applicants.filter((a) => a.status === 'accepted').length;

  return { applicants, isLoading, actionLoading, accept, reject, pendingCount, acceptedCount };
}
