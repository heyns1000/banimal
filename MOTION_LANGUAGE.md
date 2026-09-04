# Banimal Motion & Visual Language System

**Author:** Claude Code | **Source:** PR #28 + Connector Preview Analysis  
**Status:** Production Pattern Established | **Next:** Extend to WP-Admin + Block Box  
**Last Updated:** 2026-09-04

---

## Overview

PR #28 (`docs/index.html`) establishes a **production-grade motion design pattern** that unifies brand identity across three surfaces:

1. **Docs Hub Landing** (live in PR #28) — Crate reveal hero
2. **WP-Admin Connector Preview** (static mockup, `docs/connector-preview.html`) — Motion system ready to apply
3. **Block Box Container Visuals** (separate repo: `zerowaste.seedwave.faa.zone`) — Same pattern, different context

This document defines the **motion primitives, palette constraints, accessibility rules, and implementation checklist** for porting the hero animation pattern to both surfaces.

---

## Motion Primitives

### The Crate Reveal (Hero Pattern)

**Current Implementation:** `docs/index.html` lines 58-118  
**Duration:** 3.6s | **Timing:** ease-in-out | **Loop:** infinite

```css
/* Container: radial glow pulses in rhythm */
@keyframes pulse {
  0%, 20%   { opacity: 0.4; transform: scale(0.92); }
  50%       { opacity: 1;   transform: scale(1.08); }
  80%, 100% { opacity: 0.4; transform: scale(0.92); }
}

/* Lid: lifts and tilts in sync with fox reveal */
@keyframes lid {
  0%, 20%   { transform: translateY(0) rotate(0deg); }
  50%       { transform: translateY(-58px) rotate(-14deg); }
  80%, 100% { transform: translateY(0) rotate(0deg); }
}

/* Fox: hidden→revealed→hidden, scales on reveal */
@keyframes foxreveal {
  0%, 20%   { transform: translate(-50%, -50%) scale(0.82); }
  50%       { transform: translate(-50%, -46%) scale(1); }
  80%, 100% { transform: translate(-50%, -50%) scale(0.82); }
}
```

### Why This Pattern Works

1. **2D Transforms Only** — Reads clearly as a lid lifting. Early rotateX-based "3D" read as confusing skew.
2. **Proportional Timing** — All three elements (glow, lid, fox) use the same 3.6s loop, so motion feels unified.
3. **Stagger (20% → 50% → 80%)** — Lid opens while glow pulses and fox scales; creates readable narrative arc.
4. **No "Magic"** — Uses only `translateY`, `rotate`, `scale` — compatible with all browsers/devices.

---

## Visual System (No New Language)

### Color Palette

All colors already defined and verified in `docs/brand/ci-guide.html`. **Do not create new colors.**

| Role | Hex | CSS Var | Usage |
|------|-----|---------|-------|
| **Ink** | #231F20 | `--ink` | Text, borders, lid/base |
| **Cream** | #FBF4E4 | `--cream` | Background |
| **Art Cream** | #F0EEDA | `--artcream` | Lid fill (subtle contrast) |
| **Paper** | #FFFFFF | `--paper` | Base fill (crate interior) |
| **Sage** | #577D60 | `--sage` | Accent, status labels |
| **Coral** | #F16B6E | `--coral` | Glow, emphasis |
| **Dusty Rose** | #B95F56 | `--dustyrose` | Secondary accent |
| **Teal** | #1E9F97 | `--teal` | Information, links |
| **Red** | #E63946 | `--red` | Alerts only |

### Typography

- **Headings:** Baloo 2 (600, 700 weights)
- **UI Text:** JetBrains Mono (400, 500, 600 weights)
- **Body:** Georgia serif (for debrief/manual text)

**Font Loading:** Already in `<link>` tag in both `index.html` and `connector-preview.html`.

### Shadows

```css
/* Light mode */
--shadow: 0 1px 2px rgba(35,31,32,0.06), 0 6px 20px rgba(35,31,32,0.05);

/* Dark mode */
--shadow: 0 1px 2px rgba(0,0,0,0.3), 0 8px 24px rgba(0,0,0,0.35);
```

Used consistently on all cards, panels, and elevations.

---

## Light/Dark Mode System

### CSS Variables

```css
:root {
  /* Light theme (default) */
  --ink:#231F20; --cream:#FBF4E4; --paper:#FFFFFF; /* ... */
}

@media (prefers-color-scheme: dark) {
  :root:not([data-theme="light"]) {
    /* Dark theme (automatic) */
    --ink:#EDE7DA; --cream:#1B1A17; --paper:#201D18; /* ... */
  }
}

:root[data-theme="dark"] {
  /* Explicit dark override */
  /* Same as @media block above */
}
```

### Icon Swapping

The verified fox-head icon exists in two renders:
- `brand/assets/samfox-icon-verified-ink.png` — ink color on cream background
- `brand/assets/samfox-icon-verified-cream.png` — cream color on ink background

**JavaScript Auto-Swap:**

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
      el.setAttribute('src', dark ? el.getAttribute('data-icon-cream') : el.getAttribute('data-icon-ink'));
    });
  }
  
  applyIconTheme();
  if (window.matchMedia) {
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', applyIconTheme);
  }
})();
```

**HTML Usage:**

```html
<img 
  data-icon-ink="brand/assets/samfox-icon-verified-ink.png" 
  data-icon-cream="brand/assets/samfox-icon-verified-cream.png" 
  src="brand/assets/samfox-icon-verified-ink.png" 
  alt="Sam Fox™ icon"
