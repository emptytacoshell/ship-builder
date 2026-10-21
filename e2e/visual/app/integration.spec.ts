import { test, expect } from '@playwright/test';

/**
 * Visual regression tests for the real app (full integration).
 *
 * These cover the composition root (`App.tsx`) — header, preview stage,
 * mid-row panels, and the bottom carousel — which Storybook stories
 * intentionally don't.
 *
 * To regenerate baselines after an intended visual change:
 *   bun run test:visual:update
 */

test.describe('Pirate Ship Builder — integration', () => {
  test('full page renders', async ({ page }) => {
    await page.goto('/');
    const builder = page.locator('.builder');
    await builder.waitFor({ state: 'visible', timeout: 30_000 });
    await page.evaluate(() => document.fonts.ready);
    await expect(builder).toHaveScreenshot('app-full-page.png');
  });

  test('ship preview stage', async ({ page }) => {
    await page.goto('/');
    const stage = page.locator('.builder__stage-bg');
    await stage.waitFor({ state: 'visible', timeout: 30_000 });
    await page.evaluate(() => document.fonts.ready);
    await expect(stage).toHaveScreenshot('app-preview-stage.png');
  });

  test('stats panel + manifest', async ({ page }) => {
    await page.goto('/');
    const mid = page.locator('.builder__mid');
    await mid.waitFor({ state: 'visible', timeout: 30_000 });
    await page.evaluate(() => document.fonts.ready);
    await expect(mid).toHaveScreenshot('app-stats-manifest.png');
  });

  test('part panels carousel', async ({ page }) => {
    await page.goto('/');
    const carousel = page.locator('.builder__carousel');
    await carousel.waitFor({ state: 'visible', timeout: 30_000 });
    await page.evaluate(() => document.fonts.ready);
    await expect(carousel).toHaveScreenshot('app-carousel.png');
  });

  test('changing ship class updates the preview', async ({ page }) => {
    await page.goto('/');
    await page.locator('.builder__carousel').waitFor({ state: 'visible', timeout: 30_000 });
    await page.evaluate(() => document.fonts.ready);

    // Click the "Galleon" ship class option in the PartsPicker.
    const galleonBtn = page.locator('.option', { hasText: 'Galleon' }).first();
    await galleonBtn.click();

    // Wait for the preview to reflect the new (larger) hull.
    const svg = page.locator('#ship-preview-svg');
    await expect(svg).toHaveScreenshot('app-galleon-preview.png');
  });
});
