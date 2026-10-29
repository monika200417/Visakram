# VISAKRAM BUILDERS — CLAUDE CODE INSTRUCTIONS
## Version 0.1 — Project Operating Rules

> This file is the operational source of truth for Claude Code while working on the Visakram Builders website.
> Read the relevant project documentation before making architectural or visual decisions.

---

# 1. Project Identity

Project:

**Visakram Builders**

Business context:

- Construction company
- Based in Kommadi, Visakhapatnam, Andhra Pradesh
- Service area: Visakhapatnam + Vizianagaram
- Primary services: Residential construction, apartments, villas
- Stated company experience: 15+ years (client update; earlier drafts said 20+)
- Stated project figures: 40+ projects, 5 ongoing (client update; earlier drafts said 25+)
- Core values: Quality, Timeliness, Transparency

These business facts are client-provided project context and must not be expanded into unsupported claims.

---

# 2. Documentation Source of Truth

Before making changes, consult the relevant documents:

```text
docs/
├── VISAKRAM-DIGITAL-EXPERIENCE-BLUEPRINT-v0.2.md
├── DESIGN-SYSTEM.md
├── ANIMATION-SYSTEM.md
├── TECHNICAL-ARCHITECTURE.md
├── PERFORMANCE-BUDGET.md
├── SEO-SPEC.md
├── SECURITY-SPEC.md
├── QA-CHECKLIST.md
└── CLAUDE.md
```

Priority:

```text
User's current explicit instruction
        ↓
Project documentation
        ↓
Existing approved implementation
        ↓
General engineering judgment
```

If two documents appear to conflict, do not silently choose. Identify the conflict and ask the user when it materially affects implementation.

---

# 3. Before Editing Anything

Always:

1. Inspect the repository.
2. Inspect the relevant files.
3. Read the relevant documentation.
4. Understand the current implementation.
5. Identify dependencies and existing patterns.
6. Make the smallest appropriate change.

Never blindly overwrite a working file.

---

# 4. Business Truth Rules

Never invent:

- Projects
- Project descriptions
- Customer names
- Testimonials
- Quotes
- Awards
- Certifications
- Ratings
- Construction claims
- Project ownership
- Completion dates
- Project areas
- Financial claims
- Legal claims

Never convert a founder's previous employment/project history into a claim that those projects were executed by Visakram Builders unless explicitly verified.

If information is missing:

**Ask the user or leave the field intentionally unpopulated.**

Do not fill gaps with plausible marketing copy.

---

# 5. Content Rules

Use real client assets as soon as they are available.

Temporary placeholders must be obvious during development and must not accidentally ship to production.

Important content must remain accessible as HTML/text.

Do not put essential business information exclusively inside:

- Canvas
- WebGL
- Video
- Images
- Animation-only states

---

# 6. Visual Direction

The website should feel:

- Architectural
- Premium
- Editorial
- Cinematic
- Precise
- Warm
- Established
- Modern
- Trustworthy

Avoid:

- Generic construction templates
- Excessive glassmorphism
- Neon
- Heavy gradients
- Excessive rounded cards
- Bouncy UI
- Cartoon-like animation
- Random floating objects
- Excessive cursor effects
- Long blocking preloaders

Follow `DESIGN-SYSTEM.md` for detailed visual decisions.

---

# 7. Design System Rules

Use centralized design tokens.

Do not duplicate:

- Colors
- Typography values
- Spacing
- Motion values
- Radius values

throughout random component files.

Initial visual foundation:

```text
Dark:       #11120F
Charcoal:   #24251F
Paper:      #F4F1EA
White:      #FFFFFF
Stone:      #D8D1C5
Muted:      #77766E
Terracotta: #A65D45
```

Typography:

```text
Display: Playfair Display
Body/UI: Manrope
Metadata: DM Mono
```

These values are provisional until final brand assets are confirmed.

---

# 8. Technology Responsibilities

Use the simplest suitable tool.

## CSS

Use for:

