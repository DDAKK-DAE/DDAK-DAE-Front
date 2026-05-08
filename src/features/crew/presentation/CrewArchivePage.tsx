'use client';

import { useCrewDetail } from '../application/useCrewDetail';
import { ReelFeedPage } from '@/features/reel/presentation/ReelFeedPage';

interface CrewArchivePageProps {
  crewId: string;
}

export function CrewArchivePage({ crewId }: CrewArchivePageProps) {
  const { crew, isLoading } = useCrewDetail(crewId);

  if (isLoading || !crew) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-black">
        <div className="text-white/60 text-sm">불러오는 중...</div>
      </div>
    );
  }

  return (
    <ReelFeedPage
      challengeId={crew.challenge.id}
      challengeTitle={crew.challenge.title}
      type="completion"
    />
  );
}
