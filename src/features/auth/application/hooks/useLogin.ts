'use client';

import { useState } from 'react';

import { useRouter } from 'next/navigation';

import { loginApi } from '@/api/endpoints/auth';
import { useAuth } from '@/features/auth/application/store/AuthContext';

const MOCK_EMAIL = 'test@ddak.com';
const MOCK_PASSWORD = 'password123';
const MOCK_TOKEN = 'mock-token';

export function useLogin() {
  const router = useRouter();
  const { signIn } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async (email: string, password: string) => {
    setError(null);
    setIsLoading(true);
    try {
      // 목 계정 — 백엔드 없이 로컬 테스트용
      if (email === MOCK_EMAIL && password === MOCK_PASSWORD) {
        await signIn(MOCK_TOKEN);
        router.push('/feed');
        return;
      }
      const { token } = await loginApi({ email, password });
      await signIn(token);
      router.push('/feed');
    } catch (err) {
      const apiError =
        err &&
        typeof err === 'object' &&
        'response' in err
          ? (err as { response?: { data?: { error?: string } } }).response?.data?.error
          : undefined;
      setError(apiError ?? '이메일 또는 비밀번호를 확인해주세요.');
    } finally {
      setIsLoading(false);
    }
  };

  const clearError = () => setError(null);

  return { handleLogin, isLoading, error, clearError };
}