- Basic transitions
- Hover states
- Color changes
- Simple transforms
- Responsive styling

## Motion for React

Use for:

- UI transitions
- Navigation
- Mobile menu
- Component enter/exit
- Lightweight layout transitions

## GSAP + ScrollTrigger

Use for:

- Cinematic timelines
- Pinning
- Scrubbing
- Complex scroll choreography
- Featured project transitions
- Process storytelling
- 3D timeline coordination

## Three.js / React Three Fiber / Drei

Use only for meaningful 3D.

Primary signature use:

```text
FROM PLAN TO PLACE
```

Do not use Three.js for decorative effects that CSS or normal media can accomplish.

## Lenis

Optional only.

Do not introduce it unless testing demonstrates a clear benefit without harming accessibility, touch input, or performance.

---

# 9. Animation Rules

Motion must:

- Explain
- Guide
- Reveal
- Connect
- Create atmosphere

If it does none of these, remove it.

Never:

- Hijack native scrolling
- Animate every element
- Use bounce/elastic UI without a specific reason
- Create long blocking transitions
- Depend on hover for important information
- Use React state for frame-by-frame scroll animation

Respect:

```css
@media (prefers-reduced-motion: reduce)
```

---

# 10. Performance Rules

Performance is a first-class requirement.

Targets:

```text
LCP ≤ 2.5s
INP < 200ms
CLS < 0.10
```

Working budgets:

```text
Initial JS: ≤ 200 KB compressed
Initial CSS: ≤ 75 KB compressed
Primary 3D asset: preferably ≤ 5 MB
Compressed 3D target: ≤ 3 MB where practical
```

These are targets, not excuses to ship poor assets.

Always:

- Lazy-load heavy media
- Code-split 3D
- Optimize images
- Optimize video
- Reserve image/video dimensions
- Prefer transform/opacity animation
- Test mobile
- Test slow networks

If a visual feature causes unacceptable performance:

**Simplify the feature.**

Do not simply increase hardware requirements.

---

# 11. 3D Rules

The 3D experience is a signature enhancement, not the foundation.

It must:

- Load lazily
- Be code-split
- Use optimized assets
- Limit expensive lighting/shadows
- Pause when not relevant
- Dispose resources correctly
- Have mobile fallback
- Have reduced-motion fallback
- Never prevent the rest of the website from working

The story remains understandable without WebGL.

---

# 12. Video Rules

Every important video must have:

- Poster
- Optimized source
- Appropriate resolution
- Fallback
- Mobile strategy

Hero video may be prioritized.

Project/testimonial videos should generally be deferred.

Never let a failed video create a blank or unusable section.

---

# 13. Image Rules

Use:

- AVIF/WebP where practical
- Responsive images
- Explicit dimensions/aspect ratios
- Lazy loading below the fold
- Descriptive filenames
- Appropriate alt text

Do not ship raw camera-resolution files unnecessarily.

---

# 14. SEO Rules

Important content must be crawlable HTML.

Every indexable page needs appropriate:

- Title
- Meta description
- H1
- Heading hierarchy
- Canonical
- Open Graph metadata
- Internal links

Maintain local relevance for:

- Visakhapatnam
- Vizianagaram
- Andhra Pradesh

Do not keyword-stuff.

Do not invent ratings, reviews, awards, certifications, or claims.

Structured data must match actual content.

---

# 15. Security Rules

Never expose secrets.

Never put secrets in:

```text
VITE_*
src/
public/
Git
HTML
CSS
```

Remember:

**VITE_* values are public client-side values, not secrets.**

Never use unsafe HTML rendering without a documented and reviewed reason.

Validate form input.

Do not expose stack traces or sensitive data in production errors.

Review dependencies before adding them.

Run dependency/security checks before release.

---

# 16. Contact Form Rules

The form must validate:

- Name
- Phone
- WhatsApp
- Project type
- Location
- Approximate requirement
- Message

Do not add file uploads unless the user explicitly requires them and a separate security design is approved.

The final form provider must be tested before production.

