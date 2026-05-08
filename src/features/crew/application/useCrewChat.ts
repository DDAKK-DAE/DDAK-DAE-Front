'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { getCrewMessagesApi } from '@/api/endpoints/crews';
import { createStompClient } from '@/api/stompClient';
import type { CrewMessage } from '@/features/crew/domain/entities/Crew';

export function useCrewChat(crewId: string, myUserId: string | undefined) {
  const [messages, setMessages] = useState<CrewMessage[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSending, setIsSending] = useState(false);
  const clientRef = useRef<ReturnType<typeof createStompClient> | null>(null);

  // 초기 히스토리 로드 + STOMP 연결
  useEffect(() => {
    let active = true;

    async function init() {
      try {
        const history = await getCrewMessagesApi(crewId);
        if (active) setMessages(history);
      } catch {
        // 히스토리 없어도 채팅 진입 허용
      } finally {
        if (active) setIsLoading(false);
      }

      const token = typeof window !== 'undefined' ? localStorage.getItem('accessToken') : null;
      if (!token || !active) return;

      const client = createStompClient(token);
      clientRef.current = client;

      client.onConnect = () => {
        client.subscribe(`/topic/crews/${crewId}`, (frame) => {
          const incoming: CrewMessage = JSON.parse(frame.body);
          setMessages((prev) => {
            // dedup — 낙관적 메시지와 브로커 echo 동시에 오면 id로 제거
            const exists = prev.some((m) => m.id === incoming.id);
            if (exists) return prev;
            // 낙관적 placeholder(opt-) 제거 후 실제 메시지 삽입
            const filtered = prev.filter(
              (m) => !m.id.startsWith('opt-') || m.content !== incoming.content,
            );
            return [...filtered, incoming];
          });
        });
      };

      client.activate();
    }

    void init();

    return () => {
      active = false;
      clientRef.current?.deactivate();
      clientRef.current = null;
    };
  }, [crewId]);

  const sendMessage = useCallback(
    (content: string) => {
      if (!content.trim()) return;

      const optimistic: CrewMessage = {
        id: `opt-${Date.now()}`,
        sender: { userId: myUserId ?? 'me', nickname: '나' },
        content,
        createdAt: new Date().toISOString(),
      };
      setMessages((prev) => [...prev, optimistic]);

      const client = clientRef.current;
      if (!client?.connected) return;

      setIsSending(true);
      try {
        client.publish({
          destination: `/app/crews/${crewId}/messages`,
          body: JSON.stringify({ content }),
        });
      } finally {
        setIsSending(false);
      }
    },
    [crewId, myUserId],
  );

  return { messages, isLoading, isSending, sendMessage };
}
