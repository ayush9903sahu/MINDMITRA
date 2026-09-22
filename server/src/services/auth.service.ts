import bcrypt from "bcrypt";
import type { User } from "@prisma/client";
import { prisma } from "../utils/prisma";
import { AppError } from "../middleware/errorHandler";
import type { SafeUser } from "../../../shared/types/auth.types";

const SALT_ROUNDS = 12;

/** Strips passwordHash and converts dates to ISO strings for API responses. */
export function toSafeUser(user: User): SafeUser {
  return {
    id: user.id,
    email: user.email,
    createdAt: user.createdAt.toISOString(),
    updatedAt: user.updatedAt.toISOString(),
  };
}

export async function registerUser(email: string, password: string): Promise<User> {
  const normalizedEmail = email.trim().toLowerCase();

  const existing = await prisma.user.findUnique({ where: { email: normalizedEmail } });
  if (existing) {
    throw new AppError(409, "An account with this email already exists.", {
      email: "An account with this email already exists.",
    });
  }

  const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);

  const user = await prisma.user.create({
    data: { email: normalizedEmail, passwordHash },
  });

  return user;
}

export async function verifyCredentials(email: string, password: string): Promise<User> {
  const normalizedEmail = email.trim().toLowerCase();
  const user = await prisma.user.findUnique({ where: { email: normalizedEmail } });

  // Same generic message whether the email doesn't exist or the password is
  // wrong, so we never reveal which emails are registered.
  const invalidCredentialsError = new AppError(401, "Invalid email or password.");

  if (!user) {
    throw invalidCredentialsError;
  }

  const matches = await bcrypt.compare(password, user.passwordHash);
  if (!matches) {
    throw invalidCredentialsError;
  }

  return user;
}

export async function getUserById(userId: string): Promise<User | null> {
  return prisma.user.findUnique({ where: { id: userId } });
}