---

# 17. WhatsApp Rules

Use the verified client number only.

Do not invent or guess the number.

WhatsApp is a conversion channel and should remain accessible without intrusive animation.

---

# 18. Architecture Rules

Follow the architecture defined in:

```text
docs/TECHNICAL-ARCHITECTURE.md
```

Keep:

```text
Business data
```

separate from:

```text
Presentation
```

Prefer structured data modules over repeated hardcoded content.

Avoid unnecessary global state.

Do not introduce Redux or another state-management framework without a genuine requirement.

---

# 19. Component Rules

Prefer focused components.

Avoid giant files such as:

```text
HomePage.tsx
```

containing the entire application.

Use clear boundaries:

```text
sections/
components/
animations/
three/
data/
hooks/
utils/
```

Do not create abstractions merely to make the folder structure look sophisticated.

---

# 20. Dependency Rules

Before installing a package:

1. Determine whether it is actually needed.
2. Check whether native APIs can solve the problem.
3. Check whether an existing dependency already solves it.
4. Consider bundle size.
5. Consider maintenance.
6. Consider security.
7. Consider licensing.
8. Document the reason.

No dependency should be added just because it is popular.

---

# 21. React State Rules

React state is for application state.

Do not use:

```text
scroll → setState → render
```

for continuous animation.

Use:

- Refs
- Motion values
- GSAP
- ScrollTrigger
- Appropriate browser APIs

---

# 22. Accessibility Rules

Use semantic HTML.

Prefer:

```text
header
nav
main
section
article
footer
button
a
form
label
```

Do not replace buttons or links with clickable `div`s.

Maintain:

- Keyboard navigation
- Visible focus
- Logical tab order
- Accessible labels
- Heading hierarchy
- Reduced motion
- Contrast
- Accessible forms

---

# 23. Mobile Rules

Mobile is not an afterthought.

Every major feature must have an intentional mobile behavior.

Simplify when appropriate:

- 3D
- Video
- Parallax
- Pinned sections
- Complex grids
- Simultaneous animations

Do not simply scale desktop down.

---

# 24. Testing Rules

After meaningful changes:

```text
Typecheck
↓
Lint
↓
Relevant tests
↓
Desktop browser check
↓
Mobile check
↓
Performance check
```

Use:

- Vitest
- React Testing Library
- Playwright

Never say:

```text
Tests passed
```

unless they were actually run.

Never claim a build succeeded without running it.

---

# 25. QA Rules

Use:

```text
docs/QA-CHECKLIST.md
```

as the release checklist.

Test:

- Desktop
- Mobile
- Tablet where relevant
- Reduced motion
- Rapid scrolling
- Slow network
- Production build
- Contact flow
- WhatsApp
- SEO
- Security
- Accessibility

---

# 26. Git Rules

Use Git checkpoints.

Before major refactors:

```text
git status
```

Review the working tree.

Create a checkpoint before risky changes.

Prefer focused commits such as:

```text
chore: initialize project
feat: add navigation
feat: build hero
feat: add project system
feat: add 3d story
perf: optimize hero media
fix: mobile navigation
```

Do not create one enormous commit containing unrelated changes.

---

# 27. Editing Rules

When asked to modify something:

1. Inspect the current implementation.
2. Identify the exact files involved.
3. Preserve unrelated working functionality.
4. Make the smallest correct change.
5. Test the affected area.
6. Check for regressions.

Never perform broad cleanup unless explicitly requested.

---

# 28. Do Not Patch Blindly

If a visual issue appears:

Do not immediately add:

```text
z-index
!important
negative margins
random absolute positioning
```

Instead:

1. Inspect DOM structure.
2. Inspect layout context.
3. Inspect stacking contexts.
4. Identify the actual cause.
5. Fix the underlying issue.

Do not accumulate CSS patches.

---

# 29. When Requirements Are Unclear

If the missing information materially affects:

- Business facts
- Project content
- Brand identity
- Architecture
- Security
- Contact information
- Customer information

