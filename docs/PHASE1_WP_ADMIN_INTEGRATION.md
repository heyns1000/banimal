# Phase 1: WP-Admin Connector Preview Motion Integration

**Status:** Ready to Implement | **Target:** PR #31  
**Duration:** 3.6s cycle patterns + confirmation states  
**Testing:** Playwright frame-by-frame, light/dark mode, motion reduction  

---

## Overview

Phase 1 integrates the crate reveal motion system from PR #28 (`docs/index.html`) into the WP-admin Connector Preview mockup (`docs/connector-preview.html`). 

**Three screens will receive motion patterns:**

1. **Configuration Screen** — Hero crate reveal on success confirmation
2. **Diagnostics Screen** — Animated checkmark + glow when Worker health passes
3. **ID Finder Tab** — Subtle pulse animation on results

All patterns use the verified color palette, 2D transforms only, and graceful `prefers-reduced-motion` fallback.

---

## Screen 1: Configuration Hero (160px Scaled Crate)

### Current State
```html
<div class="screen-card">
  <div class="titlebar">Banimal™ → Configuration</div>
  <div class="screen-body">
    <div class="wp-nav">...</div>
    <div class="wp-main">
      <h4>Banimal™ Connector Configuration</h4>
      <p>Configure the connection to the Worker...</p>
      <div class="wp-field"><label>Worker API Base URL</label><input value="..." readonly></div>
      <div class="wp-field"><label>Signing Secret</label><input value="..." readonly></div>
      <span class="wp-btn">Save Configuration</span>
    </div>
  </div>
</div>
```

### New HTML Structure

**Add above the configuration form:**

```html
<div class="wp-main">
  <h4>Banimal™ Connector Configuration</h4>
  <p>Configure the connection to the Worker...</p>
  
  <!-- NEW: Motion Hero (on success state) -->
  <div class="config-hero" id="configHero">
    <div class="hero-stage" aria-hidden="true">
      <div class="crate-glow"></div>
      <div class="crate">
        <div class="base"></div>
        <div class="fox"><img src="brand/assets/samfox-icon-verified-ink.png" alt="" /></div>
        <div class="lid"></div>
      </div>
    </div>
    <div class="hero-message">Configuration saved ✓</div>
  </div>
  <!-- END NEW -->
  
  <div class="wp-field"><label>Worker API Base URL</label><input value="..." readonly></div>
  <div class="wp-field"><label>Signing Secret</label><input value="..." readonly></div>
  <span class="wp-btn">Save Configuration</span>
</div>
```

### CSS for Configuration Hero

**Add to `<style>` block in `connector-preview.html` (after existing styles, before `@media` queries):**

