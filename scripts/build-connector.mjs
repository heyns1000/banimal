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
  'docs/integration/replit-handoff.md',
  'scripts/render-canonical-docs.mjs',
  'scripts/verify-brand-alignment.mjs',
  'scripts/generate-palette-assets.py',
  'wordpress-plugin/banimal-ecosystem-connector',
  'MOTION_LANGUAGE.md',
  'docs/README.md',
  'src/worker',
  'src/shared',
  'package.json',
  'package-lock.json'
]

const SENSITIVE_PATTERNS = [
  /(^|\/)\.env($|\.)/i,
  /(^|\/)\.dev(vars)?($|\.)/i,
  /(^|\/)secrets?($|\.)/i,
  /\.(pem|key|crt|p12)$/i,
]

function ensureDir(p) { if (!fs.existsSync(p)) fs.mkdirSync(p, { recursive: true }) }

function escapeShell(s) { return `'${s.replace(/'/g, "'\\''")}'` }

function isSensitive(p) {
  return SENSITIVE_PATTERNS.some((r) => r.test(p)) || p.includes('node_modules')
}

function copyPath(rel) {
  const src = path.join(ROOT, rel)
  if (!fs.existsSync(src)) return false
  const dst = path.join(TMP, rel)
  ensureDir(path.dirname(dst))
  const stat = fs.statSync(src)
  if (stat.isDirectory()) {
    // copy directory while filtering sensitive files
    const entries = fs.readdirSync(src, { withFileTypes: true })
    ensureDir(dst)
    for (const e of entries) {
      const childRel = path.join(rel, e.name)
      if (isSensitive(childRel)) { console.warn('excluding sensitive path from copy:', childRel); continue }
      if (e.isDirectory()) execSync(`cp -a ${escapeShell(path.join(src, e.name))}/ ${escapeShell(path.join(dst, e.name))}/`)
      else fs.copyFileSync(path.join(src, e.name), path.join(dst, e.name))
    }
  } else {
    if (isSensitive(rel)) { console.warn('excluding sensitive file from copy:', rel); return false }
    ensureDir(path.dirname(dst))
    fs.copyFileSync(src, dst)
  }
  return true
}

function walkDir(dir) {
  let out = []
  if (!fs.existsSync(dir)) return out
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

  const missing = []
  const copied = []
  for (const p of include) {
    const ok = copyPath(p)
    if (ok) copied.push(p)
    else missing.push(p)
  }

  if (missing.length) {
    console.error('Missing required inputs for connector distribution:')
    for (const m of missing) console.error('  -', m)
    console.error('\nAborting build. Provide the required inputs or adjust include list.')
    process.exit(2)
  }

  // If wordpress plugin directory exists, produce a zipped plugin artifact
  const pluginSrc = path.join(ROOT, 'wordpress-plugin', 'banimal-ecosystem-connector')
  const pluginZipOut = path.join(OUTDIR, 'banimal-wordpress-plugin.zip')
  if (fs.existsSync(pluginSrc)) {
    console.log('Packaging WordPress plugin into', pluginZipOut)
    try {
      execSync(`rm -f ${escapeShell(pluginZipOut)} || true`)
      execSync(`cd ${escapeShell(pluginSrc)} && zip -r ${escapeShell(pluginZipOut)} .`, { stdio: 'inherit' })
      // Copy zip into TMP so it is also included in the archive
      ensureDir(path.dirname(path.join(TMP, 'wordpress-plugin.zip')))
      fs.copyFileSync(pluginZipOut, path.join(TMP, 'wordpress-plugin.zip'))
    } catch (err) {
      console.warn('WordPress plugin zip step failed (zip may be missing):', err.message)
    }
  }

  // Build inventory by walking the TMP before writing inventory.json so inventory does not list itself.
  const files = walkDir(TMP)
  const inventory = []
  for (const f of files) {
    const rel = path.relative(TMP, f).split(path.sep).join('/')
    // intentionally exclude any eventual inventory.json that might already exist
    if (rel === 'inventory.json') continue
    const src = rel // best-effort: the repo path matches rel
    const size = fs.statSync(f).size
    const sha256 = sha256File(f)
    inventory.push({ packagedPath: rel, sourcePath: src, size, sha256 })
  }

  // Write inventory into both OUTDIR and TMP (the inventory.json will be included in archive;
  // it deliberately does not list itself — documented self-exclusion)
  const manifest = {
    name: 'banimal-connector-distribution',
    version: '0.0.1',
    generatedAt: new Date().toISOString(),
    files: inventory,
    notes: 'inventory.json is included in the archive but is intentionally excluded from the listed files to avoid self-reference.'
  }
  fs.writeFileSync(path.join(OUTDIR, 'inventory.json'), JSON.stringify(manifest, null, 2))
  fs.writeFileSync(path.join(TMP, 'inventory.json'), JSON.stringify(manifest, null, 2))

  // Recompute files list to include the newly written inventory.json and any plugin zip
  const finalFiles = walkDir(TMP)

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
