'use client';

import { useRef, useState, useEffect, useCallback } from 'react';
import { useFeed } from '@/features/challenge/application/hooks/useFeed';
import { CategoryTabs } from './CategoryTabs';
import { FeedCard } from './FeedCard';

export function FeedPage() {
  const { challenges, activeCategory, setActiveCategory } = useFeed();
  const [activeIndex, setActiveIndex] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleScroll = useCallback(() => {
    const container = containerRef.current;
    if (!container) return;
    const index = Math.round(container.scrollTop / container.clientHeight);
    setActiveIndex(index);
  }, []);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    container.addEventListener('scroll', handleScroll, { passive: true });
    return () => container.removeEventListener('scroll', handleScroll);
  }, [handleScroll]);

  // Reset active index when category changes
  useEffect(() => {
    setActiveIndex(0);
    containerRef.current?.scrollTo({ top: 0 });
  }, [activeCategory]);

  return (
    <div className="relative h-full bg-[#031a0f]">
      <div className="absolute left-0 right-0 top-0 z-20">
        <CategoryTabs activeCategory={activeCategory} onCategoryChange={setActiveCategory} />
      </div>

      <div
        ref={containerRef}
        className="scrollbar-hidden h-full snap-y snap-mandatory overflow-y-scroll"
        style={{ scrollbarWidth: 'none' }}
      >
        {challenges.length === 0 ? (
          <div className="flex h-full flex-col items-center justify-center gap-3">
            <span className="text-4xl">🎬</span>
            <p className="text-sm text-white/50">해당 카테고리 챌린지가 없어요</p>
          </div>
        ) : (
          challenges.map((challenge, index) => (
            <FeedCard
              key={challenge.id}
              challenge={challenge}
              index={index}
              isActive={index === activeIndex}
            />
          ))
        )}
      </div>
    </div>
  );
}
