import { ChallengeDetailPage } from '@/features/challenge/presentation/components/ChallengeDetailPage';

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function ChallengeDetailRoute({ params }: PageProps) {
  const { id } = await params;
  return <ChallengeDetailPage challengeId={id} />;
}
