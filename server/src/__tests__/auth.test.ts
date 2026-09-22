import { describe, it, expect, beforeAll, afterAll, beforeEach } from "vitest";
import request from "supertest";
import { createApp } from "../server";
import { prisma } from "../utils/prisma";

const app = createApp();

const testUser = {
  email: "test.user@example.com",
  password: "Password123",
  passwordConfirmation: "Password123",
};

async function cleanupTestUser() {
  await prisma.user.deleteMany({ where: { email: testUser.email.toLowerCase() } });
}

describe("Auth API", () => {
  beforeAll(async () => {
    await cleanupTestUser();
  });

  afterAll(async () => {
    await cleanupTestUser();
    await prisma.$disconnect();
  });

  beforeEach(async () => {
    await cleanupTestUser();
  });

  describe("POST /api/auth/register", () => {
    it("registers a new user and returns safe user data with a session cookie", async () => {
      const res = await request(app).post("/api/auth/register").send(testUser);

      expect(res.status).toBe(201);
      expect(res.body.user).toMatchObject({ email: testUser.email.toLowerCase() });
      expect(res.body.user.passwordHash).toBeUndefined();
      expect(res.headers["set-cookie"]).toBeDefined();
      expect(res.headers["set-cookie"][0]).toMatch(/braincare_token=/);
      expect(res.headers["set-cookie"][0]).toMatch(/HttpOnly/i);
    });

    it("rejects mismatched password confirmation", async () => {
      const res = await request(app)
        .post("/api/auth/register")
        .send({ ...testUser, passwordConfirmation: "Different123" });

      expect(res.status).toBe(400);
      expect(res.body.error.fields.passwordConfirmation).toBeDefined();
    });

    it("rejects an invalid email", async () => {
      const res = await request(app)
        .post("/api/auth/register")
        .send({ ...testUser, email: "not-an-email" });

      expect(res.status).toBe(400);
      expect(res.body.error.fields.email).toBeDefined();
    });

    it("rejects a too-short password", async () => {
      const res = await request(app)
        .post("/api/auth/register")
        .send({ ...testUser, password: "abc123", passwordConfirmation: "abc123" });

      expect(res.status).toBe(400);
      expect(res.body.error.fields.password).toBeDefined();
    });

    it("rejects duplicate registration for the same email", async () => {
      await request(app).post("/api/auth/register").send(testUser);
      const res = await request(app).post("/api/auth/register").send(testUser);

      expect(res.status).toBe(409);
    });
  });

  describe("POST /api/auth/login", () => {
    beforeEach(async () => {
      await request(app).post("/api/auth/register").send(testUser);
    });

    it("logs in with correct credentials", async () => {
      const res = await request(app)
        .post("/api/auth/login")
        .send({ email: testUser.email, password: testUser.password });

      expect(res.status).toBe(200);
      expect(res.body.user.email).toBe(testUser.email.toLowerCase());
      expect(res.headers["set-cookie"]).toBeDefined();
    });

    it("rejects an incorrect password", async () => {
      const res = await request(app)
        .post("/api/auth/login")
        .send({ email: testUser.email, password: "WrongPassword1" });

      expect(res.status).toBe(401);
    });

    it("rejects a non-existent email", async () => {
      const res = await request(app)
        .post("/api/auth/login")
        .send({ email: "nobody@example.com", password: "Password123" });

      expect(res.status).toBe(401);
    });
  });

  describe("GET /api/auth/me", () => {
    it("returns 401 when no session cookie is present", async () => {
      const res = await request(app).get("/api/auth/me");
      expect(res.status).toBe(401);
    });

    it("returns the current user when authenticated", async () => {
      const agent = request.agent(app);
      await agent.post("/api/auth/register").send(testUser);

      const res = await agent.get("/api/auth/me");
      expect(res.status).toBe(200);
      expect(res.body.user.email).toBe(testUser.email.toLowerCase());
      expect(res.body.user.passwordHash).toBeUndefined();
    });
  });

  describe("POST /api/auth/logout", () => {
    it("clears the session cookie", async () => {
      const agent = request.agent(app);
      await agent.post("/api/auth/register").send(testUser);

      const res = await agent.post("/api/auth/logout");
      expect(res.status).toBe(200);

      const meRes = await agent.get("/api/auth/me");
      expect(meRes.status).toBe(401);
    });
  });
});
