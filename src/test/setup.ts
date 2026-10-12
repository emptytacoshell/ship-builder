import { GlobalRegistrator } from '@happy-dom/global-registrator';

GlobalRegistrator.register();

// Must be dynamic: the base jest-dom entry is a global augmentation (not an
// ES module), so TS flags it. The runtime JS loads fine and extends the
// global `expect` with DOM matchers.
// @ts-expect-error -- base entry is a side-effect import, not a typed module
await import('@testing-library/jest-dom');
