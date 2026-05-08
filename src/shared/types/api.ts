import type { User } from '@/features/auth/domain/entities/User';

export interface ApiSuccess<T> {
  success: true;
  data: T;
}

export interface ApiFailure {
  success: false;
  message: string;
  errorCode: string;
}

export type ApiResponse<T> = ApiSuccess<T> | ApiFailure;

export interface TokenResponse {
  token: string;
  user: User;
}
