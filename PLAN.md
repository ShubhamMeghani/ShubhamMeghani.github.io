# Implementation Plan — Shubham Meghani Portfolio

Status: **PENDING APPROVAL**
Source of truth: `SPEC.md` (approved). Each step below references the SPEC section(s) it implements and the acceptance criterion (AC) it will be verified against at the VERIFY stage. AC numbers refer to SPEC §14 in order (AC1 = content matches §4 … AC13 = no build step to deploy, after the hamburger-menu AC was inserted at position 5).

No code or website files are created in this stage — planning only.

---

## 1. Project / File Structure

```
/
├── index.html
├── SPEC.md
├── PLAN.md
├── assets/
│   ├── resume/
│   │   └── Shubham Harikrishnabhai Meghani Resume.pdf   (provided, SPEC §12)
│   └── icons/
│       └── favicon.svg      (SM monogram, accent color, SPEC §5)
├── css/
│   ├── reset.css            (minimal reset)
│   ├── variables.css        (design tokens: color, type, spacing — SPEC §5)
│   ├── base.css              (element defaults, typography — SPEC §5)
│   ├── layout.css            (page structure, nav, hamburger menu, section grid, breakpoints — SPEC §7)
│   ├── components.css        (skill tags, project card, buttons, motif containers)
│   └── motion.css            (transitions, animation states, reduced-motion overrides — SPEC §9)
└── js/
    └── main.js                (nav highlighting, smooth scroll, hamburger menu, scroll-reveal, reduced-motion handling — SPEC §6, §7, §9)
```

No bundler/build step (SPEC §10, §11 → AC13). `.nojekyll` recommended at root as a zero-cost safety addition for GitHub Pages.

---

## 2. HTML Structure & Semantic Sections (SPEC §3, §4, §8 → AC1, AC4, AC5, AC9)

Single `index.html`, single page, in this order:

- `<a class="skip-link" href="#main">Skip to content</a>` — first focusable element (AC9)
- `<header>` containing:
  - `<button class="nav-toggle" aria-expanded="false" aria-controls="primary-nav" aria-label="Open menu">` — hamburger icon, visible below tablet breakpoint only
  - `<nav id="primary-nav" aria-label="Primary">` with the anchor-link list matching each section id below; current-section link gets `aria-current="page"` (toggled by JS); at desktop/tablet widths this renders as a normal inline nav, below tablet width it becomes the toggle-controlled panel
- `<main id="main">` containing, in order:
  - `<section id="home">` — hero: name, identity line, short CTA links (resume, contact)
  - `<section id="about">` — bio paragraph (verbatim from SPEC §4)
  - `<section id="research-projects">` — heading "Research & Projects"; one `<article class="project-card">` for the adversarial-transferability project (title, description, tools list) — structured so a second `<article class="project-card">` can be duplicated later with no layout change
  - `<section id="skills">` — heading "Technical Skills"; three grouped lists (Mathematics / Machine Learning / Programming & Tools)
  - `<section id="education">` — IISc entry (institution, program, years)
  - `<section id="experience">` — heading "Experience / Beyond Code"; TEDxIISc entry (verbatim from SPEC §4)
  - `<section id="contact">` — email (`mailto:mshubham@iisc.ac.in`), GitHub (`href="https://github.com/ShubhamMeghani"`, opens new tab), LinkedIn (`href="https://www.linkedin.com/in/shubham-meghani-74730b318"`, opens new tab) — these final URLs must be used directly as `href` values; `href="#"` placeholders must never be used for these links
- `<footer>` — minimal, e.g. name + year

Every section gets a heading so structure matches the nav (AC4). Decorative motif elements are `aria-hidden="true"` SVGs, never in the accessible content flow.

**Content rule enforced at this stage:** all copy transcribed verbatim from SPEC §4 — no paraphrasing, no added claims (→ AC1).

---

## 3. CSS Architecture & Responsive Breakpoints (SPEC §5, §7 → AC2, AC3)

