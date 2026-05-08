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
  profileImage?: string | null;
}

export interface Challenge {
  id: string;
  title: string;
  description?: string;
  locationText: string;
  category: ChallengeCategory;
  audioUrl?: string | null;
  maxParticipants: number;
  currentParticipants: number;
  status: ChallengeStatus;
  host: ChallengeHost;
  deadlineAt: string;
  createdAt: string;
  hashtags?: string[];
}

export interface Participation {
  participationId: string;
  challengeId: string;
  userId: string;
  introMessage?: string;
  status: ParticipationStatus;
  createdAt: string;
}

export interface ApplicantDetail {
  participationId: string;
  user: Pick<User, 'id' | 'nickname' | 'profileImage'>;
  introMessage?: string;
  status: ParticipationStatus;
}