/>
```

---

## Accessibility Rules

### Motion Reduction

**Applies to all animated elements:**

```css
@media (prefers-reduced-motion: reduce) {
  .crate-glow, .crate .fox, .crate .lid {
    animation: none;
  }
  
  /* Freeze on the "complete" state */
  .crate .lid {
    transform: translateY(-58px) rotate(-14deg); /* Open */
  }
  
  .crate .fox {
    transform: translate(-50%, -46%) scale(1); /* Revealed */
  }
}
```

**Why freeze on "complete" rather than "start"?**
- Shows the product/content fully (fox revealed, lid open)
- Not a jarring static state mid-animation
- Respects motion sensitivity while maintaining narrative

### Semantic HTML

```html
<!-- Decorative animation must be aria-hidden -->
<div class="crate-stage" aria-hidden="true">
  <!-- Content that shouldn't be read aloud -->
</div>

<!-- Descriptive caption follows -->
<div class="caption">the container <i>is</i> the product</div>
```

### Focus & Keyboard Navigation

- All interactive elements (cards, buttons) must be keyboard-accessible
- Motion does NOT interfere with focus states
- No `transform: translateZ(0)` or hardware acceleration that breaks focus rings

---

## Implementation Roadmap

### Phase 1: WP-Admin Connector Preview (connector-preview.html)

**Goal:** Integrate crate reveal into the admin screens mockup as a hero/confirmation pattern.

**Where to Apply:**

1. **Configuration Screen Hero**
   - Show crate reveal above the form (smaller scale: 160px vs 220px)
   - Message: "Your connection is configured" (on success state)
   - Falls back to static icon if motion-disabled

2. **Diagnostics Screen Success State**
   - Animated checkmark + fox glow when Worker health check passes
   - Reuse coral glow + scale pattern
   - Duration: 1.8s (half of 3.6s, snappier for confirmation)

3. **ID Finder Tab Icon Animation**
   - Subtle pulse on the icon when results load
   - Less aggressive than full crate reveal (small-scale glow only)

**Checklist:**
- [ ] Add `<style>` block with motion definitions (can reuse from `index.html`)
- [ ] Integrate `@keyframes pulse`, `lid`, `foxreveal` into `connector-preview.html`
- [ ] Create 160px × 160px variant of crate (scale down proportionally)
- [ ] Test `prefers-reduced-motion` on all three screens
- [ ] Verify dark mode icon swap on admin chrome
- [ ] Screenshot all states (light/dark, motion/no-motion)
- [ ] Playwright: Frame-by-frame verify animation loop at 0%, 25%, 50%, 75%, 100%

### Phase 2: Block Box Container Visuals (zerowaste.seedwave.faa.zone repo)

**Goal:** Apply the crate reveal pattern to the Block Box™ container, same fox-head, different container geometry.

**Scope:**
- Block Box is a **separate product/repo** with its own GitHub Pages site
- Shares the **same fox-head icon** (never redrawn) + **same palette**
- Uses identical motion primitives but different container shapes (box vs crate)

**Deliverables:**
- `docs/index.html` in `zerowaste.seedwave.faa.zone` repo
- Hero animation: **fox-head in a shipping box** (Block Box context)
  - Lid lifts to reveal contents
  - Fox glows (coral, same)
  - Duration: 3.6s (consistency)
  - Motion reduces gracefully

**Checklist:**
- [ ] Create `zerowaste.seedwave.faa.zone` repo (or confirm it exists)
- [ ] Copy motion CSS from this repo (`MOTION_LANGUAGE.md` + `docs/index.html`)
- [ ] Adapt HTML geometry for Block Box container shape (not crate)
- [ ] Reuse Fox icon, palette, shadow system
- [ ] Test light/dark mode + motion reduction
- [ ] Deploy via GitHub Pages (same `deploy-pages.yml` pattern)
- [ ] Link from both docs hubs (Banimal → Block Box, Block Box → Banimal)

### Phase 3: Documentation & Skill Porting

**Goal:** Encode motion patterns into Claude Code plugin skill for future UI work.

**Deliverables:**
- Update `banimal-connector/skills/samfox-ci-guide/SKILL.md`
  - Add "Motion & Animation" section
  - Include CSS snippets for crate reveal, pulse, glow
  - Document `prefers-reduced-motion` pattern
  - Provide 160px, 220px, 280px size variants

**Checklist:**
- [ ] Add motion rule to skill: *"All motion uses 2D transforms only (translate, rotate, scale)"*
- [ ] Add glow rule: *"Coral (#F16B6E) radial gradient for emphasis; pulse with 3.6s ease-in-out"*
- [ ] Document duration consistency: *"Match 3.6s or use half (1.8s) for confirmations"*
- [ ] Provide motion stagger template for multi-element reveals
- [ ] Test skill loading in Claude Code on new projects

---

## Code Examples

### Minimal Crate Reveal (Copy-Paste Ready)

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <style>
    :root {
      --ink:#231F20; --cream:#FBF4E4; --artcream:#F0EEDA; --paper:#FFFFFF;
      --coral:#F16B6E; --coral-soft:#FCE7E7; --dustyrose:#B95F56;
      --shadow: 0 1px 2px rgba(35,31,32,0.06), 0 6px 20px rgba(35,31,32,0.05);
    }
    @media (prefers-color-scheme: dark) {
      :root:not([data-theme="light"]) {
        --ink:#EDE7DA; --cream:#1B1A17; --artcream:#232019; --paper:#201D18;
        --coral:#E2938B; --coral-soft:#332521; --dustyrose:#E2938B;
        --shadow: 0 1px 2px rgba(0,0,0,0.3), 0 8px 24px rgba(0,0,0,0.35);
      }
    }

    .crate-stage { position: relative; width: 220px; height: 220px; margin: 0 auto; }
    .crate-glow {
      position: absolute; inset: -20%; border-radius: 50%;
      background: radial-gradient(circle, var(--coral-soft) 0%, transparent 70%);
      animation: pulse 3.6s ease-in-out infinite;
    }
    @keyframes pulse { 
      0%, 20% { opacity: 0.4; transform: scale(0.92); } 
      50% { opacity: 1; transform: scale(1.08); } 
      80%, 100% { opacity: 0.4; transform: scale(0.92); } 
    }

    .crate { position: absolute; inset: 0; }
    .crate .fox { position: absolute; left: 50%; top: 57%; width: 88px; height: 88px; transform: translate(-50%, -50%) scale(0.82); animation: foxreveal 3.6s ease-in-out infinite; filter: drop-shadow(0 6px 14px rgba(0,0,0,0.18)); }
    .crate .fox img { width: 100%; height: 100%; object-fit: contain; }
    @keyframes foxreveal {
      0%, 20% { transform: translate(-50%, -50%) scale(0.82); }
      50% { transform: translate(-50%, -46%) scale(1); }
      80%, 100% { transform: translate(-50%, -50%) scale(0.82); }
    }

    .crate .lid { position: absolute; left: 8%; right: 8%; top: 18%; height: 46%; border: 2.5px solid var(--ink); border-bottom: none; border-radius: 10px 10px 0 0; background: var(--artcream); transform-origin: bottom center; animation: lid 3.6s ease-in-out infinite; box-shadow: var(--shadow); }
    @keyframes lid {
      0%, 20% { transform: translateY(0) rotate(0deg); }
      50% { transform: translateY(-58px) rotate(-14deg); }
      80%, 100% { transform: translateY(0) rotate(0deg); }
    }

    .crate .base { position: absolute; left: 4%; right: 4%; bottom: 6%; top: 58%; border: 2.5px solid var(--ink); border-radius: 0 0 10px 10px; background: var(--paper); box-shadow: var(--shadow); }

    @media (prefers-reduced-motion: reduce) {
      .crate-glow, .crate .fox, .crate .lid { animation: none; }
      .crate .lid { transform: translateY(-58px) rotate(-14deg); }
      .crate .fox { transform: translate(-50%, -46%) scale(1); }
    }
  </style>
</head>
<body>
  <div class="crate-stage" aria-hidden="true">
    <div class="crate-glow"></div>
    <div class="crate">
      <div class="base"></div>
      <div class="fox"><img src="path/to/samfox-icon-verified-ink.png" alt="" /></div>
      <div class="lid"></div>
    </div>
  </div>
  <div>the container <i>is</i> the product</div>
</body>
</html>
```

