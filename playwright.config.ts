import { defineConfig } from "@playwright/test";

/**
 * Full-site regression suite. It builds the site and serves the production
 * build on its own port, so it never collides with a dev server you have
 * running, and runs the checks in tests/e2e.
 */
const PORT = 3210;

export default defineConfig({
  testDir: "./tests/e2e",
  timeout: 90_000,
  expect: { timeout: 15_000 },
  fullyParallel: false,
  workers: 1,
  retries: 0,
  reporter: [["list"], ["json", { outputFile: "tests/e2e/.report.json" }]],
  use: {
    baseURL: `http://localhost:${PORT}`,
    trace: "off",
  },
  webServer: {
    command: `npm run build && npx next start -p ${PORT}`,
    url: `http://localhost:${PORT}`,
    reuseExistingServer: false,
    timeout: 300_000,
    stdout: "ignore",
    stderr: "pipe",
  },
});
