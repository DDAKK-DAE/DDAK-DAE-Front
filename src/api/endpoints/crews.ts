// src/api/endpoints/crews.ts
// Crews & Crew Messages API 엔드포인트 — api_spec.md Crews/Crew Messages 섹션 기준
import { apiClient } from '../client';
import type { ApiResponse } from '@/shared/types/api';
import type {
  CrewDetail,
  CrewMessage,
  CrewSummary,
} from '@/features/crew/domain/entities/Crew';


// ==========================================
// Request 타입 정의
// ==========================================

export interface GetMessagesParams {
  after?: string; // ISO datetime — 이 시각 이후 메시지만 (폴링용)
}

export interface SendMessageRequest {
  content: string;
}

// ==========================================
// Crews API 함수
// ==========================================

/** GET /crews/:id — 크루 상세 조회 (크루 멤버만) */
export async function getCrewApi(crewId: string): Promise<CrewDetail> {
  const response = await apiClient.get<ApiResponse<CrewDetail>>(`/crews/${crewId}`);
  return response.data.data;
}

/** GET /crews/:id/archive — 크루 릴스 아카이브 조회 */
export async function getCrewArchiveApi(crewId: string): Promise<CrewDetail['archiveReels']> {
  const response = await apiClient.get<ApiResponse<CrewDetail['archiveReels']>>(
    `/crews/${crewId}/archive`,
  );
  return response.data.data;
}

/** GET /crews/me — 내가 속한 크루 목록 조회 */
export async function getMyCrewsApi(): Promise<CrewSummary[]> {
  const response = await apiClient.get<ApiResponse<CrewSummary[]>>('/crews/me');
  return response.data.data;
}

// ==========================================
// Crew Messages API 함수 (폴링 방식 — api_spec.md)
// ==========================================

/**
 * GET /crews/:id/messages — 크루 채팅 메시지 조회 (5초 간격 폴링용)
 * @param after - 마지막 메시지 시각(ISO datetime). 이후 메시지만 반환
 */
export async function getCrewMessagesApi(
  crewId: string,
  params?: GetMessagesParams,
): Promise<CrewMessage[]> {
  const response = await apiClient.get<ApiResponse<CrewMessage[]>>(
    `/crews/${crewId}/messages`,
    { params },
  );
  return response.data.data;
}

/** POST /crews/:id/messages — 메시지 전송 */
export async function sendCrewMessageApi(
  crewId: string,
  request: SendMessageRequest,
): Promise<CrewMessage> {
  const response = await apiClient.post<ApiResponse<CrewMessage>>(
    `/crews/${crewId}/messages`,
    request,
  );
  return response.data.data;
}
