'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getMeApi, updateMeApi, type UpdateProfileRequest } from '@/api/endpoints/auth';
import { getMyCrewsApi } from '@/api/endpoints/crews';
import { getUserReelsApi } from '@/api/endpoints/reels';
import { uploadFileApi } from '@/api/endpoints/files';
import { useAuth } from '@/features/auth/application/store/AuthContext';
import type { CrewSummary } from '@/features/crew/domain/entities/Crew';
import type { Reel } from '@/features/reel/domain/entities/Reel';

export function useProfile() {
  const { currentUser, signOut } = useAuth();
  const queryClient = useQueryClient();

  const { data: crews = [], isLoading: isCrewsLoading } = useQuery<CrewSummary[]>({
    queryKey: ['my-crews'],
    queryFn: getMyCrewsApi,
    enabled: !!currentUser,
  });

  const { data: myReels = [], isLoading: isReelsLoading } = useQuery<Reel[]>({
    queryKey: ['user-reels', currentUser?.id],
    queryFn: () => getUserReelsApi(currentUser!.id),
    enabled: !!currentUser?.id,
  });

  const updateProfileMutation = useMutation({
    mutationFn: async (data: UpdateProfileRequest & { imageFile?: File }) => {
      let profileImage = data.profileImage;
      if (data.imageFile) {
        const { url } = await uploadFileApi(data.imageFile);
        profileImage = url;
      }
      const { imageFile: _, ...rest } = data;
      return updateMeApi({ ...rest, profileImage });
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['me'] });
    },
  });

  const isLoading = isCrewsLoading || isReelsLoading;

  return {
    currentUser,
    crews,
    myReels,
    isLoading,
    signOut,
    updateProfile: updateProfileMutation.mutateAsync,
    isUpdating: updateProfileMutation.isPending,
    updateError: updateProfileMutation.isError
      ? (updateProfileMutation.error?.message ?? '프로필 수정 중 오류가 발생했어요.')
      : null,
  };
}
