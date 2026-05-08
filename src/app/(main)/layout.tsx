import { BottomTabBar } from '@/shared/components/layout/BottomTabBar';

export default function MainLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-dvh flex-col bg-background">
      <div className="flex-1 min-h-0">{children}</div>
      <BottomTabBar />
    </div>
  );
}
