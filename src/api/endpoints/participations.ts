// src/api/endpoints/participations.ts
// Participations API 엔드포인트 — api_spec.md Participations 섹션 기준
import { apiClient } from '../client';
import type { ApiResponse } from '@/shared/types/api';
import type { Participation, ApplicantDetail } from '@/features/challenge/domain/entities/Challenge';

// ==========================================
// Request 타입 정의
// ==========================================

export interface ApplyChallengeRequest {
  intro_message?: string; // 한 줄 자기소개
}

// ==========================================
// API 함수
// ==========================================

/** POST /challenges/:id/apply — 챌린지 참여 신청 */
export async function applyChallengeApi(
  challengeId: string,
  request: ApplyChallengeRequest,
): Promise<Participation> {
  const response = await apiClient.post<ApiResponse<Participation>>(
    `/challenges/${challengeId}/apply`,
    request,
  );
  return response.data.data;
}

/** GET /challenges/:id/applicants — 신청자 목록 조회 (주최자만) */
export async function getApplicantsApi(challengeId: string): Promise<ApplicantDetail[]> {
  const response = await apiClient.get<ApiResponse<ApplicantDetail[]>>(
    `/challenges/${challengeId}/applicants`,
  );
  return response.data.data;
}

/** PATCH /participations/:id/accept — 신청 수락 (주최자만) */
export async function acceptParticipationApi(participationId: string): Promise<Participation> {
  const response = await apiClient.patch<ApiResponse<Participation>>(
    `/participations/${participationId}/accept`,
  );
  return response.data.data;
}

/** PATCH /participations/:id/reject — 신청 거절 (주최자만) */
export async function rejectParticipationApi(participationId: string): Promise<Participation> {
  const response = await apiClient.patch<ApiResponse<Participation>>(
    `/participations/${participationId}/reject`,
  );
  return response.data.data;
}
