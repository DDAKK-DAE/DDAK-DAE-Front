'use client';

import { useState, useEffect } from 'react';
import { getMyCrewsApi } from '@/api/endpoints/crews';
import type { CrewSummary } from '@/features/crew/domain/entities/Crew';

export function useMyCrews() {
    const [crews, setCrews] = useState<CrewSummary[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        async function fetchCrews() {
            try {
                setIsLoading(true);
                if (!process.env.NEXT_PUBLIC_API_BASE_URL) throw new Error('no api url');
                const data = await getMyCrewsApi();
                setCrews(data ?? []);
            } catch (err: unknown) {
                const errorMessage = err instanceof Error ? err.message : '크루 목록을 불러오는 중 오류가 발생했습니다.';
                setError(errorMessage);
                // Mock 데이터 (개발용)
                setCrews([
                    {
                        crew_id: 'c1',
                        challenge_title: '장원영 챌린지 같이 찍어요 ✨',
                        member_count: 4,
                        last_activity_at: new Date().toISOString(),
                    },
                    {
                        crew_id: 'c2',
                        challenge_title: '한강 피크닉 일상 브이로그 🌅',
                        member_count: 3,
                        last_activity_at: new Date(Date.now() - 3600000).toISOString(),
                    }
                ]);
                console.error('크루 목록 로딩 실패, Mock 데이터를 표시합니다.', err);
            } finally {
                setIsLoading(false);
            }
        }

        fetchCrews();
    }, []);

    return { crews, isLoading, error };
}