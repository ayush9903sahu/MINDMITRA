import { Router } from "express";
import { healthRouter } from "./health.routes";

export const apiRouter = Router();

apiRouter.use("/health", healthRouter);

// Other modules mount their routers here, e.g.:
// import { authRouter } from "./auth.routes";
// apiRouter.use("/auth", authRouter);
