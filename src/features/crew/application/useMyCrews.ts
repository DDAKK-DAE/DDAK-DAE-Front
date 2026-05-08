'use client';

import { useQuery } from '@tanstack/react-query';
import { getMyCrewsApi } from '@/api/endpoints/crews';
import type { CrewSummary } from '@/features/crew/domain/entities/Crew';

export function useMyCrews() {
  const { data, isLoading } = useQuery<CrewSummary[]>({
    queryKey: ['my-crews'],
    queryFn: getMyCrewsApi,
  });

  return { crews: data ?? [], isLoading };
}
