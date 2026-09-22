import type { JwtPayload } from "../../../shared/types/auth.types";

// Augments Express's Request type so `req.user` is available and typed
// after the `requireAuth` middleware has run. Other modules' protected
// routes should rely on this same shape rather than re-declaring it.
declare global {
  namespace Express {
    interface Request {
      user?: JwtPayload;
    }
  }
}

export {};
