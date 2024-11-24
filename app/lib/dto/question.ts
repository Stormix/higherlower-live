import type { Question } from "@/types/question";
import type { Game } from "@prisma/client";

export type OptionDto = {
  label: string;
  image: string;
  votes: number;
};

export type GameDto = {
  options: OptionDto[];
  gameId: string;
};

export const toGameDto = (game: Game, question: Question): GameDto => ({
  options: question.options.map((option) => ({
    label: option.keyword,
    image: option.image,
    votes: 0,
  })),
  gameId: game.id,
});
