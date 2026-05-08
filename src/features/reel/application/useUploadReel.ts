'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { uploadFileApi } from '@/api/endpoints/files';
import { uploadReelApi } from '@/api/endpoints/reels';
import type { Reel } from '@/features/reel/domain/entities/Reel';

export interface UploadReelParams {
  challengeId: string;
  crewId?: string | null;
  videoFile: File;
}

export function useUploadReel() {
  const queryClient = useQueryClient();

  const mutation = useMutation<Reel, Error, UploadReelParams>({
    mutationFn: async ({ challengeId, crewId, videoFile }) => {
      const { url: videoUrl } = await uploadFileApi(videoFile);
      return uploadReelApi({ challengeId, crewId: crewId ?? null, videoUrl });
    },
    onSuccess: (_, { challengeId }) => {
      void queryClient.invalidateQueries({ queryKey: ['challenge-reels', challengeId] });
    },
  });

  return {
    upload: mutation.mutateAsync,
    isUploading: mutation.isPending,
    uploadedReel: mutation.data ?? null,
    error: mutation.isError ? (mutation.error?.message ?? '업로드 중 오류가 발생했어요.') : null,
  };
}
