import { db } from "../db";

class LeaderboardService {
  async getTopStreamers(count = 10) {
    const streamers = await db.user.findMany({
      orderBy: { points: "desc" },
      take: count,
    });
    return streamers;
  }

  async getTopViewers(count = 10) {
    const viewers = await db.participant.findMany({
      orderBy: { points: "desc" },
      take: count,
    });
    return viewers;
  }
}

export default new LeaderboardService();
