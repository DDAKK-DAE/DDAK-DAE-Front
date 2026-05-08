'use client';

import { useState, useEffect } from 'react';
import { getMyCrewsApi } from '@/api/endpoints/crews';
import type { CrewSummary } from '@/features/crew/domain/entities/Crew';

const MOCK_CREWS: CrewSummary[] = [
  {
    crew_id: 'c1',
    challenge_title: '장원영 챌린지 같이 찍어요 ✨',
    member_count: 4,
    last_activity_at: new Date().toISOString(),
  },
  {
    crew_id: 'c2',
    challenge_title: '한강 피크닉 일상 브이로그 🌅',
    member_count: 3,
    last_activity_at: new Date(Date.now() - 3600000).toISOString(),
  },
];

export function useMyCrews() {
  const [crews, setCrews] = useState<CrewSummary[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchCrews() {
      try {
        setIsLoading(true);
        if (!process.env.NEXT_PUBLIC_API_BASE_URL) throw new Error('no api url');
        const data = await getMyCrewsApi();
        setCrews(data ?? []);
      } catch {
        setCrews(MOCK_CREWS);
      } finally {
        setIsLoading(false);
      }
    }

    fetchCrews();
  }, []);

  return { crews, isLoading };
}