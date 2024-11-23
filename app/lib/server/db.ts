import { PrismaClient } from "@prisma/client";

declare global {
  // allow global `var` declarations
  // eslint-disable-next-line no-var
  var db: PrismaClient | undefined;
}

// biome-ignore lint/suspicious/noRedeclare: avoid creating multiple connection on hot reload
export const db =
  global.db ||
  new PrismaClient({
    // log: ["query"],
  });

if (process.env.NODE_ENV !== "production") global.db = db;
