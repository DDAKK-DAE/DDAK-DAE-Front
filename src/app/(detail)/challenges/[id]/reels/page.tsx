import { ReelFeedPage } from '@/features/reel/presentation/ReelFeedPage';

interface Props {
  params: Promise<{ id: string }>;
}

export default async function ChallengeReelsPage({ params }: Props) {
  const { id } = await params;
  return <ReelFeedPage challengeId={id} />;
}
