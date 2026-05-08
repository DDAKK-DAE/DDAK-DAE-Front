'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getChallengesApi } from '@/api/endpoints/challenges';
import type { Challenge, ChallengeCategory } from '@/features/challenge/domain/entities/Challenge';

export function useFeed() {
  const [activeCategory, setActiveCategory] = useState<ChallengeCategory | null>(null);

  const { data, isLoading } = useQuery({
    queryKey: ['challenges', activeCategory],
    queryFn: () => getChallengesApi(activeCategory ? { category: activeCategory } : undefined),
  });

  const challenges: Challenge[] = data?.content ?? [];

  return { challenges, activeCategory, setActiveCategory, isLoading };
}
