import { Request, Response, NextFunction } from "express";
import {
  getProfileByUserId,
  upsertProfile,
  saveAvatar,
  getAvatarFile,
  deleteAvatar,
  ProfileNotFoundError,
} from "../services/profile.service";
import { updateProfileSchema } from "../utils/profile.validation";
import { AVATAR_UPLOAD } from "../../../shared/constants/profile.constants";

/**
 * All handlers below assume `requireAuth` (Module 2) has already run and
 * populated `req.user.userId`. Every query is scoped to that userId — there
 * is no route anywhere in this module that can return, list, or search
 * another user's profile. That is the privacy rule from the spec enforced
 * at the data-access layer, not just the UI layer.
 */

export async function getProfile(req: Request, res: Response, next: NextFunction) {
  try {
    const userId = req.user!.userId;
    const profile = await getProfileByUserId(userId);
    res.status(200).json({ profile, isComplete: profile !== null });
  } catch (err) {
    next(err);
  }
}

export async function updateProfile(req: Request, res: Response, next: NextFunction) {
  const result = updateProfileSchema.safeParse(req.body);

  if (!result.success) {
    const errors = result.error.issues.map((issue) => ({
      field: String(issue.path[0] ?? "form"),
      message: issue.message,
    }));
    return res.status(400).json({ message: "Please fix the highlighted fields.", errors });
  }

  try {
    const userId = req.user!.userId;
    const profile = await upsertProfile(userId, result.data);
    res.status(200).json({ profile });
  } catch (err) {
    next(err);
  }
}

export function uploadAvatarHandler(req: Request, res: Response, next: NextFunction) {
  // Actual multipart parsing happens in the `uploadAvatar` multer middleware
  // mounted on the route; by the time this handler runs, req.file is set
  // (or multer already returned a 400 via its own error, forwarded below).
  handleAvatarUpload(req, res).catch(next);
}

async function handleAvatarUpload(req: Request, res: Response) {
  const userId = req.user!.userId;

  if (!req.file) {
    return res.status(400).json({
      message: "No image file was uploaded, or the file was rejected.",
      errors: [
        {
          field: "avatar",
          message: `Upload a ${AVATAR_UPLOAD.allowedMimeTypes.join(", ")} image up to ${
            AVATAR_UPLOAD.maxSizeBytes / (1024 * 1024)
          }MB.`,
        },
      ],
    });
  }

  try {
    const profile = await saveAvatar(userId, req.file);
    res.status(200).json({ avatarUrl: profile.avatarUrl });
  } catch (err) {
    if (err instanceof ProfileNotFoundError) {
      return res.status(409).json({ message: err.message });
    }
    throw err;
  }
}

export async function getAvatar(req: Request, res: Response, next: NextFunction) {
  try {
    const userId = req.user!.userId;
    const avatar = await getAvatarFile(userId);
    if (!avatar) {
      return res.status(404).json({ message: "No avatar set." });
    }
    res.setHeader("Content-Type", avatar.mimeType);
    res.setHeader("Cache-Control", "private, max-age=0, must-revalidate");
    res.status(200).send(avatar.buffer);
  } catch (err) {
    next(err);
  }
}

export async function removeAvatar(req: Request, res: Response, next: NextFunction) {
  try {
    const userId = req.user!.userId;
    await deleteAvatar(userId);
    res.status(200).json({ message: "Avatar removed." });
  } catch (err) {
    next(err);
  }
}
