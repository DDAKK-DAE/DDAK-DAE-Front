import { FeedPage } from '@/features/challenge/presentation/components/FeedPage';

export const metadata = { title: '완성 릴스' };

export default function ReelsRoute() {
  return <FeedPage reelType="completion" />;
}
