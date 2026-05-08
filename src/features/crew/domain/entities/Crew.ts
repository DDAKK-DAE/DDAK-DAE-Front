export interface ChallengeSummary {
  id: string;
  title: string;
  category: string;
  locationText: string;
  audioUrl?: string | null;
  deadlineAt: string;
}

export interface CrewMember {
  userId: string;
  nickname: string;
  profileImage?: string | null;
}

export interface CrewArchiveReel {
  id: string;
  videoUrl: string;
  participants: CrewMember[];
  createdAt: string;
}

export interface CrewMessage {
  id: string;
  sender: CrewMember;
  content: string;
  createdAt: string;
}

export interface CrewSummary {
  crewId: string;
  challengeTitle: string;
  memberCount: number;
  lastActivityAt?: string | null;
}

export interface CrewDetail {
  id: string;
  challenge: ChallengeSummary;
  members: CrewMember[];
  createdAt: string;
}

export interface CloseCrewResponse {
  crewId: string;
  memberIds: string[];
}
