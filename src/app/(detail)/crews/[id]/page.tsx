import { CrewDetailPage } from '@/features/crew/presentation/CrewDetailPage';

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function CrewDetailRoute({ params }: PageProps) {
  const { id } = await params;
  return <CrewDetailPage crewId={id} />;
}
