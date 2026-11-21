import { existsSync } from "node:fs";
import { defineConfig } from "@playwright/test";

const baseURL = "http://127.0.0.1:3000";
const chromiumPath = process.env.CHROMIUM_PATH ?? "/usr/bin/chromium";

export default defineConfig({
  testDir: "./tests/e2e",
  workers: 1,
  use: {
    baseURL,
    launchOptions: {
      executablePath: existsSync(chromiumPath) ? chromiumPath : undefined,
    },
  },
  webServer: {
    command: "npm run dev -- --hostname 127.0.0.1 --port 3000",
    url: baseURL,
    reuseExistingServer: true,
    timeout: 90_000,
  },
});
