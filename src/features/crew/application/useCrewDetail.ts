'use client';

import { useQuery } from '@tanstack/react-query';
import { getCrewApi } from '@/api/endpoints/crews';
import { getCrewRecommendationsApi } from '@/api/endpoints/ai';
import { getChallengesApi } from '@/api/endpoints/challenges';
import type { CrewDetail } from '@/features/crew/domain/entities/Crew';
import type { CrewRecommendation, GetCrewRecommendationsRequest } from '@/api/endpoints/ai';

export function useCrewDetail(crewId: string) {
  const { data: crew, isLoading } = useQuery<CrewDetail>({
    queryKey: ['crew', crewId],
    queryFn: () => getCrewApi(crewId),
    enabled: !!crewId,
  });

  const { data: recommendationsData } = useQuery<{ recommendations: CrewRecommendation[] }>({
    queryKey: ['crew-recommendations', crewId],
    enabled: !!crew,
    throwOnError: false,
    retry: false,
    queryFn: async () => {
      const trendingPage = await getChallengesApi({ size: 20 });
      const trendingChallenges = trendingPage.content.map((c) => ({
        id: c.id,
        title: c.title,
        category: c.category,
        locationText: c.locationText,
        currentParticipants: c.currentParticipants,
        maxParticipants: c.maxParticipants,
      }));
      const crewHistory = crew
        ? [{ category: crew.challenge.category, title: crew.challenge.title }]
        : [];
      const req: GetCrewRecommendationsRequest = { crewId, crewHistory, trendingChallenges };
      return getCrewRecommendationsApi(req);
    },
  });

  const recommendations: CrewRecommendation[] = recommendationsData?.recommendations ?? [];

  return { crew: crew ?? null, recommendations, isLoading };
}
