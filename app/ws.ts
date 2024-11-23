import { defineEventHandler, defineWebSocket } from "vinxi/http";
import { db } from "./lib/server/db";
import { questionsService } from "./lib/server/services/questions";
import { twitchService } from "./lib/server/services/twitch";
import { votesService } from "./lib/server/services/votes";
import { sendMessage } from "./lib/server/utils";
import type { Message } from "./types/socket";

const getQuestion = async (previousGameId?: string) => {
  if (!previousGameId) {
    return questionsService.getQuestion();
  }
  const previousGame = await db.game.findUnique({
    where: { id: previousGameId },
  });
  if (!previousGame) return questionsService.getQuestion();

  return questionsService.getFollowUpQuestion(
    previousGame.options?.[previousGame?.answer]
  );
};

const gamesTimers = new Map<string, Timer>();

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

            // Fetch games created by this user within the last 30secs
            const games = await db.game.findMany({
              where: {
                userId,
                createdAt: { gte: new Date(Date.now() - 1000 * 30) },
                endsAt: { lte: new Date() },
              },
              orderBy: { createdAt: "desc" },
              take: 1,
            });

            const existingGame = games?.[0];
            const question = await getQuestion(previousGameId);

            const game = await db.game.upsert({
              where: {
                ...(existingGame
                  ? { id: existingGame.id }
                  : {
                      userId_createdAt: {
                        userId,
                        createdAt: new Date(),
                      },
                    }),
              },
              update: {},
              create: {
                userId,
                answer: question.answer,
                options: question.options.map((option) => option.keyword),
                createdAt: new Date(),
                updatedAt: new Date(),
                endsAt: new Date(Date.now() + 45000), // 45 seconds
              },
            });

            sendMessage(peer, {
              type: "startGame",
              payload: {
                options: question.options.map((option) => ({
                  label: option.keyword,
                  image: option.image,
                  votes: 0,
                })),
                gameId: game.id,
              },
            });

            gamesTimers.set(
              game.id,
              setInterval(async () => {
                const votes = await votesService.getVotes(game.id);
                sendMessage(peer, {
                  type: "votes",
                  payload: {
                    options: question.options.map((option, index) => ({
                      label: option.keyword,
                      image: option.image,
                      votes: votes[index],
                    })),
                    gameId: game.id,
                  },
                });
              }, 1)
            );
          }
        }
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
