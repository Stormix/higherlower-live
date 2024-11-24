import { queryOptions, useSuspenseQuery } from "@tanstack/react-query";
import { createServerFn } from "@tanstack/start";
import gameService from "../server/services/game";
import { votesService } from "../server/services/votes";

export const getVotes = createServerFn({ method: "GET" })
  .validator((data: string) => data)
  .handler(async (ctx) => {
    try {
      const gameId = ctx.data;
      if (!gameId) {
        return { votes: [0, 0], answer: null };
      }

      const votes = await votesService.getVotes(gameId);
      const result = await gameService.getResult(gameId);

      return {
        votes: votes as [number, number],
        answer: result?.answer,
        winner: result?.winner,
      };
    } catch (error) {
      console.error("Error getting votes", error);
      return { votes: [0, 0], answer: null };
    }
  });

export const votesQueryOptions = (gameId: string | null) =>
  queryOptions({
    queryKey: ["getVotes", gameId],
    queryFn: ({ queryKey }) => getVotes({ data: queryKey[1]! }),
    enabled: !!gameId,
  });

export const useVotesQuery = (gameId: string | null) => {
  return useSuspenseQuery(votesQueryOptions(gameId));
};
