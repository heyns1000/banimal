import { SELF } from 'cloudflare:test'
import { describe, expect, it } from 'vitest'

describe('GET /api/brand-guide', () => {
  it('serves the CI guide with the 9 verified colours and a public cache header', async () => {
    const res = await SELF.fetch('https://banimal.test/api/brand-guide')
    expect(res.status).toBe(200)
    expect(res.headers.get('Cache-Control')).toContain('public')

    const guide = await res.json<any>()
    expect(guide.brand.name).toBe('Sam Fox™')
    expect(guide.brand.trademarkOnly).toBe(true)
    expect(guide.palette).toHaveLength(9)
    expect(guide.palette.map((c: any) => c.hex)).toEqual(
      expect.arrayContaining(['#231F20', '#FBF4E4', '#577D60', '#F16B6E'])
    )

    // Every theme in the toggle must resolve to one of the two icon
    // variants actually served below — a typo here would silently break
    // any consumer's palette-toggle UI.
    for (const theme of guide.themes) {
      expect(['ink', 'cream']).toContain(theme.iconVariant)
    }
  })

  it('never includes personal contact details in the public response', async () => {
    const res = await SELF.fetch('https://banimal.test/api/brand-guide')
    const text = await res.text()
    expect(text).not.toMatch(/@gmail\.com|082 601/)
  })
})

describe('GET /api/brand-guide/icon/:variant', () => {
  it.each(['ink', 'cream'])('serves the verified %s icon as a real PNG', async (variant) => {
    const res = await SELF.fetch(`https://banimal.test/api/brand-guide/icon/${variant}`)
    expect(res.status).toBe(200)
    expect(res.headers.get('Content-Type')).toBe('image/png')

    const bytes = new Uint8Array(await res.arrayBuffer())
    // PNG magic number: 89 50 4E 47 0D 0A 1A 0A
    expect([...bytes.slice(0, 8)]).toEqual([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a])
  })

  it('also accepts a .png suffix, matching how a plain <img src> would request it', async () => {
    const res = await SELF.fetch('https://banimal.test/api/brand-guide/icon/ink.png')
    expect(res.status).toBe(200)
  })

  it('404s on an unknown variant instead of guessing', async () => {
    const res = await SELF.fetch('https://banimal.test/api/brand-guide/icon/coral')
    expect(res.status).toBe(404)
  })
})
