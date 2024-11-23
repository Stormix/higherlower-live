import type { TwitchMessage } from "@/types/twitch";
import { ChatClient } from "@twurple/chat";
import { nanoid } from "nanoid";
import { formatTimestamp } from "../utils";

export class TwitchService {
  clients: Record<string, ChatClient> = {};

  connectToChat(channel: string, onMessage: (message: TwitchMessage) => void) {
    console.log("Connecting to Twitch chat", channel);
    if (!this.clients[channel]) {
      const chatClient = new ChatClient({
        authProvider: undefined,
        channels: [channel],
        rejoinChannelsOnReconnect: true,
        readOnly: true,
      });

      this.clients[channel] = chatClient;
    }
    this.clients[channel].onMessage((_, username, text, msg) => {
      onMessage({
        id: nanoid(),
        username,
        color: msg.tags.get("color") ?? "#000000",
        message: text,
        timestamp: formatTimestamp(msg.date),
      });
    });

    try {
      return this.clients[channel].connect();
    } catch (error) {
      console.warn(
        "Failed to connect to Twitch chat (probably already connected)",
        error
      );
    }
  }
}

export const twitchService = new TwitchService();
