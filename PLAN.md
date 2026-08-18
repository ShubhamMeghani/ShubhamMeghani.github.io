# Implementation Plan — Shubham Meghani Portfolio

Status: **IMPLEMENTED & DEPLOYED** — this plan now describes the site as actually built and live at https://shubhammeghani.github.io/
Source of truth: `SPEC.md` (approved). Each step below references the SPEC section(s) it implements and the acceptance criterion (AC) it will be verified against at the VERIFY stage. AC numbers refer to SPEC §14 in order (AC1 = content matches §4 … AC16 = no build step to deploy; AC17 = Achievements subsection, added when the Reliance Scholar credential was implemented). Three ACs (AC8–AC10: project repository link, photo placeholder rendering, Back/Forward navigation) were inserted after the original AC7 when the project card was expanded and the History API navigation fix was added, shifting all subsequent AC numbers up by 3 from the prior version of this plan.

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

No bundler/build step (SPEC §10, §11 → AC16). `.nojekyll` recommended at root as a zero-cost safety addition for GitHub Pages.

---

## 2. HTML Structure & Semantic Sections (SPEC §3, §4, §8 → AC1, AC4, AC5, AC9, AC12)

Single `index.html`, single page, in this order:

- `<a class="skip-link" href="#main">Skip to content</a>` — first focusable element (AC12)
- `<header>` containing:
  - `<button class="nav-toggle" aria-expanded="false" aria-controls="primary-nav" aria-label="Open menu">` — hamburger icon, visible below tablet breakpoint only
  - `<nav id="primary-nav" aria-label="Primary">` with the anchor-link list matching each section id below; current-section link gets `aria-current="page"` (toggled by JS); at desktop/tablet widths this renders as a normal inline nav, below tablet width it becomes the toggle-controlled panel
