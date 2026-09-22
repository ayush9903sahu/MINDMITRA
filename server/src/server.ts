import "dotenv/config";
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import authRoutes from "./routes/auth.routes";
import { errorHandler, notFoundHandler } from "./middleware/errorHandler";
import { env } from "./utils/env";

export function createApp() {
  const app = express();

  app.use(
    cors({
      origin: env.CLIENT_ORIGIN,
      credentials: true, // required so the browser sends the HTTP-only cookie
    })
  );
  app.use(express.json());
  app.use(cookieParser());

  // --- Module 2: Authentication ---
  app.use("/api/auth", authRoutes);

  // Other modules should mount their routers here, e.g.:
  //   app.use("/api/profile", profileRoutes);
  //   app.use("/api/games", gameRoutes);

  app.use(notFoundHandler);
  app.use(errorHandler);

  return app;
}

// Only start listening when this file is run directly (not when imported
// by tests, which build the app via createApp() and use it with supertest).
if (require.main === module) {
  const app = createApp();
  app.listen(env.PORT, () => {
    console.log(`BrainCare server listening on http://localhost:${env.PORT}`);
  });
}
