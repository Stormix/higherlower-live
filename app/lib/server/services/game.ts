import type { Game } from "@prisma/client";
import { db } from "../db";
import { questionsService } from "./questions";

class GameService {
  async getGame(gameId: string) {
    return db.game.findUnique({
      where: { id: gameId },
    });
  }

  async getWinner(game: Game | null) {
    if (!game) return null;
    if (game.winner) return game.winner;

    // Get the first ever vote that votes the right answer
    const winnerVote = await db.vote.findFirst({
      where: { gameId: game.id, answer: game.answer },
      orderBy: { createdAt: "asc" },
    });

    if (!winnerVote) return null;

    await db.game.update({
      where: { id: game.id },
      data: { winner: winnerVote.username },
    });

    return winnerVote?.username;
  }

  async getResult(gameId: string) {
    const game = await db.game.findUnique({
      where: { id: gameId },
    });
    if (!game) return null;
    return {
      answer: game.endsAt < new Date() ? game.answer : null,
      winner: await this.getWinner(game),
    };
  }

  async getOngoingGame(userId: string) {
    // Fetch ongoing games created by this user
    const games = await db.game.findMany({
      where: {
        userId,
        endsAt: { gt: new Date() },
      },
      orderBy: { createdAt: "desc" },
      take: 1,
    });
    return games?.[0] ?? null;
  }

  async createQuestion(previousGameId?: string) {
    if (!previousGameId) return questionsService.getQuestion();
    const previousGame = await db.game.findUnique({
      where: { id: previousGameId },
    });
    if (!previousGame) return questionsService.getQuestion();
    return questionsService.getFollowUpQuestion(
      previousGame.options?.[previousGame?.answer]
    );
  }

  async createGame(userId: string, previousGameId?: string, duration = 2000) {
    const ongoingGame = await this.getOngoingGame(userId);
    if (ongoingGame)
      return {
        game: ongoingGame,
        question: await questionsService.getQuestionByKeywords(
          ongoingGame.options
        ),
      };

    const question = await this.createQuestion(previousGameId);
    const currentGame = await db.game.create({
      data: {
        userId,
        answer: question.answer,
        options: question.options.map((option) => option.keyword),
        createdAt: new Date(),
        updatedAt: new Date(),
        endsAt: new Date(Date.now() + duration),
      },
    });

    return { game: currentGame, question };
  }
}

const gameService = new GameService();
export default gameService;
