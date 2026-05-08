// src/shared/hooks/useDebounce.ts
// 디바운스 커스텀 훅 — 스타일 가이드 Section 1.3 Shared hooks
'use client';

import { useEffect, useState } from 'react';

/**
 * 값 변경을 일정 시간 지연시키는 디바운스 훅
 *
 * @param value - 디바운스할 값
 * @param delayMs - 지연 시간 (밀리초), 기본값 300ms
 * @returns 지연된 값
 *
 * @example
 * const debouncedSearchTerm = useDebounce(searchTerm, 500);
 */
export function useDebounce<T>(value: T, delayMs: number = 300): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedValue(value);
    }, delayMs);

    return () => {
      clearTimeout(timer);
    };
  }, [value, delayMs]);

  return debouncedValue;
}
