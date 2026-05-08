// src/shared/utils/formatDate.ts
// 날짜 포맷 유틸리티 — 스타일 가이드 Section 1.3 Shared Layer

/**
 * Date → 'YYYY-MM-DD' 형식 문자열 반환
 */
export function formatDate(date: Date): string {
  return date.toISOString().split('T')[0];
}

/**
 * ISO 날짜 문자열 → 'YYYY년 MM월 DD일' 형식 반환
 */
export function formatDateKorean(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString('ko-KR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

/**
 * ISO 날짜 문자열 → 상대 시간 표현 ('방금', 'N분 전', 'N시간 전', 'N일 전')
 */
export function formatRelativeTime(dateString: string): string {
  const now = new Date();
  const date = new Date(dateString);
  const diffMs = now.getTime() - date.getTime();
  const diffMinutes = Math.floor(diffMs / (1000 * 60));
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffMinutes < 1) return '방금';
  if (diffMinutes < 60) return `${diffMinutes}분 전`;
  if (diffHours < 24) return `${diffHours}시간 전`;
  if (diffDays < 7) return `${diffDays}일 전`;

  return formatDateKorean(dateString);
}

/**
 * 마감일까지 남은 일수 계산
 */
export function getDaysUntilDeadline(deadlineString: string): number {
  const now = new Date();
  const deadline = new Date(deadlineString);
  const diffMs = deadline.getTime() - now.getTime();
  return Math.ceil(diffMs / (1000 * 60 * 60 * 24));
}
