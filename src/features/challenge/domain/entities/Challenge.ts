import type { User } from '@/features/auth/domain/entities/User';

export const CHALLENGE_STATUS = {
  OPEN: 'open',
  CLOSED: 'closed',
} as const;

export type ChallengeStatus = (typeof CHALLENGE_STATUS)[keyof typeof CHALLENGE_STATUS];

export const CHALLENGE_CATEGORY = {
  DANCE: '댄스',
  DAILY: '일상',
  SPORTS: '스포츠',
  FOOD: '푸드',
  ETC: '기타',
} as const;

export type ChallengeCategory = (typeof CHALLENGE_CATEGORY)[keyof typeof CHALLENGE_CATEGORY];

export const PARTICIPATION_STATUS = {
  PENDING: 'pending',
  ACCEPTED: 'accepted',
  REJECTED: 'rejected',
} as const;

export type ParticipationStatus =
  (typeof PARTICIPATION_STATUS)[keyof typeof PARTICIPATION_STATUS];

export interface ChallengeHost {
  id: string;
  nickname: string;
  profileImage?: string;
}

export interface Challenge {
  id: string;
  title: string;
  description?: string;
  location_text: string;
  category: ChallengeCategory;
  audio_url?: string;
  max_participants: number;
  current_participants: number;
  status: ChallengeStatus;
  host: ChallengeHost;
  deadline_at: string;
  created_at: string;
  hashtags?: string[];
  recruitment_reel_url?: string;
}

export interface ChallengeDetail extends Challenge {
  recruitment_reels: Array<{
    id: string;
    video_url: string;
    created_at: string;
  }>;
  completion_reels: Array<{
    id: string;
    video_url: string;
    participants: ChallengeHost[];
    created_at: string;
  }>;
}

export interface Participation {
  id: string;
  challenge_id: string;
  user_id: string;
  intro_message?: string;
  status: ParticipationStatus;
  created_at: string;
}

export interface ApplicantDetail {
  participation_id: string;
  user: User;
  intro_message?: string;
  status: ParticipationStatus;
  participation_history: {
    total_count: number;
    categories: ChallengeCategory[];
  };
}
