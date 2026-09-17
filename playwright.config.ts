import { defineConfig } from "@playwright/test";
export default defineConfig({
  testDir: "./tests",
  timeout: 180000,
  expect: { timeout: 10000 },
  fullyParallel: false,
  workers: 1,
  reporter: [
    ["list"],
    ["html", { open: "never", outputFolder: "artifacts/playwright-report" }],
  ],
  use: {
    baseURL: "http://localhost:3000",
    browserName: "chromium",
    channel: "chrome",
    viewport: { width: 1440, height: 1000 },
    screenshot: "only-on-failure",
    trace: "retain-on-failure",
  },
  outputDir: "test-results",
});