- **Design tokens** (`variables.css`): CSS custom properties for the exact colors in SPEC §5, fluid type scale via `clamp()`, spacing scale for generous whitespace.
- **Mobile-first**, `min-width` media queries at ~768px (tablet) and ~1024px (desktop), matching SPEC §7.
- **Layout:** flexbox for nav/card rows, CSS grid for skills groups and multi-column sections at desktop width; no fixed pixel widths → no horizontal scroll at any breakpoint (AC3).
- **Nav below tablet breakpoint (revised — hamburger menu):**
  - `.nav-toggle` button visible only below tablet width; hidden (and inert) at tablet/desktop widths where nav renders inline as before
  - `#primary-nav` below tablet width is positioned as an overlay or slide-in panel, hidden by default (`hidden` attribute or `visibility`/`transform` off-canvas, not `display:none` alone, so it can transition), shown when `.nav-toggle`'s `aria-expanded` is `true`
  - Panel styled per the SPEC §5 design system (near-black background, off-white links, accent for active/hover/focus)

---

## 4. Typography & Visual Design System (SPEC §5 → AC2)

Unchanged from prior plan: Newsreader/Fraunces (headings), Inter/IBM Plex Sans (body), IBM Plex Mono (labels/section numbers/skill tags) via `<link>` with `display=swap`, driven by token variables. Accent color reserved for links/hover/focus/active-indicator/card accents only.

---

## 5. Mathematical / Computational Visual Motifs (SPEC §5 → AC2)

Unchanged: hand-authored low-opacity inline SVGs (coordinate grids, line-graphs, matrix/node accents), `aria-hidden="true"`, positioned and scaled responsively via CSS, no external icon library.

---

## 6. JavaScript Behavior (SPEC §6, §7 → AC4, AC5, AC10, AC11)

Single `main.js`, no dependencies, four responsibilities:

