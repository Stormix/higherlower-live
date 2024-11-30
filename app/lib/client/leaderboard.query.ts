import { queryOptions, useSuspenseQuery } from "@tanstack/react-query";
import { createServerFn } from "@tanstack/start";
import { toLeaderboardDto } from "../dto/leaderboard";
import leaderboardService from "../server/services/leaderboard";

export const getLeaderboard = createServerFn({ method: "GET" }).handler(
  async (ctx) => {
    try {
      const streamers = await leaderboardService.getTopStreamers();
      const viewers = await leaderboardService.getTopViewers();

      return toLeaderboardDto(streamers, viewers);
    } catch (error) {
      console.error("Error getting leaderboard", error);
      return { streamers: [], viewers: [] };
    }
  }
);

export const leaderboardQueryOptions = ({
  refetchInterval = 10000,
}: { refetchInterval?: number } = {}) =>
  queryOptions({
    queryKey: ["getLeaderboard"],
    queryFn: () => getLeaderboard(),
    refetchInterval,
  });

export const useLeaderboardQuery = ({
  refetchInterval,
}: { refetchInterval?: number } = {}) => {
  return useSuspenseQuery(leaderboardQueryOptions({ refetchInterval }));
};
