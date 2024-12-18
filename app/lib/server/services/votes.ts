import { BASE_STREAMER_PENALTY, BASE_STREAMER_REWARD } from "../../config";
import { db } from "../db";
import gameService from "./game";
import rewardService from "./reward";

class VotesService {
  async vote(channel: string, username: string, message: string) {
    try {
      const vote = message.match(/^(!?[12])$/)?.[1];
      if (!vote) {
        return;
      }

      // Register vote
      const user = await db.user.findFirst({
        where: {
          name: channel,
        },
      });

      if (!user) {
        console.warn("No user found for channel", channel);
        return;
      }

      const game = await gameService.getOngoingGame(user.id);

      if (!game) {
        console.warn("No active game found for user:", channel);
        return;
      }
      const answer = vote === "1" ? 0 : 1;

      await db.vote.upsert({
        where: {
          gameId_username: {
            gameId: game.id,
            username,
          },
        },
        create: {
          gameId: game.id,
          username,
          answer,
          isCorrect: game.answer === answer,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        update: {},
      });

      const points = await rewardService.getReward(
        game,
        game.answer === answer
      );

      // Award points and upsert participant
      await db.participant.upsert({
        where: {
          username: username.toLowerCase(),
        },
        create: {
          username: username.toLowerCase(),
          points,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        update: {
          points: {
            increment: points,
          },
        },
      });

      await db.game.update({
        where: { id: game.id },
        data: {
          prize: {
            increment:
              game.answer === answer
                ? BASE_STREAMER_REWARD
                : -BASE_STREAMER_PENALTY,
          },
        },
      });
    } catch (error) {
      console.error(error);
    }
  }

  async getVotes(gameId: string): Promise<[number, number]> {
    try {
      const votes = await db.vote.groupBy({
        by: ["answer"],
        where: {
          gameId: gameId,
        },
        _count: {
          answer: true,
        },
      });

      // Initialize array with zeros for both options
      const results: [number, number] = [0, 0];

      // Fill in the actual vote counts
      for (const vote of votes) {
        results[vote.answer] = vote._count.answer;
      }

      return results;
    } catch (error) {
      console.error(error);
      return [0, 0];
    }
  }
}

export const votesService = new VotesService();
