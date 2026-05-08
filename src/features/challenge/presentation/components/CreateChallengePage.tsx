'use client';

import { useRef } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Plus, X, Minus, UploadCloud, Music, Sparkles, Video } from 'lucide-react';
import { AppShell } from '@/shared/components/layout/AppShell';
import { Button } from '@/shared/components/ui/Button';
import { DatePicker } from '@/shared/components/ui/DatePicker';
import { useCreateChallenge, type UploadProgress } from '../../application/hooks/useCreateChallenge';
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

const PROGRESS_LABELS: Record<UploadProgress, string> = {
  idle: '챌린지 만들기',
  uploadingVideo: '영상 업로드 중...',
  uploadingAudio: '음원 업로드 중...',
  creating: '챌린지 생성 중...',
  attachingReel: '모집 릴스 등록 중...',
};

function formatBytes(bytes: number): string {
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)}KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)}MB`;
}

export function CreateChallengePage() {
  const router = useRouter();
  const videoInputRef = useRef<HTMLInputElement>(null);
  const audioInputRef = useRef<HTMLInputElement>(null);

  const {
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
  } = useCreateChallenge();

  const today = new Date().toISOString().split('T')[0];
  const isVideoTooLarge = form.videoFile ? form.videoFile.size > 200 * 1024 * 1024 : false;
  const videoObjectUrl = form.videoFile ? URL.createObjectURL(form.videoFile) : null;

  const canGenerateAi =
    form.title.trim().length > 0 && form.locationText.trim().length > 0 && !isGeneratingAi;

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

        {/* 모집 릴스 영상 — 핵심 UX: 영상이 곧 모집 공고 */}
        <section className="space-y-2">
          <label className="text-sm font-semibold text-foreground">
            모집 릴스 영상 <span className="text-[#e8356e]">*</span>
          </label>
          <p className="text-xs text-muted">혼자 찍은 영상을 올려서 같이 찍을 사람을 모아보세요</p>

          <input
            ref={videoInputRef}
            type="file"
            accept="video/*"
            className="hidden"
            onChange={(e) => {
              const file = e.target.files?.[0] ?? null;
              updateField('videoFile', file);
              e.target.value = '';
            }}
          />

          {form.videoFile ? (
            <div className="relative rounded-2xl overflow-hidden border border-primary/30">
              <video
                src={videoObjectUrl ?? undefined}
                className="w-full aspect-[9/16] object-cover bg-surface"
                muted
                autoPlay
                loop
                playsInline
              />
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-background/90 to-transparent px-4 py-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-foreground truncate max-w-[200px]">
                    {form.videoFile.name}
                  </span>
                  <span className={cn('text-xs ml-2 shrink-0', isVideoTooLarge ? 'text-[#e8356e]' : 'text-muted')}>
                    {formatBytes(form.videoFile.size)}
                    {isVideoTooLarge && ' (200MB 초과)'}
                  </span>
                </div>
              </div>
              <button
                onClick={() => updateField('videoFile', null)}
                className="absolute top-3 right-3 flex h-8 w-8 items-center justify-center rounded-xl bg-background/80 backdrop-blur-sm text-foreground hover:bg-surface transition-colors"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          ) : (
            <button
              onClick={() => videoInputRef.current?.click()}
              className="relative w-full aspect-[9/16] rounded-2xl overflow-hidden flex flex-col items-center justify-center gap-3 transition-all"
              style={{
                background: 'rgba(18,30,23,0.6)',
                backdropFilter: 'blur(24px)',
                padding: '1px',
              }}
            >
              <div
                className="absolute inset-0 rounded-2xl"
                style={{
                  background: 'linear-gradient(135deg, rgba(5,166,107,0.3) 0%, rgba(232,53,110,0.2) 100%)',
                  padding: '1px',
                  WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
                  WebkitMaskComposite: 'xor',
                  maskComposite: 'exclude',
                }}
              />
              <div className="flex flex-col items-center gap-3 px-6 text-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 border border-primary/30">
                  <UploadCloud className="h-8 w-8 text-primary" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-foreground">모집 릴스 영상 추가</p>
                  <p className="mt-1 text-xs text-muted">탭해서 영상을 선택하세요 (최대 200MB)</p>
                </div>
              </div>
            </button>
          )}
        </section>

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
            value={form.locationText}
            onChange={(e) => updateField('locationText', e.target.value)}
            placeholder="예: 서울 홍대 야외무대"
            className={INPUT_BASE}
          />
        </section>

        {/* 마감일 */}
        <section className="space-y-2">
          <label className="text-sm font-semibold text-foreground">
            모집 마감일 <span className="text-[#e8356e]">*</span>
          </label>
          <DatePicker
            value={form.deadlineAt}
            onChange={(v) => updateField('deadlineAt', v)}
            min={today}
          />
        </section>

        {/* 최대 인원 */}
        <section className="space-y-2">
          <label className="text-sm font-semibold text-foreground">최대 인원</label>
          <div className="flex items-center gap-4">
            <button
              onClick={() => updateField('maxParticipants', Math.max(2, form.maxParticipants - 1))}
              disabled={form.maxParticipants <= 2}
              className="flex h-10 w-10 items-center justify-center rounded-xl bg-surface border border-border text-foreground disabled:opacity-30 transition-opacity"
            >
              <Minus className="h-4 w-4" />
            </button>
            <div className="flex-1 text-center">
              <span className="text-2xl font-bold text-foreground">{form.maxParticipants}</span>
              <span className="ml-1 text-sm text-muted">명</span>
            </div>
            <button
              onClick={() => updateField('maxParticipants', Math.min(6, form.maxParticipants + 1))}
              disabled={form.maxParticipants >= 6}
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
                  i < form.maxParticipants - 1 ? 'bg-primary' : 'bg-border',
                )}
              />
            ))}
          </div>
          <p className="text-center text-xs text-subtle">최소 2명 · 최대 6명</p>
        </section>

        {/* 설명 + AI 자동작성 */}
        <section className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-sm font-semibold text-foreground">소개 (선택)</label>
            <button
              onClick={() => void generateAiDescription()}
              disabled={!canGenerateAi}
              className={cn(
                'flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium border transition-all',
                canGenerateAi
                  ? 'border-primary/50 text-primary hover:bg-primary/10'
                  : 'border-border text-subtle opacity-40 cursor-not-allowed',
              )}
            >
              <Sparkles className="h-3 w-3" />
              {isGeneratingAi ? 'AI 작성 중...' : 'AI 자동작성'}
            </button>
          </div>
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

        {/* 챌린지 음원 (선택) */}
        <section className="space-y-2">
          <label className="text-sm font-semibold text-foreground">챌린지 음원 (선택)</label>
          <p className="text-xs text-muted">선택하지 않으면 영상 음원이 사용돼요</p>

          <input
            ref={audioInputRef}
            type="file"
            accept="audio/*"
            className="hidden"
            onChange={(e) => {
              const file = e.target.files?.[0] ?? null;
              updateField('audioFile', file);
              e.target.value = '';
            }}
          />

          {form.audioFile ? (
            <div className="flex items-center gap-3 rounded-xl bg-surface border border-border px-4 py-3">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-primary/10">
                <Music className="h-4 w-4 text-primary" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm text-foreground truncate">{form.audioFile.name}</p>
                <p className="text-xs text-muted">{formatBytes(form.audioFile.size)}</p>
              </div>
              <button
                onClick={() => updateField('audioFile', null)}
                className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg hover:bg-elevated transition-colors"
              >
                <X className="h-3.5 w-3.5 text-muted" />
              </button>
            </div>
          ) : (
            <button
              onClick={() => audioInputRef.current?.click()}
              className="flex w-full items-center gap-3 rounded-xl bg-surface/60 border border-border px-4 py-3 hover:border-primary/40 transition-colors"
            >
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-surface border border-border">
                <Music className="h-4 w-4 text-muted" />
              </div>
              <span className="text-sm text-subtle">음원 파일 추가</span>
            </button>
          )}
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
          <p className="rounded-xl bg-[#e8356e]/10 border border-[#e8356e]/20 px-4 py-3 text-sm text-[#e8356e]">
            {error}
          </p>
        )}
      </div>

      {/* Bottom CTA */}
      <div className="absolute bottom-0 left-0 right-0 border-t border-border bg-background/90 backdrop-blur-md px-5 py-4">
        {isVideoTooLarge && (
          <p className="mb-2 text-center text-xs text-[#e8356e]">
            영상 파일이 200MB를 초과했어요
          </p>
        )}
        <Button
          className="w-full"
          size="lg"
          onClick={() => void submit()}
          disabled={!isValid || isSubmitting || isVideoTooLarge}
        >
          {isSubmitting ? (
            <span className="flex items-center gap-2">
              <Video className="h-4 w-4 animate-pulse" />
              {PROGRESS_LABELS[uploadProgress]}
            </span>
          ) : (
            PROGRESS_LABELS.idle
          )}
        </Button>
      </div>
    </AppShell>
  );
}
