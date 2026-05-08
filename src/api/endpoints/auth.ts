// src/api/endpoints/auth.ts
// Auth API 엔드포인트 — api_spec.md Auth 섹션 기준
import { apiClient } from '../client';
import type { ApiResponse, TokenResponse } from '@/shared/types/api';
import type { User } from '@/features/auth/domain/entities/User';

// ==========================================
// Request 타입 정의
// ==========================================

export interface SignupRequest {
  email: string;
  password: string;
  nickname: string;
  name?: string;
  birthday?: string; // 'yyyy-MM-dd'
  age?: number;
  job?: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface UpdateProfileRequest {
  nickname?: string;
  bio?: string;
  profileImage?: string;
  name?: string;
  birthday?: string;
  age?: number;
  job?: string;
}

// ==========================================
// API 함수
// ==========================================

/** POST /auth/signup — 회원가입 */
export async function signupApi(request: SignupRequest): Promise<TokenResponse> {
  const response = await apiClient.post<ApiResponse<TokenResponse>>('/auth/signup', request);
  return response.data.data;
}

/** POST /auth/login — 로그인 */
export async function loginApi(request: LoginRequest): Promise<TokenResponse> {
  const response = await apiClient.post<ApiResponse<TokenResponse>>('/auth/login', request);
  return response.data.data;
}

/** GET /auth/me — 내 프로필 조회 */
export async function getMeApi(): Promise<User> {
  const response = await apiClient.get<ApiResponse<User>>('/auth/me');
  return response.data.data;
}

/** PATCH /auth/me — 프로필 수정 */
export async function updateMeApi(request: UpdateProfileRequest): Promise<User> {
  const response = await apiClient.patch<ApiResponse<User>>('/auth/me', request);
  return response.data.data;
}
