'use client';

import { useState, useEffect } from 'react';
import type { Reel } from '@/features/reel/domain/entities/Reel';

const MOCK_COMPLETION_REELS: Reel[] = [
  {
    id: 'cr1',
    challenge_id: 'ch1',
    crew_id: 'c1',
    video_url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
    type: 'completion',
    participants: [
      { id: 'u1', nickname: '댄서김민준' },
      { id: 'u2', nickname: '이수진' },
      { id: 'u3', nickname: '박지훈크루' },
    ],
    created_at: new Date(Date.now() - 3600000).toISOString(),
  },
  {
    id: 'cr2',
    challenge_id: 'ch2',
    crew_id: 'c2',
    video_url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
    type: 'completion',
    participants: [
      { id: 'u4', nickname: '최예린' },
      { id: 'u5', nickname: '강동현' },
    ],
    created_at: new Date(Date.now() - 86400000).toISOString(),
  },
  {
    id: 'cr3',
    challenge_id: 'ch3',
    crew_id: 'c3',
    video_url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
    type: 'completion',
    participants: [
      { id: 'u6', nickname: '한지민' },
      { id: 'u7', nickname: '오세훈' },
      { id: 'u8', nickname: '윤아영' },
      { id: 'u9', nickname: '김태우' },
    ],
    created_at: new Date(Date.now() - 172800000).toISOString(),
  },
];

export function useCompletionReels() {
  const [reels, setReels] = useState<Reel[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchReels() {
      try {
        setIsLoading(true);
        // API 준비 시 전체 완료 릴스 피드 엔드포인트 연결
        if (!process.env.NEXT_PUBLIC_API_BASE_URL) throw new Error('no api url');
        // TODO: await getCompletionReelsFeedApi()
        throw new Error('no api url');
      } catch {
        await new Promise((r) => setTimeout(r, 300));
        setReels(MOCK_COMPLETION_REELS);
      } finally {
        setIsLoading(false);
      }
    }
    fetchReels();
  }, []);

  return { reels, isLoading };
}
