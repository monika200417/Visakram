# VISAKRAM BUILDERS — DESIGN SYSTEM
## Version 0.1 — Foundation

> This document defines the visual language for the Visakram Builders digital experience. It translates the approved Digital Experience Blueprint into concrete design rules.
>
> **Status:** Design foundation / subject to final brand-asset confirmation.

---

## 1. Design North Star

### Core idea

**Twenty years of construction experience, expressed through a contemporary digital experience.**

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

The visual language should communicate confidence without trying to look flashy.

### Avoid

- Generic construction-template aesthetics
- Excessive glassmorphism
- Neon colors
- Heavy gradients
- Excessive rounded cards
- Cartoon/bouncy animation
- Excessive 3D
- Random floating objects
- Excessive cursor effects
- Long blocking preloaders
- Overloaded navigation
- Tiny unreadable typography

---

## 2. Brand Expression

### Brand personality

| Attribute | Expression |
|---|---|
| Established | Strong typography, restrained layout, real project evidence |
| Premium | Space, photography, detail, materiality |
| Modern | Clean grid, contemporary typography, subtle interaction |
| Trustworthy | Clear information, real people, real projects, transparent CTA |
| Architectural | Geometry, proportion, structure, strong vertical/horizontal lines |
| Warm | Natural imagery, restrained earthy accent, human storytelling |

### Design principle

**Less decoration. More intention.**

Every visual element should communicate information, guide attention, establish hierarchy, explain a process, create atmosphere, or support conversion. If it does none of these, remove it.

---

## 3. Color System

The palette is intentionally restrained and architectural.

### Core palette

| Token | Value | Usage |
|---|---|---|
| `--color-ink` | `#11120F` | Primary dark background / major headings |
| `--color-charcoal` | `#24251F` | Secondary dark surfaces |
| `--color-paper` | `#F4F1EA` | Primary light background |
| `--color-white` | `#FFFFFF` | Clean surfaces / contrast |
| `--color-stone` | `#D8D1C5` | Borders / subtle surfaces |
| `--color-muted` | `#77766E` | Secondary text |
| `--color-terracotta` | `#A65D45` | Primary accent / CTA |
| `--color-terracotta-dark` | `#7F4433` | Accent hover / darkened state |

The terracotta accent is controlled, not dominant. Use it mainly for CTAs, small labels, active indicators, selected navigation states, and small graphic details.

### Dark experience

```text
Background: #11120F
Surface:    #24251F
Text:       #F4F1EA
Muted:      #B4B1A8
Border:     rgba(244, 241, 234, 0.16)
Accent:     #A65D45
```

### Light experience

```text
Background: #F4F1EA
Surface:    #FFFFFF
Text:       #11120F
Muted:      #77766E
Border:     rgba(17, 18, 15, 0.14)
Accent:     #A65D45
```

Do not introduce additional accent colors without a design reason.

---

## 4. Typography

Typography is one of the primary visual identities of the site.

### Type families

**Display / Editorial — Playfair Display**

Use for hero headlines, major section statements, editorial project titles, and large storytelling moments.

**Interface / Body — Manrope**

Use for navigation, body copy, buttons, forms, project metadata, and supporting text.

**Technical / Metadata — DM Mono**

Use sparingly for project numbers, location labels, process numbering, and technical labels. Do not use it for paragraphs.

### Initial desktop scale

| Level | Suggested size | Weight |
|---|---:|---:|
| Display XL | 96–128px | 500–600 |
| Display L | 72–96px | 500–600 |
| H1 | 64–80px | 500–600 |
| H2 | 48–64px | 500–600 |
| H3 | 32–40px | 500–600 |
| Body L | 20–24px | 400–500 |
| Body | 16–18px | 400–500 |
| Small | 13–14px | 400–500 |
| Mono label | 11–13px | 400–500 |

These are starting tokens, not rigid values for every component.

### Typography rules

- Prefer short editorial headlines.
- Keep body copy readable.
- Avoid all-caps paragraphs.
- Use uppercase primarily for labels and navigation.
- Use italic serif sparingly for emphasis.
- Do not animate individual characters unless there is a clear narrative purpose.

---

## 5. Layout & Grid

### Container

Recommended maximum content width: **1440px**.

Starting horizontal padding:

