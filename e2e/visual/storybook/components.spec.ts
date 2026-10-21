import { test, expect } from '@playwright/test';

/**
 * Visual regression tests for individual components rendered in Storybook.
 *
 * Each story is loaded in the Storybook iframe (isolated canvas) and
 * screenshot. Baselines live in `e2e/visual/**-snapshots/`.
 *
 * To regenerate baselines after an intended visual change:
 *   bun run test:visual:update
 */

interface StoryEntry {
  name: string;
  id: string;
}

const stories: StoryEntry[] = [
  // UI primitives
  { name: 'Section', id: 'ui-primitives--section-story' },
  { name: 'OptionGrid', id: 'ui-primitives--option-grid-story' },
  { name: 'OptionGridEmpty', id: 'ui-primitives--option-grid-empty' },
  { name: 'ColorSwatches', id: 'ui-primitives--color-swatches-story' },
  { name: 'Stepper', id: 'ui-primitives--stepper-story' },
  { name: 'StepperAtMin', id: 'ui-primitives--stepper-at-min' },
  { name: 'StepperAtMax', id: 'ui-primitives--stepper-at-max' },

  // Context-dependent panels
  { name: 'PartsPickerBrig', id: 'components-partspicker--brig' },
  { name: 'PartsPickerGalleon', id: 'components-partspicker--galleon' },
  { name: 'PartsPickerSloop', id: 'components-partspicker--sloop' },
  { name: 'ShipNaming', id: 'components-shipnaming--default' },
  { name: 'FlagDesigner', id: 'components-flagdesigner--default' },
  { name: 'FigureheadDesigner', id: 'components-figureheaddesigner--default' },
  { name: 'CrewRosterEmpty', id: 'components-crewroster--empty' },
  { name: 'CrewRosterPartial', id: 'components-crewroster--partial' },
  { name: 'CrewRosterFull', id: 'components-crewroster--full' },
  { name: 'StatsPanelSloop', id: 'components-statspanel--sloop-low' },
  { name: 'StatsPanelBrig', id: 'components-statspanel--brig-mid' },
  { name: 'StatsPanelGalleon', id: 'components-statspanel--galleon-high' },
  { name: 'StatsPanelShipOfTheLine', id: 'components-statspanel--ship-of-the-line-max' },
  { name: 'ShipManifestBrig', id: 'components-shipmanifest--brig-default' },
  { name: 'ShipManifestGalleon', id: 'components-shipmanifest--galleon-with-crew' },
  { name: 'SaveShare', id: 'components-saveshare--default' },

  // Preview / scene components
  { name: 'ShipPreviewBrigDay', id: 'components-shippreview--brig-day-clear' },
  { name: 'ShipPreviewGalleonNight', id: 'components-shippreview--galleon-night-storm' },
  { name: 'ShipPreviewFrigateDawn', id: 'components-shippreview--frigate-dawn-windy' },
  { name: 'ShipPreviewSloopDusk', id: 'components-shippreview--sloop-dusk-clear' },
  { name: 'ShipPreviewLongboatNight', id: 'components-shippreview--longboat-night-clear' },
  { name: 'ShipPreviewShipOfTheLine', id: 'components-shippreview--ship-of-the-line-day-storm' },
  { name: 'SceneControlsDay', id: 'components-scenecontrols--day-clear' },
  { name: 'SceneControlsNight', id: 'components-scenecontrols--night-storm' },
  { name: 'SceneControlsDawn', id: 'components-scenecontrols--dawn-windy' },

  // Pure SVG sub-components
  { name: 'FlagSkull', id: 'components-flag--skull-solid-black' },
  { name: 'FlagCrown', id: 'components-flag--crown-banner-red' },
  { name: 'FlagAnchor', id: 'components-flag--anchor-stripes-blue' },
  { name: 'FlagCompass', id: 'components-flag--compass-checker-green' },
  { name: 'FigureheadSiren', id: 'components-figurehead--siren-gold' },
  { name: 'FigureheadSerpent', id: 'components-figurehead--serpent-gold' },
  { name: 'FigureheadRaven', id: 'components-figurehead--raven-grey' },
  { name: 'FigureheadSphinx', id: 'components-figurehead--sphinx-gold' },
  { name: 'FigureheadDolphin', id: 'components-figurehead--dolphin-gold' },
  { name: 'FigureheadDragon', id: 'components-figurehead--dragon-red' },
  { name: 'FigureheadKraken', id: 'components-figurehead--kraken-grey' },
];

for (const entry of stories) {
  test(`screenshot: ${entry.name}`, async ({ page }) => {
    // Load the story in the isolated iframe canvas.
    await page.goto(`/iframe.html?id=${entry.id}&viewMode=story`);

    // Wait for the story canvas to render and fonts to load (stable pixels).
    const canvas = page.locator('#storybook-root');
    await canvas.waitFor({ state: 'visible', timeout: 30_000 });
    await page.evaluate(() => document.fonts.ready);

    // Screenshot the rendered story.
    await expect(canvas).toHaveScreenshot(`${entry.name}.png`, {
      animations: 'disabled',
    });
  });
}