### Confirmation State (1.8s Pulse)

```css
/* Faster confirmation: when something succeeds */
@keyframes pulse-confirm {
  0%    { opacity: 0.6; transform: scale(0.9); }
  50%   { opacity: 1;   transform: scale(1.1); }
  100%  { opacity: 0.6; transform: scale(0.9); }
}

.success-glow {
  animation: pulse-confirm 1.8s ease-in-out 2;
  /* Plays twice, then stops */
}
```

---

## Testing Checklist

### Visual

- [ ] Light mode: icon contrast against cream background
- [ ] Dark mode: icon contrast against ink background
- [ ] On mobile (280px width): crate scales proportionally, readable
- [ ] High contrast mode (Windows): animation still visible, not distracting

### Animation

- [ ] Lid moves smoothly, not janky
- [ ] Fox glow pulsates in sync with lid open/close
- [ ] 3.6s cycle repeats seamlessly (no jitter at 0%→100% boundary)
- [ ] Faster confirmation (1.8s) feels snappier, not jarring

### Accessibility

- [ ] `prefers-reduced-motion: reduce` → animation off, elements positioned at "open" state
- [ ] Keyboard: focus ring visible on cards, not hidden by glow
- [ ] Screen reader: `aria-hidden="true"` on decoration, descriptive text outside

