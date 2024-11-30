import type { Player } from "@/types/player";
import type { Participant, User } from "@prisma/client";

export type LeaderboardDto = {
  streamers: Player[];
  viewers: Player[];
};

export const toLeaderboardDto = (
  streamers: User[],
  viewers: Participant[]
): LeaderboardDto => ({
  streamers: streamers.map((streamer) => ({
    name: streamer.name,
    score: streamer.points,
  })),
  viewers: viewers.map((viewer) => ({
    name: viewer.username,
    score: viewer.points,
  })),
});
