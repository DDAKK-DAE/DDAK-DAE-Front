import { apiClient } from '../client';
import type { ApiResponse, TokenResponse } from '@/shared/types/api';
import type { User } from '@/features/auth/domain/entities/User';

export interface SignupRequest {
  email: string;
  password: string;
  nickname: string;
  name?: string;
  birthday?: string;
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

/** POST /auth/signup */
export async function signupApi(request: SignupRequest): Promise<TokenResponse> {
  const response = await apiClient.post<ApiResponse<TokenResponse>>('/auth/signup', request);
  const result = response.data;
  if (!result.success) throw new Error(result.message);
  return result.data;
}

/** POST /auth/login */
export async function loginApi(request: LoginRequest): Promise<TokenResponse> {
  const response = await apiClient.post<ApiResponse<TokenResponse>>('/auth/login', request);
  const result = response.data;
  if (!result.success) throw new Error(result.message);
  return result.data;
}

/** GET /auth/me */
export async function getMeApi(): Promise<User> {
  const response = await apiClient.get<ApiResponse<User>>('/auth/me');
  const result = response.data;
  if (!result.success) throw new Error(result.message);
  return result.data;
}

/** PATCH /auth/me */
export async function updateMeApi(request: UpdateProfileRequest): Promise<User> {
  const response = await apiClient.patch<ApiResponse<User>>('/auth/me', request);
  const result = response.data;
  if (!result.success) throw new Error(result.message);
  return result.data;
}
