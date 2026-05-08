'use client';

import { useState, useCallback } from 'react';
import { uploadReelApi } from '@/api/endpoints/reels';
import type { Reel } from '@/features/reel/domain/entities/Reel';

export type UploadReelType = 'recruitment' | 'completion';

interface UploadReelParams {
  challengeId: string;
  crewId?: string;
  videoUrl: string;
  type: UploadReelType;
}

export function useUploadReel() {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadedReel, setUploadedReel] = useState<Reel | null>(null);
  const [error, setError] = useState<string | null>(null);

  const upload = useCallback(async ({ challengeId, crewId, videoUrl }: UploadReelParams) => {
    setIsUploading(true);
    setError(null);
    try {
      if (!process.env.NEXT_PUBLIC_API_BASE_URL) {
        await new Promise((r) => setTimeout(r, 800));
        const mockReel: Reel = {
          id: `r-${Date.now()}`,
          challenge_id: challengeId,
          crew_id: crewId,
          video_url: videoUrl,
          type: crewId ? 'completion' : 'recruitment',
          participants: [],
          created_at: new Date().toISOString(),
        };
        setUploadedReel(mockReel);
        return mockReel;
      }
      const reel = await uploadReelApi({
        challenge_id: challengeId,
        crew_id: crewId,
        video_url: videoUrl,
      });
      setUploadedReel(reel);
      return reel;
    } catch {
      setError('업로드 중 오류가 발생했어요. 다시 시도해주세요.');
      return null;
    } finally {
      setIsUploading(false);
    }
  }, []);

  return { upload, isUploading, uploadedReel, error };
}
