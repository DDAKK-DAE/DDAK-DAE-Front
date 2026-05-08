// src/shared/types/api.ts
// API 응답 공통 타입 — api_spec.md 공통 응답 형식 기준
// 스타일 가이드 Section 4의 ApiResponse 예시(success/trace_id 포함)와 다르며,
// 실제 백엔드 명세(api_spec.md)를 우선 따름.

/**
 * 백엔드 공통 응답 래퍼
 * 성공: { "data": ... }
 * 에러: { "error": "메시지" }
 */
export interface ApiResponse<T> {
  data: T;
  error: string | null;
}

/**
 * API 에러 응답
 */
export interface ApiError {
  error: string;
}

/**
 * JWT 토큰 응답 (로그인/회원가입 공통)
 */
export interface TokenResponse {
  token: string;
}
