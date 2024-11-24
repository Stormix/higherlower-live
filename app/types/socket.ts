import type { OptionDto } from "@/lib/dto/question";
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

export type MessageData = {
  subscribe: { channel: string };
  unsubscribe: { channel: string };
  twitchMessage: TwitchMessage;
  connected: {};
  play: { userId: string; lastGameId?: string };
  startGame: {
    options: OptionDto[];
    gameId: string;
    endsAt: string;
  };
  endGame: { gameId: string; winner: string; answer: number };
  votes: { options: OptionDto[]; gameId: string };
};

export type Message = {
  [K in MessageType]: {
    type: K;
    payload: MessageData[K];
  };
}[MessageType];