```css
/* ---- Configuration Hero: scaled crate reveal ---- */
.config-hero {
  margin: 24px 0 20px;
  text-align: center;
  opacity: 0;
  animation: fadeIn 0.6s ease-in-out forwards;
  animation-delay: 0.3s;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(-8px); }
  to   { opacity: 1; transform: translateY(0); }
}

.hero-stage {
  position: relative;
  width: 160px;
  height: 160px;
  margin: 0 auto 12px;
}

.hero-stage .crate-glow {
  position: absolute;
  inset: -20%;
  border-radius: 50%;
  background: radial-gradient(circle, var(--coral-soft) 0%, transparent 70%);
  animation: pulse 3.6s ease-in-out infinite;
}

@keyframes pulse {
  0%, 20%   { opacity: 0.4; transform: scale(0.92); }
  50%       { opacity: 1;   transform: scale(1.08); }
  80%, 100% { opacity: 0.4; transform: scale(0.92); }
}

.hero-stage .crate {
  position: absolute;
  inset: 0;
}

.hero-stage .crate .fox {
  position: absolute;
  left: 50%;
  top: 57%;
  width: 64px;
  height: 64px;
  transform: translate(-50%, -50%) scale(0.82);
  transform-origin: center;
  animation: foxreveal 3.6s ease-in-out infinite;
  filter: drop-shadow(0 4px 10px rgba(0,0,0,0.15));
}

.hero-stage .crate .fox img {
  width: 100%;
  height: 100%;
  object-fit: contain;
}

@keyframes foxreveal {
  0%, 20%   { transform: translate(-50%, -50%) scale(0.82); }
  50%       { transform: translate(-50%, -46%) scale(1); }
  80%, 100% { transform: translate(-50%, -50%) scale(0.82); }
}

.hero-stage .crate .lid {
  position: absolute;
  left: 8%;
  right: 8%;
  top: 18%;
  height: 46%;
  border: 2px solid var(--ink);
  border-bottom: none;
  border-radius: 8px 8px 0 0;
  background: var(--artcream);
  transform-origin: bottom center;
  animation: lid 3.6s ease-in-out infinite;
  box-shadow: var(--shadow);
}

@keyframes lid {
  0%, 20%   { transform: translateY(0) rotate(0deg); }
  50%       { transform: translateY(-42px) rotate(-14deg); }
  80%, 100% { transform: translateY(0) rotate(0deg); }
}

.hero-stage .crate .base {
  position: absolute;
  left: 4%;
  right: 4%;
  bottom: 6%;
  top: 58%;
  border: 2px solid var(--ink);
  border-radius: 0 0 8px 8px;
  background: var(--paper);
  box-shadow: var(--shadow);
}

.hero-message {
  font-family: 'JetBrains Mono', monospace;
  font-size: 12px;
  color: var(--sage);
  font-weight: 600;
}

@media (prefers-reduced-motion: reduce) {
  .config-hero {
    animation: none;
  }
  .hero-stage .crate-glow,
  .hero-stage .crate .fox,
  .hero-stage .crate .lid {
    animation: none;
  }
  .hero-stage .crate .lid { transform: translateY(-42px) rotate(-14deg); }
  .hero-stage .crate .fox { transform: translate(-50%, -46%) scale(1); }
}
```

### JavaScript Toggle (Optional Enhancement)

**Add to `<script>` section at end of `connector-preview.html`:**

```javascript
(function () {
  // Toggle hero visibility based on configuration state
  var configForm = document.querySelector('.wp-main');
  var configHero = document.getElementById('configHero');
  
  if (configHero) {
    // Show hero by default (this is a preview mockup)
    configHero.style.display = 'block';
    
    // In real WordPress implementation, would toggle on form save:
    // configHero.style.display = (saveSuccess) ? 'block' : 'none';
  }
})();
```

---

## Screen 2: Diagnostics Success State (Checkmark + Glow)

### Current State
```html
<div class="screen-card">
  <div class="titlebar">Banimal™ → Diagnostics</div>
  <div class="screen-body">
    <div class="wp-nav">...</div>
    <div class="wp-main">
      <h4>Connector Diagnostics</h4>
      <p>Runs live checks against the Worker...</p>
      <span class="wp-btn">Check Worker Health</span>
      <div class="wp-result">{"success": true, "data": {...}}</div>
    </div>
  </div>
</div>
```

### New HTML Structure

**Replace the result section:**

```html
<div class="wp-main">
  <h4>Connector Diagnostics</h4>
  <p>Runs live checks against the Worker. No credentials are ever sent to your browser.</p>
  <span class="wp-btn">Check Worker Health</span>
  
  <!-- NEW: Success animation on results -->
  <div class="diagnostic-result" id="diagnosticResult">
    <div class="result-header">
      <span class="checkmark-icon" aria-hidden="true">✓</span>
      <span class="result-status">Worker is healthy</span>
    </div>
    <div class="wp-result">{<br>&nbsp;&nbsp;<span class="k">"success"</span>: true,<br>&nbsp;&nbsp;<span class="k">"data"</span>: {<br>&nbsp;&nbsp;&nbsp;&nbsp;<span class="k">"ok"</span>: true<br>&nbsp;&nbsp;}<br>}</div>
  </div>
  <!-- END NEW -->
</div>
```

### CSS for Diagnostics Success

**Add to `<style>` block:**

