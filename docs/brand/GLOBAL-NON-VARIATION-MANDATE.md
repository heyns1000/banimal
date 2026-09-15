# Banimal™ Global CI Non-Variation Mandate

**Policy ID:** `BANIMAL-GLOBAL-CI-NONVARIATION-2026-09-14`  
**Status:** Mandatory  
**Legal entity:** Fruitful Shops (Pty) Ltd

## Source of truth

The only Banimal™ logo files permitted as Banimal identity marks are:

- `docs/brand/assets/banimal-logo-ink.png`
- `docs/brand/assets/banimal-logo-white.png`

The only Banimal Connector icon files permitted in the global document-governance layer are:

- `docs/brand/assets/samfox-icon-verified-ink.png`
- `docs/brand/assets/samfox-icon-verified-cream.png`

The complete governing references are:

- `docs/brand/ci-guide.html`
- `docs/brand/banimal-connector-icons.html`
- `banimal-connector/skills/samfox-ci-guide/SKILL.md`
- `docs/brand/canonical-brand-manifest.json`

No prompt, generated image, local export, screenshot, old campaign, plugin skin, draft guide, agent memory, external URL or copied asset supersedes these repository-controlled files.

## Non-negotiable rules

1. Never redraw, trace, retype, recolour, crop into a new mark, decorate or substitute the Banimal™ logo.
2. Never replace the verified fox-head connector icon with a pear, Pearanimal, generic animal, generated mascot or approximate glyph.
3. Never type the Sam Fox™ wordmark from a font; the `o` in `fox` is the verified fox-head icon.
4. Use `™`, never `®`, for Sam Fox™ and Banimal™.
5. AI output is a style approximation and must never be presented as Sam Fox's original hand.
6. The canonical artwork is read-only. Build and publication systems pull it from the source; they do not push altered variants back.
7. Historical Git commits and frozen version directories retain their provenance. They are not falsified or backdated. Current publication is re-rendered through the canonical governance layer and recorded in a build ledger.
8. Other legitimate Fruitful ecosystem or sub-brand marks may appear only in their own clearly labelled identity role. They may never be presented as the Banimal™ logo or Banimal Connector icon.
9. A failed brand audit blocks publication. Exceptions require an explicit manifest change, human review and a recorded commit.

## Rendering contract

`scripts/render-canonical-docs.mjs` produces a governed publication tree without rewriting source history. It:

- copies the complete `docs/` tree;
- injects the canonical Banimal™ ink logo and verified Sam Fox™ ink connector icon into every HTML document on a cream field;
- injects a source-of-truth notice into every Markdown document;
- copies binary artwork unchanged;
- writes `brand-governance-ledger.json` with source and rendered checksums and the action taken for every file.

`.github/workflows/deploy-pages.yml` publishes only this governed render. `.github/workflows/brand-alignment.yml` verifies the source assets, policy, references and every rendered document before it can pass.

## Accountability

The audit is intentionally fail-closed and report-only. It identifies drift; it never “fixes” artwork automatically. Any correction to a logo or icon must replace the source through an approved commit and update the pinned Git blob SHA in `canonical-brand-manifest.json`.
