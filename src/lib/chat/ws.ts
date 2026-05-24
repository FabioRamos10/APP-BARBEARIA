import { Client } from "@stomp/stompjs";
import SockJS from "sockjs-client";
import { getToken } from "@/lib/auth/token";

export function getWsUrl(): string {
  if (typeof window === "undefined") {
    return "";
  }
  return process.env.NEXT_PUBLIC_WS_URL ?? "http://localhost:8080/ws";
}

export function createChatStompClient(onConnect?: () => void): Client {
  const token = getToken();
  return new Client({
    webSocketFactory: () => new SockJS(getWsUrl()) as unknown as WebSocket,
    connectHeaders: token ? { Authorization: `Bearer ${token}` } : {},
    reconnectDelay: 5000,
    heartbeatIncoming: 10000,
    heartbeatOutgoing: 10000,
    onConnect,
  });
}

export function chatTopic(conversaId: string): string {
  return `/topic/chat.${conversaId}`;
}
