import { GlobalRegistrator } from '@happy-dom/global-registrator';

GlobalRegistrator.register();

// Auto-cleanup from @testing-library/react doesn't reliably register under
// Bun's test runner, so the DOM can persist across tests within a file and
// cause "multiple elements" query failures. Registering cleanup explicitly
// guarantees a clean DOM before every test (idempotent if auto-cleanup also
// fires). Must be dynamic: a static named import of @testing-library/react
// would evaluate its eagerly-built `screen` queries before the DOM is
// registered and throw.
const { cleanup } = await import('@testing-library/react');
afterEach(() => {
  cleanup();
});

// Must be dynamic: the base jest-dom entry is a global augmentation (not an
// ES module), so TS flags it. The runtime JS loads fine and extends the
// global `expect` with DOM matchers.
// @ts-expect-error -- base entry is a side-effect import, not a typed module
await import('@testing-library/jest-dom');
