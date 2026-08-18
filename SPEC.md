# Website Specification — Shubham Meghani Portfolio

Status: **APPROVED — IMPLEMENTED & DEPLOYED**
Process: SPEC → PLAN → IMPLEMENT → VERIFY → ITERATE (this document is the source of truth for all later stages)
Live site: https://shubhammeghani.github.io/

## 1. Purpose & Goals
A personal academic/professional portfolio for a Mathematics & Computing undergraduate at IISc working in AI/ML, built as a Week 02 Spec-Driven Development course assignment. Goals: present identity, research/project work, skills, and education credibly to recruiters, faculty, and research collaborators; support future extension (more projects) without redesign.

## 2. Target Audience
Recruiters/hiring managers (research/ML roles), faculty/potential research advisors or collaborators, peers, and course graders reviewing the assignment.

## 3. Information Architecture
Single-page scrolling site with a fixed/sticky nav bar that jumps to in-page sections (anchor links, smooth scroll).

Section order:
1. **Home** (hero: name, identity line, primary CTA links)
2. **About**
3. **Research & Projects**
4. **Technical Skills**
5. **Education**
6. **Experience / Beyond Code**
7. **Contact**

No separate pages, no Publications section, no Blog.

## 4. Content Inventory (source of truth — no invented content)

**Name:** Shubham Harikrishnabhai Meghani
**Identity line:** B.Tech Mathematics & Computing student at IISc · AI/ML

**Bio (About):**
> I'm a Mathematics and Computing undergraduate at the Indian Institute of Science, Bangalore, interested in the intersection of mathematical reasoning, machine learning, and software engineering. My recent work includes exploring adversarial robustness and the transferability of adversarial examples across neural network models. I enjoy working on technically challenging problems that combine theory with computation.

**Photo:** A real headshot is in place in the Hero section, at `assets/images/1787039088135(1).png`, presented via an `<img>` with `alt="Shubham Harikrishnabhai Meghani"`, cropped with `object-fit: cover` in the same portrait-shaped frame originally designed for the placeholder — no layout change was needed to add it.

**Research & Projects — Project 1 (primary, featured prominently):**
- Title: Asymmetric Transferability of Adversarial Examples
- Label: "Team research project" (this was a five-person research project; the site must not imply solo authorship, but does not list all collaborators or individual contributions)
- Description (verbatim, source: `reference/Adversarial_Robustness_Report.pdf`, used as source material only — never linked, deployed, or committed):
  > We investigated why adversarial examples transfer asymmetrically between neural network models, and identified which model properties drive this asymmetry.
  >
  > **Approach.** We trained five architectures — ResNet18, ResNet34, VGG11, VGG16, and DenseNet121 — on CIFAR-10, then generated adversarial examples on each model using PGD (ε = 8/255, 20 steps) and measured how well those examples transferred to every other model (fooling rate). For each model pair, we compared transfer asymmetry against three model properties: input-gradient norm, gradient cosine similarity, and parameter count.
  >
  > **Findings.** Transfer was consistently asymmetric — for example, adversarial examples crafted on ResNet models transferred more effectively to VGG models than the reverse, while DenseNet showed inconsistent behavior across pairs. Gradient norm difference showed a strong, statistically significant correlation with transfer asymmetry (Pearson r = 0.96, p < 0.001), while gradient cosine similarity showed no meaningful relationship (r = −0.10) and parameter count showed only a weak one (r = 0.25).
  >
  > **Why it happens.** A first-order (Taylor expansion) analysis of PGD-style attacks shows that the expected change in a target model's loss from a transferred perturbation is proportional to the target's own gradient norm. Since cosine similarity between two models' gradients is inherently symmetric while their gradient norms generally are not, norm differences — not gradient alignment — are what drive the directional asymmetry.
- Tools: Python, PyTorch, CIFAR-10, ResNet, VGG, DenseNet
- Repository link: "View Project Repository" → `https://github.com/KausiganK/Adversarial-Robustness` (a shared/team repository — must not be presented as personally owned)
- Do not add the diffusion-model/Incremental-Adversarial-Training thread from the same report (a separate research direction, out of scope for this project card), do not mention NeurIPS or any publication/submission/acceptance status, do not name individual collaborators, and do not add any further results/claims beyond what's written above without explicit approval. Additional projects only on explicit approval.

**Technical Skills (grouped, not a flat cloud):**
- Mathematics: Optimization, Linear Algebra, Probability, Real Analysis
- Machine Learning: Deep Learning, Adversarial Machine Learning, Model Evaluation, Transferability
- Programming & Tools: Python, C/C++, SQL, PyTorch, Git

