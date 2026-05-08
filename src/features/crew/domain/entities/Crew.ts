// src/features/crew/domain/entities/Crew.ts
// 크루 도메인 엔티티 — 스타일 가이드 Section 2.1 Domain Layer
// api_spec.md Crews & Crew Messages 섹션 기준

import type { User } from '@/features/auth/domain/entities/User';
import type { Challenge } from '@/features/challenge/domain/entities/Challenge';
import type { CrewRecommendation } from '@/api/endpoints/ai';

// ==========================================
// 도메인 엔티티 타입
// ==========================================

/** 크루 멤버 */
export interface CrewMember {
  user: User;
  joined_at: string;
}

/** 크루 아카이브 릴스 아이템 */
export interface CrewArchiveReel {
  id: string;
  video_url: string;
  participants: Array<Pick<User, 'id' | 'nickname' | 'profileImage'>>;
  created_at: string;
}

/** 크루 채팅 메시지 */
export interface CrewMessage {
  id: string;
  sender: Pick<User, 'id' | 'nickname' | 'profileImage'>;
  content: string;
  created_at: string; // ISO datetime
}

/** 내 크루 목록 아이템 (GET /me/crews 응답) */
export interface CrewSummary {
  crew_id: string;
  challenge_title: string;
  member_count: number;
  last_activity_at?: string;
}

/** 크루 상세 (GET /crews/:id 응답) */
export interface CrewDetail {
  id: string;
  challenge: Challenge;
  members: CrewMember[];
  created_at: string;
  /** AI 추천 카드 (상단 고정) */
  ai_recommendations?: CrewRecommendation[];
  /** 릴스 아카이브 */
  archiveReels: CrewArchiveReel[];
}

/** Crew 기본 타입 (POST /challenges/:id/close 응답) */
export interface Crew {
  crew_id: string;
  challenge_id: string;
  members: Array<Pick<User, 'id' | 'nickname'>>;
  created_at: string;
}
