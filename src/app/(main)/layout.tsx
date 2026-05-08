import { BottomTabBar } from '@/shared/components/layout/BottomTabBar';

export default function MainLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-dvh flex-col overflow-hidden bg-background">
      <main className="flex-1 overflow-hidden">{children}</main>
      <BottomTabBar />
    </div>
  );
}
