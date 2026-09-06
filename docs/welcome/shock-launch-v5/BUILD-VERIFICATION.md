# Shock Launch v5 — Alignment Audit & Build Verification Manual

Backup reference for the Banimal Connector / Sam Fox™ CI Guide build process,
covering `docs/welcome/shock-launch-v5/`. Logs every layout/alignment defect
found across this page's builds, in the order it was found, plus the
checklist used to verify a build before it ships. Not a changelog of
features — just the alignment audit trail and the verification steps, kept
here as a backup.

The issues logged below as "1–7" were found and fixed on `shock-launch-v2/`
before that version shipped to `main` (PR #35) and this page was carried
forward into `shock-launch-v3/` unchanged, then merged to `main` (PR #36).
Issue "8" was found after that merge and fixed in `shock-launch-v4/`, which
then also shipped to `main` (PR #37). This round — a real i18n build, not an
alignment fix, logged as "9" below for continuity — lives in the new
`shock-launch-v5/`. Everything from here on is tracked against v5.

---

## Versioning formula — read this before touching this page again

`docs/welcome/shock-launch/` is v1, `docs/welcome/shock-launch-v2/` is v2,
`docs/welcome/shock-launch-v3/` is v3, `docs/welcome/shock-launch-v4/` is v4,
this directory is v5. **Once a
version's directory has been merged into
`main`, it is frozen — never edit it in place again.** Any further change
(fix, enhancement, redesign) starts a new version:

1. Confirm the current highest `docs/welcome/shock-launch-v<N>/` has
   actually reached `main` (`git log main -- docs/welcome/shock-launch-vN/`
   is non-empty, or check the merged PR).
2. `git mv docs/welcome/shock-launch-v<N> docs/welcome/shock-launch-v<N+1>`
   — copy-by-rename, don't hand-recreate the files.
3. Make the change inside the new `v<N+1>/` directory only.
4. Move (and update) this manual into `v<N+1>/` along with it, and append a
   new dated entry to the issue log below for anything fixed in this round
   — don't renumber or rewrite the earlier entries, they're history for the
   version they happened on.
5. `v<N>/` stays byte-for-byte as it shipped. It is a record, not a draft.

This mirrors the convention already set by v1 → v2 (see commit history:
`docs/welcome/shock-launch/` was never touched again after
`docs/welcome/shock-launch-v2/` was created from it) — this file just makes
it explicit so it keeps happening automatically instead of by memory.

---

## Sam Fox™ CI Guide compliance notes

These rules from the CI Guide Master governed every fix below and are
restated here so future edits don't regress them:

- The verified Sam Fox™ fox-head mark (`samfox-icon-verified-ink.png` /
  `-cream.png`) is never redrawn, retyped, or recolored. It only reverses
  ink↔cream, driven by `data-theme` + a `MutationObserver`, never a third
  color.
- AI-approximated art (e.g. the glassy "core" fox icon used on the theme
  toggle) is never presented as the Sam Fox™ mark or attributed to her hand.
  It does not appear in the "Verified at the Source" section. It may reuse
  the nine verified palette hex values for decoration (color reuse ≠
  authorship claim).
- The Fruitful™ marks (pear / wordmark / lockup) are a distinct brand from
  Sam Fox™ and must not be conflated with it.
- Interactive color pickers (the palette swatches) glow a UI frame/plate
  around a verified mark — they never touch the mark's own pixels or `src`.

---

## Alignment issue log

Each entry: what was reported → root cause → fix. All fixes were verified
locally with Playwright against a `python3 -m http.server` rooted at `docs/`
before publishing, per the checklist below.

### 1. Fruitful mark rendering as a solid black box in dark mode
- **Reported:** screenshot showing the Fruitful pear/wordmark/lockup marks
  as solid black rectangles on dark backgrounds.
- **Root cause:** the extracted PNGs were `RGB` (flattened onto opaque
  white), not `RGBA`. Under `[data-theme='dark'] { filter: invert(1); }`,
  white flattening inverts to black.
- **Fix:** re-extracted as true alpha-transparent PNGs (`ImageOps.grayscale`
  + `ImageOps.invert` as an alpha mask, RGB set to black), replacing
  `docs/brand/assets/fruitful-{pear,wordmark,lockup}-verified.png`.

### 2. Inline logo forcing a 3-line heading wrap
- **Reported:** screenshot showing "Welcome to [logo]" wrapping across 3
  lines and misaligned left instead of sitting inline with the text.
- **Root cause:** the page's global reset —
  `img, picture, video, canvas, svg { display: block; }` — forces every
  `<img>` onto its own line regardless of height/width sizing.
- **Fix:** `.h2-wordmark { display: inline; height: 0.72em; vertical-align:
  -0.06em; }` so the mark sizes against the heading's own font-size and
  reads as one glyph among the surrounding words.

### 3. Two-tone background banding on "Verified at the Source"
- **Reported:** 3 screenshots showing the section's background split into
  two visibly different shades with a hard vertical seam, at wide
  viewports.
- **Root cause:** `<section class="verified-section wrap">` combined a
  full-bleed background class with `.wrap` (max-width: 1240px) on the same
  element, capping the *background box itself* to 1240px instead of just
  the content width.
- **Fix:** moved the background class to the outer `<section>` and `.wrap`
  to an inner `<div>` — matching the pre-existing `flag-section` /
  `merge-section` pattern elsewhere on the page.

### 4. Hero art oversized/cropped on a narrow-but-tall viewport
- **Reported:** screenshot showing the hero's eye/fox/curtain art and its
  flanking "THE SHOCK LAUNCH" text cropped off both edges at a narrow
  panel width.
- **Root cause:** `.hero { min-height: 92vh; }` sizes purely off viewport
  height. On a narrow-but-tall viewport, `background-size: cover` then has
  to scale the (square) hero art up hard to cover that height, pushing
  everything near the edges off-screen.
- **Fix:** `min-height: clamp(520px, min(92vh, 120vw), 900px);` — bounds
  the height by viewport width too, so cover-mode never has to zoom past a
  ~1.3:1 aspect demand.

### 5. Anchor-jump landing a heading behind the sticky header
- **Reported:** screenshot showing "THE REVEAL / Flag activation" tucked
  under/behind the sticky header after a nav-link jump to `#flag`.
- **Root cause:** `scroll-padding-top: var(--space-16)` (64px) undershot
  the sticky header's real rendered height (~74–81px, driven by the theme
  toggle's height + padding).
- **Fix:** bumped to `scroll-padding-top: var(--space-24)` (96px).

### 6. "Welcome to Fruitful" mock heading left-aligned against centered siblings
- **Reported:** screenshot showing the mock heading starting at the left
  edge while the eyebrow, paragraph, and portal chips below it are
  centered — same container, mismatched alignment.
- **Root cause:** `.welcome-mock h3 { display: flex; align-items: center;
  }` (added to lay the inline wordmark next to the text) had no
  `justify-content`, so it defaulted to `flex-start` — overriding the
  parent's `text-align: center`, which has no effect on flex children.
- **Fix:** added `justify-content: center;` to that rule.

### 7. Global Data Merge canvas card floating with a mismatched gap
- **Reported:** two screenshots at different widths showing the merge
  canvas card's bottom edge landing at a different height than the copy
  column beside it, leaving an inconsistent gap.
- **Root cause:** `.merge-canvas-wrap { aspect-ratio: 1/1; }` sizes the
  card purely off its own column width, independent of the copy column's
  (content-driven) height; `.merge-grid { align-items: center; }` then
  centers the mismatched box, so the gap shifts with viewport width.
- **Fix:** `.merge-grid { align-items: stretch; }` plus dropping the fixed
  aspect-ratio for a `min-height` on the two-column desktop layout, so the
  card always matches the copy column's height. The square aspect-ratio is
  restored only inside the `max-width: 900px` single-column fallback,
  where there's no sibling to stretch against.

### 8. Flag illustration floating with a mismatched gap against its copy (v4)
- **Reported:** "Flag raised = ecosystem live · flag lowered = standing by,
  please align this" — the flag-caption text quoted back with no
  screenshot; the same category of bug as #7 above, found by re-checking
  every other two-column grid on the page for the identical pattern after
  fixing the merge-grid one.
- **Root cause:** exactly #7's pattern, on a different section:
  `.flag-stage { aspect-ratio: 3/4; }` sizes the flag illustration purely
  off its own column width, independent of `.flag-copy`'s (content-driven)
  height; `.flag-grid { align-items: center; }` then centered the
  mismatched box, leaving a ~10px gap top and bottom (measured via
  `getBoundingClientRect()`: copy 473px tall vs. rig 453px tall).
- **Fix:** same shape as #7 — `.flag-grid { align-items: stretch; }` plus
  dropping `.flag-stage`'s fixed aspect-ratio for a `min-height` on the
  two-column desktop layout. The pole/ball/cloth positioning inside
  `.flag-stage` all uses `%`-relative values, so it scales proportionally
  with the stretched height instead of breaking. Aspect-ratio restored only
  inside the `max-width: 900px` single-column fallback.

### 9. Three-language i18n build (v5) — English / Simplified Chinese / Spanish
- **Requested:** a second fox-head icon (the same glassy toggle icon), wired
  as a language switcher instead of a theme switcher, translating the whole
  page into English, Mainland Simplified Chinese, and a third language of
  choice (Spanish — broadest global reach alongside English and Mandarin).
  "Atom level persistence" → the choice survives a reload via
  `localStorage`. "Global supersede of the meaning" → every visible string
  on the page is translated, not a token subset.
- **Architecture:** `i18n.js` (loaded before `script.js`) holds the full
  `TRANSLATIONS` dictionary and an `apply()` pass over four attribute
  families:
  - `data-i18n="key"` — plain `textContent` swap.
  - `data-i18n-html="key"` — `innerHTML` swap, for the handful of headings
    that carry an inline `<img class="h2-wordmark">` / `.hero-wordmark` /
    `.mock-wordmark` logo mid-sentence ("Welcome to [logo]", "The [logo]
    Portals", …). Each language's dictionary entry embeds the same `<img>`
    tag in its own grammatically correct position — Chinese and Spanish
    word order around the mark differs from English, so this couldn't be
    done as a text-prefix/suffix split around a fixed image position.
  - `data-i18n-alt="key"` / `data-i18n-aria="key"` — `alt`/`aria-label`
    swaps, for the three portal photos, the verified fox-mark image, the
    header brand link, and both fox-head toggles.
  - A global `window.foxI18n` API (`t(key)`, `getLang()`, `setLang()`,
    `cycle()`, `onChange(fn)`) so `script.js`'s own dynamic strings — the
    flag status pill/button (`Standing by` ⇄ `Flag activated`, `Raise` ⇄
    `Lower`), the theme toggle's `aria-label`, and the signup form's
    success message — re-render in the current language instead of
    reverting to hardcoded English when their state changes or the
    language is switched mid-interaction.
- **What stays untranslated on purpose:** verified brand names (Fruitful™,
  Sam Fox™, Banimal™), the "Shock Launch" campaign name, the nine CI-Guide
  colour names (INK, SAGE, MINT, …), the `welcome.fruitful.co.za` mock URL,
  the email placeholder, and filenames inside `<code>` tags — a brand name
  or a literal filename doesn't change meaning by being left alone in a
  Chinese or Spanish sentence; translating it would misrepresent it.
- **Verified:** all three languages checked via `getBoundingClientRect()`
  and `textContent`/`innerHTML` reads (not just screenshots) for the nav,
  hero, flag section (both static and post-interaction dynamic text),
  portals (including `alt` text), and the verify section's `<code>`-tagged
  filenames staying literal. Persistence checked via a real page reload
  reading `localStorage.getItem('fox-lang')` back. Theme + language checked
  together (dark mode × Chinese) to confirm the two independent toggles
  don't interfere.

---

## Build verification checklist

Run before every push to this build:

1. **Brand-alignment audit** — `node scripts/verify-brand-alignment.mjs`
   from the repo root. Must report clean against the CI Guide Master, the
   Connector icon page, and `brand-guide.ts`.
2. **Local render check** — serve the real repo files (not just the
   artifact copy) so relative asset paths resolve identically to
   production:
   ```bash
   python3 -m http.server 8934 --directory docs
   ```
3. **Playwright pass** — launch headless Chromium
   (`/opt/pw-browsers/chromium-*/chrome-linux/chrome`, `args:
   ['--no-sandbox']`), and for every fix:
   - Force-settle scroll-reveal animations before screenshotting:
     `document.querySelectorAll('.reveal').forEach(el =>
     el.classList.add('is-visible'))`.
   - Prefer `window.location.hash = '#section'` over clicking nav links
     when testing at narrow widths — the desktop nav may be hidden behind
     the mobile burger menu.
   - Check both the light and dark `data-theme`, and at least one narrow
     (~700×1000) and one wide (~1400×900) viewport.
   - For any fixed-vs-flexible sizing fix, read back the actual
     `getBoundingClientRect()` values (not just a screenshot) to confirm
     the numbers actually match — e.g. `merge-canvas-wrap` height vs
     `merge-copy` height.
4. **Mirror to both copies** — every fix lands in both the real repo files
   (whichever `docs/welcome/shock-launch-vN/` is current and unfrozen per
   the formula above) and the live Claude Artifact copy. They must stay
   byte-equivalent in behavior; only the artifact inlines assets
   as base64 data URIs.
5. **Ship order** — publish the artifact first (fast, low-risk to redo),
   then commit + push the repo copy, then open/update the PR.

## Known trap: draft-PR auto-merge captures a stale commit

If a PR was opened as a draft with auto-merge armed, marking it "ready for
review" later merges whatever commit was on the branch **at that moment** —
not necessarily the latest one pushed. Any commits pushed after auto-merge
fires land on the now-merged branch but never reach `main`. Symptom: a
merge commit whose second parent is an old commit, with later commits still
sitting on the branch, unmerged. Check with:

```bash
git log -1 --format="%P" <merge-commit>   # second parent should be HEAD at merge time
git merge-base --is-ancestor <latest-commit> origin/main   # NO means it's stranded
```

Fix: open a fresh PR from the same branch — the stranded commits are still
there, just not yet merged into `main`.
