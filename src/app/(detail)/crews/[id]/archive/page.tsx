import { CrewArchivePage } from '@/features/crew/presentation/CrewArchivePage';

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function CrewArchiveRoute({ params }: PageProps) {
  const { id } = await params;
  return <CrewArchivePage crewId={id} />;
}
