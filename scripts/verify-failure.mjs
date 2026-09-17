import { chromium } from "@playwright/test";
import { writeFile } from "node:fs/promises";
import assert from "node:assert/strict";
const browser = await chromium.launch({ channel: "chrome" });
try {
  const page = await browser.newPage({
    viewport: { width: 1440, height: 1000 },
  });
  await page.goto("http://localhost:3001/contact");
  await page.getByLabel("Your name").fill("Failure Handling Test");
  await page.getByLabel("Email address").fill("failure-check@example.test");
  await page.getByLabel("Service interested in").selectOption("WEB");
  await page
    .getByLabel("Tell us about your project")
    .fill(
      "This local test verifies that a failed database connection cannot report a saved inquiry.",
    );
  const response = page.waitForResponse((r) =>
    r.url().endsWith("/api/inquiries"),
  );
  await page.getByRole("button", { name: "Send your message" }).click();
  assert.equal((await response).status(), 503);
  await page.getByRole("alert").waitFor();
  assert.match(
    await page.getByRole("alert").textContent(),
    /couldn’t complete your request/,
  );
  assert.equal(await page.getByRole("status").count(), 0);
  assert.match(
    await page.getByLabel("Tell us about your project").inputValue(),
    /failed database connection/,
  );
  await page.evaluate(() => window.scrollTo({ top: 0, behavior: "instant" }));
  await page.screenshot({
    path: "artifacts/screenshots/contact-database-error.png",
    fullPage: true,
  });
  await writeFile(
    "artifacts/failure-check.json",
    JSON.stringify(
      {
        databaseUnavailableStatus: 503,
        successNotShown: true,
        formInputPreserved: true,
      },
      null,
      2,
    ),
  );
  console.log(
    "Database failure: 503, clear error, no false success, input preserved.",
  );
} finally {
  await browser.close();
}
