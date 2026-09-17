import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
import { PrismaClient } from "@prisma/client";
import { randomBytes } from "node:crypto";
import argon2 from "argon2";
import { mkdir, readdir, readFile } from "node:fs/promises";
const db = new PrismaClient();
const run = randomBytes(5).toString("hex");
const email = `client-${run}@example.test`,
  otherEmail = `other-${run}@example.test`,
  adminEmail = `admin-${run}@example.test`;
const password = `Testing-${randomBytes(12).toString("hex")}`;
const origin = "http://localhost:3000";
async function cleanLimits() {
  await db.rateLimitBucket.deleteMany();
}
async function login(
  page: import("@playwright/test").Page,
  account = email,
  pass = password,
) {
  await page.goto("/login");
  await page.getByLabel("Email address", { exact: true }).fill(account);
  await page.getByLabel("Password", { exact: true }).fill(pass);
  await page.getByRole("button", { name: "Sign in", exact: true }).click();
  await expect(page).toHaveURL(
    account === adminEmail ? /\/admin$/ : /\/dashboard$/,
  );
}
async function shot(page: import("@playwright/test").Page, name: string) {
  await page.evaluate(() => window.scrollTo({ top: 0, behavior: "instant" }));
  await page.screenshot({
    path: `artifacts/screenshots/${name}.png`,
    fullPage: true,
  });
}
test.describe.configure({ mode: "serial" });
test.beforeAll(async () => {
  if (!process.env.DATABASE_URL?.includes("yoletech_test"))
    throw new Error("Tests require the separate yoletech_test database.");
  await mkdir("artifacts/screenshots", { recursive: true });
  await cleanLimits();
  const hash = await argon2.hash(password);
  await db.user.createMany({
    data: [
      { name: "Second Test Client", email: otherEmail, passwordHash: hash },
      {
        name: "Yoletech Test Owner",
        email: adminEmail,
        passwordHash: hash,
        role: "ADMIN",
      },
    ],
  });
});
test.afterAll(async () => {
  await db.inquiryNote.deleteMany({ where: { author: { email: adminEmail } } });
  await db.inquiry.deleteMany({
    where: {
      OR: [
        {
          email: {
            in: [email, otherEmail, adminEmail, `guest-${run}@example.test`],
          },
        },
        { user: { email: { in: [email, otherEmail, adminEmail] } } },
      ],
    },
  });
  await db.user.deleteMany({
    where: { email: { in: [email, otherEmail, adminEmail] } },
  });
  await db.blogPost.deleteMany({
    where: { slug: `verification-article-${run}` },
  });
  await cleanLimits();
  await db.$disconnect();
});
test("public pages, metadata, keyboard entry and accessibility", async ({
  page,
}) => {
  for (const route of [
    "/",
    "/about",
    "/services",
    "/pricing",
    "/contact",
    "/blog",
    "/privacy",
    "/terms",
    "/signup",
    "/login",
    "/forgot-password",
    "/reset-password",
  ]) {
    const response = await page.goto(route);
    expect(response?.status()).toBe(200);
    await expect(page.locator("h1")).toHaveCount(1);
    await expect(page.locator("main")).toBeVisible();
    await page.evaluate(() => document.fonts.ready);
    const scan = await new AxeBuilder({ page })
      .withTags(["wcag2a", "wcag2aa", "wcag21aa", "wcag22aa"])
      .analyze();
    expect(
      scan.violations,
      `${route}: ${JSON.stringify(scan.violations.map((v) => ({ id: v.id, nodes: v.nodes.map((n) => n.target) })))}`,
    ).toEqual([]);
    await shot(page, route === "/" ? "home-desktop" : route.slice(1));
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= window.innerWidth,
      ),
    ).toBe(true);
  }
  await page.goto("/");
  await page.keyboard.press("Tab");
  await expect(
    page.getByRole("link", { name: "Skip to content" }),
  ).toBeFocused();
  await page.keyboard.press("Enter");
  await expect(page.locator("main")).toBeFocused();
  await expect(page.locator("link[rel=canonical]")).toHaveAttribute(
    "href",
    /^https:\/\/yoletech\.work\/?$/,
  );
  await page.goto("/pricing");
  await page.getByText("What are the payment terms?", { exact: true }).click();
  await expect(
    page.getByText("Draft terms: Payment stages", { exact: false }),
  ).toBeVisible();
});
test("mobile navigation, layout, carousel controls and reduced motion", async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");
  await expect(page.getByRole("heading", { level: 1 })).toHaveText(
    "Full-Stack Web Development",
  );
  await page.getByRole("button", { name: "Open navigation" }).click();
  await expect(
    page.getByRole("navigation", { name: "Mobile navigation" }),
  ).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(
    page.getByRole("button", { name: "Open navigation" }),
  ).toBeFocused();
  await page.getByRole("button", { name: "Next service", exact: true }).click();
  await expect(page.locator("h1")).toHaveText("Data Analysis & Insights");
  await page
    .getByRole("button", { name: "Previous service", exact: true })
    .click();
  await page.waitForTimeout(5700);
  await expect(page.locator("h1")).toHaveText("Full-Stack Web Development");
  await shot(page, "home-mobile");
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= window.innerWidth,
    ),
  ).toBe(true);
  for (const route of [
    "/services",
    "/pricing",
    "/contact",
    "/signup",
    "/blog",
  ]) {
    await page.goto(route);
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= window.innerWidth,
      ),
      route,
    ).toBe(true);
    await shot(page, `${route.slice(1)}-mobile`);
  }
});
test("carousel autoplay, focus/hover pause and all eight service links", async ({
  page,
}) => {
  await page.goto("/");
  await page.mouse.move(0, 0);
  await page.waitForTimeout(5700);
  await expect(page.locator("h1")).toHaveText("Data Analysis & Insights");
  await page.locator("h1").hover();
  await page.waitForTimeout(5700);
  await expect(page.locator("h1")).toHaveText("Data Analysis & Insights");
  const dots = page.locator("button.dot");
  expect(await dots.count()).toBe(8);
  for (let i = 0; i < 8; i++) {
    await dots.nth(i).click();
    const href = await page
      .getByRole("link", { name: "Explore this service" })
      .getAttribute("href");
    expect(href).toMatch(/^\/services#/);
    await expect(page.locator("h1")).not.toBeEmpty();
  }
  await page.getByRole("button", { name: "Pause slideshow" }).click();
  await page.mouse.move(0, 0);
  await page.getByRole("link", { name: "Skip to content" }).focus();
  await page.waitForTimeout(5700);
  await expect(page.locator("h1")).toHaveText("AI-Powered Graphic Design");
});
test("guest inquiry validation, service preselection and persisted lead", async ({
  page,
  request,
}) => {
  await cleanLimits();
  const invalid = await request.post("/api/inquiries", {
    headers: { Origin: origin },
    data: { name: "A", email: "bad", service: "INVALID", message: "short" },
  });
  expect(invalid.status()).toBe(400);
  await page.goto("/contact?service=DATA");
  await expect(page.getByLabel("Service interested in")).toHaveValue("DATA");
  await page.getByLabel("Your name").fill("Guest Test Client");
  await page.getByLabel("Email address").fill(`guest-${run}@example.test`);
  await page
    .getByLabel("Tell us about your project")
    .fill(
      "Please help us understand our sales data and build a useful dashboard.",
    );
  await page.getByRole("button", { name: "Send your message" }).click();
  await expect(page.getByRole("status")).toContainText(
    "your request has been saved",
  );
  const inquiry = await db.inquiry.findFirstOrThrow({
    where: { email: `guest-${run}@example.test` },
  });
  expect(inquiry.userId).toBeNull();
  expect(inquiry.service).toBe("DATA");
  await shot(page, "contact-success");
});
test("signup, login, secure cookie, dashboard, profile and owned requests", async ({
  page,
}) => {
  await cleanLimits();
  await page.goto("/signup");
  await page.getByLabel("Your name").fill("First Test Client");
  await page.getByLabel("Email address").fill(email);
  await page.getByLabel("Password", { exact: true }).fill(password);
  await page.getByLabel("Confirm password").fill(password);
  await page.getByLabel("Company").fill("Example Studio");
  await page.getByRole("button", { name: "Create your account" }).click();
  await expect(page).toHaveURL(/\/login\?registered=1/);
  const user = await db.user.findUniqueOrThrow({ where: { email } });
  expect(user.passwordHash).not.toEqual(password);
  expect(await argon2.verify(user.passwordHash, password)).toBe(true);
  expect(user.role).toBe("CLIENT");
  await login(page);
  const cookie = (await page.context().cookies()).find((c) =>
    c.name.includes("yoletech-session"),
  );
  expect(cookie?.httpOnly).toBe(true);
  expect(cookie?.secure).toBe(true);
  expect(cookie?.sameSite).toBe("Lax");
  await shot(page, "dashboard-empty");
  await page.getByRole("link", { name: "My profile", exact: true }).click();
  await page.getByLabel("Your name").fill("Updated Test Client");
  await page.getByLabel("Phone").fill("+2348000000000");
  await page.getByRole("button", { name: "Save profile" }).click();
  await expect(page.getByRole("status")).toContainText(
    "profile has been updated",
  );
  await shot(page, "profile");
  await page.goto("/dashboard/requests/new");
  await page.getByLabel("Service interested in").selectOption("WEB");
  await page
    .getByLabel("Tell us about your project")
    .fill(
      'Build an accessible website for our test studio. <script>alert("xss")</script>',
    );
  await page.getByRole("button", { name: "Submit request" }).click();
  await expect(page.getByRole("status")).toContainText("saved");
  await shot(page, "new-request");
  await page.goto("/dashboard");
  await expect(
    page.getByText("Build an accessible website", { exact: false }),
  ).toBeVisible();
  await shot(page, "dashboard");
  await page.goto("/contact?service=IT_SUPPORT");
  await page
    .getByLabel("Tell us about your project")
    .fill("A signed-in contact request for help setting up our software.");
  await page.getByRole("button", { name: "Send your message" }).click();
  await expect(page.getByRole("status")).toContainText("saved");
  expect(await db.inquiry.count({ where: { userId: user.id } })).toBe(2);
  await page.goto("/dashboard");
  await page.getByRole("button", { name: "Sign out", exact: true }).click();
  await expect(page).toHaveURL("/login");
  await page.goto("/dashboard");
  await expect(page).toHaveURL("/login");
});
test("ownership, admin denial, CSRF and server validation", async ({
  page,
  request,
}) => {
  await cleanLimits();
  await login(page, otherEmail);
  await expect(
    page.getByText("Build an accessible website", { exact: false }),
  ).toHaveCount(0);
  await page.goto("/admin");
  await expect(page).toHaveURL("/dashboard");
  const inquiry = await db.inquiry.findFirstOrThrow({ where: { email } });
  const denied = await page.request.post(`/api/admin/inquiries/${inquiry.id}`, {
    headers: { Origin: origin },
    data: { status: "CLOSED", note: "Unauthorized note" },
  });
  expect(denied.status()).toBe(403);
  const csrf = await page.request.post("/api/profile", {
    headers: { Origin: "https://untrusted.example" },
    data: { name: "Changed by attacker" },
  });
  expect(csrf.status()).toBe(403);
  const invalid = await page.request.post("/api/profile", {
    headers: { Origin: origin },
    data: { name: "", email: "invalid" },
  });
  expect(invalid.status()).toBe(400);
  const forged = await page.request.post("/api/inquiries", {
    headers: { Origin: origin },
    data: {
      userId: inquiry.userId,
      name: "Forged",
      email,
      service: "DATA",
      message: "An ownership test using a forged account id.",
    },
  });
  expect(forged.status()).toBe(201);
  const owned = await db.inquiry.findFirstOrThrow({
    where: { message: "An ownership test using a forged account id." },
  });
  expect(owned.userId).not.toBe(inquiry.userId);
  const anon = await request.post(`/api/admin/inquiries/${inquiry.id}`, {
    headers: { Origin: origin },
    data: { status: "CLOSED" },
  });
  expect(anon.status()).toBe(403);
});
test("admin client search, details, guest inquiries and private follow-up", async ({
  page,
}) => {
  await cleanLimits();
  await login(page, adminEmail);
  await expect(
    page.getByRole("heading", { name: "Every client. One clear view." }),
  ).toBeVisible();
  await shot(page, "admin");
  await page
    .getByRole("textbox", { name: "Search clients by name or email" })
    .fill(email);
  await page.getByRole("button", { name: "Search", exact: true }).click();
  await page.getByRole("link", { name: "View Updated Test Client" }).click();
  await expect(page.locator("h1")).toHaveText("Updated Test Client");
  await shot(page, "admin-client");
  await page.goto(`/admin/inquiries?q=${encodeURIComponent(email)}`);
  const first = page.locator("article").first();
  await first.locator("summary").click();
  await first.getByLabel("Request status").selectOption("IN_PROGRESS");
  await first
    .getByLabel("Private follow-up note")
    .fill("Private owner follow-up: prepare a scope for this test.");
  await first.getByRole("button", { name: "Save follow-up" }).click();
  await expect(first.getByRole("status")).toContainText("saved");
  await expect(
    first.getByText("Private owner follow-up:", { exact: false }),
  ).toBeVisible();
  await expect(first.getByLabel("Request status")).toHaveValue("IN_PROGRESS");
  await expect(first.getByLabel("Private follow-up note")).toHaveValue("");
  await shot(page, "admin-inquiries");
  const scan = await new AxeBuilder({ page })
    .withTags(["wcag2a", "wcag2aa", "wcag21aa", "wcag22aa"])
    .analyze();
  expect(scan.violations).toEqual([]);
  await page.goto(
    `/admin/inquiries?q=${encodeURIComponent(`guest-${run}@example.test`)}`,
  );
  await expect(page.getByText("Guest lead", { exact: true })).toBeVisible();
});
test("email reset, single-use token and session revocation", async ({
  page,
}) => {
  await cleanLimits();
  await login(page);
  await page.goto("/forgot-password");
  await page.getByLabel("Email address").fill(email);
  await page.getByRole("button", { name: "Send reset link" }).click();
  await expect(page.getByRole("status")).toContainText("If an account exists");
  const files = await readdir(".local/mail");
  let url = "";
  for (const f of files) {
    const mail = JSON.parse(await readFile(`.local/mail/${f}`, "utf8"));
    if (mail.to === email) url = mail.url;
  }
  expect(url).toContain("/reset-password?token=");
  await page.goto(url);
  await shot(page, "reset-password-valid");
  const newPassword = `Updated-${randomBytes(12).toString("hex")}`;
  await page.getByLabel("New password").fill(newPassword);
  await page.getByLabel("Confirm password").fill(newPassword);
  await page.getByRole("button", { name: "Update password" }).click();
  await expect(page).toHaveURL("/login?reset=1");
  await page.goto("/dashboard");
  await expect(page).toHaveURL("/login");
  const reused = await page.request.post("/api/auth/reset-password", {
    headers: { Origin: origin },
    data: {
      token: new URL(url).searchParams.get("token"),
      password: newPassword,
      confirmation: newPassword,
    },
  });
  expect(reused.status()).toBe(400);
  await login(page, email, newPassword);
  await expect(
    page.getByText("Private owner follow-up:", { exact: false }),
  ).toHaveCount(0);
});
test("login throttling and expired sessions", async ({ page, request }) => {
  await cleanLimits();
  for (let i = 0; i < 8; i++) {
    const response = await request.post("/api/auth/login", {
      headers: { Origin: origin },
      data: {
        email: `missing-${run}@example.test`,
        password: "wrong-password",
      },
    });
    expect(response.status()).toBe(401);
  }
  const blocked = await request.post("/api/auth/login", {
    headers: { Origin: origin },
    data: { email: `missing-${run}@example.test`, password: "wrong-password" },
  });
  expect(blocked.status()).toBe(429);
  await cleanLimits();
  await login(page, otherEmail);
  const user = await db.user.findUniqueOrThrow({
    where: { email: otherEmail },
  });
  await db.session.updateMany({
    where: { userId: user.id },
    data: { expiresAt: new Date(Date.now() - 1000) },
  });
  await page.goto("/dashboard");
  await expect(page).toHaveURL("/login");
});
test("blog article, filtering, related posts boundary, metadata and 404", async ({
  page,
  request,
}) => {
  const slug = `verification-article-${run}`;
  await db.blogPost.create({
    data: {
      slug,
      title: "Verification article — unpublished fixture",
      excerpt: "A temporary article used only to verify the blog template.",
      bodyMarkdown:
        '## A useful question\n\nStart with a clear goal.\n\n- Check the data\n- Review the result\n\n<script>alert("unsafe")</script>',
      category: "DATA",
      authorName: "Yoletech test fixture",
      status: "PUBLISHED",
      publishedAt: new Date(),
    },
  });
  await page.goto("/blog?category=DATA");
  await expect(
    page.getByRole("heading", {
      name: "Verification article — unpublished fixture",
    }),
  ).toBeVisible();
  await shot(page, "blog-with-fixture");
  await page
    .getByRole("heading", {
      name: "Verification article — unpublished fixture",
    })
    .getByRole("link")
    .click();
  await expect(page.locator("h1")).toContainText("Verification article");
  await expect(
    page.getByRole("heading", { name: "A useful question" }),
  ).toBeVisible();
  await shot(page, "blog-article");
  expect(
    (
      await new AxeBuilder({ page })
        .withTags(["wcag2a", "wcag2aa", "wcag21aa", "wcag22aa"])
        .analyze()
    ).violations,
  ).toEqual([]);
  await page.goto("/blog?category=IT_SUPPORT");
  await expect(
    page.getByText("A little knowledge goes a long way."),
  ).toBeVisible();
  const missing = await page.goto("/blog/does-not-exist");
  expect(missing?.status()).toBe(404);
  await shot(page, "404");
  const sitemap = await request.get("/sitemap.xml");
  expect(await sitemap.text()).toContain(slug);
  expect(await (await request.get("/robots.txt")).text()).toContain(
    "Disallow: /admin",
  );
});
