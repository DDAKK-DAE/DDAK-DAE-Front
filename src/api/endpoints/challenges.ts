import { apiClient } from '../client';
import type { ApiResponse } from '@/shared/types/api';
import type { PaginationParams, Page } from '@/shared/types/pagination';
import type { Challenge } from '@/features/challenge/domain/entities/Challenge';
import type { CloseCrewResponse } from '@/features/crew/domain/entities/Crew';

export interface GetChallengesParams extends PaginationParams {
  category?: string;
  location?: string;
}

export interface CreateChallengeRequest {
  title: string;
  description?: string;
  locationText: string;
  category: string;
  maxParticipants: number;
  deadlineAt: string;
  audioUrl?: string;
  hashtags?: string[];
}

export type UpdateChallengeRequest = Partial<CreateChallengeRequest>;

/** GET /challenges — 피드 목록 (Spring Pageable) */
export async function getChallengesApi(params?: GetChallengesParams): Promise<Page<Challenge>> {
  const response = await apiClient.get<ApiResponse<Page<Challenge>>>('/challenges', { params });
  const result = response.data;
  if (!result.success) throw new Error(result.message);
  return result.data;
}

/** GET /challenges/:id */
export async function getChallengeByIdApi(id: string): Promise<Challenge> {
  const response = await apiClient.get<ApiResponse<Challenge>>(`/challenges/${id}`);
  const result = response.data;
  if (!result.success) throw new Error(result.message);
  return result.data;
}

/** POST /challenges */
export async function createChallengeApi(request: CreateChallengeRequest): Promise<Challenge> {
  const response = await apiClient.post<ApiResponse<Challenge>>('/challenges', request);
  const result = response.data;
  if (!result.success) throw new Error(result.message);
  return result.data;
}

/** PATCH /challenges/:id */
export async function updateChallengeApi(
  id: string,
  request: UpdateChallengeRequest,
): Promise<Challenge> {
  const response = await apiClient.patch<ApiResponse<Challenge>>(`/challenges/${id}`, request);
  const result = response.data;
  if (!result.success) throw new Error(result.message);
  return result.data;
}

/** DELETE /challenges/:id */
export async function deleteChallengeApi(id: string): Promise<void> {
  await apiClient.delete(`/challenges/${id}`);
}

/** POST /challenges/:id/close — 모집 마감 + 크루 자동 생성 */
export async function closeChallengeApi(id: string): Promise<CloseCrewResponse> {
  const response = await apiClient.post<ApiResponse<CloseCrewResponse>>(
    `/challenges/${id}/close`,
  );
  const result = response.data;
  if (!result.success) throw new Error(result.message);
  return result.data;
}
