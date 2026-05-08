// src/api/endpoints/reels.ts
// Reels API 엔드포인트 — api_spec.md Reels 섹션 기준
import { apiClient } from '../client';
import type { ApiResponse } from '@/shared/types/api';
import type { PaginationParams } from '@/shared/types/pagination';
import type { Reel, ReelFeedResponse } from '@/features/reel/domain/entities/Reel';

// ==========================================
// Request 타입 정의
// ==========================================

export interface UploadReelRequest {
  challenge_id: string;
  crew_id?: string; // null이면 모집용, 값 있으면 완료용 릴스
  video_url: string;
}

export interface GetChallengeReelsParams extends PaginationParams {
  type?: 'recruitment' | 'completion'; // 생략 시 전체
}

// ==========================================
// API 함수
// ==========================================

/** POST /reels — 릴스 업로드 */
export async function uploadReelApi(request: UploadReelRequest): Promise<Reel> {
  const response = await apiClient.post<ApiResponse<Reel>>('/reels', request);
  return response.data.data;
}

/**
 * GET /challenges/:id/reels — 챌린지별 릴스 피드 (음원 통일 몰아보기)
 * 응답에 챌린지 audio_url 포함 → 프론트에서 이 음원으로 통일 재생
 */
export async function getChallengeReelsApi(
  challengeId: string,
  params?: GetChallengeReelsParams,
): Promise<ReelFeedResponse> {
  const response = await apiClient.get<ApiResponse<ReelFeedResponse>>(
    `/challenges/${challengeId}/reels`,
    { params },
  );
  return response.data.data;
}

/** GET /users/:id/reels — 사용자 릴스 이력 조회 (마이페이지) */
export async function getUserReelsApi(userId: string): Promise<Reel[]> {
  const response = await apiClient.get<ApiResponse<Reel[]>>(`/users/${userId}/reels`);
  return response.data.data;
}
