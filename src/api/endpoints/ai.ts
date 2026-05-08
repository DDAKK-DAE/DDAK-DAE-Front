// src/api/endpoints/ai.ts
// AI API 엔드포인트 — api_spec.md AI 섹션 기준 (FastAPI 별도 서버)
import { aiApiClient } from '../client';
import type { ApiResponse } from '@/shared/types/api';

// ==========================================
// Request/Response 타입 정의
// ==========================================

export interface GenerateChallengeDescriptionRequest {
  title: string;
  location_text: string;
  max_participants: number;
}

export interface GenerateChallengeDescriptionResponse {
  description: string;
  hashtags: string[];
}

export interface AnalyzeGroupChemistryRequest {
  challenge_id: string;
  accepted_user_ids: string[];
  candidate_user_id: string;
}

export interface AnalyzeGroupChemistryResponse {
  analysis: string;
}

export interface CrewRecommendation {
  challenge_id: string;
  title: string;
  reason: string;
}

export interface GetCrewRecommendationsResponse {
  recommendations: CrewRecommendation[];
}

// ==========================================
// AI API 함수 (FastAPI 서버)
// ==========================================

/** POST /ai/challenge-description — 챌린지 글 자동 작성 */
export async function generateChallengeDescriptionApi(
  request: GenerateChallengeDescriptionRequest,
): Promise<GenerateChallengeDescriptionResponse> {
  const response = await aiApiClient.post<ApiResponse<GenerateChallengeDescriptionResponse>>(
    '/ai/challenge-description',
    request,
  );
  return response.data.data;
}

/** POST /ai/group-chemistry — 그룹 케미 분석 */
export async function analyzeGroupChemistryApi(
  request: AnalyzeGroupChemistryRequest,
): Promise<AnalyzeGroupChemistryResponse> {
  const response = await aiApiClient.post<ApiResponse<AnalyzeGroupChemistryResponse>>(
    '/ai/group-chemistry',
    request,
  );
  return response.data.data;
}

/** GET /crews/:id/recommendation — 크루 챌린지 추천 */
export async function getCrewRecommendationsApi(
  crewId: string,
): Promise<GetCrewRecommendationsResponse> {
  const response = await aiApiClient.get<ApiResponse<GetCrewRecommendationsResponse>>(
    `/crews/${crewId}/recommendation`,
  );
  return response.data.data;
}
