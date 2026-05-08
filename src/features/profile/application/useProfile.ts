'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/features/auth/application/store/AuthContext';
import { getMyCrewsApi } from '@/api/endpoints/crews';
import { getChallengesApi } from '@/api/endpoints/challenges';
import type { CrewSummary } from '@/features/crew/domain/entities/Crew';
import type { Challenge } from '@/features/challenge/domain/entities/Challenge';

const MOCK_CREWS: CrewSummary[] = [
  { crew_id: 'c1', challenge_title: '장원영 챌린지 같이 찍어요 ✨', member_count: 4, last_activity_at: new Date().toISOString() },
  { crew_id: 'c2', challenge_title: '한강 피크닉 일상 브이로그 🌅', member_count: 3, last_activity_at: new Date(Date.now() - 3600000).toISOString() },
];

const MOCK_MY_CHALLENGES: Challenge[] = [
  {
    id: 'ch10',
    title: '성수동 카페 탐방 먹방 🍰',
    category: '푸드',
    location_text: '서울 성수동',
    max_participants: 4,
    current_participants: 2,
    status: 'open',
    host: { id: 'mock-1', nickname: '딱대유저' },
    deadline_at: new Date(Date.now() + 5 * 86400000).toISOString(),
    created_at: new Date(Date.now() - 2 * 86400000).toISOString(),
  },
];

export function useProfile() {
  const { currentUser, signOut } = useAuth();
  const [crews, setCrews] = useState<CrewSummary[]>([]);
  const [myChallenges, setMyChallenges] = useState<Challenge[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      setIsLoading(true);
      try {
        if (!process.env.NEXT_PUBLIC_API_BASE_URL) throw new Error('no api url');
        const [crewData, challengeData] = await Promise.all([
          getMyCrewsApi(),
          getChallengesApi(),
        ]);
        setCrews(crewData ?? []);
        setMyChallenges(challengeData.filter((c) => c.host.id === currentUser?.id));
      } catch {
        setCrews(MOCK_CREWS);
        setMyChallenges(MOCK_MY_CHALLENGES);
      } finally {
        setIsLoading(false);
      }
    }

    fetchData();
  }, [currentUser?.id]);

  return { currentUser, crews, myChallenges, isLoading, signOut };
}
