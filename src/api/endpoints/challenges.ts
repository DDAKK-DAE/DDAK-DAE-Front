// src/api/endpoints/challenges.ts
// Challenges API 엔드포인트 — api_spec.md Challenges 섹션 기준
import { apiClient } from '../client';
import type { ApiResponse } from '@/shared/types/api';
import type { PaginationParams } from '@/shared/types/pagination';
import type { Challenge, ChallengeDetail } from '@/features/challenge/domain/entities/Challenge';
import type { Crew } from '@/features/crew/domain/entities/Crew';

// ==========================================
// Request 타입 정의
// ==========================================

export interface GetChallengesParams extends PaginationParams {
  category?: string;
  location?: string;
}

export interface CreateChallengeRequest {
  title: string;
  description?: string;
  location_text: string;
  category: string;
  max_participants: number; // 2~6
  deadline_at: string; // ISO datetime
  audio_url?: string;
  hashtags?: string[];
}

export type UpdateChallengeRequest = Partial<CreateChallengeRequest>;

// ==========================================
// API 함수
// ==========================================

/** GET /challenges — 챌린지 피드 목록 조회 (AI 개인화 정렬) */
export async function getChallengesApi(params?: GetChallengesParams): Promise<Challenge[]> {
  const response = await apiClient.get<ApiResponse<Challenge[]>>('/challenges', { params });
  return response.data.data;
}

/** GET /challenges/:id — 챌린지 상세 조회 */
export async function getChallengeByIdApi(id: string): Promise<ChallengeDetail> {
  const response = await apiClient.get<ApiResponse<ChallengeDetail>>(`/challenges/${id}`);
  return response.data.data;
}

/** POST /challenges — 챌린지 개설 */
export async function createChallengeApi(request: CreateChallengeRequest): Promise<Challenge> {
  const response = await apiClient.post<ApiResponse<Challenge>>('/challenges', request);
  return response.data.data;
}

/** PATCH /challenges/:id — 챌린지 수정 (주최자만) */
export async function updateChallengeApi(
  id: string,
  request: UpdateChallengeRequest,
): Promise<Challenge> {
  const response = await apiClient.patch<ApiResponse<Challenge>>(`/challenges/${id}`, request);
  return response.data.data;
}

/** DELETE /challenges/:id — 챌린지 삭제 (주최자만, status='open') */
export async function deleteChallengeApi(id: string): Promise<void> {
  await apiClient.delete(`/challenges/${id}`);
}

/** POST /challenges/:id/close — 모집 마감 (주최자만) → 크루 자동 생성 */
export async function closeChallengeApi(id: string): Promise<Crew> {
  const response = await apiClient.post<ApiResponse<Crew>>(`/challenges/${id}/close`);
  return response.data.data;
}