**Education:**
- Indian Institute of Science, Bangalore — B.Tech in Mathematics and Computing, 2024–2028 (no GPA)

**Experience / Beyond Code:**
- **TEDxIISc — Sponsorship & Partnerships**
  Worked on sponsor outreach and partnership development for TEDxIISc, including communicating with potential sponsors, understanding their branding and association requirements, preparing sponsorship proposals, and coordinating with the team to develop suitable sponsor benefits.
  (No metrics, sponsor names, or additional responsibilities beyond this are to be added.)
- **Achievements** — a small subsection nested within Experience / Beyond Code (not a separate top-level nav section, not moved into Education), styled visually distinct from the TEDxIISc entry (a compact badge/pill with an inline description, not a bordered role-description block) so it clearly reads as an award rather than a role:
  - **Reliance Scholar** — Reliance Foundation Scholarship recipient.
  No additional details about the scholarship are to be added beyond this.

**Contact:**
- Email: mshubham@iisc.ac.in
- GitHub: https://github.com/ShubhamMeghani
- LinkedIn: https://www.linkedin.com/in/shubham-meghani-74730b318
- Plain links, no contact form.

**Resume:** Downloadable PDF, linked from the hero section as a static file (`assets/resume/Shubham Harikrishnabhai Meghani Resume.pdf`), opens/downloads directly — no invented content.

## 5. Visual Design System (approved)

- Background: near-black `#0A0A0B`
- Primary text: off-white `#EDEDED`
- Accent: muted violet/indigo `#7C6FF0` — used sparingly (links, highlights, section markers, focus states), never as large fills
- Secondary/muted text and borders: `#8A8A93` (muted text), `#242428` (borders)

**Typography:**
- Headings: serif with editorial/academic character (Newsreader or Fraunces)
- Body: clean sans-serif (Inter or IBM Plex Sans)
- Monospace accents: for section numbers, labels, coordinates, skill tags (IBM Plex Mono or JetBrains Mono)
- Loaded via web font CDN or self-hosted, with `font-display: swap`

**Visual motifs:** subtle coordinate/grid lines, thin vector/graph line-art, faint matrix/notation glyphs, or network-node line patterns as low-opacity background accents or section dividers — never dominant, never literal stock icons or 3D renders.

**Explicitly avoided:** generic developer-portfolio templates, generic "AI" imagery (brains, circuits, glowing orbs), stock photography, dominant gradients, 3D/glassmorphism effects, visual clutter.

**Favicon:** "SM" typographic monogram in the muted violet/indigo accent color (`#7C6FF0`). Confirmed.

## 6. Functionality
- Sticky nav with anchor-jump to each section, active-section highlighting on scroll
- Smooth scroll behavior
- Resume download link
- External links (GitHub, LinkedIn, email `mailto:`) function correctly (GitHub/LinkedIn in new tab, email via `mailto:`)
- No contact form, no backend, no database, no analytics/tracking
- Projects section built so a new project can be added by duplicating one structured HTML block/template — no redesign needed
- Below the tablet breakpoint, primary nav collapses into a hamburger menu (toggle button that opens/closes an overlay or panel listing the same section links)
- Section navigation uses the History API correctly (no full page reloads):
  - Clicking a nav link — desktop inline nav or the mobile hamburger menu alike, via the same shared link elements and click handling — creates a history entry, updates the URL hash, and smoothly scrolls to the section (instantly if `prefers-reduced-motion: reduce`)
  - Browser Back/Forward navigate between previously visited sections and scroll to the corresponding section, without creating duplicate history entries — required on both desktop and mobile (Android)
  - The active-nav highlight stays correct after Back/Forward
  - Opening or refreshing a URL with a section hash opens directly to that section
  - The initial page-load history entry is seeded with a well-formed state object so the very first Back press behaves consistently
  - Opening the mobile hamburger menu creates its own history entry (no URL/hash change), so an edge-swipe or hardware Back press while the menu is open closes the menu instead of leaving the site; choosing a section link while the menu is open collapses "menu open" and "navigate to section" into a single back-stack step

## 7. Responsive Behavior
- Fully responsive across mobile (~360–480px), tablet (~768px), and desktop (~1024px+) widths
- Fluid layout using relative units and flexbox/grid — no fixed-width breakage, no horizontal scroll at any breakpoint
- Nav collapses to a compact hamburger menu below the tablet breakpoint. Requirements:
  - Fully keyboard operable (toggle button reachable and activatable via keyboard; menu links reachable via Tab when open)
  - Visible focus states on the toggle button and every menu link
  - Selecting a link closes the menu automatically and scrolls to the target section
  - Open/close transition respects `prefers-reduced-motion` (see §9)

