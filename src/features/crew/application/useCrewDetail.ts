'use client';

import { useState, useEffect } from 'react';
import { getCrewApi } from '@/api/endpoints/crews';
import { getCrewRecommendationsApi } from '@/api/endpoints/ai';
import type { CrewDetail } from '@/features/crew/domain/entities/Crew';
import type { CrewRecommendation } from '@/api/endpoints/ai';

const MOCK_CREW: CrewDetail = {
  id: 'c1',
  challenge: {
    id: 'ch1',
    title: '장원영 챌린지 같이 찍어요 ✨',
    description: '함께 영상 찍고 업로드해요!',
    category: '댄스',
    location_text: '서울 홍대',
    max_participants: 6,
    current_participants: 4,
    host: { id: 'u1', nickname: '김세현' },
    status: 'open',
    deadline_at: new Date(Date.now() + 7 * 24 * 3600000).toISOString(),
    created_at: new Date().toISOString(),
    hashtags: ['댄스', '챌린지'],
  },
  members: [
    { user: { id: 'u1', email: 'u1@ddak.com', nickname: '김세현' }, joined_at: new Date().toISOString() },
    { user: { id: 'u2', email: 'u2@ddak.com', nickname: '이지은' }, joined_at: new Date().toISOString() },
    { user: { id: 'u3', email: 'u3@ddak.com', nickname: '박민준' }, joined_at: new Date().toISOString() },
    { user: { id: 'u4', email: 'u4@ddak.com', nickname: '최수아' }, joined_at: new Date().toISOString() },
  ],
  created_at: new Date().toISOString(),
  archiveReels: [],
};

const MOCK_RECOMMENDATIONS: CrewRecommendation[] = [
  { challenge_id: 'ch2', title: '한강 피크닉 브이로그 🌅', reason: '야외 활동을 즐기는 멤버들이 많아요!' },
  { challenge_id: 'ch3', title: '카페 투어 챌린지 ☕', reason: '서울 카페를 함께 탐방해요' },
];

export function useCrewDetail(crewId: string) {
  const [crew, setCrew] = useState<CrewDetail | null>(null);
  const [recommendations, setRecommendations] = useState<CrewRecommendation[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchCrew() {
      try {
        setIsLoading(true);
        if (!process.env.NEXT_PUBLIC_API_BASE_URL) throw new Error('no api url');
        const [crewData, recData] = await Promise.all([
          getCrewApi(crewId),
          getCrewRecommendationsApi(crewId),
        ]);
        setCrew(crewData);
        setRecommendations(recData.recommendations);
      } catch {
        setCrew(MOCK_CREW);
        setRecommendations(MOCK_RECOMMENDATIONS);
      } finally {
        setIsLoading(false);
      }
    }

    fetchCrew();
  }, [crewId]);

  return { crew, recommendations, isLoading };
}
