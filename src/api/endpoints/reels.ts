import { apiClient } from '../client';
import type { ApiResponse } from '@/shared/types/api';
import type { Reel, ReelFeedResponse } from '@/features/reel/domain/entities/Reel';

export interface UploadReelRequest {
  challengeId: string;
  crewId?: string | null;
  videoUrl: string;
}

export interface GetChallengeReelsParams {
  type?: 'recruitment' | 'completion';
}

/** POST /reels */
export async function uploadReelApi(request: UploadReelRequest): Promise<Reel> {
  const response = await apiClient.post<ApiResponse<Reel>>('/reels', request);
  const result = response.data;
  if (!result.success) throw new Error(result.message);
  return result.data;
}

/** GET /challenges/:id/reels */
export async function getChallengeReelsApi(
  challengeId: string,
  params?: GetChallengeReelsParams,
): Promise<ReelFeedResponse> {
  const response = await apiClient.get<ApiResponse<ReelFeedResponse>>(
    `/challenges/${challengeId}/reels`,
    { params },
  );
  const result = response.data;
  if (!result.success) throw new Error(result.message);
  return result.data;
}

/** GET /users/:id/reels */
export async function getUserReelsApi(userId: string): Promise<Reel[]> {
  const response = await apiClient.get<ApiResponse<Reel[]>>(`/users/${userId}/reels`);
  const result = response.data;
  if (!result.success) throw new Error(result.message);
  return result.data;
}
