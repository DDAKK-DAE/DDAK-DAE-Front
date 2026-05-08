import { ApplicantsPage } from '@/features/challenge/presentation/components/ApplicantsPage';

interface Props {
  params: Promise<{ id: string }>;
}

export default async function ChallengeApplicantsPage({ params }: Props) {
  const { id } = await params;
  return <ApplicantsPage challengeId={id} />;
}
