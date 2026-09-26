#!/usr/bin/env node
import { cpSync, existsSync, mkdirSync, readFileSync, readdirSync, rmSync, statSync, writeFileSync } from 'node:fs'
import { createHash } from 'node:crypto'
import { dirname, join, relative, resolve, sep } from 'node:path'
import { fileURLToPath } from 'node:url'

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..')
const SOURCE = join(ROOT, 'docs')
const outArg = process.argv.indexOf('--out')
const OUTPUT = resolve(ROOT, outArg >= 0 ? process.argv[outArg + 1] : '.rendered-docs')
const POLICY_ID = 'BANIMAL-GLOBAL-CI-NONVARIATION-2026-09-14'

if (!existsSync(SOURCE)) throw new Error('docs/ is missing')
if (!OUTPUT.startsWith(ROOT + sep)) throw new Error('Output must stay inside the repository')
rmSync(OUTPUT, { recursive: true, force: true })
mkdirSync(OUTPUT, { recursive: true })
cpSync(SOURCE, OUTPUT, { recursive: true })

function walk(dir, out = []) {
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry)
    const st = statSync(full)
    if (st.isDirectory()) walk(full, out)
    else out.push(full)
  }
  return out
}

function sha256(value) {
  return createHash('sha256').update(value).digest('hex')
}

function webPath(fromDir, target) {
  let p = relative(fromDir, target).split(sep).join('/')
  if (!p.startsWith('.')) p = `./${p}`
  return p
}

function governanceBlock(outputFile) {
  const dir = dirname(outputFile)
  const brandRoot = join(OUTPUT, 'brand')
  const banimal = webPath(dir, join(brandRoot, 'assets/banimal-logo-ink.png'))
  const fox = webPath(dir, join(brandRoot, 'assets/samfox-icon-verified-ink.png'))
  const guide = webPath(dir, join(brandRoot, 'ci-guide.html'))
  const connector = webPath(dir, join(brandRoot, 'banimal-connector-icons.html'))
  const mandate = webPath(dir, join(brandRoot, 'GLOBAL-NON-VARIATION-MANDATE.md'))
  const css = `<style id="banimal-global-ci-style">
#banimal-global-ci{position:relative;z-index:2147483647;display:flex;align-items:center;gap:12px;min-height:56px;padding:8px 18px;background:#FBF4E4;color:#231F20;border-bottom:2px solid #231F20;font:600 12px/1.35 Arial,sans-serif;letter-spacing:.02em}#banimal-global-ci img{display:block!important;width:auto!important;max-width:none!important;object-fit:contain!important;filter:none!important;transform:none!important}#banimal-global-ci .bgci-fox{height:38px!important}#banimal-global-ci .bgci-logo{height:26px!important;margin-left:auto}#banimal-global-ci a{color:#231F20!important;text-decoration:underline!important}#banimal-global-ci .bgci-rule{font-weight:400}@media(max-width:640px){#banimal-global-ci{flex-wrap:wrap;padding:8px 12px}#banimal-global-ci .bgci-logo{margin-left:0;height:22px!important}#banimal-global-ci .bgci-rule{width:100%}}
</style>`
  const html = `<aside id="banimal-global-ci" data-policy="${POLICY_ID}" aria-label="Canonical Banimal and Sam Fox identity governance"><img class="bgci-fox" src="${fox}" alt="Verified Sam Fox connector icon"><strong>Banimal™ Connector</strong><span class="bgci-rule">Canonical non-variation render · <a href="${guide}">Sam Fox™ CI Guide</a> · <a href="${connector}">Connector rules</a> · <a href="${mandate}">mandate</a></span><img class="bgci-logo" src="${banimal}" alt="Banimal™"></aside>`
  return { css, html }
}

const ledger = {
  policyId: POLICY_ID,
  sourceRoot: 'docs',
  publicationRoot: relative(ROOT, OUTPUT).split(sep).join('/'),
  rule: 'Sources retain provenance; HTML and Markdown are governed at publication; binary assets are copied byte-for-byte.',
  files: [],
}

for (const sourceFile of walk(SOURCE)) {
  const rel = relative(SOURCE, sourceFile)
  const outputFile = join(OUTPUT, rel)
  const sourceBytes = readFileSync(sourceFile)
  let action = 'copied-byte-for-byte'

  if (sourceFile.endsWith('.html')) {
    let content = sourceBytes.toString('utf8')
    if (!content.includes(`data-policy="${POLICY_ID}"`)) {
      const block = governanceBlock(outputFile)
      if (/<\/head>/i.test(content)) content = content.replace(/<\/head>/i, `${block.css}</head>`)
      else content = `${block.css}\n${content}`
      if (/<body(?:\s[^>]*)?>/i.test(content)) content = content.replace(/<body(?:\s[^>]*)?>/i, (m) => `${m}${block.html}`)
      else content = content.replace(/(<\/style>)/i, `$1${block.html}`)
      writeFileSync(outputFile, content)
    }
    action = 'canonical-html-governance-injected'
  } else if (sourceFile.endsWith('.md')) {
    const content = sourceBytes.toString('utf8')
    const notice = `> [!IMPORTANT]\n> Governed by **${POLICY_ID}**. Banimal™ identity must resolve to \`docs/brand/assets/banimal-logo-ink.png\` or \`banimal-logo-white.png\`; the Connector icon must resolve to the verified Sam Fox™ assets. See [the global mandate](./brand/GLOBAL-NON-VARIATION-MANDATE.md).\n\n`
    writeFileSync(outputFile, content.startsWith('> [!IMPORTANT]') ? content : notice + content)
    action = 'canonical-markdown-governance-injected'
  }

  const renderedBytes = readFileSync(outputFile)
  ledger.files.push({
    path: rel.split(sep).join('/'),
    action,
    sourceSha256: sha256(sourceBytes),
    renderedSha256: sha256(renderedBytes),
  })
}

writeFileSync(join(OUTPUT, 'brand-governance-ledger.json'), JSON.stringify(ledger, null, 2) + '\n')
console.log(`Canonical brand render complete: ${ledger.files.length} files -> ${relative(ROOT, OUTPUT)}`)
