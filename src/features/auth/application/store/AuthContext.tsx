'use client';

import { createContext, useCallback, useContext, useEffect, useState } from 'react';

import { getMeApi } from '@/api/endpoints/auth';
import type { User } from '@/features/auth/domain/entities/User';

const MOCK_TOKEN = 'mock-token';
const MOCK_USER: User = {
  id: 'mock-1',
  email: 'test@ddak.com',
  nickname: '딱대유저',
  bio: '테스트 계정이에요 🎬',
  job: '개발자',
};

interface AuthContextValue {
  currentUser: User | null;
  isLoading: boolean;
  signIn: (token: string) => Promise<void>;
  signOut: () => void;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

interface AuthProviderProps {
  children: React.ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const loadUser = useCallback(async () => {
    setIsLoading(true);
    try {
      const token = localStorage.getItem('accessToken');
      // 목 토큰이면 API 없이 목 유저 반환
      if (token === MOCK_TOKEN) {
        setCurrentUser(MOCK_USER);
        return;
      }
      const user = await getMeApi();
      setCurrentUser(user);
    } catch {
      setCurrentUser(null);
      localStorage.removeItem('accessToken');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    if (!token) {
      setIsLoading(false);
      return;
    }
    void loadUser();
  }, [loadUser]);

  const signIn = useCallback(
    async (token: string) => {
      localStorage.setItem('accessToken', token);
      await loadUser();
    },
    [loadUser],
  );

  const signOut = useCallback(() => {
    localStorage.removeItem('accessToken');
    setCurrentUser(null);
  }, []);

  const refreshUser = useCallback(async () => {
    await loadUser();
  }, [loadUser]);

  return (
    <AuthContext.Provider value={{ currentUser, isLoading, signIn, signOut, refreshUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth는 AuthProvider 내부에서만 사용할 수 있습니다.');
  }
  return context;
}
