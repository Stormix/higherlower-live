import type { TwitchMessage } from "./twitch";

export type MessageType =
  | "subscribe"
  | "unsubscribe"
  | "twitchMessage"
  | "connected"
  | "play"
  | "startGame"
  | "votes"
  | "endGame";

export type Option = {
  label: string;
  image: string;
  votes: number;
};

export type MessageData = {
  subscribe: { channel: string };
  unsubscribe: { channel: string };
  twitchMessage: TwitchMessage;
  // biome-ignore lint/complexity/noBannedTypes: <explanation>
  connected: {};
  play: { userId: string; lastGameId?: string };
  startGame: {
    options: Option[];
    gameId: string;
  };
  endGame: { gameId: string; winner: string; answer: number };
  votes: { options: Option[]; gameId: string };
};

export type Message = {
  [K in MessageType]: {
    type: K;
    payload: MessageData[K];
  };
}[MessageType];
