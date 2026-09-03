#!/usr/bin/env node
// Brand alignment audit — checks that every document claiming to follow the
// Sam Fox™ Core CI Guide Master actually resolves against real files and
// real values, instead of drifting quietly the way docs/brand/ci-guide.html
// did (85 broken download links, two pages linking to each other through
// private claude.ai artifact URLs instead of the sibling file sitting right
// next to them). Report-only: it fails the check and prints exactly what's
// wrong, it never rewrites anything itself — the same "no mass dispatch"
// posture the Seedwave Atlas already calls for from the Ecosystem
// Governance Sentinel, applied here as a real, running check instead of a
// planned one.
//
// Run locally: node scripts/verify-brand-alignment.mjs

import { readFileSync, existsSync, readdirSync, statSync } from 'node:fs'
import { join, dirname, relative } from 'node:path'
import { fileURLToPath } from 'node:url'

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..')
const problems = []

function rel(p) {
  return relative(ROOT, p)
}

// The 9 verified colours, section 03 of docs/brand/ci-guide.html — the one
// place this list should ever need to be typed by hand again.
const VERIFIED_PALETTE = [
  '231F20', 'FBF4E4', 'F0EEDA', '577D60', 'A7DACB', 'F16B6E', 'B95F56', '1E9F97', 'E63946',
]

function walk(dir, exts, out = []) {
  if (!existsSync(dir)) return out
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry)
    const st = statSync(full)
    if (st.isDirectory()) {
      if (entry === 'node_modules' || entry === 'dist' || entry === '.git') continue
      walk(full, exts, out)
    } else if (exts.some((e) => entry.endsWith(e))) {
      out.push(full)
    }
  }
  return out
}

// ---- Check 1: no private claude.ai artifact URLs in committed docs ----
// These pages live in the repo specifically so they don't depend on a
// private, possibly-inaccessible artifact URL — a doc that links out to one
// instead of the sibling file next to it isn't actually self-contained.
const scanDirs = ['docs', 'banimal-connector', 'wordpress-plugin/banimal-ecosystem-connector']
for (const d of scanDirs) {
  for (const file of walk(join(ROOT, d), ['.html', '.md'])) {
    const content = readFileSync(file, 'utf-8')
    const matches = content.match(/claude\.ai\/code\/artifact\/[a-zA-Z0-9-]+/g)
    if (matches) {
      problems.push(
        `${rel(file)}: links to a private claude.ai artifact (${[...new Set(matches)].join(', ')}) instead of a repo-relative path`
      )
    }
  }
}

// ---- Check 2: every local asset/palette href in docs/brand/*.html resolves ----
for (const file of walk(join(ROOT, 'docs/brand'), ['.html'])) {
  const content = readFileSync(file, 'utf-8')
  const dir = dirname(file)
  const hrefRe = /href="((?:assets|palettes)\/[^"]+)"/g
  let m
  const seen = new Set()
  while ((m = hrefRe.exec(content))) {
    const relPath = m[1]
    if (seen.has(relPath)) continue
    seen.add(relPath)
    if (!existsSync(join(dir, relPath))) {
      problems.push(`${rel(file)}: links to "${relPath}" but that file doesn't exist`)
    }
  }
}

// ---- Check 3: the verified icon assets exist ----
for (const name of ['samfox-icon-verified-ink.png', 'samfox-icon-verified-cream.png']) {
  const p = join(ROOT, 'docs/brand/assets', name)
  if (!existsSync(p)) {
    problems.push(`docs/brand/assets/${name} is missing — the verified fox-head icon must exist in both renders`)
  }
}

// ---- Check 4: ci-guide.html's palette section 03 has exactly the 9 verified hexes ----
const ciGuidePath = join(ROOT, 'docs/brand/ci-guide.html')
if (existsSync(ciGuidePath)) {
  const content = readFileSync(ciGuidePath, 'utf-8')
  const s03 = content.split('id="s03"')[1]?.split('id="s04"')[0] ?? ''
  for (const hex of VERIFIED_PALETTE) {
    if (!s03.includes(`#${hex}`)) {
      problems.push(`docs/brand/ci-guide.html section 03 is missing verified colour #${hex}`)
    }
  }
} else {
  problems.push('docs/brand/ci-guide.html is missing entirely')
}

// ---- Check 5: brand-guide.ts (the machine-readable twin) has the same 9 hexes ----
const brandGuideTs = join(ROOT, 'src/worker/routes/brand-guide.ts')
if (existsSync(brandGuideTs)) {
  const content = readFileSync(brandGuideTs, 'utf-8')
  const tsHexes = new Set(
    [...content.matchAll(/hex: '#([0-9A-Fa-f]{6})'/g)].map((m) => m[1].toUpperCase())
  )
  for (const hex of VERIFIED_PALETTE) {
    if (!tsHexes.has(hex)) {
      problems.push(`src/worker/routes/brand-guide.ts is missing verified colour #${hex} — the CI Guide and the machine-readable endpoint have drifted apart`)
    }
  }
  for (const hex of tsHexes) {
    if (!VERIFIED_PALETTE.includes(hex)) {
      problems.push(`src/worker/routes/brand-guide.ts serves #${hex}, which is not one of the 9 verified colours`)
    }
  }
} else {
  problems.push('src/worker/routes/brand-guide.ts is missing entirely')
}

// ---- Report ----
if (problems.length === 0) {
  console.log('Brand alignment audit: clean. CI Guide Master, the Connector icon page, and brand-guide.ts all agree.')
  process.exit(0)
} else {
  console.error(`Brand alignment audit found ${problems.length} problem(s):\n`)
  for (const p of problems) console.error(`  - ${p}`)
  console.error('\nThis check reports drift, it does not fix it — see docs/brand/ci-guide.html\'s own compliance rule (never redraw the marks) before touching any actual artwork.')
  process.exit(1)
}
