// src/api/client.ts
// Axios 클라이언트 — 스타일 가이드 Section 4 (Axios 클라이언트)
// Request Interceptor: JWT 자동 주입
// Response Interceptor: 401 자동 로그아웃

import axios, {
  type AxiosInstance,
  type InternalAxiosRequestConfig,
  type AxiosResponse,
  type AxiosError,
} from 'axios';

// Spring Boot 메인 API 서버
export const apiClient: AxiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL ?? 'http://localhost:8080',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// 파일 업로드 전용 클라이언트 — 영상 200MB 허용 위해 timeout 60초
export const uploadClient: AxiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL ?? 'http://localhost:8080',
  timeout: 60000,
});

// FastAPI AI 서버 (별도 baseURL — api_spec.md AI 섹션)
export const aiApiClient: AxiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_AI_API_BASE_URL ?? 'http://localhost:8000',
  timeout: 5000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// ==========================================
// Request Interceptor — JWT 자동 주입
// 스타일 가이드 Section 4: "자동으로 Authorization 헤더에 토큰(JWT)을 주입"
// ==========================================
function applyRequestInterceptor(client: AxiosInstance): void {
  client.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
      // localStorage는 클라이언트 사이드에서만 접근 가능
      if (typeof window !== 'undefined') {
        const token = localStorage.getItem('accessToken');
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
      }
      return config;
    },
    (error: AxiosError) => Promise.reject(error),
  );
}

// ==========================================
// Response Interceptor — 401 자동 로그아웃
// 스타일 가이드 Section 4: "토큰 만료(401) 시 자동 로그아웃 처리"
// ==========================================
function applyResponseInterceptor(client: AxiosInstance): void {
  client.interceptors.response.use(
    (response: AxiosResponse) => response,
    (error: AxiosError) => {
      if (
        error.response?.status === 401 &&
        typeof window !== 'undefined' &&
        window.location.pathname !== '/login'
      ) {
        localStorage.removeItem('accessToken');
        window.location.href = '/login';
      }
      return Promise.reject(error);
    },
  );
}

applyRequestInterceptor(apiClient);
applyRequestInterceptor(uploadClient);
applyRequestInterceptor(aiApiClient);
applyResponseInterceptor(apiClient);
applyResponseInterceptor(uploadClient);
applyResponseInterceptor(aiApiClient);
