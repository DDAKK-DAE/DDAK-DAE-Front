import { ReelFeedPage } from '@/features/reel/presentation/ReelFeedPage';

interface Props {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ type?: string }>;
}

export default async function ChallengeReelsPage({ params, searchParams }: Props) {
  const { id } = await params;
  const { type } = await searchParams;
  const reelType = type === 'completion' ? 'completion' : type === 'recruitment' ? 'recruitment' : undefined;
  return <ReelFeedPage challengeId={id} type={reelType} />;
}