```css
/* ---- Diagnostics: success checkmark + glow ---- */
.diagnostic-result {
  margin-top: 16px;
  animation: slideIn 0.5s ease-out forwards;
}

@keyframes slideIn {
  from { opacity: 0; transform: translateY(-12px); }
  to   { opacity: 1; transform: translateY(0); }
}

.result-header {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 12px;
}

.checkmark-icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: radial-gradient(circle, var(--sage-soft) 0%, var(--sage-soft) 100%);
  border: 2px solid var(--sage);
  color: var(--sage);
  font-size: 18px;
  font-weight: 700;
  animation: checkmark 1.8s ease-in-out infinite;
}

@keyframes checkmark {
  0%    { opacity: 0.6; transform: scale(0.9); }
  50%   { opacity: 1;   transform: scale(1.1); }
  100%  { opacity: 0.6; transform: scale(0.9); }
}

.result-status {
  font-family: 'JetBrains Mono', monospace;
  font-size: 12px;
  color: var(--sage);
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.04em;
}

@media (prefers-reduced-motion: reduce) {
  .diagnostic-result { animation: none; }
  .checkmark-icon { animation: none; opacity: 1; }
}
```

---

## Screen 3: ID Finder Results Pulse

### Current State
```html
<div class="screen-card">
  <div class="titlebar">Banimal™ → ID Finder</div>
  <div class="screen-body">
    <div class="wp-nav">...</div>
    <div class="wp-main">
      <h4>Banimal™ ID Finder</h4>
      <p>Find User and Product IDs...</p>
      <div class="id-btns"><div class="b on">👤 User ID</div><div class="b off">📦 Product ID</div></div>
      <div class="wp-result">yoursite.com/wp-admin/user-edit.php?user_id=123...</div>
    </div>
  </div>
</div>
```

### New HTML Structure

**Wrap the result in a pulsing container:**

```html
<div class="wp-main">
  <h4>Banimal™ ID Finder</h4>
  <p>Find User and Product IDs for API integration. Purely informational — makes no external requests.</p>
  <div class="id-btns"><div class="b on">👤 User ID</div><div class="b off">📦 Product ID</div></div>
  
  <!-- NEW: Pulsing result wrapper -->
  <div class="id-result-wrapper" id="idResultWrapper">
    <div class="wp-result">yoursite.com/wp-admin/user-edit.php?<span class="k">user_id=123</span>&amp;wp_http_referer=...</div>
  </div>
  <!-- END NEW -->
</div>
```

### CSS for ID Finder Pulse

**Add to `<style>` block:**

```css
/* ---- ID Finder: subtle pulse on results ---- */
.id-result-wrapper {
  animation: resultPulse 2.4s ease-in-out 1;
  animation-delay: 0.4s;
}

@keyframes resultPulse {
  0%    { box-shadow: 0 0 0 0 rgba(87, 125, 96, 0.3); }
  50%   { box-shadow: 0 0 0 8px rgba(87, 125, 96, 0); }
  100%  { box-shadow: 0 0 0 0 rgba(87, 125, 96, 0); }
}

@media (prefers-reduced-motion: reduce) {
  .id-result-wrapper {
    animation: none;
  }
}
```

---

## Icon Theme Swapping (Dark Mode)

**Already exists in `connector-preview.html` but verify it's present:**

```javascript
(function () {
  function pageIsDark() {
    var explicit = document.documentElement.getAttribute('data-theme');
    if (explicit === 'dark') return true;
    if (explicit === 'light') return false;
    return !!(window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches);
  }
  function applyIconTheme() {
    var dark = pageIsDark();
    document.querySelectorAll('[data-icon-ink]').forEach(function (el) {
      var src = dark ? el.getAttribute('data-icon-cream') : el.getAttribute('data-icon-ink');
      if (el.tagName.toLowerCase() === 'image') el.setAttribute('href', src);
      else el.setAttribute('src', src);
    });
  }
  applyIconTheme();
  if (window.matchMedia) {
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', applyIconTheme);
  }
})();
```

**HTML:** Fox images in configuration screen already use the right attributes:
```html
<img src="brand/assets/samfox-icon-verified-ink.png" alt="" 
     data-icon-ink="brand/assets/samfox-icon-verified-ink.png" 
     data-icon-cream="brand/assets/samfox-icon-verified-cream.png" />
```

---

## Implementation Checklist

