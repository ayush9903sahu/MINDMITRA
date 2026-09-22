import multer from "multer";
import { Request } from "express";
import { AVATAR_UPLOAD } from "../../../../shared/constants/profile.constants";

/**
 * Avatar uploads use memory storage: the file is validated and written to
 * disk deliberately by profile.service.ts (not by multer directly), so we
 * control the final filename (`<userId>.<ext>`) and can clean up a
 * previous avatar with a different extension. Nothing here ever writes to
 * a public/static directory — see profile.controller.ts for how avatars
 * are served back out through an authenticated route.
 */
const storage = multer.memoryStorage();

function fileFilter(_req: Request, file: Express.Multer.File, cb: multer.FileFilterCallback) {
  if (!(AVATAR_UPLOAD.allowedMimeTypes as readonly string[]).includes(file.mimetype)) {
    cb(new Error("UNSUPPORTED_FILE_TYPE"));
    return;
  }
  cb(null, true);
}

export const uploadAvatar = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: AVATAR_UPLOAD.maxSizeBytes,
    files: 1,
  },
}).single(AVATAR_UPLOAD.fieldName);
