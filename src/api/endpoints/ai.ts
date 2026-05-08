import { aiApiClient } from '../client';

// ── generate-description ─────────────────────────────────────────────────────

export interface GenerateChallengeDescriptionRequest {
  title: string;
  locationText: string;
  maxParticipants: number;
  category: string;
  descriptionHint?: string;
  mood?: string;
  targetAudience?: string;
  difficulty?: string;
}

export interface GenerateChallengeDescriptionResponse {
  description: string;
  hashtags: string[];
}

/** POST /ai/generate-description */
export async function generateChallengeDescriptionApi(
  request: GenerateChallengeDescriptionRequest,
): Promise<GenerateChallengeDescriptionResponse> {
  const { data } = await aiApiClient.post<GenerateChallengeDescriptionResponse>(
    '/ai/generate-description',
    request,
  );
  return data;
}

// ── chemistry ────────────────────────────────────────────────────────────────

export interface ParticipationHistoryItem {
  category: string;
  title: string;
}

export interface ChemistryMember {
  nickname: string;
  bio?: string;
  participationHistory: ParticipationHistoryItem[];
}

export interface AnalyzeGroupChemistryRequest {
  challengeTitle: string;
  currentMembers: ChemistryMember[];
  applicant: ChemistryMember & { introMessage?: string };
}

export interface AnalyzeGroupChemistryResponse {
  score: number;
  summary: string;
  comment: string;
}

/** POST /ai/chemistry */
export async function analyzeGroupChemistryApi(
  request: AnalyzeGroupChemistryRequest,
): Promise<AnalyzeGroupChemistryResponse> {
  const { data } = await aiApiClient.post<AnalyzeGroupChemistryResponse>(
    '/ai/chemistry',
    request,
  );
  return data;
}

// ── crew-recommendation ──────────────────────────────────────────────────────

export interface TrendingChallengeItem {
  id: string;
  title: string;
  category: string;
  locationText: string;
  currentParticipants: number;
  maxParticipants: number;
}

export interface GetCrewRecommendationsRequest {
  crewId: string;
  crewHistory: ParticipationHistoryItem[];
  trendingChallenges: TrendingChallengeItem[];
}

export interface CrewRecommendation {
  challengeId: string;
  title: string;
  reason: string;
}

export interface GetCrewRecommendationsResponse {
  recommendations: CrewRecommendation[];
}

/** POST /ai/crew-recommendation */
export async function getCrewRecommendationsApi(
  request: GetCrewRecommendationsRequest,
): Promise<GetCrewRecommendationsResponse> {
  const { data } = await aiApiClient.post<GetCrewRecommendationsResponse>(
    '/ai/crew-recommendation',
    request,
  );
  return data;
}
