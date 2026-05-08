import type { Challenge } from '@/features/challenge/domain/entities/Challenge';
import { CHALLENGE_STATUS } from '@/features/challenge/domain/entities/Challenge';

export function isChallengeJoinable(challenge: Challenge): boolean {
  if (challenge.status !== CHALLENGE_STATUS.OPEN) return false;
  if (challenge.current_participants >= challenge.max_participants) return false;
  return new Date() < new Date(challenge.deadline_at);
}

export function getRemainingSlots(challenge: Challenge): number {
  return challenge.max_participants - challenge.current_participants;
}
