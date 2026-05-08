'use client';

import { useMemo, useState } from 'react';

import {
  CHALLENGE_CATEGORY,
  CHALLENGE_STATUS,
  type Challenge,
  type ChallengeCategory,
} from '@/features/challenge/domain/entities/Challenge';

const MOCK_CHALLENGES: Challenge[] = [
  {
    id: '1',
    title: '장원영 챌린지 같이 찍어요 ✨',
    description: '혼자 연습했는데 해운대에서 같이 찍을 분 구해요! 초보도 환영해요',
    location_text: '부산 해운대 해수욕장',
    category: CHALLENGE_CATEGORY.DANCE,
    max_participants: 4,
    current_participants: 2,
    status: CHALLENGE_STATUS.OPEN,
    host: { id: 'u1', nickname: '댄서혜린' },
    deadline_at: '2026-05-30T00:00:00Z',
    created_at: '2026-05-01T00:00:00Z',
    hashtags: ['장원영', '해운대댄스', '같이찍어요'],
  },
  {
    id: '2',
    title: '한강 피크닉 일상 브이로그 🌅',
    description: '한강에서 감성 일상 영상 같이 찍을 분! 저녁 노을 타임 맞춰가요',
    location_text: '서울 반포 한강공원',
    category: CHALLENGE_CATEGORY.DAILY,
    max_participants: 3,
    current_participants: 1,
    status: CHALLENGE_STATUS.OPEN,
    host: { id: 'u2', nickname: '감성브이로거' },
    deadline_at: '2026-05-22T00:00:00Z',
    created_at: '2026-05-02T00:00:00Z',
    hashtags: ['한강피크닉', '일상브이로그', '저녁노을'],
  },
  {
    id: '3',
    title: '서핑 챌린지 🏄 함께해요',
    description: '양양에서 서핑하면서 릴스 찍을 팀 구해요. 초급자도 OK!',
    location_text: '강원 양양 서핑비치',
    category: CHALLENGE_CATEGORY.SPORTS,
    max_participants: 6,
    current_participants: 3,
    status: CHALLENGE_STATUS.OPEN,
    host: { id: 'u3', nickname: '서퍼제이' },
    deadline_at: '2026-06-05T00:00:00Z',
    created_at: '2026-05-03T00:00:00Z',
    hashtags: ['양양서핑', '서핑챌린지', '여름릴스'],
  },
  {
    id: '4',
    title: '성수동 카페 탐방 먹방 🍰',
    description: '성수동 트렌디한 카페 돌면서 먹방 찍을 분 구해요!',
    location_text: '서울 성수동 카페거리',
    category: CHALLENGE_CATEGORY.FOOD,
    max_participants: 4,
    current_participants: 2,
    status: CHALLENGE_STATUS.OPEN,
    host: { id: 'u4', nickname: '카페탐방러' },
    deadline_at: '2026-05-25T00:00:00Z',
    created_at: '2026-05-04T00:00:00Z',
    hashtags: ['성수동카페', '먹방릴스', '카페탐방'],
  },
  {
    id: '5',
    title: '제주도 감성 여행 영상 🌿',
    description: '제주도에서 올레길 걸으며 감성 영상 찍을 크루 모집해요',
    location_text: '제주 올레길 7코스',
    category: CHALLENGE_CATEGORY.DAILY,
    max_participants: 5,
    current_participants: 2,
    status: CHALLENGE_STATUS.OPEN,
    host: { id: 'u5', nickname: '제주감성이' },
    deadline_at: '2026-06-10T00:00:00Z',
    created_at: '2026-05-05T00:00:00Z',
    hashtags: ['제주여행', '올레길', '감성릴스'],
  },
  {
    id: '6',
    title: '방탄 Butter 안무 같이 찍자 🕺',
    description: 'BTS Butter 안무 크루 촬영해요. 연습 영상 있으신 분 우선!',
    location_text: '서울 홍대 연습실',
    category: CHALLENGE_CATEGORY.DANCE,
    max_participants: 6,
    current_participants: 4,
    status: CHALLENGE_STATUS.OPEN,
    host: { id: 'u6', nickname: '방탄댄서K' },
    deadline_at: '2026-05-20T00:00:00Z',
    created_at: '2026-05-06T00:00:00Z',
    hashtags: ['BTS', 'Butter챌린지', '홍대댄스'],
  },
  {
    id: '7',
    title: '롱보드 스케이트 영상 🛹',
    description: '한강 롱보드 라이딩 영상 같이 찍을 분 모집! 장비 있으면 OK',
    location_text: '서울 여의도 한강공원',
    category: CHALLENGE_CATEGORY.SPORTS,
    max_participants: 4,
    current_participants: 1,
    status: CHALLENGE_STATUS.OPEN,
    host: { id: 'u7', nickname: '보더리나' },
    deadline_at: '2026-05-28T00:00:00Z',
    created_at: '2026-05-07T00:00:00Z',
    hashtags: ['롱보드', '한강라이딩', '스케이트릴스'],
  },
];

export function useFeed() {
  const [activeCategory, setActiveCategory] = useState<ChallengeCategory | null>(null);
  const [isLoading] = useState(false);

  const challenges = useMemo<Challenge[]>(() => {
    if (!activeCategory) return MOCK_CHALLENGES;
    return MOCK_CHALLENGES.filter((c) => c.category === activeCategory);
  }, [activeCategory]);

  return { challenges, activeCategory, setActiveCategory, isLoading };
}
