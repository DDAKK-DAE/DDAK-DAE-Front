'use client';

import { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { createChallengeApi } from '@/api/endpoints/challenges';
import { CHALLENGE_CATEGORY, type ChallengeCategory } from '@/features/challenge/domain/entities/Challenge';

export interface CreateChallengeForm {
  title: string;
  category: ChallengeCategory | '';
  location_text: string;
  description: string;
  deadline_at: string;
  max_participants: number;
  hashtags: string[];
}

const INITIAL_FORM: CreateChallengeForm = {
  title: '',
  category: '',
  location_text: '',
  description: '',
  deadline_at: '',
  max_participants: 4,
  hashtags: [],
};

export function useCreateChallenge() {
  const router = useRouter();
  const [form, setForm] = useState<CreateChallengeForm>(INITIAL_FORM);
  const [tagInput, setTagInput] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

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
    form.location_text.trim().length > 0 &&
    form.deadline_at !== '';

  const submit = useCallback(async () => {
    if (!isValid) return;
    setIsSubmitting(true);
    setError(null);
    try {
      if (!process.env.NEXT_PUBLIC_API_BASE_URL) {
        await new Promise((r) => setTimeout(r, 800));
        router.push('/feed');
        return;
      }
      const created = await createChallengeApi({
        title: form.title.trim(),
        category: form.category as ChallengeCategory,
        location_text: form.location_text.trim(),
        description: form.description.trim() || undefined,
        deadline_at: new Date(form.deadline_at).toISOString(),
        max_participants: form.max_participants,
        hashtags: form.hashtags.length > 0 ? form.hashtags : undefined,
      });
      router.push(`/challenges/${created.id}`);
    } catch {
      setError('챌린지 생성 중 오류가 발생했어요. 다시 시도해주세요.');
    } finally {
      setIsSubmitting(false);
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
    error,
    submit,
    CATEGORIES,
  };
}
