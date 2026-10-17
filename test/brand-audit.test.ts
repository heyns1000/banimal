import { readFileSync } from 'fs'
import { describe, it, expect } from 'vitest'

describe('brand audit: email templates', () => {
  it('uses only canonical banimal logo basenames in src/worker/routes/email.ts', () => {
    const content = readFileSync('src/worker/routes/email.ts', 'utf8')
    const re = /["'\(]([^"'\)\s]*banimal[^"'\)\s]*logo[^"'\)\s]*\.(?:png|jpe?g|svg|webp|gif))/gi
    const matches = [...content.matchAll(re)]
    const allowed = new Set(['banimal-logo-ink.png', 'banimal-logo-white.png'])
    for (const m of matches) {
      const base = m[1].split(/[\\/]/).pop().toLowerCase()
      expect(allowed.has(base)).toBe(true)
    }
  })
})
