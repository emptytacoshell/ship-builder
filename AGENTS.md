# Agent Instructions

Pirate Ship Builder — a client-only React + TypeScript + Vite single-page app for designing a pirate ship (hull, rigging, armament, flag, figurehead, crew), computing derived stats, and saving/sharing the result. There is no backend, no router, and no state-persistence library; everything runs in the browser. The project uses **Bun** as its runtime and package manager (not Node.js/npm).

## Commands

- `bun run dev` — start the Vite dev server (HMR).
- `bun run build` — type-check with `tsc -b` and produce a production build in `dist/`.
- `bun run typecheck` — type-check only (`tsc -b`), no output. Fast, side-effect-free way to verify types after a change.
- `bun run lint` — run `oxlint` (config in `.oxlintrc.json`; react, typescript, oxc plugins, plus the `correctness` category which enables the React Compiler rules).
- `bun run preview` — serve the production build.
- `bun test` — run the test suite once.
- `bun run test:watch` — run tests in watch mode.
- `bun run test:coverage` — run the suite with built-in code coverage (`text` + `lcov` reports in `coverage/`).
- `bun test src/lib/stats.test.ts` — run a single test file; add `--test-name-pattern="name"` to run one test by name, e.g. `bun test src/lib/rank.test.ts --test-name-pattern="weights firepower"`.

Tests live in `src/**/*.test.ts(x)` (Bun's native test runner, `happy-dom` globals registered via `@happy-dom/global-registrator` in the `bunfig.toml` preload; `@testing-library/jest-dom` matchers load via `src/test/setup.ts`). Test globals (`describe`, `it`, `expect`, `jest`) are provided by Bun — no import needed. They cover the pure logic in `src/lib/`, the `reducer` in `src/state/build.tsx`, and React components via React Testing Library — use `renderWithBuild` / `sampleBuild` from `src/test/render.tsx` to render a component inside a seeded `BuildProvider`. Validate changes via `bun run typecheck` (types), `bun run lint`, and `bun test`.

## Architecture

The app is a single `App` component (`src/App.tsx`) composed of two React Context providers and a set of self-contained panel components. The big picture worth knowing:

- **State lives in Context, not in components.** `src/state/build.tsx` (`BuildProvider` / `useBuild`) is the source of truth for the whole ship, driven by a `useReducer` with a `BuildAction` discriminated union. `src/state/scene.tsx` (`SceneProvider` / `useScene`) is separate, lightweight state for preview visuals (time of day, weather). Components read via `useBuild()`/`useScene()` and mutate via `dispatch`.
- **`stats` are derived, never stored.** `BuildProvider` computes `stats` with `useMemo` from `computeStats(build)` in `src/lib/stats.ts`. Don't add `stats` to the build state — it's always recomputed.
- **Domain model vs. content data vs. pure logic.**
  - `src/types/build.ts` — the `BuildState`, selection types, and `Stats` domain model (all IDs are string-literal unions).
  - `src/data/` — content: `shipClasses.ts` (per-class base stats, mast/cannon limits, default builds, and the `HullGeometry` that drives the SVG preview) and `parts.ts` (woods, sails, cannon tiers, emblems, figureheads, crew roles, color palettes, each with a `StatModifier`).
  - `src/lib/` — pure, side-effect-free functions: `stats.ts` (computeStats), `rank.ts` (combat score + ship rank thresholds), `manifest.ts` (text manifest), `random.ts` (random build), `serialize.ts` (encode/decode, localStorage, share URL), `exportPng.ts` (SVG → PNG).
  - `src/components/` — UI panels (PartsPicker, ShipNaming, FlagDesigner, FigureheadDesigner, CrewRoster, StatsPanel, ShipManifest, SaveShare, SceneControls) plus `ShipPreview.tsx` (the SVG renderer) and `ui.tsx` (shared primitives: `Section`, `OptionGrid`, `ColorSwatches`, `Stepper`).

## Conventions

- **Invariants are enforced in the reducer, not the UI.** `clampToClass` (in `build.tsx`) clamps `mastCount` to `maxMasts` and `cannonCount` to `maxCannons` on class changes and on any rigging/armament change. When adding a new tunable that has class-dependent limits, run it through the same clamping so state can never go out of range.
- **Components are presentational and thin.** Panels pull `build`/`dispatch` from context and delegate all derivation to `src/lib`. Keep new components in this shape — don't recompute stats or encode/decode inside a component.
- **Adding a new option/part** means: (1) extend the ID union in `src/types/build.ts`, (2) add an entry with a `StatModifier` in `src/data/parts.ts`, (3) wire it into `src/lib/stats.ts` if it affects stats, and (4) render it via the `ui.tsx` primitives in the relevant panel.
- **Sharing/serialization is base64url of the full `BuildState`.** `encodeBuild`/`decodeBuild` in `serialize.ts` are URL-safe; the initial build is resolved from `?build=` → localStorage → default via `resolveInitialBuild`. Keep the encoded token compact and self-contained (it's a `BuildState`, not a diff).
- **The SVG preview has a stable id.** `SaveShare` finds the preview via `document.getElementById('ship-preview-svg')` for PNG export — preserve that element id if you touch `ShipPreview.tsx`.
- **Styling is plain global CSS** (BEM-ish class names) in `App.css`/`index.css`, not CSS modules. Reuse existing class patterns (e.g. `option`, `swatch`, `btn`, `section`) and the frosted-glass panel layout.
- **The React Compiler is enabled** (`react({ compiler: true })` in `vite.config.ts`, powered by `oxc-transform-react`). It auto-memoizes components/hooks, so keep components compliant with the [Rules of React](https://react.dev/learn/react-compiler) — no interior mutability or mutation-in-render; the compiler skips code that violates them. `useMemo`/`useCallback` are optional (the compiler adds them).
- **Use `crypto.randomUUID()`** for `CrewMember.id`.
- **TypeScript is run at maximum strictness.** `tsconfig.base.json` holds the shared strict flags (`strict`, `noUncheckedIndexedAccess`, `exactOptionalPropertyTypes`, `noPropertyAccessFromIndexSignature`, `noImplicitReturns`, `noUncheckedSideEffectImports`, etc.); `tsconfig.app.json` (browser `src/`, DOM, bundler resolution) and `tsconfig.node.json` (`vite.config.ts`, Node, nodenext) only extend it with their environment-specific options. Make any strictness change in the base config. This is why the code uses `!` on known-safe index accesses and `| undefined` on optional props — keep new code consistent with that.
