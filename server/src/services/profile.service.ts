import fs from "fs/promises";
import path from "path";
import { Profile as PrismaProfile } from "@prisma/client";
import { prisma } from "../utils/prisma";
import { computeAge } from "../utils/age";
import { sanitizeShallowObject } from "../utils/sanitize";
import { UpdateProfileParsed } from "../utils/profile.validation";
import { Profile } from "../../../shared/types/profile.types";
import { PROFILE_ROUTES } from "../../../shared/constants/profile.constants";

// Avatars live outside the Express static/public tree on purpose — see
// uploadAvatar.middleware.ts and the controller for why they're served
// through an authenticated route instead of a public URL.
const AVATAR_DIR = path.join(process.cwd(), "uploads", "avatars");

async function ensureAvatarDir(): Promise<void> {
  await fs.mkdir(AVATAR_DIR, { recursive: true });
}

function extensionForMime(mimeType: string): string {
  switch (mimeType) {
    case "image/png":
      return "png";
    case "image/webp":
      return "webp";
    case "image/jpeg":
    default:
      return "jpg";
  }
}

function toApiProfile(record: PrismaProfile): Profile {
  return {
    id: record.id,
    userId: record.userId,
    fullName: record.fullName,
    dateOfBirth: record.dateOfBirth.toISOString().slice(0, 10),
    age: computeAge(record.dateOfBirth),
    gender: record.gender as Profile["gender"],
    genderCustom: record.genderCustom,
    contactEmail: record.contactEmail,
    addressLine1: record.addressLine1,
    addressLine2: record.addressLine2,
    city: record.city,
    state: record.state,
    postalCode: record.postalCode,
    country: record.country,
    avatarUrl: record.avatarPath ? PROFILE_ROUTES.avatar : null,
    createdAt: record.createdAt.toISOString(),
    updatedAt: record.updatedAt.toISOString(),
  };
}

export async function getProfileByUserId(userId: string): Promise<Profile | null> {
  const record = await prisma.profile.findUnique({ where: { userId } });
  return record ? toApiProfile(record) : null;
}

/**
 * Creates the profile on first save, updates it thereafter — the client
 * never needs to know which case it is (see PUT /api/profile as an upsert).
 * `defaultContactEmail` is only used the very first time a profile is
 * created, in case the caller wants to pre-fill it from the account email;
 * the profile.controller currently always sends contactEmail explicitly, so
 * this is mainly a safety net for future callers.
 */
export async function upsertProfile(userId: string, input: UpdateProfileParsed): Promise<Profile> {
  const clean = sanitizeShallowObject(input);

  const record = await prisma.profile.upsert({
    where: { userId },
    create: {
      userId,
      fullName: clean.fullName,
      dateOfBirth: new Date(clean.dateOfBirth),
      gender: clean.gender,
      genderCustom: clean.genderCustom,
      contactEmail: clean.contactEmail,
      addressLine1: clean.addressLine1,
      addressLine2: clean.addressLine2,
      city: clean.city,
      state: clean.state,
      postalCode: clean.postalCode,
      country: clean.country,
    },
    update: {
      fullName: clean.fullName,
      dateOfBirth: new Date(clean.dateOfBirth),
      gender: clean.gender,
      genderCustom: clean.genderCustom,
      contactEmail: clean.contactEmail,
      addressLine1: clean.addressLine1,
      addressLine2: clean.addressLine2,
      city: clean.city,
      state: clean.state,
      postalCode: clean.postalCode,
      country: clean.country,
    },
  });

  return toApiProfile(record);
}

export async function saveAvatar(userId: string, file: Express.Multer.File): Promise<Profile> {
  await ensureAvatarDir();

  const existing = await prisma.profile.findUnique({ where: { userId } });
  if (!existing) {
    // A profile row must exist before an avatar can be attached to it.
    // The client always creates the profile (PUT) before offering avatar
    // upload — see ProfilePage.tsx — but we guard here too.
    throw new ProfileNotFoundError();
  }

  const ext = extensionForMime(file.mimetype);
  const filename = `${userId}.${ext}`;
  const filePath = path.join(AVATAR_DIR, filename);

  // If a previous avatar had a different extension, remove it so we don't
  // accumulate orphaned files for this user.
  if (existing.avatarPath && existing.avatarPath !== filename) {
    await fs.rm(path.join(AVATAR_DIR, existing.avatarPath), { force: true });
  }

  await fs.writeFile(filePath, file.buffer);

  const record = await prisma.profile.update({
    where: { userId },
    data: {
      avatarPath: filename,
      avatarMimeType: file.mimetype,
      avatarUpdatedAt: new Date(),
    },
  });

  return toApiProfile(record);
}

export async function getAvatarFile(userId: string): Promise<{ buffer: Buffer; mimeType: string } | null> {
  const record = await prisma.profile.findUnique({ where: { userId } });
  if (!record?.avatarPath) return null;

  try {
    const buffer = await fs.readFile(path.join(AVATAR_DIR, record.avatarPath));
    return { buffer, mimeType: record.avatarMimeType ?? "image/jpeg" };
  } catch {
    // File missing on disk despite a DB record (e.g. manual cleanup) —
    // treat as "no avatar" rather than a 500.
    return null;
  }
}

export async function deleteAvatar(userId: string): Promise<void> {
  const record = await prisma.profile.findUnique({ where: { userId } });
  if (!record?.avatarPath) return;

  await fs.rm(path.join(AVATAR_DIR, record.avatarPath), { force: true });
  await prisma.profile.update({
    where: { userId },
    data: { avatarPath: null, avatarMimeType: null, avatarUpdatedAt: null },
  });
}

export class ProfileNotFoundError extends Error {
  constructor() {
    super("Profile not found. Save your profile details before uploading an avatar.");
    this.name = "ProfileNotFoundError";
  }
}
