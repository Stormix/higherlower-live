import type { Stat } from "@/types/question";
import fs from "node:fs";
import path from "node:path";
import { db } from "../lib/server/db";

const seed = async () => {
  const QUESTIONS_FILE = path.join(
    process.cwd(),
    "app",
    "data",
    "results.json"
  );

  const data = fs.readFileSync(QUESTIONS_FILE, "utf8");
  const stats = JSON.parse(data) as Stat[];

  await db.stat.createMany({
    data: stats,
  });
};

seed()
  .then(() => console.log("Seed completed"))
  .catch(console.error)
  .finally(() => process.exit(0));
