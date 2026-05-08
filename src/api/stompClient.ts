import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';

export function createStompClient(token: string): Client {
  return new Client({
    webSocketFactory: () =>
      new SockJS(process.env.NEXT_PUBLIC_WS_URL ?? 'http://localhost:8080/ws'),
    connectHeaders: { Authorization: `Bearer ${token}` },
    reconnectDelay: 3000,
    heartbeatIncoming: 10000,
    heartbeatOutgoing: 10000,
  });
}
