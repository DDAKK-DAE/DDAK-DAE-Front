// src/shared/utils/cn.ts
// clsx + tailwind-merge 조합 유틸리티 — 스타일 가이드 Section 6 명시
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Tailwind CSS 클래스 병합 유틸리티
 * - clsx: 조건부 클래스 처리
 * - tailwind-merge: Tailwind 클래스 충돌 해결
 *
 * @example
 * cn('px-4 py-2', isActive && 'bg-primary', className)
 */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}
