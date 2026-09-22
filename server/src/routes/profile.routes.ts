import { Router, Request, Response, NextFunction } from "express";
import { requireAuth } from "../middleware/auth.middleware";
import { uploadAvatar } from "../middleware/uploadAvatar.middleware";
import { getProfile, updateProfile, uploadAvatarHandler, getAvatar, removeAvatar } from "../controllers/profile.controller";

const router = Router();

// Every route in this module requires an authenticated session. There is no
// public or unauthenticated profile route by design (see privacy note in
// profile.controller.ts).
router.use(requireAuth);

router.get("/", getProfile);
router.put("/", updateProfile);

// multer needs its own error handling: a bad file (wrong type / too large)
// throws before uploadAvatarHandler runs, so we translate that into the
// same { message, errors } shape the rest of the API uses instead of
// letting Express's default multer error (a raw 500) leak through.
router.post("/avatar", (req: Request, res: Response, next: NextFunction) => {
  uploadAvatar(req, res, (err: unknown) => {
    if (err) {
      const message =
        err instanceof Error && err.message === "UNSUPPORTED_FILE_TYPE"
          ? "Unsupported file type. Upload a JPEG, PNG, or WebP image."
          : err instanceof Error && err.message.includes("File too large")
          ? "Image is too large. Maximum size is 5MB."
          : "Could not process the uploaded image.";
      return res.status(400).json({ message, errors: [{ field: "avatar", message }] });
    }
    next();
  });
}, uploadAvatarHandler);

router.get("/avatar", getAvatar);
router.delete("/avatar", removeAvatar);

export default router;
