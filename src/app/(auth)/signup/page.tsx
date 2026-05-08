import type { Metadata } from 'next';

import { SignupForm } from '@/features/auth/presentation/components/SignupForm';

export const metadata: Metadata = { title: '회원가입' };

export default function SignupPage() {
  return <SignupForm />;
}
