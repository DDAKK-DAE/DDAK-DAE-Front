export const REEL_TYPE = {
  RECRUITMENT: 'recruitment',
  COMPLETION: 'completion',
} as const;

export type ReelType = (typeof REEL_TYPE)[keyof typeof REEL_TYPE];

export interface ReelParticipant {
  userId: string;
  nickname: string;
  profileImage: string | null;
}

export interface Reel {
  id: string;
  challengeId: string;
  crewId: string | null;
  videoUrl: string;
  reelType: ReelType;
  participants: ReelParticipant[];
  createdAt: string;
}

export interface ReelFeedResponse {
  audioUrl?: string | null;
  crewId: string | null;
  reels: Reel[];
}
