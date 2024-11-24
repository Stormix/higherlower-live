import type { Message } from "@/types/socket";
import type { Peer } from "crossws";
import { toGameDto } from "../../dto/question";
import { sendMessage } from "../utils";
import gameService from "./game";
import { twitchService } from "./twitch";
import { votesService } from "./votes";

class WebSocketService {
  async processMessage(message: Message, peer: Peer) {
    switch (message.type) {
      case "subscribe": {
        const channel = message?.payload?.channel;
        if (!channel) {
          return;
        }
        twitchService.connectToChat(channel, (message) => {
          sendMessage(peer, {
            type: "twitchMessage",
            payload: message,
          });

          // Register vote
          votesService.vote(channel, message.username, message.message);
        });
        break;
      }
      case "play": {
        const userId = message?.payload?.userId;
        const previousGameId = message?.payload?.lastGameId;

        if (!userId) {
          return;
        }

        const { game, question } = await gameService.createGame(
          userId,
          previousGameId
        );

        if (!question) {
          console.warn("Found a game without a question");
          return;
        }

        sendMessage(peer, {
          type: "startGame",
          payload: {
            ...toGameDto(game, question!),
            endsAt: game.endsAt.toISOString(),
          },
        });
      }
    }
  }
}

const webSocketService = new WebSocketService();
export default webSocketService;
