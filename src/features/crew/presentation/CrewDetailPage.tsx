'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Send, Users, Sparkles, Video } from 'lucide-react';
import { AppShell } from '@/shared/components/layout/AppShell';
import { useCrewDetail } from '../application/useCrewDetail';
import { useCrewChat } from '../application/useCrewChat';
import { useAuth } from '@/features/auth/application/store/AuthContext';
import { formatRelativeTime } from '@/shared/utils/formatDate';
import { cn } from '@/shared/utils/cn';

type Tab = 'chat' | 'members' | 'recommend';

interface CrewDetailPageProps {
  crewId: string;
}

export function CrewDetailPage({ crewId }: CrewDetailPageProps) {
  const router = useRouter();
  const { currentUser } = useAuth();
  const { crew, recommendations, isLoading } = useCrewDetail(crewId);
  const { messages, isSending, sendMessage } = useCrewChat(crewId, currentUser?.id);

  const [activeTab, setActiveTab] = useState<Tab>('chat');
  const [inputValue, setInputValue] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // 새 메시지 도착 시 스크롤
  useEffect(() => {
    if (activeTab === 'chat') {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, activeTab]);

  const handleSend = async () => {
    const content = inputValue.trim();
    if (!content || isSending) return;
    setInputValue('');
    await sendMessage(content);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      void handleSend();
    }
  };

  if (isLoading || !crew) {
    return (
      <AppShell className="bg-background">
        <div className="flex h-full items-center justify-center text-muted">로딩 중...</div>
      </AppShell>
    );
  }

  return (
    <AppShell className="bg-background">
      {/* Header */}
      <header className="flex items-center gap-3 border-b border-border bg-background/80 px-4 py-4 backdrop-blur-md">
        <button
          onClick={() => router.back()}
          className="flex h-9 w-9 items-center justify-center rounded-xl hover:bg-surface transition-colors"
        >
          <ArrowLeft className="h-5 w-5 text-foreground" />
        </button>
        <div className="flex-1 min-w-0">
          <h1 className="truncate font-bold text-foreground">{crew.challenge.title}</h1>
          <p className="text-xs text-muted">{crew.members.length}명의 크루원</p>
        </div>
      </header>

      {/* Tabs */}
      <div className="flex border-b border-border">
        {([
          { key: 'chat', label: '채팅', icon: <Send className="h-3.5 w-3.5" /> },
          { key: 'members', label: '멤버', icon: <Users className="h-3.5 w-3.5" /> },
          { key: 'recommend', label: 'AI 추천', icon: <Sparkles className="h-3.5 w-3.5" /> },
        ] as { key: Tab; label: string; icon: React.ReactNode }[]).map(({ key, label, icon }) => (
          <button
            key={key}
            onClick={() => setActiveTab(key)}
            className={cn(
              'flex flex-1 items-center justify-center gap-1.5 py-3 text-sm font-medium transition-colors',
              activeTab === key
                ? 'border-b-2 border-primary text-primary'
                : 'text-muted hover:text-foreground',
            )}
          >
            {icon}
            {label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      {activeTab === 'chat' && (
        <>
          {/* Messages */}
          <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3">
            {messages.length === 0 ? (
              <div className="flex flex-col items-center justify-center pt-16 text-center">
                <span className="text-3xl mb-2">💬</span>
                <p className="text-sm text-muted">아직 메시지가 없어요.<br />첫 메시지를 보내보세요!</p>
              </div>
            ) : (
              messages.map((msg) => {
                const isMe = msg.sender.id === currentUser?.id || msg.sender.nickname === '나';
                return (
                  <div
                    key={msg.id}
                    className={cn('flex gap-2', isMe ? 'flex-row-reverse' : 'flex-row')}
                  >
                    {/* Avatar */}
                    {!isMe && (
                      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary text-xs font-bold">
                        {msg.sender.nickname.slice(0, 1)}
                      </div>
                    )}
                    <div className={cn('flex flex-col gap-1', isMe ? 'items-end' : 'items-start')}>
                      {!isMe && (
                        <span className="text-xs text-muted px-1">{msg.sender.nickname}</span>
                      )}
                      <div
                        className={cn(
                          'max-w-[70vw] rounded-2xl px-4 py-2 text-sm',
                          isMe
                            ? 'rounded-tr-sm bg-primary text-white'
                            : 'rounded-tl-sm bg-surface text-foreground',
                        )}
                      >
                        {msg.content}
                      </div>
                      <span className="text-[10px] text-subtle px-1">
                        {formatRelativeTime(msg.created_at)}
                      </span>
                    </div>
                  </div>
                );
              })
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="border-t border-border bg-background px-4 py-3">
            <div className="flex items-center gap-2 rounded-2xl bg-surface px-4 py-2">
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="메시지를 입력하세요..."
                className="flex-1 bg-transparent text-sm text-foreground placeholder:text-subtle outline-none"
              />
              <button
                onClick={() => void handleSend()}
                disabled={!inputValue.trim() || isSending}
                className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-white transition-opacity disabled:opacity-40"
              >
                <Send className="h-4 w-4" />
              </button>
            </div>
          </div>
        </>
      )}

      {activeTab === 'members' && (
        <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3">
          {crew.members.map((member) => (
            <div
              key={member.user.id}
              className="flex items-center gap-3 rounded-2xl bg-surface p-4 border border-border"
            >
              <div className="flex h-11 w-11 items-center justify-center rounded-full bg-primary/10 text-primary font-bold text-base">
                {member.user.nickname.slice(0, 1)}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-foreground">{member.user.nickname}</p>
                <p className="text-xs text-muted mt-0.5">
                  {formatRelativeTime(member.joined_at)} 참여
                </p>
              </div>
              {member.user.id === crew.challenge.host?.id && (
                <span className="rounded-full bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary">
                  크루장
                </span>
              )}
            </div>
          ))}
        </div>
      )}

      {activeTab === 'recommend' && (
        <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
          <p className="text-xs text-muted text-center">
            AI가 우리 크루에 맞는 다음 챌린지를 추천해줘요 ✨
          </p>
          {recommendations.length === 0 ? (
            <div className="flex flex-col items-center justify-center pt-12 text-center">
              <Sparkles className="h-10 w-10 text-primary/30 mb-3" />
              <p className="text-sm text-muted">추천 챌린지를 불러오는 중이에요...</p>
            </div>
          ) : (
            recommendations.map((rec) => (
              <div
                key={rec.challenge_id}
                className="rounded-2xl border border-border bg-surface p-4 space-y-2"
              >
                <div className="flex items-start gap-2">
                  <Video className="h-4 w-4 text-primary mt-0.5 shrink-0" />
                  <h3 className="font-semibold text-foreground text-sm">{rec.title}</h3>
                </div>
                <p className="text-xs text-muted leading-relaxed pl-6">{rec.reason}</p>
              </div>
            ))
          )}
        </div>
      )}
    </AppShell>
  );
}
