import type { Metadata } from 'next';
import { Geist, Geist_Mono, Noto_Sans_KR } from 'next/font/google';

import { AuthProvider } from '@/features/auth/application/store/AuthContext';
import { QueryProvider } from '@/shared/components/providers/QueryProvider';
import './globals.css';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

const notoSansKr = Noto_Sans_KR({
  variable: '--font-noto-sans-kr',
  subsets: ['latin'],
  weight: ['400', '500', '700'],
});

export const metadata: Metadata = {
  title: {
    default: '딱대 | 숏폼 챌린지 크루 모집',
    template: '%s | 딱대',
  },
  description: '숏폼 챌린지를 같이 찍을 크루를 찾아보세요. 장원영 챌린지, 댄스 챌린지 등 다양한 챌린지 크루를 모집합니다.',
  keywords: ['숏폼', '챌린지', '크루', '릴스', '틱톡', '모임'],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="ko"
      className={`${geistSans.variable} ${geistMono.variable} ${notoSansKr.variable}`}
    >
      <body>
        <QueryProvider>
          <AuthProvider>{children}</AuthProvider>
        </QueryProvider>
      </body>
    </html>
  );
}

