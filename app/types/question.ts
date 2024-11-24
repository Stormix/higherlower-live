import type { Stat } from "@prisma/client";

export interface Question {
  options: Stat[];
  answer: number;
}
