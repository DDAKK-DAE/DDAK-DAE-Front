import { apiClient } from '../client';
import type { ApiResponse } from '@/shared/types/api';
import type { ApplicantDetail } from '@/features/challenge/domain/entities/Challenge';

export interface ApplyChallengeRequest {
  introMessage?: string;
}

/** POST /challenges/:id/apply */
export async function applyChallengeApi(
  challengeId: string,
  request: ApplyChallengeRequest,
): Promise<void> {
  const response = await apiClient.post<ApiResponse<unknown>>(
    `/challenges/${challengeId}/apply`,
    request,
  );
  const result = response.data;
  if (!result.success) throw new Error(result.message);
}

/** GET /challenges/:id/applicants — host만 가능 */
export async function getApplicantsApi(challengeId: string): Promise<ApplicantDetail[]> {
  const response = await apiClient.get<ApiResponse<ApplicantDetail[]>>(
    `/challenges/${challengeId}/applicants`,
  );
  const result = response.data;
  if (!result.success) throw new Error(result.message);
  return result.data;
}

/** PATCH /participations/:id/accept */
export async function acceptParticipationApi(participationId: string): Promise<void> {
  const response = await apiClient.patch<ApiResponse<unknown>>(
    `/participations/${participationId}/accept`,
  );
  const result = response.data;
  if (!result.success) throw new Error(result.message);
}

/** PATCH /participations/:id/reject */
export async function rejectParticipationApi(participationId: string): Promise<void> {
  const response = await apiClient.patch<ApiResponse<unknown>>(
    `/participations/${participationId}/reject`,
  );
  const result = response.data;
  if (!result.success) throw new Error(result.message);
}
