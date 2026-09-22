# VISAKRAM BUILDERS — TECHNICAL ARCHITECTURE
## Version 0.1 — Engineering Foundation

> This document defines the technical structure of the Visakram Builders website before implementation begins.
> The architecture prioritizes maintainability, performance, accessibility, SEO, security, and controlled visual complexity.

---

# 1. Technical North Star

The website should be:

- Fast
- Stable
- Maintainable
- SEO-friendly
- Accessible
- Responsive
- Secure
- Animation-rich where justified
- Simple underneath the visual experience

Technology should support the experience without becoming the experience.

### Core principle

**Use the simplest technical solution that achieves the approved design.**

Do not introduce a dependency merely because it is available.

---

# 2. Approved Core Stack

## Application

- React
- TypeScript
- Vite

## Motion

- Motion for React
- GSAP
- GSAP ScrollTrigger

## 3D

- Three.js
- React Three Fiber
- Drei

## Optional

- Lenis — only if testing proves it is beneficial

## Styling

- CSS
- CSS Modules where component isolation is useful
- Centralized design tokens

Avoid introducing a large UI framework unless a concrete requirement appears.

---

# 3. Supporting Engineering Stack

## Quality

- TypeScript strict mode
- ESLint
- Prettier

## Testing

- Vitest
- React Testing Library
- Playwright

## Code quality

- SonarQube

## Security

- OWASP-oriented review
- Dependency auditing
- Secure handling of environment variables
- Input validation
- Safe external integrations

## Version control

- Git
- GitHub

## Deployment

- GoDaddy hosting

The final deployment method should be validated against the exact GoDaddy hosting plan before production configuration.

---

# 4. Project Structure

Recommended structure:

```text
visakram/
│
├── docs/
│   ├── VISAKRAM-DIGITAL-EXPERIENCE-BLUEPRINT-v0.2.md
│   ├── DESIGN-SYSTEM.md
│   ├── ANIMATION-SYSTEM.md
│   ├── TECHNICAL-ARCHITECTURE.md
│   ├── PERFORMANCE-BUDGET.md
│   ├── SEO-SPEC.md
│   ├── SECURITY-SPEC.md
│   ├── QA-CHECKLIST.md
│   └── CLAUDE.md
│
├── public/
│   ├── assets/
│   ├── images/
│   ├── videos/
│   ├── fonts/
│   ├── icons/
│   └── models/
│
├── src/
│   ├── app/
│   ├── pages/
│   ├── components/
│   ├── sections/
│   ├── animations/
│   ├── three/
│   ├── data/
│   ├── hooks/
│   ├── styles/
│   ├── utils/
│   └── main.tsx
│
├── tests/
│   ├── unit/
│   └── e2e/
│
├── .env.example
├── .gitignore
├── eslint.config.*
├── index.html
├── package.json
├── tsconfig.json
├── vite.config.ts
├── README.md
└── CLAUDE.md
```

This structure is a target architecture. Folders should only contain code when they are actually needed.

Do not create empty abstraction layers merely for appearance.

---

# 5. Application Architecture

The application should be organized around clear responsibilities.

```text
App
│
├── Global Navigation
├── Route/Page
│   ├── Section
│   │   ├── Presentation components
│   │   ├── Media components
│   │   └── Animation logic
│   └── Page-specific content
│
└── Global Footer / CTA
```

Keep page composition separate from reusable UI components.

---

# 6. Pages

Initial pages:

```text
/
 /projects
 /projects/:slug
 /services
 /about
 /process
 /contact
```

The exact route set may evolve with content requirements.

Do not create routes for content that does not exist.

---

# 7. Page Responsibilities

## Home

Story-driven overview:

- Hero
- Statement
- Proof
- Services
- Featured project
- Visakram Way
- 3D story
- Process
- Project archive preview
- Founders
- Testimonials
- Location
- Final CTA

## Projects

Project archive and filtering.

## Project Detail

Individual project story.

Potential structure:

```text
Hero
Project metadata
Overview
Gallery
Construction/story section
Optional video
Testimonial
Related projects
CTA
```

Only populate fields supported by verified project data.

## Services

Detailed service presentation.

## About

Company and founder story.

## Process

Detailed construction process.

## Contact

Project enquiry and contact options.

---

# 8. Component Architecture

Components should be categorized by responsibility.

## Global components

Examples:

```text
Header
Footer
Button
Container
SectionHeading
Media
```

## Navigation

```text
DesktopNavigation
MobileNavigation
MobileMenu
NavigationLink
```