```text
Desktop: 48–64px
Tablet:  32px
Mobile:  20px
```

### Grid

```text
Desktop: 12 columns
Tablet:   8 columns
Mobile:   4 columns
```

Use the grid to create intentional asymmetry. Not every section needs to use every column.

### Negative space

Whitespace is part of the design system. Prefer large breathing room around major statements, clear separation between chapters, controlled overlap, and strong image-to-text relationships.

---

## 6. Logo System

Support:

1. Light logo for dark backgrounds
2. Dark logo for light backgrounds

Never stretch, compress, redraw, or add unapproved effects to the logo. Final logo assets supplied by the client should be treated as the source of truth.

---

## 7. Buttons & CTAs

### Primary CTA

**START A PROJECT**

Direction:

- Terracotta fill
- Light text
- Strong but restrained typography
- Minimal radius
- Clear hover transition

### Secondary CTA examples

- VIEW PROJECTS
- EXPLORE SERVICES
- DISCOVER OUR PROCESS
- CHAT ON WHATSAPP

### Button behavior

Use small translation, background transition, border transition, and optionally subtle arrow movement.

Avoid bounce, elastic scaling, large rotation, and glow effects.

---

## 8. Image System

Photography is a major component of the brand.

### Image priority

1. Completed project photography
2. Construction-stage photography
3. Founder/team photography
4. Customer testimonial photography
5. High-quality supporting architectural imagery

Real client/project photography should take priority over stock imagery whenever authentic material exists.

### Image treatment

Preferred:

- Large crops
- Full-bleed architectural compositions
- Editorial aspect ratios
- Controlled cropping
- Subtle reveal masks
- Slow, restrained scale transitions

Avoid heavy filters, excessive rounded image cards, and random floating image collages.

Use responsive image assets, appropriate formats, responsive sizes, lazy loading below the fold, and explicit dimensions/aspect ratios.

---

## 9. Video System

Video should create atmosphere and storytelling, not become a distraction.

### Hero video

The hero video should fill the visual frame, start quickly, use muted/autoplay-compatible behavior where appropriate, use `playsinline`, have a strong poster image, have a static fallback, and maintain text readability.

### Project video

Project videos may use full-width cinematic blocks, large contained video, image-to-video transitions, or scroll-controlled reveals.

### Performance rules

Every important video needs an optimized source, poster, appropriate resolution, mobile strategy, fallback, and lazy-loading strategy when non-critical. Do not load every project video on the initial page load.

---

## 10. Project Cards

Project cards should feel like editorial project previews rather than generic portfolio cards.

Typical information:

```text
PROJECT NAME
LOCATION
CATEGORY
STATUS / YEAR
```

Optional:

```text
VIEW PROJECT →
```

The image should dominate; metadata should remain visually secondary.

---

## 11. Service Presentation

Primary services:

- Residential Construction
- Apartments
- Villas

Present services through large editorial compositions rather than a grid of identical icon cards.

Preferred structure:

```text
SERVICE NUMBER
SERVICE TITLE
SHORT DESCRIPTION
VISUAL
OPTIONAL DETAIL / LINK
```

Icons are optional and should not become the primary visual language.

---

## 12. Founder Presentation

Direction:

**TWO BACKGROUNDS. ONE DIRECTION.**

The presentation should communicate experience, responsibility, complementary areas of expertise, and shared direction.

Avoid generic profile cards, excessive badges, skill bars, artificial statistics, and unverified claims. Use verified biographies and original photography when supplied.

---

## 13. Testimonial Presentation

Customer stories should feel credible and human.

Preferred:

- Large testimonial video
- Customer/project photography
- Name
- Project
- Location
- Short verified quote

Avoid anonymous testimonials, invented quotes, and tiny rotating carousels as the primary trust mechanism. Publish customer information only with appropriate permission.

---

## 14. Motion Visual Language

Motion should feel slow, smooth, intentional, physical, editorial, and cinematic.

### Preferred

- Fade/reveal
- Clip-path/image reveal
- Controlled image scale
- Mask transitions
- Text entrance
- Sticky narrative
- Scroll-linked progression
- Subtle parallax
- Large visual transitions

### Avoid

