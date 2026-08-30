import { Hono } from 'hono'

const brandGuide = new Hono<{ Bindings: Env }>()

// Single source of truth for every consumer that needs to render the Sam
// Fox™ brand correctly: the WordPress connector plugin, the banimal-connector
// Claude Code skill, and any future adapter (Replit, GitHub Actions, other
// storefronts). Values here must match docs/brand/ci-guide.html (the master)
// and banimal-connector/skills/samfox-ci-guide/SKILL.md (the same rules,
// written for Claude) exactly — this file is the machine-readable twin of
// both, not a third, independent copy. Bump `version` whenever a value here
// changes so a caching consumer knows to refetch.
//
// Deliberately excludes personal contact details (email, phone) present in
// the CI Guide master — those are meaningful to a human reading the guide,
// not to a plugin applying brand tokens to a theme, and this endpoint is
// public and unauthenticated by design.
const CI_GUIDE = {
  version: '2026-08-30',
  brand: {
    name: 'Sam Fox™',
    legalEntity: 'Fruitful Shops (Pty) Ltd',
    marksOnlyLegal: ['Sam Fox™', 'Drawing like Sam Fox™', 'pink "SF" monogram'],
    trademarkOnly: true, // ™ only, never ®
  },
  palette: [
    { name: 'ink', hex: '#231F20', role: 'primary text / dark ground' },
    { name: 'cream', hex: '#FBF4E4', role: 'primary light ground' },
    { name: 'artcream', hex: '#F0EEDA', role: 'secondary light ground' },
    { name: 'sage', hex: '#577D60', role: 'accent / theme' },
    { name: 'mint', hex: '#A7DACB', role: 'accent / theme' },
    { name: 'coral', hex: '#F16B6E', role: 'accent / theme, eye-glow in dark mode' },
    { name: 'dustyrose', hex: '#B95F56', role: 'accent / theme' },
    { name: 'teal', hex: '#1E9F97', role: 'accent' },
  ],
  paletteRatio: { cream: 55, body: 28, accent: 12, ink: 5 },
  wordmark: {
    // The "o" in "fox" is drawn as the fox-head icon in every legitimate
    // rendering of the wordmark — never a typed letter O.
    oIsFoxHeadIcon: true,
    placement: 'bottom-right',
    clearSpace: 'one script "S" per side',
    allowedBackgrounds: ['white', 'cream', 'ink'],
  },
  foxHeadConstruction: [
    'Thick ink outline — closed with confidence, slightly irregular, never vector-perfect.',
    'Oversized eyes + catch-light — each eye 30-38% of face width, uneven pair on purpose, one bold white catch-light top-left.',
    'Rosy cheek disc — two soft coral discs below the eyes.',
    'Freckle dots — 3-6 dots across the muzzle; tiny triangular or heart nose.',
    'Soft collar / prop — a collar, bow, or prop; no complex anatomy; head fills 60-70% of the figure.',
    'Sam Fox™ signature — signed bottom-right; small pink "SF" monogram in-art.',
  ],
  typography: {
    display: 'bold rounded sans ("Futura soul")',
    support: 'marketplace-friendly system sans',
    note: 'The Sam Fox™ wordmark is drawn, never set from any font.',
  },
  compliance: [
    '™ only, never ® — "Sam Fox™", "Drawing like Sam Fox™".',
    'Reproduction beyond the Fruitful project requires commission or licence.',
    'AI/agent output is a style approximation only — label it "in the style of Sam Fox™".',
    'Never redraw, retype, re-letter, or recolour the marks into a brighter "retail" CI.',
  ],
  source: 'https://banimal.co.za (see docs/brand/ci-guide.html in this repo for the full master)',
}

// GET /api/brand-guide — public, unauthenticated, read-only. Static brand
// tokens, not a secret; safe to fetch from a WordPress site, a Claude Code
// session, or any future adapter without signing.
brandGuide.get('/', (c) => {
  return c.json(CI_GUIDE, 200, {
    'Cache-Control': 'public, max-age=3600',
  })
})

export default brandGuide
