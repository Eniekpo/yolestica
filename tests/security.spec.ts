import { test, expect } from "@playwright/test";
import { PrismaClient } from "@prisma/client";
import { randomBytes, createHash } from "node:crypto";
const db = new PrismaClient();
const email = `security-${randomBytes(5).toString("hex")}@example.test`;
const password = `Secure-test-${randomBytes(12).toString("hex")}`;
const origin = "http://localhost:3000";
const headers = { Origin: origin, "Content-Type": "application/json" };
const hash = (v: string) => createHash("sha256").update(v).digest("hex");
test.beforeAll(async () => {
  if (!process.env.DATABASE_URL?.includes("yoletech_test"))
    throw new Error("A separate test database is required.");
  await db.rateLimitBucket.deleteMany();
});
test.afterAll(async () => {
  await db.user.deleteMany({ where: { email } });
  await db.rateLimitBucket.deleteMany();
  await db.$disconnect();
});
test("reject malformed input and ignore public role escalation", async ({
  request,
}) => {
  for (const data of [null, [], { name: "A" }]) {
    const res = await request.post("/api/auth/signup", { headers, data });
    expect(res.status()).toBe(400);
  }
  const wrongOrigin = await request.post("/api/auth/signup", {
    headers: { Origin: "https://attacker.example" },
    data: {},
  });
  expect(wrongOrigin.status()).toBe(403);
  const tooLarge = await request.post("/api/inquiries", {
    headers,
    data: { message: "x".repeat(25000) },
  });
  expect(tooLarge.status()).toBe(413);
  const created = await request.post("/api/auth/signup", {
    headers,
    data: {
      name: "Security Test User",
      email,
      password,
      confirmation: password,
      role: "ADMIN",
    },
  });
  expect(created.status()).toBe(201);
  const user = await db.user.findUniqueOrThrow({ where: { email } });
  expect(user.role).toBe("CLIENT");
  const duplicate = await request.post("/api/auth/signup", {
    headers,
    data: {
      name: "Duplicate",
      email: email.toUpperCase(),
      password,
      confirmation: password,
    },
  });
  expect(duplicate.status()).toBe(409);
  const known = await request.post("/api/auth/forgot-password", {
    headers,
    data: { email },
  });
  const unknown = await request.post("/api/auth/forgot-password", {
    headers,
    data: { email: `unknown-${email}` },
  });
  expect(known.status()).toBe(200);
  expect(unknown.status()).toBe(200);
  expect(await known.json()).toEqual(await unknown.json());
  const expired = randomBytes(32).toString("hex");
  await db.passwordResetToken.create({
    data: {
      userId: user.id,
      tokenHash: hash(expired),
      expiresAt: new Date(Date.now() - 1000),
    },
  });
  const failed = await request.post("/api/auth/reset-password", {
    headers,
    data: { token: expired, password, confirmation: password },
  });
  expect(failed.status()).toBe(400);
  const token = randomBytes(32).toString("hex");
  await db.passwordResetToken.create({
    data: {
      userId: user.id,
      tokenHash: hash(token),
      expiresAt: new Date(Date.now() + 60000),
    },
  });
  const newPassword = `Changed-${randomBytes(12).toString("hex")}`;
  const results = await Promise.all([
    request.post("/api/auth/reset-password", {
      headers,
      data: { token, password: newPassword, confirmation: newPassword },
    }),
    request.post("/api/auth/reset-password", {
      headers,
      data: { token, password: newPassword, confirmation: newPassword },
    }),
  ]);
  expect(results.map((r) => r.status()).sort()).toEqual([200, 400]);
});