## Project

```text
ProjectCard
ProjectGrid
ProjectMeta
ProjectGallery
ProjectHero
```

## Testimonial

```text
TestimonialVideo
TestimonialQuote
TestimonialCard
```

## Media

```text
ResponsiveImage
VideoPlayer
VideoBackground
ImageReveal
```

## Sections

Large homepage chapters remain section-level components.

Example:

```text
HeroSection
StatementSection
ProofSection
ServicesSection
FeaturedProjectSection
VisakramWaySection
ThreeStorySection
ProcessSection
FoundersSection
TestimonialsSection
FinalCTASection
```

---

# 9. Data Architecture

Business content should be separated from presentation.

Example:

```text
src/data/
├── site.ts
├── projects.ts
├── services.ts
├── founders.ts
├── testimonials.ts
└── navigation.ts
```

The UI should consume structured data instead of hardcoding repeated content throughout components.

Example concept:

```ts
type Project = {
  slug: string;
  name: string;
  location: string;
  category: string;
  status?: string;
  year?: string;
  description?: string;
  images: string[];
  videos?: string[];
};
```

Optional fields should remain optional until verified.

Do not create fake placeholder business information and accidentally ship it.

---

# 10. Content Truth Rules

The following are non-negotiable:

1. Do not invent project names.
2. Do not invent project descriptions.
3. Do not invent testimonials.
4. Do not invent certifications.
5. Do not invent awards.
6. Do not invent customer names.
7. Do not claim ownership of projects without verification.
8. Do not turn founder resume experience into Visakram project claims.
9. Do not publish private customer information without permission.
10. Clearly distinguish verified content from temporary development placeholders.

---

# 11. Asset Architecture

## Images

Store public image assets under:

```text
public/images/
```

Organize when the collection becomes large:

```text
public/images/
├── brand/
├── projects/
├── founders/
├── testimonials/
└── general/
```

## Videos

```text
public/videos/
├── hero/
├── projects/
├── testimonials/
└── process/
```

## 3D

```text
public/models/
```

Use optimized GLB/GLTF assets.

Do not commit unnecessary source files such as huge raw CAD/BIM exports into the production web repository.

---

# 12. Asset Naming

Use predictable names.

Preferred:

```text
visakram-hero-desktop.mp4
visakram-hero-mobile.mp4
project-vasudha-enclave-cover.webp
founder-shanmukesh.webp
founder-satish.webp
plan-to-place-building.glb
```

Avoid:

```text
IMG_9382-final-final2-new.jpg
video_new_latest_REAL.mp4
```

Asset names should communicate purpose.

---

# 13. Responsive Media

Images must use responsive delivery where practical.

Requirements:

- Explicit dimensions/aspect ratios
- Appropriate `alt` text
- Lazy loading below the fold
- High-priority loading only for critical media
- Modern formats where practical
- Correct `object-fit` behavior

Hero media receives special treatment because it is part of the critical path.

---

# 14. Video Architecture

Video components should support:

```text
poster
source
fallback
autoplay policy
muted state
playsInline
loading strategy
```

Hero video should not prevent the page from becoming usable.

Non-critical project videos should be lazy-loaded.

Video components should fail gracefully if media cannot load.

---

# 15. 3D Architecture

The 3D system should be isolated.

Suggested:

```text
src/three/
├── PlanToPlaceScene.tsx
├── BuildingModel.tsx
├── materials/
├── lights/
├── camera/
└── utils/
```

The 3D chapter should be loaded separately from the initial application where practical.

Conceptually:

```text
Initial page
   ↓
Normal React experience
   ↓
User approaches 3D section
   ↓
Load 3D module
   ↓
Initialize scene
   ↓
Run only while relevant
```

Do not initialize the Three.js renderer during the initial page load if the section is far below the fold.

---

# 16. Animation Architecture

Animation logic should not be scattered randomly through components.

Suggested:

```text
src/animations/
├── presets/
├── reveals/
├── transitions/
├── scroll/
└── utils/
```

Major cinematic timelines should have clearly named modules.

Example:

```text
featuredProjectTimeline.ts
visakramWayTimeline.ts
planToPlaceTimeline.ts
```

Keep animation setup close enough to the component to understand its purpose, but extract genuinely reusable systems.

---

# 17. React State Rules

Do not use React state for continuously changing visual values.

Avoid:

```text
scroll
→ setState()
→ render
→ scroll
→ setState()
```

for frame-level animation.

