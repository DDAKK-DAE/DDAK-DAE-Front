'use client';

import { useRouter } from 'next/navigation';
import { ArrowLeft, Plus, X, Minus } from 'lucide-react';
import { AppShell } from '@/shared/components/layout/AppShell';
import { Button } from '@/shared/components/ui/Button';
import { useCreateChallenge } from '../../application/hooks/useCreateChallenge';
import { cn } from '@/shared/utils/cn';

const CATEGORY_COLORS: Record<string, string> = {
  댄스: 'border-[#e8356e]/60 text-[#e8356e] bg-[#e8356e]/10',
  일상: 'border-[#f5a318]/60 text-[#f5a318] bg-[#f5a318]/10',
  스포츠: 'border-[#07d98a]/60 text-[#07d98a] bg-[#07d98a]/10',
  푸드: 'border-[#f5a318]/60 text-[#f5a318] bg-[#f5a318]/10',
  기타: 'border-purple-400/60 text-purple-300 bg-purple-500/10',
};

const INPUT_BASE =
  'w-full rounded-xl bg-surface border border-border px-4 py-3 text-sm text-foreground placeholder:text-subtle outline-none focus:border-primary transition-colors';

export function CreateChallengePage() {
  const router = useRouter();
  const {
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
  } = useCreateChallenge();

  const today = new Date().toISOString().split('T')[0];

  return (
    <AppShell className="bg-background">
      {/* Header */}
      <header className="flex items-center gap-3 border-b border-border bg-background/80 px-4 py-4 backdrop-blur-md shrink-0">
        <button
          onClick={() => router.back()}
          className="flex h-9 w-9 items-center justify-center rounded-xl hover:bg-surface transition-colors"
        >
          <ArrowLeft className="h-5 w-5 text-foreground" />
        </button>
        <h1 className="flex-1 font-bold text-foreground">챌린지 만들기</h1>
      </header>

      {/* Form */}
      <div className="flex-1 overflow-y-auto px-5 py-6 pb-32 space-y-6">

        {/* 제목 */}
        <section className="space-y-2">
          <label className="text-sm font-semibold text-foreground">
            제목 <span className="text-[#e8356e]">*</span>
          </label>
          <input
            type="text"
            value={form.title}
            onChange={(e) => updateField('title', e.target.value)}
            placeholder="어떤 챌린지인지 한 줄로 알려주세요"
            maxLength={50}
            className={INPUT_BASE}
          />
          <p className="text-right text-xs text-subtle">{form.title.length}/50</p>
        </section>

        {/* 카테고리 */}
        <section className="space-y-2">
          <label className="text-sm font-semibold text-foreground">
            카테고리 <span className="text-[#e8356e]">*</span>
          </label>
          <div className="flex flex-wrap gap-2">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => updateField('category', cat)}
                className={cn(
                  'rounded-full border px-4 py-1.5 text-sm font-medium transition-all',
                  form.category === cat
                    ? CATEGORY_COLORS[cat] ?? 'border-primary text-primary bg-primary/10'
                    : 'border-border text-muted hover:border-primary/40 hover:text-foreground',
                )}
              >
                {cat}
              </button>
            ))}
          </div>
        </section>

        {/* 장소 */}
        <section className="space-y-2">
          <label className="text-sm font-semibold text-foreground">
            장소 <span className="text-[#e8356e]">*</span>
          </label>
          <input
            type="text"
            value={form.location_text}
            onChange={(e) => updateField('location_text', e.target.value)}
            placeholder="예: 서울 홍대 야외무대"
            className={INPUT_BASE}
          />
        </section>

        {/* 마감일 */}
        <section className="space-y-2">
          <label className="text-sm font-semibold text-foreground">
            모집 마감일 <span className="text-[#e8356e]">*</span>
          </label>
          <input
            type="date"
            value={form.deadline_at}
            min={today}
            onChange={(e) => updateField('deadline_at', e.target.value)}
            className={cn(INPUT_BASE, 'appearance-none')}
          />
        </section>

        {/* 최대 인원 */}
        <section className="space-y-2">
          <label className="text-sm font-semibold text-foreground">최대 인원</label>
          <div className="flex items-center gap-4">
            <button
              onClick={() => updateField('max_participants', Math.max(2, form.max_participants - 1))}
              disabled={form.max_participants <= 2}
              className="flex h-10 w-10 items-center justify-center rounded-xl bg-surface border border-border text-foreground disabled:opacity-30 transition-opacity"
            >
              <Minus className="h-4 w-4" />
            </button>
            <div className="flex-1 text-center">
              <span className="text-2xl font-bold text-foreground">{form.max_participants}</span>
              <span className="ml-1 text-sm text-muted">명</span>
            </div>
            <button
              onClick={() => updateField('max_participants', Math.min(6, form.max_participants + 1))}
              disabled={form.max_participants >= 6}
              className="flex h-10 w-10 items-center justify-center rounded-xl bg-surface border border-border text-foreground disabled:opacity-30 transition-opacity"
            >
              <Plus className="h-4 w-4" />
            </button>
          </div>
          <div className="flex justify-center gap-1 pt-1">
            {Array.from({ length: 5 }).map((_, i) => (
              <div
                key={i}
                className={cn(
                  'h-1.5 w-1.5 rounded-full transition-colors',
                  i < form.max_participants - 1 ? 'bg-primary' : 'bg-border',
                )}
              />
            ))}
          </div>
          <p className="text-center text-xs text-subtle">최소 2명 · 최대 6명</p>
        </section>

        {/* 설명 */}
        <section className="space-y-2">
          <label className="text-sm font-semibold text-foreground">소개 (선택)</label>
          <textarea
            value={form.description}
            onChange={(e) => updateField('description', e.target.value)}
            placeholder="챌린지 분위기, 참여 조건 등을 자유롭게 적어주세요"
            maxLength={300}
            rows={4}
            className={cn(INPUT_BASE, 'resize-none')}
          />
          <p className="text-right text-xs text-subtle">{form.description.length}/300</p>
        </section>

        {/* 해시태그 */}
        <section className="space-y-2">
          <label className="text-sm font-semibold text-foreground">해시태그 (선택 · 최대 5개)</label>
          <div className="flex gap-2">
            <input
              type="text"
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') { e.preventDefault(); addTag(); }
              }}
              placeholder="#태그 입력 후 Enter"
              className={cn(INPUT_BASE, 'flex-1')}
            />
            <button
              onClick={addTag}
              disabled={!tagInput.trim() || form.hashtags.length >= 5}
              className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary text-white disabled:opacity-30 transition-opacity"
            >
              <Plus className="h-4 w-4" />
            </button>
          </div>
          {form.hashtags.length > 0 && (
            <div className="flex flex-wrap gap-2 pt-1">
              {form.hashtags.map((tag) => (
                <span
                  key={tag}
                  className="flex items-center gap-1.5 rounded-full bg-primary/10 px-3 py-1 text-xs text-primary"
                >
                  #{tag}
                  <button onClick={() => removeTag(tag)} className="opacity-70 hover:opacity-100">
                    <X className="h-3 w-3" />
                  </button>
                </span>
              ))}
            </div>
          )}
        </section>

        {error && (
          <p className="rounded-xl bg-red-500/10 border border-red-500/20 px-4 py-3 text-sm text-red-400">
            {error}
          </p>
        )}
      </div>

      {/* Bottom CTA */}
      <div className="absolute bottom-0 left-0 right-0 border-t border-border bg-background/90 backdrop-blur-md px-5 py-4">
        <Button
          className="w-full"
          size="lg"
          onClick={() => void submit()}
          disabled={!isValid || isSubmitting}
        >
          {isSubmitting ? '생성 중...' : '챌린지 만들기'}
        </Button>
      </div>
    </AppShell>
  );
}