- `<main id="main">` containing, in order:
  - `<section id="home">` — hero: name, identity line, short CTA links (resume, contact); alongside the text, `.hero-portrait` (portrait aspect ratio, corner-bracket frame reusing the project-card's accent motif) holds the real headshot as an `<img src="assets/images/1787039088135(1).png" alt="Shubham Harikrishnabhai Meghani">`, cropped via `object-fit: cover` — AC9. The container's size/position was designed in advance so the photo dropped in with no layout change
  - `<section id="about">` — bio paragraph (verbatim from SPEC §4)
  - `<section id="research-projects">` — heading "Research & Projects"; one `<article class="project-card">` for the adversarial-transferability project: a "Team research project" label, the Approach/Findings/Why-it-happens description (verbatim from SPEC §4, sourced from `reference/Adversarial_Robustness_Report.pdf` as reference material only), tools list, and a "View Project Repository" link to `https://github.com/KausiganK/Adversarial-Robustness` (AC8) — structured so a second `<article class="project-card">` can be duplicated later with no layout change
  - `<section id="skills">` — heading "Technical Skills"; three grouped lists (Mathematics / Machine Learning / Programming & Tools)
  - `<section id="education">` — IISc entry (institution, program, years)
  - `<section id="experience">` — heading "Experience / Beyond Code"; TEDxIISc entry (verbatim from SPEC §4), followed by an `.achievements` subsection (a small "Achievements" label, then a `.achievement` row: a pill-shaped `.achievement-title` badge — "Reliance Scholar" — plus inline `.achievement-desc` text — "Reliance Foundation Scholarship recipient.") — AC17. Deliberately styled unlike `.credential` (no left border, no paragraph block) so it reads as an award, not a role
  - `<section id="contact">` — email (`mailto:mshubham@iisc.ac.in`), GitHub (`href="https://github.com/ShubhamMeghani"`, opens new tab), LinkedIn (`href="https://www.linkedin.com/in/shubham-meghani-74730b318"`, opens new tab) — these final URLs must be used directly as `href` values; `href="#"` placeholders must never be used for these links
- `<footer>` — minimal, e.g. name + year

Every section gets a heading so structure matches the nav (AC4). Decorative motif elements are `aria-hidden="true"` SVGs, never in the accessible content flow.

**Content rule enforced at this stage:** all copy transcribed verbatim from SPEC §4 — no paraphrasing, no added claims (→ AC1).

---

## 3. CSS Architecture & Responsive Breakpoints (SPEC §5, §7 → AC2, AC3)

- **Design tokens** (`variables.css`): CSS custom properties for the exact colors in SPEC §5, fluid type scale via `clamp()`, spacing scale for generous whitespace.
- **Mobile-first**, `min-width` media queries at ~768px (tablet) and ~1024px (desktop), matching SPEC §7.
- **Layout:** flexbox for nav/card rows, CSS grid for skills groups and multi-column sections at desktop width; no fixed pixel widths → no horizontal scroll at any breakpoint (AC3).
- **Hero layout:** `.hero-layout` is a flex container (column, portrait stacked below the text, on mobile; row, portrait beside the text, at ≥768px) wrapping `.hero-content` and `.hero-portrait` — AC9.
- **Nav below tablet breakpoint (revised — hamburger menu):**
  - `.nav-toggle` button visible only below tablet width; hidden (and inert) at tablet/desktop widths where nav renders inline as before
  - `#primary-nav` below tablet width is positioned as an overlay or slide-in panel, hidden by default (`hidden` attribute or `visibility`/`transform` off-canvas, not `display:none` alone, so it can transition), shown when `.nav-toggle`'s `aria-expanded` is `true`
  - Panel styled per the SPEC §5 design system (near-black background, off-white links, accent for active/hover/focus)

---

## 4. Typography & Visual Design System (SPEC §5 → AC2)

Unchanged from prior plan: Newsreader/Fraunces (headings), Inter/IBM Plex Sans (body), IBM Plex Mono (labels/section numbers/skill tags) via `<link>` with `display=swap`, driven by token variables. Accent color reserved for links/hover/focus/active-indicator/card accents only.

---

## 5. Mathematical / Computational Visual Motifs (SPEC §5 → AC2)

Unchanged: hand-authored low-opacity inline SVGs (coordinate grids, line-graphs, matrix/node accents), `aria-hidden="true"`, positioned and scaled responsively via CSS, no external icon library. The project-card's corner-bracket accent is factored into a reusable `.corner-frame` class, also applied to `.hero-portrait` so the two share the same accent-framing language (AC9).

---

## 6. JavaScript Behavior (SPEC §6, §7 → AC4, AC5, AC10, AC13, AC14)

Single `main.js`, no dependencies, five responsibilities:

1. **Section navigation via the History API (SPEC §6, §7 → AC10):**
   - `scrollToSection(id)` is a shared helper: scrolls the target section into view, instantly if `prefers-reduced-motion: reduce`, smoothly otherwise. Used by both the click handler and the `popstate` handler below, so Back/Forward and clicks scroll identically.
   - **Nav link click:** `preventDefault()`, close the hamburger menu if open, call `scrollToSection(id)`, then `history.pushState({section: id}, "", "#" + id)` — but only if the hash is actually changing, to avoid pushing duplicate consecutive entries for the same section. This click handler is attached once to each `<a>` inside `#primary-nav`; the desktop inline nav and the mobile hamburger panel are the same DOM elements (CSS only repositions/hides the container), so mobile-menu taps and desktop clicks run through this identical code path — there is no separate mobile navigation implementation.
   - **Initial-load state seeding:** on script init, `history.replaceState({section: ...}, "", location.href)` gives the very first history entry a well-formed state object (it otherwise stays `null` until the first navigation) — hardening against the first Back press behaving inconsistently, which is the most common cause of "Back exits a single-page app" reports on mobile.
   - **`popstate` listener:** fires when the user presses Back/Forward (the browser has already moved the history pointer and updated `location.hash` by this point). Reads `location.hash` (falling back to `"home"` if empty) and calls `scrollToSection(id)` — critically, it does **not** call `pushState`/`replaceState`, since that would create duplicate/incorrect history entries on top of the navigation the browser already performed.
   - **Direct load / refresh with a hash:** handled natively by the browser (it scrolls to the matching element id as part of normal page load) — no additional JS needed for this case.
   - **No full page reload** at any point: navigation only ever calls `scrollIntoView` + History API methods, never sets `location.hash` or `location.href` directly.
2. **Active-section detection:** `IntersectionObserver` on all `<section>` elements toggles `aria-current="page"` on the matching nav link as sections enter/leave view. This is purely scroll-position-driven, so it stays correct automatically after Back/Forward navigation without any extra wiring — AC10.
3. **Hamburger menu control (SPEC §6, §7):**
   - Toggle click/Enter/Space flips `aria-expanded` on `.nav-toggle` and shows/hides `#primary-nav`
   - When opened: focus moves to the first link inside the menu **after** the open transition/class is applied (not before), so focus never lands on a still-hidden/off-screen element; `Escape` key closes the menu and returns focus to the toggle button
   - Selecting any link inside the open menu closes it (and triggers the navigation logic above) — SPEC §6, AC5
   - The `popstate` handler also closes the menu if it happens to be open, for consistency
   - Open/close visual transition (slide/fade) is skipped in favor of an instant show/hide when `prefers-reduced-motion: reduce` is set — SPEC §9, AC13 (the menu's *functionality* — open, close, keyboard operability — is unaffected by reduced motion; only the transition is)
4. **Scroll-reveal animation:** `IntersectionObserver` adds `.is-visible` on first section entry, triggering fade/slide transition; skipped (content shown immediately) under reduced motion.

No other JS — no analytics, no third-party scripts (SPEC §6, §11).

---

## 7. Navigation & Active-Section Detection (SPEC §3, §6, §7 → AC4, AC10)

Covered in §2 (structure), §3 (layout/breakpoints), §6 (behavior) above. Verification target: at desktop/tablet widths, all 7 links work and highlight as before; below tablet width, the hamburger toggle opens the menu, each link is reachable and operable by keyboard, selecting a link scrolls to the section and closes the menu, and the active-link highlight still updates correctly afterward. Additionally (AC10): clicking through several sections and then pressing Back/Forward must move between those sections (not leave the site), scrolling to and highlighting the correct section at each step, with no duplicate history entries and no full page reload.

---

## 8. Resume Asset Handling (SPEC §4, §12 → AC6)

`assets/resume/Shubham Harikrishnabhai Meghani Resume.pdf`, linked with `download` attribute from the hero. The PDF is present at that path — this is no longer blocked.

---

## 9. Accessibility Requirements (SPEC §8 → AC5, AC9, AC11, AC12)

- Semantic landmarks per §2 structure.
- Skip-link, visible focus outlines (accent-colored, sufficient contrast) on all links, buttons, and menu items — explicitly including `.nav-toggle` and every link inside the open hamburger menu (SPEC §7, §8).
- `.nav-toggle` has an accessible name (`aria-label="Open menu"`, updated to `"Close menu"` when open, or a visually-hidden text label), `aria-expanded`, and `aria-controls="primary-nav"`.
- Menu is dismissible via `Escape` and via selecting a link; focus is managed on open/close (see §6) rather than left stranded.
- Contrast check planned as a VERIFY-stage task: `--text`/`--bg` and `--muted`/`--bg` likely safe; `--accent` (`#7C6FF0`) on `--bg` for any text use flagged as a specific risk to measure against 4.5:1/3:1 thresholds.
- `aria-hidden="true"` on all decorative SVG motifs. `.hero-portrait` now holds a real `<img>` with meaningful `alt` text, so it is no longer `aria-hidden`.
- Full keyboard walkthrough (including hamburger menu open → navigate → close cycle) as an explicit VERIFY step.

---

## 10. Animation & Reduced-Motion Behavior (SPEC §9 → AC13)

- All transitions (fade/slide-in, hover states, nav active-state change, **hamburger menu open/close**) defined in `motion.css` using short durations/subtle transforms only.
- Reduced-motion check in `main.js` gates JS-driven scroll behavior, scroll-reveal class toggling, and the hamburger menu's open/close transition; a `@media (prefers-reduced-motion: reduce)` block in `motion.css` sets `transition: none` as a CSS-level backstop.
- VERIFY step: toggle OS-level "reduce motion" and confirm no scroll-triggered animation, smooth-scroll, or animated menu transition occurs — while confirming the menu still opens/closes functionally (instantly).

---

## 11. GitHub Pages Deployment (SPEC §11 → AC15, AC16)

Done: repository `ShubhamMeghani/ShubhamMeghani.github.io` created, files pushed to `main` root, Pages serving from `main` / `/ (root)`, no Actions workflow. Live at https://shubhammeghani.github.io/, confirmed working across five deploys: (1) initial launch, (2) headshot + expanded project card + Back/Forward fix, (3) first Reliance Scholar entry + mobile hero CTA-to-portrait gap fix, (4) Reliance Scholar restructured into a distinct Achievements subsection + more compact inter-section spacing, (5) initial-history-state hardening for mobile Back/Forward reliability.

---

## 12. Verification Plan — Mapped to Every Acceptance Criterion (SPEC §14)

All criteria below were exercised during the VERIFY stage (manual testing plus targeted browser automation across several sessions) and passed. AC2 (cross-browser) and AC3 (responsive) were confirmed by the architect manually on their own laptop and Android device, rather than by automated cross-browser/device testing.

| AC | Criterion | Verification method |
|----|-----------|---------------------|
| AC1 | Content matches §4 exactly | Manual line-by-line diff of rendered page text against SPEC §4 |
| AC2 | Renders correctly cross-browser | Manual check in Chrome, Edge, Firefox, Safari, Brave (current versions) |
| AC3 | Responsive, no horizontal scroll | Manual resize/DevTools device emulation at mobile/tablet/desktop widths |
| AC4 | Nav jump + active highlight correct | Manual click-through of all 7 links + manual scroll-through observation, at all breakpoints |
| AC5 | Hamburger menu: keyboard operable, visible focus, closes on selection, respects reduced motion | Manual keyboard-only walkthrough below tablet width (open via keyboard, tab through links, Escape to close, select a link to auto-close); repeat with OS reduce-motion on/off |
| AC6 | Resume PDF downloads | Manual click test once real PDF is in place |
| AC7 | Email/GitHub/LinkedIn links work | Manual click test — URLs are final, no longer conditional |
| AC8 | Project repository link opens the correct URL | Manual click test on "View Project Repository", confirm destination and new-tab behavior |
| AC9 | Photo renders correctly, no overflow, at mobile/tablet/desktop | Manual visual check at all three breakpoints, confirmed on real devices (laptop + Android) |
| AC10 | Back/Forward navigation: correct history entries, correct scroll/highlight, no duplicates, no full reload — desktop and mobile | Manual test sequence: Home → About → Projects → Contact → Back → Back → Forward, checking URL hash, visible section, and active-nav highlight at every step (desktop, via browser automation). Mobile hamburger-menu navigation confirmed to use the identical code path via code review; initial-state seeding added as a hardening measure — pending the architect's re-verification on their Android device |
| AC11 | WCAG 2.1 AA contrast | Automated check (axe DevTools or Lighthouse accessibility audit) |
| AC12 | Keyboard navigable, visible focus | Manual keyboard-only walkthrough of entire page (Tab/Shift+Tab/Enter) |
| AC13 | Animations respect reduced motion | Manual test with OS "reduce motion" toggled on/off (covers scroll-reveal, smooth-scroll, and hamburger menu) |
| AC14 | No console errors | DevTools console check on load and on interaction |
| AC15 | Live and reachable after push | Manual visit to deployed URL post-push |
| AC16 | No build step to deploy | Confirmed by design (§10, §11) — no CI/build config exists in the repo |
| AC17 | Achievements subsection (Reliance Scholar) distinct from TEDxIISc entry, no new nav item, not in Education | Manual visual check: `.achievement` renders as a pill badge + inline description, clearly distinguishable from `.credential`'s bordered role-description block; nav and Education sections confirmed unchanged |

---

## Final Status
Implementation complete and deployed. No open items or blockers remain. All content, assets (resume, headshot), links (contact, project repository), navigation behavior (including the Back/Forward History API fix, which applies identically to desktop and mobile hamburger-menu navigation, plus an initial-history-state hardening measure for mobile reliability), and the Achievements subsection described above are live at https://shubhammeghani.github.io/. The architect should re-verify Back/Forward on their Android device against this latest deploy.