Use appropriate:

- Motion values
- GSAP timelines
- ScrollTrigger
- Refs
- Browser APIs

React state should represent application state, not animation frames.

---

# 18. Routing Strategy

Use a lightweight React routing solution only when multiple pages require it.

Routes must provide:

- Direct navigation
- Browser back/forward support
- Refresh support
- SEO-friendly URLs
- Accessible navigation

If the final hosting environment cannot support SPA fallback cleanly, deployment configuration must account for it before launch.

---

# 19. State Management

Do not introduce Redux or another global state framework unless the project develops a genuine need.

Initial state should remain local where possible.

Potential global state should be limited to things such as:

- Navigation state
- Light/dark visual context if required
- Global media state where justified

Business content should come from structured data, not global state.

---

# 20. Forms & Contact

The site requires a project enquiry form.

Initial fields:

```text
Name
Phone
WhatsApp
Project type
Location
Approximate requirement
Message
```

The form should:

- Validate required fields
- Validate user input
- Provide clear success/error feedback
- Prevent accidental duplicate submission
- Never expose secrets in client-side code

Because the project does not require a custom backend, the final submission mechanism should use a suitable external form/email service or hosting-compatible endpoint.

The exact provider must be selected and tested before production.

---

# 21. WhatsApp Integration

WhatsApp should be treated as a conversion channel, not a decorative icon.

Use it at appropriate points:

- Header/primary CTA area
- Project detail CTA
- Contact page
- Mobile persistent action where appropriate

The actual phone number must be confirmed before production.

Do not hardcode an unverified number.

---

# 22. Environment Variables

Secrets must never be committed.

Use:

```text
.env
.env.local
```

and provide:

```text
.env.example
```

for required variable names.

For Vite, remember that variables exposed to client-side code are not secret.

Never put:

- API secret keys
- Private tokens
- Passwords
- Database credentials

into `VITE_*` variables.

---

# 23. Error Handling

The application should fail gracefully.

Use:

- Error boundaries for React rendering failures
- Fallback UI for unavailable media
- Safe 3D fallback
- Form error states
- Route-level fallback handling

A failed 3D module should not break the entire website.

A failed video should fall back to its poster/image.

---

# 24. Accessibility Architecture

Use semantic HTML:

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

Do not replace semantic controls with clickable `div`s.

Requirements:

- Keyboard navigation
- Visible focus
- Accessible names
- Proper heading hierarchy
- Form labels/errors
- Reduced-motion support
- Sufficient contrast
- No animation-only information

---

# 25. SEO Architecture

The architecture must allow each page to provide:

- Unique title
- Meta description
- Canonical URL
- Open Graph metadata
- Appropriate headings
- Structured content
- Descriptive URLs

Important content must exist in HTML/text, not only inside canvas or animation.

SEO-specific implementation is defined in `SEO-SPEC.md`.

---

# 26. Performance Architecture

Performance must influence architecture from the beginning.

Priorities:

1. HTML/content availability
2. Critical CSS
3. Critical fonts
4. Hero media
5. Interactive UI
6. Below-fold media
7. 3D
8. Non-critical enhancements

Do not load the 3D scene before essential content.

Do not load every project image at full resolution.

Do not load every video on page startup.

Detailed budgets will be defined in:

```text
docs/PERFORMANCE-BUDGET.md
```

---

# 27. Code Splitting

Potential lazy-loaded modules:

- Project detail pages
- 3D experience
- Heavy gallery/lightbox
- Non-critical video modules
- Large animation chapters

The initial bundle should contain only what the initial experience requires.

Do not blindly lazy-load tiny components where the overhead is greater than the benefit.

---

# 28. Dependency Rules

Before adding a dependency, ask:

1. Is it necessary?
2. Can native browser APIs solve it?
3. Can an existing dependency already solve it?
4. Does it increase bundle size significantly?
5. Is it maintained?
6. Does it introduce security or licensing concerns?
7. Does it create architectural complexity?

Every dependency should have a reason.

---

# 29. Testing Architecture

## Unit tests

Use Vitest for:

- Utility functions
- Data transformations
- Validation
- Pure logic

## Component tests

Use React Testing Library for:

- Navigation
- Forms
- Buttons
- Important component behavior
- Accessibility behavior

## End-to-end tests

Use Playwright for:

- Homepage loading
- Navigation
- Project browsing
- Contact form behavior
- Mobile navigation
- Major CTA flows

Animation should not make tests unnecessarily fragile.

