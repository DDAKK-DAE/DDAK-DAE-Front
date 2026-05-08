'use client';

import { useState } from 'react';

import { useRouter } from 'next/navigation';

import { signupApi, type SignupRequest } from '@/api/endpoints/auth';
import { useAuth } from '@/features/auth/application/store/AuthContext';

export function useSignup() {
  const router = useRouter();
  const { signIn } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSignup = async (data: SignupRequest) => {
    setError(null);
    setIsLoading(true);
    try {
      const { token } = await signupApi(data);
      await signIn(token);
      router.push('/');
    } catch (err) {
      const apiError =
        err &&
        typeof err === 'object' &&
        'response' in err
          ? (err as { response?: { data?: { error?: string } } }).response?.data?.error
          : undefined;
      setError(apiError ?? '회원가입에 실패했어요. 다시 시도해주세요.');
    } finally {
      setIsLoading(false);
    }
  };

  const clearError = () => setError(null);

  return { handleSignup, isLoading, error, clearError };
}