### Dark Mode

- [ ] CSS variables swap correctly
- [ ] Icon swapper JavaScript runs on page load + listen for system change
- [ ] No manual refresh needed when system theme changes

### Cross-Browser

- [ ] Chrome, Firefox, Safari on macOS
- [ ] Chrome, Firefox on Windows (high-contrast mode)
- [ ] iOS Safari (motion, focus)
- [ ] Android Chrome (motion, focus)

---

## Dependencies & Assets

### Required Files

- `brand/assets/samfox-icon-verified-ink.png` — Already in repo
- `brand/assets/samfox-icon-verified-cream.png` — Already in repo
- `brand/assets/banimal-logo-ink.png` — Already in repo (footer)

### External

- Google Fonts: `Baloo 2`, `JetBrains Mono` (already loading in both pages)

### Generate

- None — all colors are hex, all motion is CSS-only.

---

## Related PRs & Issues

- **PR #28** — Establishes the crate reveal pattern in `docs/index.html`
- **PR #27** — Connects CI Guide Master to Connector Preview
- **PR #25** — Production readiness (tests, CI gates)

---

## Next Steps

1. **Immediate (This Week)**
   - [ ] Integrate motion CSS into `connector-preview.html` (Phase 1 hero)
   - [ ] Test `prefers-reduced-motion` on all three WP-admin mockup screens
   - [ ] Take Playwright screenshots (light/dark, motion/no-motion)

2. **Short Term (Next Sprint)**
   - [ ] Create Block Box repo or confirm existence
   - [ ] Port motion system to Block Box landing page (Phase 2)
   - [ ] Link from both docs hubs

3. **Documentation (Ongoing)**
   - [ ] Update Claude Code skill with motion rules
   - [ ] Add motion section to CI Guide Master (if updating brand docs)
   - [ ] Share pattern with team for future UI work

---

## Questions & Open Decisions

1. **Block Box Repo:** Does `zerowaste.seedwave.faa.zone` repo exist? If not, should we create it?
2. **Confirmation Duration:** Is 1.8s (half of 3.6s) right for success states, or should we use a different tempo?
3. **Admin UI Integration:** Should the WP-admin plugin _real code_ render motion, or just the mockup in `connector-preview.html`?
4. **Skill Versioning:** When should the Claude Code skill version-bump if motion rules are added?

---

## Summary

**The crate reveal pattern is production-ready.** It establishes a clear, accessible, and brand-consistent motion language across all three surfaces:

- ✅ **2D transforms** → readable, performant, accessible
- ✅ **3.6s cycle** → consistent pace across surfaces
- ✅ **Coral glow** → visual emphasis, on-brand
- ✅ **Motion reduction** → graceful fallback for accessibility
- ✅ **Light/dark mode** → automatic icon swapping, no friction

**Ready to ship to WP-admin and Block Box.** Use this document as the source of truth for all future motion design in the Banimal ecosystem.
