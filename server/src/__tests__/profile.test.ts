import request from "supertest";
import path from "path";
import fs from "fs";
import os from "os";
import { app } from "../server"; // ASSUMPTION: server.ts exports `app` (an Express instance)
// separately from the app.listen() call, matching Module 2's auth.test.ts
// import of the same module. If Module 2's actual server.ts exports
// something else (e.g. a default export, or only starts listening with no
// export), adjust this import to match — nothing else in this file depends
// on the export shape beyond `app` being a supertest-compatible listener.
import { prisma } from "../utils/prisma";

const testUser = {
  email: "profile-test-user@example.com",
  password: "Str0ngPassw0rd!",
  passwordConfirmation: "Str0ngPassw0rd!",
};

let cookie: string;
let userId: string;

// NOTE: these tests require a live Postgres connection (same requirement
// documented for Module 2's auth.test.ts) and will not run against an
// in-memory DB. Run `npx prisma migrate dev` first.
beforeAll(async () => {
  await prisma.profile.deleteMany({ where: { user: { email: testUser.email } } });
  await prisma.user.deleteMany({ where: { email: testUser.email } });

  const registerRes = await request(app).post("/api/auth/register").send(testUser);
  userId = registerRes.body.user.id;
  const setCookie = registerRes.headers["set-cookie"];
  cookie = Array.isArray(setCookie) ? setCookie[0] : setCookie;
});

afterAll(async () => {
  await prisma.profile.deleteMany({ where: { userId } });
  await prisma.user.deleteMany({ where: { id: userId } });
  await prisma.$disconnect();
});

const validProfilePayload = {
  fullName: "Margaret Chen",
  dateOfBirth: "1952-06-14",
  gender: "FEMALE",
  contactEmail: "margaret.contact@example.com",
  addressLine1: "12 Willow Street",
  city: "Springfield",
  state: "IL",
  postalCode: "62704",
  country: "USA",
};

describe("GET /api/profile", () => {
  it("returns 401 when not authenticated", async () => {
    const res = await request(app).get("/api/profile");
    expect(res.status).toBe(401);
  });

  it("returns profile: null before any profile has been saved", async () => {
    const res = await request(app).get("/api/profile").set("Cookie", cookie);
    expect(res.status).toBe(200);
    expect(res.body.profile).toBeNull();
    expect(res.body.isComplete).toBe(false);
  });
});

describe("PUT /api/profile", () => {
  it("rejects a missing full name", async () => {
    const res = await request(app)
      .put("/api/profile")
      .set("Cookie", cookie)
      .send({ ...validProfilePayload, fullName: "" });
    expect(res.status).toBe(400);
    expect(res.body.errors.some((e: any) => e.field === "fullName")).toBe(true);
  });

  it("rejects an invalid email", async () => {
    const res = await request(app)
      .put("/api/profile")
      .set("Cookie", cookie)
      .send({ ...validProfilePayload, contactEmail: "not-an-email" });
    expect(res.status).toBe(400);
    expect(res.body.errors.some((e: any) => e.field === "contactEmail")).toBe(true);
  });

  it("rejects a future date of birth", async () => {
    const futureDate = new Date(Date.now() + 1000 * 60 * 60 * 24 * 365).toISOString().slice(0, 10);
    const res = await request(app)
      .put("/api/profile")
      .set("Cookie", cookie)
      .send({ ...validProfilePayload, dateOfBirth: futureDate });
    expect(res.status).toBe(400);
    expect(res.body.errors.some((e: any) => e.field === "dateOfBirth")).toBe(true);
  });

  it("rejects gender OTHER without genderCustom", async () => {
    const res = await request(app)
      .put("/api/profile")
      .set("Cookie", cookie)
      .send({ ...validProfilePayload, gender: "OTHER" });
    expect(res.status).toBe(400);
    expect(res.body.errors.some((e: any) => e.field === "genderCustom")).toBe(true);
  });

  it("creates the profile on first save and computes age", async () => {
    const res = await request(app).put("/api/profile").set("Cookie", cookie).send(validProfilePayload);
    expect(res.status).toBe(200);
    expect(res.body.profile.fullName).toBe("Margaret Chen");
    expect(typeof res.body.profile.age).toBe("number");
    expect(res.body.profile.age).toBeGreaterThan(60);
  });

  it("updates the same profile on subsequent saves (upsert, not duplicate)", async () => {
    await request(app)
      .put("/api/profile")
      .set("Cookie", cookie)
      .send({ ...validProfilePayload, fullName: "Margaret A. Chen" });

    const res = await request(app).get("/api/profile").set("Cookie", cookie);
    expect(res.body.profile.fullName).toBe("Margaret A. Chen");

    const count = await prisma.profile.count({ where: { userId } });
    expect(count).toBe(1);
  });

  it("strips angle brackets from free-text fields", async () => {
    const res = await request(app)
      .put("/api/profile")
      .set("Cookie", cookie)
      .send({ ...validProfilePayload, addressLine1: "<script>alert(1)</script> 12 Willow St" });
    expect(res.status).toBe(200);
    expect(res.body.profile.addressLine1).not.toContain("<");
    expect(res.body.profile.addressLine1).not.toContain(">");
  });

  it("returns 401 when not authenticated", async () => {
    const res = await request(app).put("/api/profile").send(validProfilePayload);
    expect(res.status).toBe(401);
  });
});

describe("POST /api/profile/avatar", () => {
  const tinyPngPath = path.join(os.tmpdir(), "braincare-test-avatar.png");

  beforeAll(() => {
    // 1x1 transparent PNG, base64-decoded to a real file for supertest's .attach()
    const onePixelPng = Buffer.from(
      "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==",
      "base64"
    );
    fs.writeFileSync(tinyPngPath, onePixelPng);
  });

  afterAll(() => {
    fs.rmSync(tinyPngPath, { force: true });
  });

  it("returns 401 when not authenticated", async () => {
    const res = await request(app).post("/api/profile/avatar").attach("avatar", tinyPngPath);
    expect(res.status).toBe(401);
  });

  it("rejects an unsupported file type", async () => {
    const textFile = Buffer.from("not an image");
    const res = await request(app)
      .post("/api/profile/avatar")
      .set("Cookie", cookie)
      .attach("avatar", textFile, { filename: "notes.txt", contentType: "text/plain" });
    expect(res.status).toBe(400);
  });

  it("accepts a valid PNG and returns an avatarUrl", async () => {
    const res = await request(app).post("/api/profile/avatar").set("Cookie", cookie).attach("avatar", tinyPngPath);
    expect(res.status).toBe(200);
    expect(res.body.avatarUrl).toBe("/api/profile/avatar");
  });

  it("serves the uploaded avatar back only to its owner", async () => {
    const res = await request(app).get("/api/profile/avatar").set("Cookie", cookie);
    expect(res.status).toBe(200);
    expect(res.headers["content-type"]).toContain("image/png");

    const unauthed = await request(app).get("/api/profile/avatar");
    expect(unauthed.status).toBe(401);
  });

  it("removes the avatar on DELETE", async () => {
    const del = await request(app).delete("/api/profile/avatar").set("Cookie", cookie);
    expect(del.status).toBe(200);

    const getRes = await request(app).get("/api/profile/avatar").set("Cookie", cookie);
    expect(getRes.status).toBe(404);
  });
});
