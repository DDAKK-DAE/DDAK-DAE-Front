'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { getCrewMessagesApi, sendCrewMessageApi } from '@/api/endpoints/crews';
import type { CrewMessage } from '@/features/crew/domain/entities/Crew';

const POLL_INTERVAL = 5000;

const MOCK_MESSAGES: CrewMessage[] = [
  {
    id: 'm1',
    sender: { id: 'u2', nickname: '이지은' },
    content: '오늘 촬영 몇 시에 모이나요?',
    created_at: new Date(Date.now() - 600000).toISOString(),
  },
  {
    id: 'm2',
    sender: { id: 'u3', nickname: '박민준' },
    content: '저는 오후 3시 이후면 괜찮아요!',
    created_at: new Date(Date.now() - 300000).toISOString(),
  },
  {
    id: 'm3',
    sender: { id: 'u1', nickname: '김세현' },
    content: '저도 3시 ㄱㄱ 🙌',
    created_at: new Date(Date.now() - 60000).toISOString(),
  },
];

export function useCrewChat(crewId: string, myUserId: string | undefined) {
  const [messages, setMessages] = useState<CrewMessage[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSending, setIsSending] = useState(false);
  const lastMessageAtRef = useRef<string | undefined>(undefined);
  const useMockRef = useRef(false);

  // 초기 메시지 로딩
  useEffect(() => {
    async function fetchInitial() {
      try {
        if (!process.env.NEXT_PUBLIC_API_BASE_URL) throw new Error('no api url');
        const data = await getCrewMessagesApi(crewId);
        setMessages(data);
        if (data.length > 0) {
          lastMessageAtRef.current = data[data.length - 1].created_at;
        }
      } catch {
        useMockRef.current = true;
        setMessages(MOCK_MESSAGES);
        lastMessageAtRef.current = MOCK_MESSAGES[MOCK_MESSAGES.length - 1].created_at;
      } finally {
        setIsLoading(false);
      }
    }

    fetchInitial();
  }, [crewId]);

  // 5초 폴링
  useEffect(() => {
    if (useMockRef.current) return;

    const timer = setInterval(async () => {
      try {
        const newMessages = await getCrewMessagesApi(crewId, {
          after: lastMessageAtRef.current,
        });
        if (newMessages.length > 0) {
          setMessages((prev) => [...prev, ...newMessages]);
          lastMessageAtRef.current = newMessages[newMessages.length - 1].created_at;
        }
      } catch {
        // 폴링 실패는 조용히 무시
      }
    }, POLL_INTERVAL);

    return () => clearInterval(timer);
  }, [crewId]);

  const sendMessage = useCallback(
    async (content: string) => {
      if (!content.trim()) return;

      // 낙관적 업데이트
      const optimistic: CrewMessage = {
        id: `opt-${Date.now()}`,
        sender: { id: myUserId ?? 'me', nickname: '나' },
        content,
        created_at: new Date().toISOString(),
      };
      setMessages((prev) => [...prev, optimistic]);

      if (useMockRef.current) return;

      setIsSending(true);
      try {
        const sent = await sendCrewMessageApi(crewId, { content });
        // 낙관적 메시지를 실제 메시지로 교체
        setMessages((prev) => prev.map((m) => (m.id === optimistic.id ? sent : m)));
        lastMessageAtRef.current = sent.created_at;
      } catch {
        // 전송 실패 시 낙관적 메시지 제거
        setMessages((prev) => prev.filter((m) => m.id !== optimistic.id));
      } finally {
        setIsSending(false);
      }
    },
    [crewId, myUserId],
  );

  return { messages, isLoading, isSending, sendMessage };
}