1. **Smooth scroll on nav click:** intercept anchor clicks, scroll to target section; instant jump instead of smooth when `prefers-reduced-motion: reduce` is set (SPEC §9 → AC10).
2. **Active-section detection:** `IntersectionObserver` on all `<section>` elements toggles `aria-current="page"` on the matching nav link as sections enter/leave view.
3. **Hamburger menu control (new — SPEC §6, §7):**
   - Toggle click/Enter/Space flips `aria-expanded` on `.nav-toggle` and shows/hides `#primary-nav`
   - When opened: focus moves to the first link inside the menu; `Escape` key closes the menu and returns focus to the toggle button
   - Selecting any link inside the open menu closes it (and triggers the smooth-scroll/active-section logic above) — SPEC §6, AC5
   - Open/close visual transition (slide/fade) is skipped in favor of an instant show/hide when `prefers-reduced-motion: reduce` is set — SPEC §9, AC10 (the menu's *functionality* — open, close, keyboard operability — is unaffected by reduced motion; only the transition is)
4. **Scroll-reveal animation:** `IntersectionObserver` adds `.is-visible` on first section entry, triggering fade/slide transition; skipped (content shown immediately) under reduced motion.

No other JS — no analytics, no third-party scripts (SPEC §6, §11).

---

## 7. Navigation & Active-Section Detection (SPEC §3, §6, §7 → AC4)

Covered in §2 (structure), §3 (layout/breakpoints), §6 (behavior) above. Verification target: at desktop/tablet widths, all 7 links work and highlight as before; below tablet width, the hamburger toggle opens the menu, each link is reachable and operable by keyboard, selecting a link scrolls to the section and closes the menu, and the active-link highlight still updates correctly afterward.

---

## 8. Resume Asset Handling (SPEC §4, §12 → AC6)

`assets/resume/Shubham Harikrishnabhai Meghani Resume.pdf`, linked with `download` attribute from the hero. The PDF is present at that path — this is no longer blocked.

---

## 9. Accessibility Requirements (SPEC §8 → AC5, AC8, AC9)

- Semantic landmarks per §2 structure.
- Skip-link, visible focus outlines (accent-colored, sufficient contrast) on all links, buttons, and menu items — explicitly including `.nav-toggle` and every link inside the open hamburger menu (SPEC §7, §8).
- `.nav-toggle` has an accessible name (`aria-label="Open menu"`, updated to `"Close menu"` when open, or a visually-hidden text label), `aria-expanded`, and `aria-controls="primary-nav"`.
- Menu is dismissible via `Escape` and via selecting a link; focus is managed on open/close (see §6) rather than left stranded.
- Contrast check planned as a VERIFY-stage task: `--text`/`--bg` and `--muted`/`--bg` likely safe; `--accent` (`#7C6FF0`) on `--bg` for any text use flagged as a specific risk to measure against 4.5:1/3:1 thresholds.
- `aria-hidden="true"` on all decorative SVG motifs.
- Full keyboard walkthrough (including hamburger menu open → navigate → close cycle) as an explicit VERIFY step.

---

## 10. Animation & Reduced-Motion Behavior (SPEC §9 → AC10)

- All transitions (fade/slide-in, hover states, nav active-state change, **hamburger menu open/close**) defined in `motion.css` using short durations/subtle transforms only.
- Reduced-motion check in `main.js` gates JS-driven scroll behavior, scroll-reveal class toggling, and the hamburger menu's open/close transition; a `@media (prefers-reduced-motion: reduce)` block in `motion.css` sets `transition: none` as a CSS-level backstop.
- VERIFY step: toggle OS-level "reduce motion" and confirm no scroll-triggered animation, smooth-scroll, or animated menu transition occurs — while confirming the menu still opens/closes functionally (instantly).

---

## 11. GitHub Pages Deployment (SPEC §11 → AC12, AC13)

Unchanged: repo created by you, files pushed to `main` root, Pages source set to `main` / `/ (root)`, no Actions workflow, live URL checked post-push.

---

## 12. Verification Plan — Mapped to Every Acceptance Criterion (SPEC §14)

| AC | Criterion | Verification method |
|----|-----------|---------------------|
| AC1 | Content matches §4 exactly | Manual line-by-line diff of rendered page text against SPEC §4 |
| AC2 | Renders correctly cross-browser | Manual check in Chrome, Edge, Firefox, Safari, Brave (current versions) |
| AC3 | Responsive, no horizontal scroll | Manual resize/DevTools device emulation at mobile/tablet/desktop widths |
| AC4 | Nav jump + active highlight correct | Manual click-through of all 7 links + manual scroll-through observation, at all breakpoints |
| AC5 | Hamburger menu: keyboard operable, visible focus, closes on selection, respects reduced motion | Manual keyboard-only walkthrough below tablet width (open via keyboard, tab through links, Escape to close, select a link to auto-close); repeat with OS reduce-motion on/off |
| AC6 | Resume PDF downloads | Manual click test once real PDF is in place |
| AC7 | Email/GitHub/LinkedIn links work | Manual click test — URLs are final, no longer conditional |
| AC8 | WCAG 2.1 AA contrast | Automated check (axe DevTools or Lighthouse accessibility audit) |
| AC9 | Keyboard navigable, visible focus | Manual keyboard-only walkthrough of entire page (Tab/Shift+Tab/Enter) |
| AC10 | Animations respect reduced motion | Manual test with OS "reduce motion" toggled on/off (covers scroll-reveal, smooth-scroll, and hamburger menu) |
| AC11 | No console errors | DevTools console check on load and on interaction |
| AC12 | Live and reachable after push | Manual visit to deployed URL post-push |
| AC13 | No build step to deploy | Confirmed by design (§10, §11) — no CI/build config exists in the repo |

---

## Open Items / Blockers Before Full Implementation
None. Resume PDF, GitHub URL, LinkedIn URL, and mobile nav pattern are all resolved and incorporated above.