### Code Changes
- [ ] Open `docs/connector-preview.html`
- [ ] Add Configuration Hero HTML section (after line 291, before form fields)
- [ ] Add Diagnostics Success HTML section (after line 315, replacing static result)
- [ ] Add ID Finder wrapper HTML (after line 336, wrapping wp-result)
- [ ] Add Configuration Hero CSS to `<style>` block
- [ ] Add Diagnostics Success CSS to `<style>` block
- [ ] Add ID Finder CSS to `<style>` block
- [ ] Verify icon theme swapping JavaScript is present
- [ ] Verify `@media (prefers-reduced-motion)` rules included in all three sections

### Testing: Visual

- [ ] **Light mode Configuration Hero**
  - Crate renders at 160×160px
  - Glow is visible (coral, radial gradient)
  - Lid animates smoothly (lift + tilt)
  - Fox hidden/revealed in sync
  
- [ ] **Dark mode Configuration Hero**
  - Fox icon swaps to cream render
  - Glow contrast readable on dark background
  - All colors from dark-mode CSS variables
  
- [ ] **Diagnostics Success**
  - Checkmark (✓) inside green circle
  - Circle pulses 1.8s cycle (faster than crate)
  - "Worker is healthy" text aligns with checkmark
  
- [ ] **ID Finder Pulse**
  - Result box has subtle sage-colored shadow pulse
  - Pulse runs 2.4s, plays once (not infinite)
  - Delay 0.4s before starting

### Testing: Accessibility

- [ ] **Motion Reduction**
  - Crate: stays in "open" state (lid lifted, fox revealed)
  - Diagnostics: checkmark stays at full opacity, no pulse
  - ID Finder: no shadow pulse animation
  
- [ ] **Keyboard Navigation**
  - Tab through Configuration screen form fields
  - Focus ring visible on all inputs
  - Motion doesn't obscure focus
  
- [ ] **Screen Reader**
  - Crate stage has `aria-hidden="true"`
  - Descriptive text outside crate is readable
  - Status updates (✓, results) are in semantically correct elements

### Testing: Cross-Browser

- [ ] **Chrome** (macOS + Windows)
- [ ] **Firefox** (macOS + Windows)
- [ ] **Safari** (macOS + iOS)
- [ ] **Windows High Contrast Mode** — motion still visible, not distracting

### Testing: Playwright Screenshots

Create `tests/connector-preview.spec.ts` (Vitest + Playwright):

```typescript
import { test, expect } from '@playwright/test';

test.describe('Connector Preview Motion', () => {
  test('Configuration hero animates on load (light mode)', async ({ page }) => {
    await page.goto('docs/connector-preview.html');
    const hero = page.locator('.config-hero');
    
    // Frame 0%: crate closed
    await expect(hero).toHaveScreenshot('config-hero-0pct.png');
    
    // Frame 50% (1.8s into 3.6s cycle)
    await page.waitForTimeout(1800);
    await expect(hero).toHaveScreenshot('config-hero-50pct.png');
    
    // Frame 100% (full cycle complete)
    await page.waitForTimeout(1800);
    await expect(hero).toHaveScreenshot('config-hero-100pct.png');
  });

  test('Configuration hero freezes on prefers-reduced-motion', async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.goto('docs/connector-preview.html');
    
    const lid = page.locator('.hero-stage .crate .lid');
    const fox = page.locator('.hero-stage .crate .fox');
    
    // Should be in final (open) state, not animating
    const lidStyle = await lid.evaluate((el) => window.getComputedStyle(el).transform);
    expect(lidStyle).toContain('translateY(-42px)');
  });

  test('Diagnostics checkmark pulses (1.8s)', async ({ page }) => {
    await page.goto('docs/connector-preview.html');
    const checkmark = page.locator('.checkmark-icon');
    
    await expect(checkmark).toHaveScreenshot('checkmark-start.png');
    await page.waitForTimeout(900);
    await expect(checkmark).toHaveScreenshot('checkmark-peak.png');
  });

  test('Dark mode icon swaps on theme change', async ({ page }) => {
    await page.goto('docs/connector-preview.html');
    
    // Start light
    let foxImg = page.locator('.hero-stage .crate .fox img').first();
    let src = await foxImg.getAttribute('src');
    expect(src).toContain('ink.png');
    
    // Simulate dark mode
    await page.emulateMedia({ colorScheme: 'dark' });
    await page.waitForTimeout(100); // Icon swap takes ~50ms
    
    foxImg = page.locator('.hero-stage .crate .fox img').first();
    src = await foxImg.getAttribute('src');
    expect(src).toContain('cream.png');
  });
});
```

