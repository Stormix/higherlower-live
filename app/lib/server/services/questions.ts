import type { Question, Stat } from "@/types/question";
import fs from "node:fs";
import path from "node:path";

const QUESTIONS_FILE = path.join(process.cwd(), "app", "data", "results.json");

class QuestionsService {
  stats: Stat[] = [];

  constructor() {
    this.loadStats();
  }

  async loadStats() {
    if (this.stats.length > 0) return;
    const data = fs.readFileSync(QUESTIONS_FILE, "utf8");
    this.stats = JSON.parse(data);
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
        Math.max(...options.map((option) => option.searchVolume))
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
}

export const questionsService = new QuestionsService();
