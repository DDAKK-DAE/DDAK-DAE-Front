import { UploadReelPage } from '@/features/reel/presentation/UploadReelPage';

interface Props {
  params: Promise<{ id: string }>;
}

export default async function ChallengeUploadPage({ params }: Props) {
  const { id } = await params;
  return <UploadReelPage challengeId={id} />;
}
