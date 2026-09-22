import { PrismaClient } from "@prisma/client";

/**
 * Shared Prisma client singleton.
 * Other modules (Profile, Games, Progress, Reminders) should import this
 * same instance rather than instantiating their own PrismaClient.
 */
declare global {
  // eslint-disable-next-line no-var
  var __braincarePrisma: PrismaClient | undefined;
}

export const prisma: PrismaClient =
  global.__braincarePrisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === "development" ? ["warn", "error"] : ["error"],
  });

if (process.env.NODE_ENV !== "production") {
  global.__braincarePrisma = prisma;
}
