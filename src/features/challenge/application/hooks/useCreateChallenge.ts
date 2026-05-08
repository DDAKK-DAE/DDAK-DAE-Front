'use client';

import { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { createChallengeApi } from '@/api/endpoints/challenges';
import { uploadFileApi } from '@/api/endpoints/files';
import { uploadReelApi } from '@/api/endpoints/reels';
import { generateChallengeDescriptionApi } from '@/api/endpoints/ai';
import { CHALLENGE_CATEGORY, type ChallengeCategory } from '@/features/challenge/domain/entities/Challenge';

export type UploadProgress =
  | 'idle'
  | 'uploadingVideo'
  | 'uploadingAudio'
  | 'creating'
  | 'attachingReel';

export interface CreateChallengeForm {
  title: string;
  category: ChallengeCategory | '';
  locationText: string;
  description: string;
  deadlineAt: string;
  maxParticipants: number;
  hashtags: string[];
  videoFile: File | null;
  audioFile: File | null;
}

const INITIAL_FORM: CreateChallengeForm = {
  title: '',
  category: '',
  locationText: '',
  description: '',
  deadlineAt: '',
  maxParticipants: 4,
  hashtags: [],
  videoFile: null,
  audioFile: null,
};

export function useCreateChallenge() {
  const router = useRouter();
  const [form, setForm] = useState<CreateChallengeForm>(INITIAL_FORM);
  const [tagInput, setTagInput] = useState('');
  const [uploadProgress, setUploadProgress] = useState<UploadProgress>('idle');
  const [error, setError] = useState<string | null>(null);
  const [isGeneratingAi, setIsGeneratingAi] = useState(false);

  const isSubmitting = uploadProgress !== 'idle';

  const updateField = useCallback(<K extends keyof CreateChallengeForm>(
    key: K,
    value: CreateChallengeForm[K],
  ) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  }, []);

  const addTag = useCallback(() => {
    const tag = tagInput.trim().replace(/^#/, '');
    if (!tag || form.hashtags.includes(tag) || form.hashtags.length >= 5) return;
    setForm((prev) => ({ ...prev, hashtags: [...prev.hashtags, tag] }));
    setTagInput('');
  }, [tagInput, form.hashtags]);

  const removeTag = useCallback((tag: string) => {
    setForm((prev) => ({ ...prev, hashtags: prev.hashtags.filter((t) => t !== tag) }));
  }, []);

  const isValid =
    form.title.trim().length > 0 &&
    form.category !== '' &&
    form.locationText.trim().length > 0 &&
    form.deadlineAt !== '' &&
    form.videoFile !== null;

  const generateAiDescription = useCallback(async () => {
    if (!form.title.trim() || !form.locationText.trim()) return;
    setIsGeneratingAi(true);
    try {
      const result = await generateChallengeDescriptionApi({
        title: form.title.trim(),
        locationText: form.locationText.trim(),
        maxParticipants: form.maxParticipants,
      });
      setForm((prev) => ({
        ...prev,
        description: result.description,
        hashtags: result.hashtags.slice(0, 5),
      }));
    } catch {
      // AI 미구현 — mock fallback
      setForm((prev) => ({
        ...prev,
        description: `${form.title}에 함께할 크루를 모집합니다. ${form.locationText}에서 촬영 예정이에요!`,
        hashtags: ['챌린지', '같이찍어요', '릴스'].slice(0, 5 - prev.hashtags.length),
      }));
    } finally {
      setIsGeneratingAi(false);
    }
  }, [form.title, form.locationText, form.maxParticipants]);

  const submit = useCallback(async () => {
    if (!isValid || !form.videoFile) return;
    setError(null);

    try {
      setUploadProgress('uploadingVideo');
      const { url: videoUrl } = await uploadFileApi(form.videoFile);

      let audioUrl: string | undefined;
      if (form.audioFile) {
        setUploadProgress('uploadingAudio');
        const { url } = await uploadFileApi(form.audioFile);
        audioUrl = url;
      }

      setUploadProgress('creating');
      const created = await createChallengeApi({
        title: form.title.trim(),
        category: form.category as ChallengeCategory,
        locationText: form.locationText.trim(),
        description: form.description.trim() || undefined,
        deadlineAt: new Date(form.deadlineAt).toISOString(),
        maxParticipants: form.maxParticipants,
        audioUrl,
        hashtags: form.hashtags.length > 0 ? form.hashtags : undefined,
      });

      setUploadProgress('attachingReel');
      await uploadReelApi({ challengeId: created.id, crewId: null, videoUrl });

      router.push(`/challenges/${created.id}`);
    } catch (err) {
      const message = err instanceof Error ? err.message : undefined;
      setError(message ?? '챌린지 생성 중 오류가 발생했어요. 다시 시도해주세요.');
    } finally {
      setUploadProgress('idle');
    }
  }, [form, isValid, router]);

  const CATEGORIES = Object.values(CHALLENGE_CATEGORY);

  return {
    form,
    tagInput,
    setTagInput,
    updateField,
    addTag,
    removeTag,
    isValid,
    isSubmitting,
    uploadProgress,
    error,
    submit,
    CATEGORIES,
    isGeneratingAi,
    generateAiDescription,
  };
}
