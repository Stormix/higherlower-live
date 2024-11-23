import type { TwitchMessage } from "./twitch";

export type MessageType =
  | "subscribe"
  | "unsubscribe"
  | "twitchMessage"
  | "connected";

export type MessageData = {
  subscribe: { channel: string };
  unsubscribe: { channel: string };
  twitchMessage: TwitchMessage;
  // biome-ignore lint/complexity/noBannedTypes: <explanation>
  connected: {};
};

export type Message = {
  [K in MessageType]: {
    type: K;
    payload: MessageData[K];
  };
}[MessageType];
