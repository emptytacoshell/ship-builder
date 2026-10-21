import { defineConfig, devices } from '@playwright/test';

const isCI = Boolean(process.env['CI']);

/**
 * Playwright config for visual regression testing.
 *
 * Two projects:
 * - `storybook` — screenshots individual stories from `storybook dev` (port 6006).
 * - `app`       — screenshots the real app from the Vite dev server (port 5173).
 *
 * Both dev servers are started as top-level `webServer` entries and reused
 * across the two projects.
 *
 * Run:        bun run test:visual
 * Update:     bun run test:visual:update
 */
export default defineConfig({
  testDir: './e2e/visual',
  expect: {
    toHaveScreenshot: {
      maxDiffPixels: 0,
      animations: 'disabled',
    },
  },
  use: {
    viewport: { width: 1280, height: 800 },
    trace: 'retain-on-failure',
  },
  webServer: [
    {
      command: 'bunx storybook dev -p 6006 --no-open',
      url: 'http://localhost:6006',
      reuseExistingServer: !isCI,
      timeout: 180_000,
    },
    {
      command: 'bun run dev --port 5173 --strictPort',
      url: 'http://localhost:5173',
      reuseExistingServer: !isCI,
      timeout: 60_000,
    },
  ],
  projects: [
    {
      name: 'storybook',
      use: { ...devices['Desktop Chrome'], baseURL: 'http://localhost:6006' },
      testDir: './e2e/visual/storybook',
    },
    {
      name: 'app',
      use: { ...devices['Desktop Chrome'], baseURL: 'http://localhost:5173' },
      testDir: './e2e/visual/app',
    },
  ],
});
