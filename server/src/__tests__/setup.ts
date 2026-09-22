process.env.JWT_SECRET = process.env.JWT_SECRET || "test-secret-do-not-use-in-production";
process.env.JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || "1h";
process.env.NODE_ENV = "test";
process.env.CLIENT_ORIGIN = process.env.CLIENT_ORIGIN || "http://localhost:5173";
// DATABASE_URL must point at a real (test) Postgres database for these
// integration tests to run against Prisma. See README section "Testing".
process.env.DATABASE_URL =
  process.env.DATABASE_URL ||
  "postgresql://user:password@localhost:5432/braincare_test?schema=public";
