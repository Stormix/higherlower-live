import { useChatStore } from "@/lib/client/store/chat";
import type { Message } from "@/types/socket";
import { type ReactNode, createContext, useContext, useEffect, useState } from "react";
import { toast } from "sonner";

interface WebSocketContextType {
  socket: WebSocket | null;
  isConnected: boolean;
  connect: (channel: string) => void;
  connectedChannel: string | null;
}

const WebSocketContext = createContext<WebSocketContextType>({
  socket: null,
  isConnected: false,
  connect: () => {},
  connectedChannel: null,
});

export const useWebSocket = () => useContext(WebSocketContext);

interface WebSocketProviderProps {
  children: ReactNode;
}

export function WebSocketProvider({ children }: WebSocketProviderProps) {
  const [socket, setSocket] = useState<WebSocket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [connectedChannel, setConnectedChannel] = useState<string | null>(null);
  const { addMessage } = useChatStore();

  const connect = (channel: string) => {
    socket?.send(JSON.stringify({ type: "subscribe", payload: { channel } }));
    setConnectedChannel(channel); // TODO: move to when we receive the message
  };

  useEffect(() => {
    const endpoint = import.meta.env.VITE_APP_URL ?? "http://localhost:3000";
    const wsProtocol = endpoint.startsWith("https") ? "wss" : "ws";
    const wsEndpoint = `${wsProtocol}://${endpoint.replace(/^https?:\/\//, "")}/ws`;
    const ws = new WebSocket(wsEndpoint);

    ws.onopen = () => {
      console.log("WebSocket open");
      setIsConnected(true);
    };

    ws.onclose = () => {
      console.log("WebSocket close");
      setIsConnected(false);
    };

    ws.onerror = (error) => {
      console.error("WebSocket error:", error);
      toast.error("WebSocket error, please refresh the page");
    };

    setSocket(ws);

    ws.onmessage = (event) => {
      const message = JSON.parse(event.data) as Message;
      if (message.type === "twitchMessage") {
        addMessage(message.payload);
      }
    };

    return () => {
      ws.close();
    };
  }, [addMessage]);

  return (
    <WebSocketContext.Provider value={{ socket, isConnected, connect, connectedChannel }}>
      {children}
    </WebSocketContext.Provider>
  );
}