## 8. Accessibility (WCAG 2.1 AA)
- Semantic HTML landmarks (`header`, `nav`, `main`, `section`, `footer`)
- Text/background contrast ratios meet AA (≥4.5:1 body text, ≥3:1 large text)
- Full keyboard navigability, visible focus states on all interactive elements
- Alt text on any non-decorative images (if added later); decorative motifs marked `aria-hidden`
- Skip-to-content link
- Hamburger menu toggle has an accessible name and `aria-expanded` state reflecting open/closed; menu is reachable and dismissible via keyboard
- Respects `prefers-reduced-motion` (see §9)

## 9. Animation
- Subtle fade/slide-in on scroll for section entry, subtle hover/transition states, small UI transitions (e.g. nav active state, hamburger menu open/close)
- No parallax, no continuously moving/looping backgrounds, no flashy transitions
- All animation disabled/reduced when `prefers-reduced-motion: reduce` is set, including the hamburger menu open/close transition
- Explicit navigation (nav-link clicks, Back/Forward) shows the destination section immediately, fully revealed — the fade/slide-in reveal only plays for sections encountered by organic scrolling, so jumping directly to a section never shows it mid-transition

## 10. Technical Stack
Plain HTML/CSS/JS, no framework, no build step, no npm dependencies.

## 11. Hosting & Deployment
- GitHub Pages, served directly from the `main` branch root — no GitHub Actions/build pipeline
- Repository: `ShubhamMeghani/ShubhamMeghani.github.io`. Live URL: https://shubhammeghani.github.io/
- Acceptance test: pushing to `main` results in the live GitHub Pages URL reflecting the change with no manual build step — confirmed working across multiple deploys

## 12. Assets/Info (all provided and in use)
- Resume PDF — in place at `assets/resume/Shubham Harikrishnabhai Meghani Resume.pdf`
- Headshot photo — in place at `assets/images/1787039088135(1).png`
- GitHub profile URL: https://github.com/ShubhamMeghani
- LinkedIn profile URL: https://www.linkedin.com/in/shubham-meghani-74730b318
- Project repository URL: https://github.com/KausiganK/Adversarial-Robustness

## 13. Out of Scope
Contact form, blog, light-mode toggle, publications section, analytics/tracking, additional projects beyond the one specified, GPA, any content/links/results not explicitly provided by the architect (Shubham).

## 14. Acceptance Criteria (testable)
- [ ] All content matches §4 exactly — no invented facts, projects, links, or results
- [ ] Site renders correctly and matches visual spec (§5) in Chrome, Edge, Firefox, Safari, Brave (current versions)
- [ ] Responsive with no horizontal scroll or broken layout at mobile/tablet/desktop widths
- [ ] Nav links jump to correct sections; active section highlights correctly on scroll
- [ ] Below the tablet breakpoint, hamburger menu opens/closes via mouse and keyboard, shows visible focus states throughout, and closes automatically after a link is selected
- [ ] Resume PDF downloads/opens successfully
- [ ] Email, GitHub, LinkedIn links function correctly
- [ ] Project repository link opens the correct URL in a new tab
- [ ] Photo renders correctly (no overflow, no broken-image appearance) at mobile/tablet/desktop widths
- [ ] Back/Forward navigation works as specified in §6 (correct history entries, correct scroll position, correct active-nav highlight, no duplicate entries, no full page reload), for both desktop nav clicks and mobile hamburger-menu navigation
- [ ] Pressing Back while the mobile hamburger menu is open closes the menu rather than leaving the site; the menu's history entry does not linger after it is closed by any method (link tap, toggle button, Escape, or Back)
- [ ] Navigating directly to a section (nav-link click or Back/Forward) shows it fully in place immediately — no visible blank/faded state or delayed settle from the scroll-reveal animation
- [ ] Contrast ratios pass WCAG 2.1 AA (verified via automated tool, e.g. axe or Lighthouse)
- [ ] Fully keyboard-navigable with visible focus states
- [ ] Animations respect `prefers-reduced-motion`, including hamburger menu open/close
- [ ] No console errors
- [ ] Site is live and reachable at the GitHub Pages URL after push to `main`
- [ ] No build step required to deploy
- [ ] Achievements subsection (Reliance Scholar) renders inside Experience / Beyond Code, visually distinct from the TEDxIISc entry, with no new nav item and not moved into Education
