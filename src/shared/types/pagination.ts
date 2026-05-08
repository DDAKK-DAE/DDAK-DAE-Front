// src/shared/types/pagination.ts
// 페이지네이션 공통 타입 — api_spec.md (?page=1&size=20)

/**
 * 페이지네이션 쿼리 파라미터
 */
export interface PaginationParams {
  page?: number;
  size?: number;
}

/**
 * 페이지네이션 목록 응답 래퍼
 */
export interface PaginatedResponse<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  currentPage: number;
  size: number;
  hasNext: boolean;
}
