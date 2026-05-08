import type { ReactNode } from 'react';

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="relative min-h-dvh overflow-hidden bg-background flex items-center justify-center px-4 py-12">
      {/* Ambient glow blobs */}
      <div className="pointer-events-none absolute -top-48 -right-24 h-[480px] w-[480px] rounded-full bg-primary/10 blur-[96px]" />
      <div className="pointer-events-none absolute -bottom-32 -left-24 h-[380px] w-[380px] rounded-full bg-primary/8 blur-[80px]" />
      <div className="pointer-events-none absolute left-1/2 top-1/2 h-[600px] w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/5 blur-[120px]" />
      <div className="pointer-events-none absolute right-1/4 top-1/4 h-48 w-48 rounded-full bg-accent/6 blur-[60px]" />

      <div className="relative z-10 w-full flex justify-center">
        {children}
      </div>
    </div>
  );
}
