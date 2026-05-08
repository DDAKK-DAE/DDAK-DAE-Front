'use client';

import { useState, useEffect } from 'react';
import { getChallengeReelsApi } from '@/api/endpoints/reels';
import type { Reel, ReelFeedResponse } from '@/features/reel/domain/entities/Reel';

const MOCK_REELS: ReelFeedResponse = {
  audio_url: undefined,
  reels: [
    {
      id: 'r1',
      challenge_id: 'ch1',
      video_url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
      type: 'recruitment',
      participants: [{ id: 'u1', nickname: '댄서김민준' }],
      created_at: new Date(Date.now() - 3600000).toISOString(),
    },
    {
      id: 'r2',
      challenge_id: 'ch1',
      video_url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
      type: 'recruitment',
      participants: [{ id: 'u2', nickname: '이수진' }],
      created_at: new Date(Date.now() - 7200000).toISOString(),
    },
    {
      id: 'r3',
      challenge_id: 'ch1',
      video_url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
      type: 'completion',
      participants: [
        { id: 'u1', nickname: '댄서김민준' },
        { id: 'u3', nickname: '박지훈크루' },
      ],
      created_at: new Date(Date.now() - 86400000).toISOString(),
    },
  ],
};

export function useReelFeed(challengeId: string) {
  const [reels, setReels] = useState<Reel[]>([]);
  const [audioUrl, setAudioUrl] = useState<string | undefined>(undefined);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchReels() {
      try {
        setIsLoading(true);
        if (!process.env.NEXT_PUBLIC_API_BASE_URL) throw new Error('no api url');
        const data = await getChallengeReelsApi(challengeId);
        setReels(data.reels);
        setAudioUrl(data.audio_url);
      } catch {
        setReels(MOCK_REELS.reels);
        setAudioUrl(MOCK_REELS.audio_url);
      } finally {
        setIsLoading(false);
      }
    }

    fetchReels();
  }, [challengeId]);

  return { reels, audioUrl, isLoading };
}