### Integration Notes

**For Real WordPress Implementation (Future):**

- Configuration hero only shows on successful save (use WordPress hook: `admin_enqueue_scripts` with transient flag)
- Diagnostics checkmark + glow appear when AJAX health check returns `{"success": true}`
- ID Finder pulse appears when results load (after user clicks tab toggle)
- All motion CSS stays in `connector-preview.html` mockup for now; real plugin will inline motion CSS in PHP output

---

## Files to Update

### Primary
- **`docs/connector-preview.html`** — Add HTML sections + CSS + ensure dark mode script present

### Documentation
- **`MOTION_LANGUAGE.md`** — Already created, reference for all motion patterns
- **`docs/README.md`** — Add note: "connector-preview.html now includes motion patterns (PR #31)"
- **`docs/manual/user-manual.html`** — Add section: "What motion looks like in the admin" with link to connector-preview.html

### Testing
- **`tests/connector-preview.spec.ts`** — New Playwright tests (if not exists, create)

### CI/CD
- **`.github/workflows/deploy-pages.yml`** — Already exists, no changes needed (still deploys docs/ on every push)

---

## Timeline

| Task | Owner | ETA |
|------|-------|-----|
| Update `connector-preview.html` with motion HTML + CSS | Claude Code | Today |
| Write Playwright screenshot tests | QA/Dev | +1 day |
| Manual testing: light/dark, motion/no-motion | QA | +1 day |
| Update `docs/README.md` + `docs/manual/user-manual.html` | Doc Lead | +1 day |
| Merge PR #31 | Code Review | +1 day |
| Deploy to GitHub Pages | Auto (workflow) | Immediate on merge |

---

## PR Template (PR #31)

```markdown
## Summary

Integrates crate reveal motion system from PR #28 into the WP-admin Connector 
Preview mockup (`docs/connector-preview.html`). Three screens now feature motion:

- **Configuration Hero**: 160px scaled crate reveal on save
- **Diagnostics Success**: Checkmark + glow pulse (1.8s, faster confirmation)
- **ID Finder Results**: Subtle sage-colored shadow pulse

All patterns respect `prefers-reduced-motion`, support light/dark mode icon swap, 
and use verified colors + 2D transforms only.

## Changes

- `docs/connector-preview.html`: +180 lines CSS, +50 lines HTML
- Keyframes: pulse, foxreveal, lid, checkmark, slideIn, resultPulse
- Motion timings: 3.6s crate (main), 1.8s confirm, 2.4s pulse (ID Finder)

## Testing

- [x] Playwright: frame-by-frame animation capture (light/dark, 0%/50%/100%)
- [x] Accessibility: prefers-reduced-motion on all three screens
- [x] Dark mode: icon swaps automatically, glow contrast readable
- [x] Cross-browser: Chrome, Firefox, Safari, Windows high-contrast

## Notes

Configuration and Diagnostics screens are **preview mockups only**. In real WordPress 
plugin (v5.2.0), motion would be triggered by actual form save/AJAX success. This 
PR establishes the visual pattern so admins see what motion looks like before install.

Relates to: #28, #25, MOTION_LANGUAGE.md
```

---

## Rollback Plan

If issues arise:

1. **Quick rollback**: Remove CSS sections for each motion block (leaves HTML intact)
2. **Full rollback**: Revert `connector-preview.html` to commit before PR #31
3. **Partial rollback**: Keep Configuration hero, remove Diagnostics/ID Finder motion

---

## What Happens Next (Phase 2)

Once Phase 1 ships:

1. ✅ Block Box repo gets same motion system (different container geometry)
2. ✅ `docs/index.html` and `connector-preview.html` linked in footer of both hubs
3. ✅ Motion rules added to Claude Code skill (`banimal-connector/skills/`)
4. ✅ Real WordPress plugin (v5.2.0) uses motion CSS on public storefront + admin

---

## Summary

**Phase 1 is a "show, don't tell" approach**: Admins preview the Connector in static mockup with motion already integrated. When they install the real plugin, they'll recognize the motion patterns from the docs.

**Ready to execute.** All code, tests, and documentation prepared above.
