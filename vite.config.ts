import react from '@vitejs/plugin-react'
import { defineConfig } from 'vitest/config'

// https://vite.dev/config/
export default defineConfig({
  // The React Compiler transform is real overhead for tests (memoization is
  // irrelevant there), so enable it only outside the Vitest run.
  plugins: [react({ compiler: !process.env['VITEST'] })],
  test: {
    globals: true,
    environment: 'happy-dom',
    setupFiles: ['./src/test/setup.ts'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'lcov'],
      include: ['src/**/*.{ts,tsx}'],
      exclude: ['**/*.test.ts', 'src/main.tsx'],
    },
  },
})
