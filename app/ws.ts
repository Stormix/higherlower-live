import { defineEventHandler, defineWebSocket } from "vinxi/http";
import { twitchService } from "./lib/server/services/twitch";
import { sendMessage } from "./lib/server/utils";
import type { Message } from "./types/socket";

export default defineEventHandler({
  handler() {},
  websocket: defineWebSocket({
    open(peer) {
      console.log("WebSocket open", peer.id);
      sendMessage(peer, {
        type: "connected",
        payload: {},
      });
    },
    async message(peer, msg) {
      const message = JSON.parse(msg.text()) as Message;
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
          });
          break;
        }
      }
    },
    async close(peer, details) {
      console.log("WebSocket close", peer.id, details.reason);
    },
    async error(peer, error) {
      console.error("WebSocket error", peer.id, error);
    },
  }),
});
