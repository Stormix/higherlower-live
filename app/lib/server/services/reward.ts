import type { Game } from "@prisma/client";
import { BASE_REWARD } from "../../config";
import { db } from "../db";

class RewardService {
  async getReward(game: Game, isCorrect: boolean, time: Date = new Date()) {
    if (!isCorrect) return 0;
    const timeLeft = (game.endsAt.getTime() - time.getTime()) / 1000;
    if (timeLeft <= 0) return 0;
    const multiplier = timeLeft / game.duration;
    return BASE_REWARD * multiplier;
  }

  async rewardStreamer(gameId: string) {
    const reward = await db.game.findUnique({
      where: { id: gameId },
      select: { prize: true, userId: true },
    });

    if (!reward) return;

    await db.user.update({
      where: { id: reward.userId },
      data: {
        points: { increment: reward.prize },
      },
    });

    // Set prize to 0
    await db.game.update({
      where: { id: gameId },
      data: { prize: 0 },
    });
  }
}

export default new RewardService();
