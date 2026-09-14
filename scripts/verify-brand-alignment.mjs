#!/usr/bin/env node
import { createHash } from 'node:crypto'
import { existsSync, readFileSync, readdirSync, statSync } from 'node:fs'
import { dirname, join, relative, resolve, sep } from 'node:path'
import { fileURLToPath } from 'node:url'

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..')
const problems = []
const manifestPath = join(ROOT, 'docs/brand/canonical-brand-manifest.json')
const manifest = JSON.parse(readFileSync(manifestPath, 'utf8'))
const VERIFIED_PALETTE = ['231F20', 'FBF4E4', 'F0EEDA', '577D60', 'A7DACB', 'F16B6E', 'B95F56', '1E9F97', 'E63946']
const TEXT_EXTS = new Set(['.html', '.md', '.css', '.js', '.mjs', '.jsx', '.ts', '.tsx', '.json', '.yml', '.yaml', '.php'])
const EXCLUDED_DIRS = new Set(['.git', 'node_modules', 'dist', '.rendered-docs', '.brand-render'])

function rel(p) { return relative(ROOT, p).split(sep).join('/') }
function ext(name) { const i = name.lastIndexOf('.'); return i < 0 ? '' : name.slice(i) }
function walk(dir, out = []) {
  if (!existsSync(dir)) return out
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry)
    const st = statSync(full)
    if (st.isDirectory()) { if (!EXCLUDED_DIRS.has(entry)) walk(full, out) }
    else out.push(full)
  }
  return out
}
function gitBlobSha(file) {
  const body = readFileSync(file)
  return createHash('sha1').update(Buffer.from(`blob ${body.length}\0`)).update(body).digest('hex')
}
function verifyPinned(label, record) {
  const p = join(ROOT, record.path)
  if (!existsSync(p)) return problems.push(`${label}: missing ${record.path}`)
  const actual = gitBlobSha(p)
  if (actual !== record.gitBlobSha) problems.push(`${label}: ${record.path} is ${actual}, expected pinned Git blob ${record.gitBlobSha}`)
}

verifyPinned('Banimal ink logo', manifest.canonicalBanimalLogo.ink)
verifyPinned('Banimal white logo', manifest.canonicalBanimalLogo.white)
verifyPinned('Sam Fox ink connector icon', manifest.canonicalConnectorIcon.ink)
verifyPinned('Sam Fox cream connector icon', manifest.canonicalConnectorIcon.cream)

for (const path of Object.values(manifest.authoritativeGuides)) {
  if (!existsSync(join(ROOT, path))) problems.push(`Authoritative guide is missing: ${path}`)
}

const allowedBanimalLogoNames = new Set(['banimal-logo-ink.png', 'banimal-logo-white.png'])
const prohibited = [
  [/pearanimal|pear[ -]?animal/gi, 'prohibited Pearanimal substitute'],
  [/Sam Fox®|Banimal®/g, 'registered-mark symbol is prohibited; use ™'],
]

for (const file of walk(ROOT)) {
  if (!TEXT_EXTS.has(ext(file))) continue
  const content = readFileSync(file, 'utf8')
  for (const [pattern, label] of prohibited) {
    pattern.lastIndex = 0
    if (pattern.test(content)) problems.push(`${rel(file)}: ${label}`)
  }
  const logoRefs = [...content.matchAll(/["'(]([^"')\s]*banimal[^"')\s]*logo[^"')\s]*\.(?:png|jpe?g|svg|webp|gif))/gi)]
  for (const match of logoRefs) {
    const name = match[1].split(/[\\/]/).pop().toLowerCase()
    if (!allowedBanimalLogoNames.has(name)) problems.push(`${rel(file)}: noncanonical Banimal logo reference "${match[1]}"`)
  }
  const privateLinks = content.match(/claude\.ai\/code\/(?:artifact|session)\/[a-zA-Z0-9_-]+/g)
  if (privateLinks && file.startsWith(join(ROOT, 'docs'))) problems.push(`${rel(file)}: private Claude URL in published documentation`)
}

for (const file of walk(join(ROOT, 'docs/brand')).filter((p) => p.endsWith('.html'))) {
  const content = readFileSync(file, 'utf8')
  const dir = dirname(file)
  for (const m of content.matchAll(/href="((?:assets|palettes)\/[^"]+)"/g)) {
    if (!existsSync(join(dir, m[1]))) problems.push(`${rel(file)}: unresolved local brand link "${m[1]}"`)
  }
}

const ciGuidePath = join(ROOT, manifest.authoritativeGuides.human)
if (existsSync(ciGuidePath)) {
  const content = readFileSync(ciGuidePath, 'utf8')
  const s03 = content.split('id="s03"')[1]?.split('id="s04"')[0] ?? ''
  for (const hex of VERIFIED_PALETTE) if (!s03.includes(`#${hex}`)) problems.push(`${rel(ciGuidePath)} section 03 is missing verified colour #${hex}`)
}

const brandGuideTs = join(ROOT, 'src/worker/routes/brand-guide.ts')
if (existsSync(brandGuideTs)) {
  const content = readFileSync(brandGuideTs, 'utf8')
  const values = new Set([...content.matchAll(/hex: '#([0-9A-Fa-f]{6})'/g)].map((m) => m[1].toUpperCase()))
  for (const hex of VERIFIED_PALETTE) if (!values.has(hex)) problems.push(`${rel(brandGuideTs)} is missing verified colour #${hex}`)
  for (const hex of values) if (!VERIFIED_PALETTE.includes(hex)) problems.push(`${rel(brandGuideTs)} serves noncanonical colour #${hex}`)
} else problems.push('src/worker/routes/brand-guide.ts is missing')

const renderedArg = process.argv.indexOf('--rendered')
if (renderedArg >= 0) {
  const rendered = resolve(ROOT, process.argv[renderedArg + 1])
  const sourceHtml = walk(join(ROOT, 'docs')).filter((p) => p.endsWith('.html'))
  for (const source of sourceHtml) {
    const output = join(rendered, relative(join(ROOT, 'docs'), source))
    if (!existsSync(output)) { problems.push(`Rendered document missing: ${relative(rendered, output)}`); continue }
    const content = readFileSync(output, 'utf8')
    if (!content.includes(`data-policy="${manifest.policyId}"`)) problems.push(`${relative(rendered, output)}: canonical governance strip missing`)
    if (!content.includes('banimal-logo-ink.png')) problems.push(`${relative(rendered, output)}: canonical Banimal ink logo missing`)
    if (!content.includes('samfox-icon-verified-ink.png')) problems.push(`${relative(rendered, output)}: verified connector icon missing`)
  }
  const ledger = join(rendered, 'brand-governance-ledger.json')
  if (!existsSync(ledger)) problems.push('Rendered governance ledger is missing')
}

if (problems.length) {
  console.error(`Brand alignment audit found ${problems.length} problem(s):\n`)
  for (const p of problems) console.error(`  - ${p}`)
  console.error('\nPublication is blocked. The audit reports drift and never redraws or rewrites canonical artwork.')
  process.exit(1)
}
console.log(`Brand alignment audit: clean under ${manifest.policyId}. Canonical assets, guides, palette and governed renders agree.`)
