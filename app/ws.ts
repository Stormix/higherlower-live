import { defineEventHandler, defineWebSocket } from "vinxi/http";
import webSocketService from "./lib/server/services/websocket";
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
      try {
        const message = JSON.parse(msg.text()) as Message;
        await webSocketService.processMessage(message, peer);
      } catch (error) {
        console.error("WebSocket message error", error);
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
