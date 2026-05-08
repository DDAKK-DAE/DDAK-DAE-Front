'use client';

import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, CheckCircle2, AlertCircle, UploadCloud, X, Play } from 'lucide-react';
import { AppShell } from '@/shared/components/layout/AppShell';
import { Button } from '@/shared/components/ui/Button';
import { Select } from '@/shared/components/ui/Select';
import { useUploadReel } from '../application/useUploadReel';
import { useMyCrews } from '@/features/crew/application/useMyCrews';
import { cn } from '@/shared/utils/cn';

const MAX_VIDEO_SIZE = 200 * 1024 * 1024;

const REEL_TYPE_OPTIONS = [
  {
    value: 'recruitment' as const,
    label: '모집 릴스',
    description: '혼자 찍은 챌린지 영상 — 크루원 모집용',
    color: 'border-primary/50 bg-primary/5 text-primary',
  },
  {
    value: 'completion' as const,
    label: '완료 릴스',
    description: '크루원들과 함께 찍은 완성 영상',
    color: 'border-[#07d98a]/50 bg-[#07d98a]/5 text-[#07d98a]',
  },
];

interface UploadReelPageProps {
  challengeId: string;
  challengeTitle?: string;
}

export function UploadReelPage({ challengeId, challengeTitle }: UploadReelPageProps) {
  const router = useRouter();
  const { upload, isUploading, uploadedReel, error } = useUploadReel();
  const { crews } = useMyCrews();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [videoPreviewUrl, setVideoPreviewUrl] = useState<string | null>(null);
  const [reelType, setReelType] = useState<'recruitment' | 'completion'>('recruitment');
  const [selectedCrewId, setSelectedCrewId] = useState<string>('');
  const [fileError, setFileError] = useState<string | null>(null);

  const isCompletionType = reelType === 'completion';

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > MAX_VIDEO_SIZE) {
      setFileError('파일 크기가 200MB를 초과해요');
      return;
    }
    if (videoPreviewUrl) URL.revokeObjectURL(videoPreviewUrl);
    setVideoFile(file);
    setVideoPreviewUrl(URL.createObjectURL(file));
    setFileError(null);
  };

  const clearFile = () => {
    if (videoPreviewUrl) URL.revokeObjectURL(videoPreviewUrl);
    setVideoFile(null);
    setVideoPreviewUrl(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleSubmit = async () => {
    if (!videoFile) return;
    if (isCompletionType && !selectedCrewId) return;

    await upload({
      challengeId,
      crewId: isCompletionType ? selectedCrewId : undefined,
      videoFile,
    });
  };

  if (uploadedReel) {
    return (
      <AppShell className="bg-background">
        <div className="flex h-full flex-col items-center justify-center px-8 text-center gap-5">
          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-primary/10">
            <CheckCircle2 className="h-10 w-10 text-primary" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-foreground">업로드 완료!</h2>
            <p className="mt-2 text-sm text-muted">릴스가 성공적으로 올라갔어요 🎉</p>
          </div>
          <div className="flex w-full flex-col gap-2">
            <Button className="w-full" onClick={() => router.push(`/challenges/${challengeId}/reels`)}>
              릴스 보러 가기
            </Button>
            <Button variant="secondary" className="w-full" onClick={() => router.back()}>
              돌아가기
            </Button>
          </div>
        </div>
      </AppShell>
    );
  }

  return (
    <AppShell className="bg-background">
      <header className="flex items-center gap-3 border-b border-border bg-background/80 px-4 py-4 backdrop-blur-md shrink-0">
        <button
          onClick={() => router.back()}
          className="flex h-9 w-9 items-center justify-center rounded-xl hover:bg-surface transition-colors"
        >
          <ArrowLeft className="h-5 w-5 text-foreground" />
        </button>
        <div className="flex-1 min-w-0">
          <h1 className="font-bold text-foreground">릴스 올리기</h1>
          {challengeTitle && (
            <p className="text-xs text-muted truncate mt-0.5">{challengeTitle}</p>
          )}
        </div>
      </header>

      <div className="flex-1 overflow-y-auto px-5 pb-32 pt-6 space-y-6">

        {/* 릴스 타입 선택 */}
        <section className="space-y-3">
          <label className="text-sm font-semibold text-foreground">릴스 종류</label>
          <div className="space-y-2">
            {REEL_TYPE_OPTIONS.map((opt) => (
              <button
                key={opt.value}
                onClick={() => setReelType(opt.value)}
                className={cn(
                  'w-full rounded-2xl border p-4 text-left transition-all',
                  reelType === opt.value
                    ? opt.color
                    : 'border-border bg-surface text-foreground hover:border-border/60',
                )}
              >
                <p className="font-semibold text-sm">{opt.label}</p>
                <p className={cn('text-xs mt-0.5', reelType === opt.value ? 'opacity-70' : 'text-muted')}>
                  {opt.description}
                </p>
              </button>
            ))}
          </div>
        </section>

        {/* 크루 선택 (완료 릴스일 때) */}
        {isCompletionType && (
          <section className="space-y-2">
            <label className="text-sm font-semibold text-foreground">
              함께한 크루 <span className="text-red-400">*</span>
            </label>
            <Select
              value={selectedCrewId}
              onChange={setSelectedCrewId}
              placeholder="크루 선택..."
              options={crews.map((crew) => ({
                value: crew.crewId,
                label: `${crew.challengeTitle} (${crew.memberCount}명)`,
              }))}
            />
            {!selectedCrewId && (
              <p className="text-xs text-muted">완료 릴스는 크루를 선택해야 해요</p>
            )}
          </section>
        )}

        {/* 영상 파일 선택 */}
        <section className="space-y-3">
          <label className="text-sm font-semibold text-foreground">
            영상 파일 <span className="text-red-400">*</span>
          </label>

          <input
            ref={fileInputRef}
            type="file"
            accept="video/*"
            className="hidden"
            onChange={handleFileChange}
          />

          {!videoFile ? (
            <button
              onClick={() => fileInputRef.current?.click()}
              className="w-full rounded-2xl border-2 border-dashed border-border bg-surface/60 backdrop-blur-sm p-8 flex flex-col items-center gap-3 hover:border-primary/40 hover:bg-primary/5 transition-all"
            >
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-primary/10">
                <UploadCloud className="h-7 w-7 text-primary" />
              </div>
              <div className="text-center">
                <p className="text-sm font-medium text-foreground">영상 파일 선택</p>
                <p className="text-xs text-muted mt-1">최대 200MB · MP4, MOV 등</p>
              </div>
            </button>
          ) : (
            <div className="rounded-2xl border border-border bg-surface overflow-hidden">
              <div className="relative aspect-[9/16] max-h-64 bg-black">
                <video
                  src={videoPreviewUrl ?? undefined}
                  controls
                  playsInline
                  className="h-full w-full object-contain"
                />
              </div>
              <div className="flex items-center gap-3 px-4 py-3">
                <Play className="h-4 w-4 text-primary shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-foreground truncate">{videoFile.name}</p>
                  <p className="text-xs text-muted mt-0.5">
                    {(videoFile.size / (1024 * 1024)).toFixed(1)} MB
                  </p>
                </div>
                <button
                  onClick={clearFile}
                  className="flex h-7 w-7 items-center justify-center rounded-full hover:bg-border transition-colors"
                >
                  <X className="h-4 w-4 text-muted" />
                </button>
              </div>
            </div>
          )}

          {fileError && (
            <div className="flex items-center gap-1.5 text-xs text-red-400">
              <AlertCircle className="h-3 w-3" />
              {fileError}
            </div>
          )}
        </section>

        {error && (
          <div className="flex items-center gap-2 rounded-xl border border-red-400/30 bg-red-500/10 px-4 py-3 text-sm text-red-400">
            <AlertCircle className="h-4 w-4 shrink-0" />
            {error}
          </div>
        )}
      </div>

      <div className="absolute bottom-0 left-0 right-0 border-t border-border bg-background/90 backdrop-blur-md px-5 py-4">
        <Button
          className="w-full"
          size="lg"
          onClick={() => void handleSubmit()}
          disabled={isUploading || !videoFile || (isCompletionType && !selectedCrewId)}
        >
          {isUploading ? '업로드 중...' : '릴스 올리기'}
        </Button>
      </div>
    </AppShell>
  );
}
