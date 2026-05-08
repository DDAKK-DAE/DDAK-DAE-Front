'use client';

import Link from 'next/link';
import { Users, ChevronRight, MessageSquare } from 'lucide-react';
import { useMyCrews } from '../application/useMyCrews';
import { formatRelativeTime } from '@/shared/utils/formatDate';
import { AppShell } from '@/shared/components/layout/AppShell';
import type { CrewSummary } from '@/features/crew/domain/entities/Crew';

export function CrewListPage() {
    const { crews, isLoading } = useMyCrews();

    return (
        <AppShell className="bg-background">
            {/* Header */}
            <header className="sticky top-0 z-10 bg-gradient-to-b from-[#c0ddb8] to-[#a8cc9e] px-6 pt-5 pb-6 shadow-[0_2px_10px_rgba(6,83,11,0.1)]">
                <p className="text-xs font-semibold text-primary/70 tracking-widest uppercase mb-1">My Crews</p>
                <h1 className="text-2xl font-bold text-foreground tracking-tight">내 크루</h1>
                <p className="text-sm text-muted mt-0.5">참여 중인 챌린지 팀원들과 대화해보세요</p>
            </header>

            {/* Crew List */}
            <div className="flex-1 overflow-y-auto px-4 pb-20">
                {isLoading ? (
                    <div className="flex h-40 items-center justify-center text-muted">로딩 중...</div>
                ) : crews.length === 0 ? (
                    <div className="flex flex-col items-center justify-center pt-20 text-center">
                        <span className="text-4xl mb-4">👥</span>
                        <p className="text-muted">아직 참여 중인 크루가 없어요.<br />피드에서 챌린지에 도전해보세요!</p>
                    </div>
                ) : (
                    <div className="space-y-3 pt-2">
                        {crews.map((crew: CrewSummary) => (
                            <Link
                                key={crew.crew_id}
                                href={`/crews/${crew.crew_id}`}
                                className="group relative flex items-center gap-4 rounded-2xl bg-surface p-4 border border-border hover:border-primary/30 transition-all active:scale-[0.98]"
                            >
                                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
                                    <Users className="h-6 w-6" />
                                </div>

                                <div className="flex-1 min-w-0">
                                    <h3 className="font-bold text-foreground truncate group-hover:text-primary transition-colors">
                                        {crew.challenge_title}
                                    </h3>
                                    <div className="flex items-center gap-3 mt-1 text-xs text-muted">
                                        <span className="flex items-center gap-1">
                                            <Users className="h-3 w-3" /> {crew.member_count}명
                                        </span>
                                        {crew.last_activity_at && (
                                            <span className="flex items-center gap-1">
                                                <MessageSquare className="h-3 w-3" /> {formatRelativeTime(crew.last_activity_at)}
                                            </span>
                                        )}
                                    </div>
                                </div>

                                <ChevronRight className="h-5 w-5 text-subtle group-hover:text-primary transition-colors" />
                            </Link>
                        ))}
                    </div>
                )}
            </div>
        </AppShell>
    );
}