'use client';

import { useQuery } from '@tanstack/react-query';
import { getCrewApi, getCrewArchiveApi } from '@/api/endpoints/crews';
import { getCrewRecommendationsApi } from '@/api/endpoints/ai';
import type { CrewDetail, CrewArchiveReel } from '@/features/crew/domain/entities/Crew';
import type { CrewRecommendation } from '@/api/endpoints/ai';

export function useCrewDetail(crewId: string) {
  const { data: crew, isLoading: isCrewLoading } = useQuery<CrewDetail>({
    queryKey: ['crew', crewId],
    queryFn: () => getCrewApi(crewId),
    enabled: !!crewId,
  });

  const { data: archiveReels = [], isLoading: isArchiveLoading } = useQuery<CrewArchiveReel[]>({
    queryKey: ['crew-archive', crewId],
    queryFn: () => getCrewArchiveApi(crewId),
    enabled: !!crewId,
  });

  const { data: recommendationsData } = useQuery<{ recommendations: CrewRecommendation[] }>({
    queryKey: ['crew-recommendations', crewId],
    queryFn: () => getCrewRecommendationsApi(crewId),
    enabled: !!crewId,
    // AI 미구현 — 실패해도 빈 배열로
    throwOnError: false,
    retry: false,
  });

  const isLoading = isCrewLoading || isArchiveLoading;
  const recommendations: CrewRecommendation[] = recommendationsData?.recommendations ?? [];

  return { crew: crew ?? null, recommendations, archiveReels, isLoading };
}