stop and ask the user.

If the uncertainty is only a minor implementation detail, choose the simplest reasonable solution and document it.

Never invent client information to avoid asking.

---

# 30. Client Asset Rules

When real assets become available:

- Prefer them over placeholders.
- Do not alter important brand assets without approval.
- Preserve original files outside production if needed.
- Optimize copies for web delivery.
- Confirm usage rights for customer/project media.

---

# 31. Documentation Discipline

When an architectural decision changes:

Update the appropriate documentation.

Examples:

```text
Visual change
→ DESIGN-SYSTEM.md

Animation change
→ ANIMATION-SYSTEM.md

Architecture change
→ TECHNICAL-ARCHITECTURE.md

Performance change
→ PERFORMANCE-BUDGET.md

SEO change
→ SEO-SPEC.md

Security change
→ SECURITY-SPEC.md

QA requirement
→ QA-CHECKLIST.md
```

Do not allow documentation and implementation to drift significantly.

---

# 32. Development Order

Follow this order unless the user explicitly changes it:

```text
1. Project initialization
2. Tooling configuration
3. Design tokens
4. Global layout
5. Navigation
6. Hero
7. Statement + proof
8. Services
9. Project system
10. Featured project
11. Visakram Way
12. Process
13. Founders
14. Testimonials
15. 3D story
16. Contact + WhatsApp
17. SEO
18. Performance
19. Security
20. QA
21. Production deployment
```

Do not start with the 3D system.

---

# 33. Work Incrementally

Do not attempt to build the entire website in one prompt.

For each major milestone:

```text
Plan
↓
Implement
↓
Run checks
↓
Review
↓
Commit
↓
Continue
```

A large feature should be divided into smaller checkpoints.

---

# 34. Stop Conditions

Stop and ask the user before proceeding when:

- Required business information is missing
- Client content conflicts
- The requested change contradicts the approved architecture
- A security-sensitive decision is required
- A third-party service must be selected
- A major dependency must be introduced
- A major architecture refactor is necessary
- Existing files contain unexpected work that may be overwritten
- The correct behavior cannot be inferred safely

---

# 35. What Claude Must Never Do

Never:

- Invent client facts
- Invent projects
- Invent testimonials
- Invent awards
- Invent certifications
- Claim unverified project ownership
- Expose secrets
- Rewrite the whole project unnecessarily
- Replace working architecture without reason
- Add dependencies without justification
- Use React state for per-frame animation
- Block the site behind a long preloader
- Make 3D mandatory for content comprehension
- Ignore mobile
- Ignore reduced motion
- Ignore performance regressions
- Claim tests passed without running them
- Claim deployment succeeded without verification

---

# 36. Final Quality Standard

The final website should feel:

**premium in appearance, simple in architecture, deliberate in motion, fast in use, factual in content, accessible in interaction, and reliable in production.**

Technology should disappear behind the experience.

The visitor should remember:

- Visakram Builders
- Quality
- Timeliness
- Transparency
- Real projects
- Real people
- A clear path to start a project

Not:

- which library created an animation
- how complex the code is
- how many effects were used

---

# 37. First Implementation Instruction

When implementation begins:

**Do not immediately build the homepage.**

First:

1. Inspect the repository.
2. Confirm the current Node/npm environment.
3. Confirm whether a Vite/React project already exists.
4. Inspect `package.json`.
5. Inspect existing source files.
6. Check Git status.
7. Check current dependencies.
8. Compare the repository against `TECHNICAL-ARCHITECTURE.md`.
9. Propose the smallest initialization/change plan.
10. Only then begin implementation.

If a working existing project already exists, preserve it unless the user explicitly asks for a reset.

---

# 38. End of Operational Instructions

This document is the operational guide for Claude Code.

The user remains the final decision-maker for:

- Brand direction
- Client content
- Major visual changes
- Major architecture changes
- Third-party service selection
- Production deployment decisions

When in doubt about client truth or a major architectural decision:

**Ask before inventing or restructuring.**
