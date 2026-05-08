'use client';

import { cn } from '@/shared/utils/cn';
import {
  CHALLENGE_CATEGORY,
  type ChallengeCategory,
} from '@/features/challenge/domain/entities/Challenge';

const CATEGORIES: { value: ChallengeCategory | null; label: string }[] = [
  { value: null, label: '전체' },
  { value: CHALLENGE_CATEGORY.DANCE, label: '댄스' },
  { value: CHALLENGE_CATEGORY.DAILY, label: '일상' },
  { value: CHALLENGE_CATEGORY.SPORTS, label: '스포츠' },
  { value: CHALLENGE_CATEGORY.FOOD, label: '푸드' },
  { value: CHALLENGE_CATEGORY.ETC, label: '기타' },
];

interface CategoryTabsProps {
  activeCategory: ChallengeCategory | null;
  onCategoryChange: (category: ChallengeCategory | null) => void;
}

export function CategoryTabs({ activeCategory, onCategoryChange }: CategoryTabsProps) {
  return (
    <div
      className="flex items-center gap-2 overflow-x-auto px-4 py-3"
      style={{
        scrollbarWidth: 'none',
        background: 'linear-gradient(to bottom, rgba(0,0,0,0.55) 0%, transparent 100%)',
      }}
    >
      {CATEGORIES.map(({ value, label }) => {
        const isActive = activeCategory === value;
        return (
          <button
            key={label}
            onClick={() => onCategoryChange(value)}
            className={cn(
              'flex-shrink-0 rounded-full px-4 py-1.5 text-sm font-semibold transition-all duration-200',
              isActive
                ? 'bg-primary text-white shadow-lg shadow-primary/40'
                : 'bg-white/15 text-white/85 backdrop-blur-sm hover:bg-white/25',
            )}
          >
            {label}
          </button>
        );
      })}
    </div>
  );
}
