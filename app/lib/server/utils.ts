import type { Message } from "@/types/socket";
import type { Peer } from "crossws";

export const sendMessage = (socket: WebSocket | Peer, message: Message) => {
  socket.send(JSON.stringify(message));
};

export const formatTimestamp = (timestamp: Date) => {
  return timestamp.getTime();
};
