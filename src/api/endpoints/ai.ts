import { aiApiClient } from '../client';
import type { ApiResponse } from '@/shared/types/api';

export interface GenerateChallengeDescriptionRequest {
  title: string;
  locationText: string;
  maxParticipants: number;
}

export interface GenerateChallengeDescriptionResponse {
  description: string;
  hashtags: string[];
}

export interface AnalyzeGroupChemistryRequest {
  challengeId: string;
  acceptedUserIds: string[];
  candidateUserId: string;
}

export interface AnalyzeGroupChemistryResponse {
  analysis: string;
}

export interface CrewRecommendation {
  challengeId: string;
  title: string;
  reason: string;
}

export interface GetCrewRecommendationsResponse {
  recommendations: CrewRecommendation[];
}

/** POST /ai/challenge-description */
export async function generateChallengeDescriptionApi(
  request: GenerateChallengeDescriptionRequest,
): Promise<GenerateChallengeDescriptionResponse> {
  const response = await aiApiClient.post<ApiResponse<GenerateChallengeDescriptionResponse>>(
    '/ai/challenge-description',
    request,
  );
  const result = response.data;
  if (!result.success) throw new Error(result.message);
  return result.data;
}

/** POST /ai/group-chemistry */
export async function analyzeGroupChemistryApi(
  request: AnalyzeGroupChemistryRequest,
): Promise<AnalyzeGroupChemistryResponse> {
  const response = await aiApiClient.post<ApiResponse<AnalyzeGroupChemistryResponse>>(
    '/ai/group-chemistry',
    request,
  );
  const result = response.data;
  if (!result.success) throw new Error(result.message);
  return result.data;
}

/** GET /crews/:id/recommendation */
export async function getCrewRecommendationsApi(
  crewId: string,
): Promise<GetCrewRecommendationsResponse> {
  const response = await aiApiClient.get<ApiResponse<GetCrewRecommendationsResponse>>(
    `/crews/${crewId}/recommendation`,
  );
  const result = response.data;
  if (!result.success) throw new Error(result.message);
  return result.data;
}
