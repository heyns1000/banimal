#!/usr/bin/env node
import fs from 'fs'
import path from 'path'
import { execSync } from 'child_process'
import crypto from 'crypto'

const ROOT = path.resolve(process.cwd())
const OUTDIR = path.join(ROOT, 'dist', 'banimal-connector')
const TMP = path.join(ROOT, '.tmp', 'banimal-connector')
const FIXED_MTIME = '2026-01-01'

const include = [
  'banimal-connector',
  'banimal-connector/skills/samfox-ci-guide',
  'docs/brand',
  'docs/manual',
  'docs/atlas',
  'docs/index.html',
  'connector-preview.html',
  'scripts/render-canonical-docs.mjs',
  'scripts/verify-brand-alignment.mjs',
  'scripts/generate-palette-assets.py',
  'wordpress-plugin/banimal-ecosystem-connector',
  'MOTION_LANGUAGE.md',
  'docs/README.md'
]

function ensureDir(p) { if (!fs.existsSync(p)) fs.mkdirSync(p, { recursive: true }) }

function copyPath(rel) {
  const src = path.join(ROOT, rel)
  if (!fs.existsSync(src)) return false
  const dst = path.join(TMP, rel)
  ensureDir(path.dirname(dst))
  const stat = fs.statSync(src)
  if (stat.isDirectory()) {
    // fs.cp is available in Node 16+, but to be safe, use exec tar copy
    execSync(`cp -a ${escapeShell(src)}/ ${escapeShell(dst)}/`)
  } else {
    ensureDir(path.dirname(dst))
    fs.copyFileSync(src, dst)
  }
  return true
}

function escapeShell(s) { return `'${s.replace(/'/g, "'\\''")}'` }

function walkDir(dir) {
  let out = []
  const entries = fs.readdirSync(dir, { withFileTypes: true })
  for (const e of entries) {
    const full = path.join(dir, e.name)
    if (e.isDirectory()) out = out.concat(walkDir(full))
    else if (e.isFile()) out.push(full)
  }
  return out
}

function sha256File(p) {
  const data = fs.readFileSync(p)
  return crypto.createHash('sha256').update(data).digest('hex')
}

async function main() {
  // Clean
  if (fs.existsSync(TMP)) execSync(`rm -rf ${escapeShell(TMP)}`)
  ensureDir(TMP)
  ensureDir(OUTDIR)

  const copied = []
  for (const p of include) {
    const ok = copyPath(p)
    if (ok) copied.push(p)
    else console.warn(`skip missing: ${p}`)
  }

  const files = walkDir(TMP)
  const inventory = []
  for (const f of files) {
    const rel = path.relative(TMP, f).split(path.sep).join('/')
    const src = rel // best-effort: the repo path matches rel
    const size = fs.statSync(f).size
    const sha256 = sha256File(f)
    inventory.push({ packagedPath: rel, sourcePath: src, size, sha256 })
  }

  // Write inventory
  const manifest = {
    name: 'banimal-connector-distribution',
    version: '0.0.1',
    generatedAt: new Date().toISOString(),
    files: inventory
  }
  fs.writeFileSync(path.join(OUTDIR, 'inventory.json'), JSON.stringify(manifest, null, 2))

  // Create deterministic tar.gz using system tar with fixed mtime and ordered files
  const archivePath = path.join('dist', 'banimal-connector.tar.gz')
  ensureDir(path.dirname(archivePath))
  // Use pax format to set mtime
  const tarCmd = `tar --sort=name --mtime='${FIXED_MTIME}' --owner=0 --group=0 --numeric-owner -czf ${escapeShell(archivePath)} -C ${escapeShell(TMP)} .`
  console.log('running:', tarCmd)
  execSync(tarCmd, { stdio: 'inherit' })

  const archiveStat = fs.statSync(archivePath)
  const archiveSha = sha256File(archivePath)
  const summary = { archive: archivePath, size: archiveStat.size, sha256: archiveSha }
  fs.writeFileSync(path.join(OUTDIR, 'archive-summary.json'), JSON.stringify(summary, null, 2))

  console.log('wrote distribution:', archivePath)
  console.log('inventory entries:', inventory.length)
}

main().catch((err) => { console.error(err); process.exit(1) })
