import type { Challenge } from '@/features/challenge/domain/entities/Challenge';
import { CHALLENGE_STATUS } from '@/features/challenge/domain/entities/Challenge';

export function isChallengeJoinable(challenge: Challenge): boolean {
  if (challenge.status !== CHALLENGE_STATUS.OPEN) return false;
  if (challenge.currentParticipants >= challenge.maxParticipants) return false;
  return new Date() < new Date(challenge.deadlineAt);
}

export function getRemainingSlots(challenge: Challenge): number {
  return challenge.maxParticipants - challenge.currentParticipants;
}
