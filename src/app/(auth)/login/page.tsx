import type { Metadata } from 'next';

import { LoginForm } from '@/features/auth/presentation/components/LoginForm';

export const metadata: Metadata = { title: '로그인' };

export default function LoginPage() {
  return <LoginForm />;
}
