// src/features/reel/domain/entities/Reel.ts
// 릴스 도메인 엔티티 — 스타일 가이드 Section 2.1 Domain Layer
// api_spec.md Reels 섹션 기준

import type { User } from '@/features/auth/domain/entities/User';

// ==========================================
// 상수 정의
// ==========================================

export const REEL_TYPE = {
  RECRUITMENT: 'recruitment', // 모집용 릴스 (혼자 찍은 버전)
  COMPLETION: 'completion', // 완료용 릴스 (크루와 찍은 영상)
} as const;

export type ReelType = (typeof REEL_TYPE)[keyof typeof REEL_TYPE];

// ==========================================
// 도메인 엔티티 타입
// ==========================================

/** 릴스 엔티티 */
export interface Reel {
  id: string;
  challenge_id: string;
  crew_id?: string;
  video_url: string;
  type: ReelType;
  participants: Array<Pick<User, 'id' | 'nickname' | 'profileImage'>>;
  created_at: string;
}

/**
 * 챌린지별 릴스 피드 응답 (GET /challenges/:id/reels)
 * audio_url 포함 → 피드 전체에서 이 음원으로 통일 재생 (핵심 UX)
 */
export interface ReelFeedResponse {
  audio_url?: string; // 챌린지 대표 음원
  reels: Reel[];
}
