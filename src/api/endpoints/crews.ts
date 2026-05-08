import { apiClient } from '../client';
import type { ApiResponse } from '@/shared/types/api';
import type {
  CrewDetail,
  CrewArchiveReel,
  CrewMessage,
  CrewSummary,
} from '@/features/crew/domain/entities/Crew';

/** GET /crews/:id */
export async function getCrewApi(crewId: string): Promise<CrewDetail> {
  const response = await apiClient.get<ApiResponse<CrewDetail>>(`/crews/${crewId}`);
  const result = response.data;
  if (!result.success) throw new Error(result.message);
  return result.data;
}

/** GET /crews/:id/archive */
export async function getCrewArchiveApi(crewId: string): Promise<CrewArchiveReel[]> {
  const response = await apiClient.get<ApiResponse<CrewArchiveReel[]>>(
    `/crews/${crewId}/archive`,
  );
  const result = response.data;
  if (!result.success) throw new Error(result.message);
  return result.data;
}

/** GET /me/crews */
export async function getMyCrewsApi(): Promise<CrewSummary[]> {
  const response = await apiClient.get<ApiResponse<CrewSummary[]>>('/me/crews');
  const result = response.data;
  if (!result.success) throw new Error(result.message);
  return result.data;
}

/** GET /crews/:id/messages — 초기 200개 로드 (STOMP 연결 전 히스토리) */
export async function getCrewMessagesApi(crewId: string): Promise<CrewMessage[]> {
  const response = await apiClient.get<ApiResponse<CrewMessage[]>>(
    `/crews/${crewId}/messages`,
  );
  const result = response.data;
  if (!result.success) throw new Error(result.message);
  return result.data;
}
