import { defineConfig } from 'vitest/config'
import { cloudflareTest } from '@cloudflare/vitest-pool-workers'

// Runs the Worker's own route handlers inside the real workerd runtime
// (not mocked), against the same wrangler.json bindings (D1, R2) the
// production Worker uses. Migrations are applied fresh per test run so
// tests never depend on state left over from a previous run.
export default defineConfig({
  plugins: [
    cloudflareTest({
      wrangler: { configPath: './wrangler.json' },
      miniflare: {
        d1Databases: ['DB'],
      },
    }),
  ],
  test: {
    include: ['test/**/*.test.ts'],
  },
})