- Bounce
- Elastic UI
- Constant floating
- Excessive rotations
- Scroll hijacking
- Animation on every element
- Heavy cursor effects
- Long loading animations

### Motion hierarchy

**Level 0 — Static:** important information, core navigation, accessibility fallback.

**Level 1 — Micro:** buttons, links, hover states, menu controls.

**Level 2 — Editorial:** section reveals, image transitions, typography entrances.

**Level 3 — Cinematic:** hero storytelling, featured-project transitions, process narratives, large scroll chapters.

**Level 4 — Signature:** reserved for the `FROM PLAN TO PLACE` 3D story.

Level 4 should be rare.

---

## 15. Responsive Design

Responsive behavior must be designed, not merely scaled.

### Desktop

Emphasize large typography, wide imagery, editorial compositions, scroll storytelling, and 3D where appropriate.

### Tablet

Simplify navigation, grid complexity, pinned sequences, and media composition.

### Mobile

Prioritize speed, readability, touch interaction, clear CTA, strong photography, and shorter motion sequences. The mobile experience should remain premium even when complex desktop effects are removed.

---

## 16. Accessibility

Requirements:

- Strong color contrast
- Visible keyboard focus
- Readable text sizes
- Semantic HTML
- Accessible navigation
- Accessible forms
- Proper image alt text
- Reduced-motion support

For `prefers-reduced-motion: reduce`, large motion sequences should become stable visual states. No important information should depend exclusively on animation.

---

## 17. Shape Language

Preferred:

- Sharp or subtly rounded geometry
- Thin borders
- Architectural rectangles
- Controlled cropping
- Strong horizontal and vertical alignment

Avoid excessive pill shapes, huge rounded cards, soft SaaS-style UI, and decorative blobs.

Suggested default radius:

```text
0–4px
```

Larger radii require a specific design reason.

---

## 18. Decorative Language

Allowed:

- Thin rules
- Small numbering systems
- Grid lines
- Architectural measurements
- Subtle texture/noise
- Fine borders
- Controlled masks

Decorative elements remain secondary. Architecture, photography, typography, and content should carry the experience.

---

## 19. Content Tone

Copy should be:

- Confident
- Clear
- Human
- Concise
- Professional
- Specific

Avoid empty marketing superlatives, unverified awards/certifications, artificial urgency, and excessive jargon.

Use documented facts.

---

## 20. Initial Design Tokens

```css
:root {
  /* Colors */
  --color-ink: #11120F;
  --color-charcoal: #24251F;
  --color-paper: #F4F1EA;
  --color-white: #FFFFFF;
  --color-stone: #D8D1C5;
  --color-muted: #77766E;
  --color-terracotta: #A65D45;
  --color-terracotta-dark: #7F4433;

  /* Layout */
  --container-max: 1440px;
  --page-padding-desktop: 64px;
  --page-padding-tablet: 32px;
  --page-padding-mobile: 20px;

  /* Radius */
  --radius-sm: 2px;
  --radius-md: 4px;

  /* Typography */
  --font-display: "Playfair Display", serif;
  --font-body: "Manrope", sans-serif;
  --font-mono: "DM Mono", monospace;
}
```

These tokens are starting values and may be refined during implementation.

---

## 21. Design Non-Negotiables

1. Real project content takes priority over decorative effects.
2. Do not invent company information.
3. Do not invent projects or testimonials.
4. Do not use excessive animation.
5. Do not make 3D the entire website.
6. Do not sacrifice performance for visual effects.
7. Do not sacrifice accessibility for animation.
8. Do not hide important content behind interaction.
9. Use real client assets as soon as they are available.
10. Keep the visual language consistent across all pages.
11. Prefer restraint over decoration.
12. Every major visual effect must have a purpose.
13. Validate the design on mobile, not only desktop.
14. Keep typography and spacing consistent through tokens.
15. Final client-supplied brand colors/logo override provisional values here.

---

## 22. Next Design Documents

1. `ANIMATION-SYSTEM.md`
2. `TECHNICAL-ARCHITECTURE.md`
3. `PERFORMANCE-BUDGET.md`
4. `SEO-SPEC.md`
5. `SECURITY-SPEC.md`
6. `QA-CHECKLIST.md`
7. `CLAUDE.md`

Only after these foundations are sufficiently defined should implementation begin.
