import type { ReactNode } from 'react';

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="relative min-h-dvh overflow-hidden bg-background flex items-center justify-center px-4 py-12">
      {/* Light Theme Ambient Glow Blobs */}
      <div className="pointer-events-none absolute -top-48 -right-24 h-[600px] w-[600px] rounded-full bg-primary/15 blur-[100px] animate-float" />
      <div className="pointer-events-none absolute -bottom-32 -left-24 h-[500px] w-[500px] rounded-full bg-primary/10 blur-[90px] animate-float" style={{ animationDelay: '1s' }} />
      <div className="pointer-events-none absolute left-1/3 top-1/3 h-[700px] w-[700px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-accent/5 blur-[120px] animate-float" style={{ animationDelay: '2s' }} />
      <div className="pointer-events-none absolute right-1/4 bottom-1/4 h-64 w-64 rounded-full bg-warning/5 blur-[80px]" />

      <div className="relative z-10 w-full flex justify-center">
        {children}
      </div>
    </div>
  );
}
