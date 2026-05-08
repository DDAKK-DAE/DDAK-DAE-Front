'use client';

import { useState } from 'react';

import { useRouter } from 'next/navigation';

import { loginApi } from '@/api/endpoints/auth';
import { useAuth } from '@/features/auth/application/store/AuthContext';

export function useLogin() {
  const router = useRouter();
  const { signIn } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async (email: string, password: string) => {
    setError(null);
    setIsLoading(true);
    try {
      const { token } = await loginApi({ email, password });
      await signIn(token);
      router.push('/feed');
    } catch (err) {
      setError(err instanceof Error ? err.message : '이메일 또는 비밀번호를 확인해주세요.');
    } finally {
      setIsLoading(false);
    }
  };

  const clearError = () => setError(null);

  return { handleLogin, isLoading, error, clearError };
}