Prefer testing user-visible outcomes rather than exact animation frame timing.

---

# 30. Code Quality

Required:

- TypeScript strict mode
- ESLint
- Prettier
- No unused code
- No unnecessary `any`
- Clear component naming
- Clear function naming
- Small focused modules
- No giant monolithic page component

SonarQube should be used as a quality gate where practical.

Do not ignore warnings simply to make the dashboard look clean.

---

# 31. Security Architecture

The frontend must follow basic OWASP principles.

Requirements include:

- Validate input
- Encode/display user content safely
- Avoid unsafe HTML injection
- Never expose secrets
- Keep dependencies updated
- Review third-party scripts
- Minimize external integrations
- Use HTTPS in production
- Avoid unnecessary permissions
- Protect form endpoints against abuse where supported

Detailed rules will be defined in:

```text
docs/SECURITY-SPEC.md
```

---

# 32. Git Architecture

Use Git checkpoints before major architectural changes.

Suggested milestones:

```text
chore: initialize project
feat: establish design system
feat: build navigation
feat: build hero
feat: build homepage foundation
feat: add project system
feat: add cinematic sections
feat: add 3d experience
feat: add contact flow
perf: optimize production build
fix: cross-browser issues
chore: production release
```

Commit messages should describe the actual change.

Do not make one enormous commit containing the entire website.

---

# 33. Claude Code Rules

Claude Code must:

1. Inspect the existing repository before editing.
2. Read relevant documentation before implementation.
3. Never invent business content.
4. Never modify unrelated functionality.
5. Avoid unnecessary dependencies.
6. Follow the established folder architecture.
7. Use existing components before creating duplicates.
8. Keep TypeScript strict.
9. Avoid React state for frame-level animation.
10. Lazy-load heavy 3D.
11. Preserve reduced-motion behavior.
12. Test after meaningful changes.
13. Never claim tests passed without running them.
14. Explain significant architectural changes.
15. Create a Git checkpoint before major refactors.
16. Avoid huge files.
17. Keep business data separate from presentation.
18. Preserve SEO content in accessible HTML.
19. Prefer simple solutions over clever abstractions.
20. Never overwrite working code blindly.

---

# 34. Development Workflow

Each feature follows:

```text
1. Read relevant docs
        ↓
2. Inspect existing code
        ↓
3. Define smallest implementation
        ↓
4. Implement
        ↓
5. Run typecheck/lint
        ↓
6. Run relevant tests
        ↓
7. Test desktop
        ↓
8. Test mobile
        ↓
9. Check performance
        ↓
10. Git checkpoint
```

Do not stack multiple untested features together.

---

# 35. Build Order

Implementation should follow:

```text
Foundation
   ↓
Design tokens
   ↓
Global layout
   ↓
Navigation
   ↓
Hero
   ↓
Statement + proof
   ↓
Services
   ↓
Project system
   ↓
Featured project
   ↓
Visakram Way
   ↓
Process
   ↓
Founders
   ↓
Testimonials
   ↓
3D story
   ↓
Contact + WhatsApp
   ↓
SEO
   ↓
Performance
   ↓
Security
   ↓
QA
   ↓
Production
```

Do not begin with the 3D scene.

The 3D scene is a signature chapter, not the foundation of the application.

---

# 36. Architecture Non-Negotiables

1. React + TypeScript remains the application foundation.
2. Vite remains the build foundation.
3. CSS remains the default for simple styling.
4. Motion is used for UI/component animation.
5. GSAP is used for genuinely complex timelines.
6. Three.js is used only for meaningful 3D.
7. Native scrolling remains the baseline.
8. Heavy modules are lazy-loaded.
9. Business content is separated from presentation.
10. No secrets are shipped to the client.
11. Important content remains accessible as HTML.
12. Performance is considered before adding visual complexity.
13. Accessibility is considered before finalizing motion.
14. Testing is part of implementation, not a final afterthought.
15. Claude must inspect before modifying.
16. No invented business information.
17. No giant monolithic components.
18. No dependency without a clear reason.
19. No major refactor without a Git checkpoint.
20. A visually impressive feature that damages stability is not acceptable.

---

# 37. Next Architecture Documents

After this document:

1. `PERFORMANCE-BUDGET.md`
2. `SEO-SPEC.md`
3. `SECURITY-SPEC.md`
4. `QA-CHECKLIST.md`
5. `CLAUDE.md`

After those documents are complete, we can initialize the actual React/Vite implementation and begin development in controlled checkpoints.
