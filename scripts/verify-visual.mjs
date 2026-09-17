import { chromium } from "@playwright/test";
import { writeFile } from "node:fs/promises";
import assert from "node:assert/strict";
const browser = await chromium.launch({ channel: "chrome" });
const page = await browser.newPage({ reducedMotion: "reduce" });
const report = [];
try {
  for (const width of [1440, 1024, 768, 390, 320]) {
    await page.setViewportSize({ width, height: 900 });
    await page.goto("http://localhost:3000");
    await page.evaluate(() => document.fonts.ready);
    const heights = [];
    for (let i = 0; i < 8; i++) {
      await page.locator("button.dot").nth(i).click();
      heights.push(
        Math.round((await page.locator(".hero").boundingBox()).height),
      );
    }
    const overflow = await page.evaluate(
      () => document.documentElement.scrollWidth > window.innerWidth,
    );
    const gutter = (await page.locator(".hero .site-container").boundingBox())
      .x;
    assert.equal(overflow, false, `Horizontal overflow at ${width}`);
    assert.ok(gutter >= 20, `Missing gutter at ${width}`);
    assert.ok(
      Math.max(...heights) - Math.min(...heights) <= 1,
      `Hero height changes at ${width}`,
    );
    report.push({ width, heights, overflow, gutter });
    console.log(width, heights, overflow, gutter);
    await page.locator("button.dot").first().click();
    await page.evaluate(() => {
      document.activeElement?.blur();
      window.scrollTo({ top: 0, behavior: "instant" });
    });
    await page.screenshot({
      path: `artifacts/screenshots/home-${width}.png`,
      fullPage: true,
    });
    if (width === 390)
      await page.screenshot({
        path: "artifacts/screenshots/home-mobile-viewport.png",
      });
  }
  await page.goto("http://localhost:3000");
  await page
    .locator(".hero")
    .dispatchEvent("touchstart", { touches: [{ clientX: 280 }] });
  await page
    .locator(".hero")
    .dispatchEvent("touchend", { changedTouches: [{ clientX: 70 }] });
  assert.equal(
    await page.locator("h1").textContent(),
    "Data Analysis & Insights",
  );
  await page.goto("http://localhost:3000");
  await page.keyboard.press("Tab");
  await page.keyboard.press("Tab");
  const outline = await page
    .getByRole("link", { name: "Yoletech home" })
    .first()
    .evaluate((el) => getComputedStyle(el).outlineColor);
  assert.equal(outline, "rgb(255, 255, 255)");
  await writeFile(
    "artifacts/responsive-measurements.json",
    JSON.stringify(
      { screens: report, swipe: "passed", darkFocusRing: outline },
      null,
      2,
    ),
  );
} finally {
  await browser.close();
}
