import type { Question } from "@/types/question";
import type { Stat } from "@prisma/client";
import { db } from "../db";

const bigIntMax = (...args: bigint[]) => args.reduce((m, e) => (e > m ? e : m));

class QuestionsService {
  stats: Stat[] = [];

  constructor() {
    this.loadStats();
  }

  async loadStats() {
    if (this.stats.length > 0) return;
    this.stats = await db.stat.findMany();
  }

  async getRandomStat(): Promise<Stat> {
    await this.loadStats();
    return this.stats[Math.floor(Math.random() * this.stats.length)];
  }

  async getQuestion(): Promise<Question> {
    const options = await Promise.all(
      Array.from({ length: 2 }).map(() => this.getRandomStat())
    );

    return {
      options,
      answer: this.answerQuestion(options),
    };
  }

  answerQuestion(options: Stat[]): number {
    return options.findIndex(
      (option) =>
        option.searchVolume ===
        bigIntMax(...options.map((option) => option.searchVolume))
    );
  }

  async getFollowUpQuestion(keyword: string): Promise<Question> {
    const existingStat = this.stats.find((stat) => stat.keyword === keyword);
    if (!existingStat) throw new Error("Stat not found");
    const options = [existingStat, await this.getRandomStat()];

    return {
      options,
      answer: this.answerQuestion(options),
    };
  }

  async getStat(keyword: string): Promise<Stat | null> {
    await this.loadStats();
    return this.stats.find((stat) => stat.keyword === keyword) ?? null;
  }

  async getQuestionByKeywords(keywords: string[]): Promise<Question | null> {
    const options = await Promise.all(
      keywords.map((keyword) => this.getStat(keyword))
    );
    if (options.some((option) => option === null)) return null;
    return {
      options: options as Stat[],
      answer: this.answerQuestion(options as Stat[]), // Stupid that TS doesn't infer this
    };
  }
}

export const questionsService = new QuestionsService();
