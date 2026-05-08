// src/features/auth/application/store/AuthContext.tsx
// 전역 인증 상태 관리 — 스타일 가이드 Section 3 (Global State: Context API)
'use client';

import { createContext, useCallback, useContext, useEffect, useState } from 'react';

import { getMeApi } from '@/api/endpoints/auth';
import type { User } from '@/features/auth/domain/entities/User';

// ==========================================
// Context 타입 정의
// ==========================================

interface AuthContextValue {
  /** 현재 로그인한 사용자 (null이면 비로그인) */
  currentUser: User | null;
  /** 로딩 중 여부 */
  isLoading: boolean;
  /** 로그인 처리 (토큰 저장 + 사용자 정보 로드) */
  signIn: (token: string) => Promise<void>;
  /** 로그아웃 처리 */
  signOut: () => void;
  /** 사용자 정보 새로고침 */
  refreshUser: () => Promise<void>;
}

// ==========================================
// Context 생성
// ==========================================

const AuthContext = createContext<AuthContextValue | null>(null);

// ==========================================
// Provider
// ==========================================

interface AuthProviderProps {
  children: React.ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  /** 토큰으로 사용자 정보 로드 */
  const loadUser = useCallback(async () => {
    setIsLoading(true);
    try {
      const user = await getMeApi();
      setCurrentUser(user);
    } catch {
      // 토큰 만료/없음 → 로그아웃 상태
      setCurrentUser(null);
      localStorage.removeItem('accessToken');
    } finally {
      setIsLoading(false);
    }
  }, []);

  /** 앱 마운트 시 기존 토큰으로 자동 로그인 시도 (localStorage 동기화) */
  /* eslint-disable react-hooks/set-state-in-effect */
  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    if (!token) {
      setIsLoading(false);
      return;
    }
    void loadUser();
  }, [loadUser]);
  /* eslint-enable react-hooks/set-state-in-effect */

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

// ==========================================
// Custom Hook
// ==========================================

/**
 * 인증 상태 접근 훅
 * AuthProvider 외부에서 사용 시 에러
 */
export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth는 AuthProvider 내부에서만 사용할 수 있습니다.');
  }
  return context;
}
