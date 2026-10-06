# VISAKRAM BUILDERS — ANIMATION SYSTEM
## Version 0.1 — Motion Foundation

> This document defines how motion is used across the Visakram Builders website.
> Motion is treated as a communication and storytelling system, not decoration.

---

## 1. Motion North Star

The animation language should feel:

- Cinematic
- Smooth
- Architectural
- Intentional
- Physical
- Editorial
- Calm
- Premium

The goal is **not** to make every element move.

The goal is to make the visitor understand:

- where they are,
- what deserves attention,
- what is changing,
- how the story progresses,
- and what action they can take.

### Core principle

**Motion should explain, guide, reveal, connect, or create atmosphere.**

If an animation does none of these, remove it.

---

# 2. Motion Hierarchy

The website uses five motion levels.

## Level 0 — Static

No animation.

Use for:

- Important information
- Body copy
- Accessibility-critical content
- Core navigation
- Legal/contact information

## Level 1 — Micro Interaction

Short UI feedback.

Use for:

- Buttons
- Links
- Navigation states
- Menu controls
- Form controls

Typical duration:

```text
150–300ms
```

## Level 2 — Editorial

Section and content reveals.

Use for:

- Headline entrances
- Image reveals
- Project cards
- Service sections
- Founder content
- Testimonials

Typical duration:

```text
400–900ms
```

## Level 3 — Cinematic

Large storytelling sequences.

Use for:

- Hero
- Featured project
- Visakram Way
- Process storytelling
- Major image transitions
- Scroll-driven chapters

Typical duration:

```text
800–2000ms+
```

Duration may extend because these are timeline-based experiences rather than simple UI transitions.

## Level 4 — Signature 3D

Reserved for the primary 3D story:

**FROM PLAN TO PLACE**

Use only when the interaction genuinely benefits from spatial visualization.

---

# 3. Technology Responsibilities

The project should not use every animation library everywhere.

## CSS

Use CSS for:

- Simple hover states
- Opacity transitions
- Color transitions
- Border transitions
- Transform transitions
- Basic responsive states

CSS is preferred when it is sufficient.

## Motion for React

Use Motion for:

- Component entrance/exit
- Navigation
- Mobile menu
- Modal/panel transitions
- Lightweight layout transitions
- UI interaction
- Small scroll-linked effects where GSAP is unnecessary

Do not introduce GSAP for a simple button animation.

## GSAP + ScrollTrigger

Use GSAP for:

- Cinematic timelines
- Scroll-driven choreography
- Pinning
- Scrubbing
- Horizontal storytelling
- Multi-element synchronized sequences
- Complex media transitions
- Coordinating the 3D story timeline

GSAP should be reserved for interactions that actually require timeline control.

## Three.js / React Three Fiber / Drei

Use Three.js only for genuine 3D.

Primary use:

**FROM PLAN TO PLACE**

Potential stages:

```text
Blueprint
   ↓
Foundation
   ↓
Structure
   ↓
Floors
   ↓
Facade
   ↓
Completed Building
```

Do not use Three.js for decorative floating objects simply because 3D is available.

## Lenis

Lenis is optional.

Only introduce it if testing demonstrates that it improves the intended experience without causing:

- Input issues
- Accessibility problems
- Touch problems
- Scroll synchronization problems
- Performance regressions

Native scrolling remains the baseline.

---

# 4. Motion Tokens

Initial tokens:

```css
:root {
  --motion-micro: 180ms;
  --motion-ui: 350ms;
  --motion-editorial: 700ms;
  --motion-cinematic: 1200ms;

  --ease-standard: cubic-bezier(0.2, 0.65, 0.3, 1);
  --ease-enter: cubic-bezier(0.16, 1, 0.3, 1);
  --ease-exit: cubic-bezier(0.7, 0, 0.84, 0);
}
```

These are starting values.

They should be refined through visual testing rather than multiplied into dozens of arbitrary timings.

---

# 5. Easing Philosophy

Preferred:

- Smooth ease-out
- Controlled ease-in/out
- Custom cubic-bezier curves
- Linear progression for scroll-scrubbed values when appropriate

Avoid:

- Bounce
- Elastic
- Cartoon overshoot
- Random spring effects
- Excessive snapping

The motion should feel closer to:

**architecture / material / camera movement**

than:

**mobile-app UI animation**.

---

# 6. Hero Motion

The hero is the first major cinematic moment.

## Initial state

- Hero video/image already establishes atmosphere.
- Logo and navigation remain readable.
- Headline begins in a controlled state.
- CTA remains discoverable.

## Entrance sequence

Suggested sequence:

```text
0.0s   Hero media visible
0.2s   Logo/navigation settle
0.4s   Headline reveal
0.7s   Supporting text
0.9s   CTA
1.1s   Scroll indicator
```

These values are a starting choreography, not a rigid requirement.

## Hero behavior

Possible effects:

- Subtle text reveal
- Controlled image/video scale
- Small opacity transitions
- Scroll-based compression
- Text movement during hero exit

Avoid:

- Large zooms
- Aggressive parallax
- Flash transitions
- Excessive blur
- Long preloader sequences

---

# 7. Editorial Reveal System

Standard content reveal:

```text
Initial:
opacity: 0
transform: translateY(24px)

Final:
opacity: 1
transform: translateY(0)
```

Use sparingly.

Recommended:

- One primary headline
- One supporting content group
- One visual group

Do not animate every child individually unless there is a specific reason.

---

# 8. Image Reveal System

Preferred image reveal patterns:

### Pattern A — Mask Reveal

Image is revealed through a clipping container.

### Pattern B — Scale Settle

Image begins slightly enlarged and settles into its final scale.

### Pattern C — Editorial Crop

A large image enters through a controlled crop.

### Pattern D — Expand

A contained project image grows into a larger visual field.

Pattern D should be reserved for important project storytelling.

---

# 9. Scroll Architecture

The website keeps **native scrolling**.

We do not hijack the scroll wheel.

## Approved patterns

### Pattern 1 — Reveal

Content appears naturally as the visitor reaches it.

### Pattern 2 — Sticky Narrative

A visual remains fixed while associated text changes.

### Pattern 3 — Scrub

A visual property follows scroll progress.

Examples:

- Image scale
- Timeline progression
- 3D construction stages

### Pattern 4 — Pin

A section temporarily remains in place while its story progresses.

Use carefully.

### Pattern 5 — Horizontal Story

Use only where horizontal movement communicates a clear narrative.

Do not turn the entire website into a horizontal-scrolling site.

---

# 10. Statement Section

The large brand statement should have minimal motion.

Possible:

- Line reveal
- Subtle opacity progression
- Small vertical movement

The typography itself should remain the dominant experience.

---

# 11. Proof / Metrics Motion

Metrics such as:

```text
20+ Years
25+ Completed
5 Ongoing
2 Founders
```

may use restrained number reveals.

Avoid exaggerated counting animations.

The numbers should appear credible and immediate.

If animated counting is used, it must not delay access to the actual value.

---

# 12. Services Motion

Service rows can use:

- Image preview
- Hover image movement
- Text emphasis
- Small arrow movement
- Controlled transition between services

Desktop may support richer interaction.

Mobile should simplify to a reliable tap interaction.

---

# 13. Featured Project Motion

This is one of the major cinematic chapters.

Suggested sequence:

```text
Contained project image
        ↓
Image begins expanding
        ↓
Container approaches viewport edges
        ↓
Image becomes dominant
        ↓
Project information enters
        ↓
Transition to next chapter
```

Use GSAP/ScrollTrigger only if this effect requires timeline control.

---

# 14. The Visakram Way

Core principles:

```text
QUALITY
TIMELINESS
TRANSPARENCY
```

Recommended interaction:

```text
Central visual
      +
Active principle
      +
Supporting evidence
```

As the visitor progresses:

```text
QUALITY
   ↓
TIMELINESS
   ↓
TRANSPARENCY
```

The visual should change meaningfully with each stage.

Avoid simply fading three cards into view.

---

# 15. FROM PLAN TO PLACE — 3D Motion System

This is the signature interactive chapter.

## Purpose

Demonstrate the transformation from planning to completed construction.

## Timeline

```text
01  Blueprint
02  Foundation
03  Structure
04  Floors
05  Facade
06  Completed Building
```

## Scroll relationship

Scroll progress controls the story.

Conceptually:

```text
0%     Blueprint
20%    Foundation
40%    Structure
60%    Floors
80%    Facade
100%   Completed Building
```

The actual thresholds can be tuned during implementation.

## Important

The 3D scene must:

- Load lazily
- Be code-split
- Pause when not visible
- Use optimized geometry
- Use optimized textures
- Limit expensive shadows/lights
- Dispose resources correctly
- Have a mobile fallback
- Have a reduced-motion fallback

## Mobile fallback

The mobile version may use:

- Simplified 3D
- Pre-rendered image sequence
- Video sequence
- Static visual stages

The experience should remain understandable without full desktop 3D.

---

# 16. Process Animation

Process:

```text
CONSULT
   ↓
PLAN
   ↓
BUILD
   ↓
QUALITY
   ↓
HANDOVER
```

Each stage should have a clear visual relationship.

Possible behavior:

- Active stage highlighted
- Progress line advances
- Supporting image changes
- Small metadata changes

Avoid five unrelated animations running simultaneously.

---

# 17. Project Archive Motion

Project archive should prioritize browsing.

Use:

- Image hover scale
- Metadata reveal
- Filter transition
- Light stagger

Avoid:

- Complex page transitions that slow exploration
- Hover effects that hide project information
- Heavy animation on every grid item

---

# 18. Founder Motion

Founder section should feel human.

Possible:

- Image reveal
- Text entrance
- Subtle image movement
- Background transition

Avoid:

- Floating profile portraits
- Skill bars
- Animated percentage statistics
- Excessive biography effects

---

# 19. Testimonial Motion

For video testimonials:

- Poster/image appears first
- Play interaction is obvious
- Video opens or expands smoothly
- Controls remain accessible

Do not autoplay customer testimonials with sound.

Do not use rapid testimonial carousels as the primary presentation.

---

# 20. Navigation Motion

Desktop navigation:

- Minimal
- Stable
- Clear active state

Mobile menu:

```text
Open
↓
Full/large navigation panel
↓
Links appear in controlled sequence
↓
CTA available
```

Closing should be faster than opening where appropriate.

Do not animate navigation so heavily that it delays access.

---

# 21. Page Transitions

Page transitions should be subtle.

Preferred:

- Crossfade
- Short opacity transition
- Controlled content entrance

Avoid:

- Long cinematic transitions between every route
- Full-screen blocking animations
- Transitions that make users wait

The content should remain the priority.

---

# 22. Hover System

Hover is progressive enhancement.

Desktop:

- Image scale: subtle
- Arrow movement: small
- Text color: controlled
- Border/background: controlled

Mobile:

- Do not depend on hover.

Every hover interaction must have a useful non-hover equivalent.

---

# 23. Reduced Motion

When:

```css
@media (prefers-reduced-motion: reduce)
```

the experience should:

- Remove large parallax
- Disable unnecessary transforms
- Replace scrubbed animation with stable states
- Remove decorative motion
- Reduce transition durations
- Keep all content accessible

The reduced-motion version must remain a complete website.

---

# 24. Performance Rules

Animation must respect the performance budget.

Prefer animating:

- `transform`
- `opacity`

Be careful with:

- Large filters
- Continuous blur
- Expensive box shadows
- Layout-triggering properties
- Large DOM animation sets

Avoid React state updates on every scroll frame.

Use:

- Motion values
- GSAP ticker/ScrollTrigger
- Browser-native scroll-linked mechanisms where appropriate

---

# 25. Scroll Performance Rules

Never build:

```text
scroll event
   ↓
setState()
   ↓
React render
   ↓
repeat every frame
```

for cinematic scroll effects.

Prefer animation systems that update visual properties without causing unnecessary React rendering.

---

# 26. Visibility & Lifecycle

Heavy animation should not continue when invisible.

For large sections:

- Detect visibility
- Pause expensive media when appropriate
- Pause 3D rendering when offscreen
- Dispose resources when no longer needed
- Resume safely when visible again

---

# 27. Motion Debugging

Every major animation should be testable independently.

During development, support:

- Reduced-motion testing
- Slow-motion inspection
- Mobile testing
- Desktop testing
- Scroll interruption testing
- Rapid-scroll testing
- Route navigation testing

A visitor should be able to scroll quickly without breaking the animation state.

---

# 28. Animation Failure Rules

If an animation:

- causes frame drops,
- delays content,
- breaks scrolling,
- creates accessibility problems,
- causes layout shifts,
- behaves incorrectly on mobile,

**simplify the animation.**

Do not solve a performance problem by simply demanding more hardware.

---

# 29. Motion Non-Negotiables

1. Native scrolling remains the baseline.
2. Motion must have a purpose.
3. CSS is preferred for simple effects.
4. Motion is preferred for component/UI animation.
5. GSAP is reserved for complex timelines.
6. Three.js is reserved for meaningful 3D.
7. No unnecessary library usage.
8. No React state per scroll frame.
9. No long blocking preloader.
10. No animation-dependent content.
11. Reduced motion must be supported.
12. Mobile must have an intentional motion strategy.
13. Heavy animation must be lazy-loaded where practical.
14. Heavy 3D must pause when not visible.
15. Performance problems require simplification, not escalation.
16. Animation must never compromise navigation or conversion.
17. Real content and photography remain more important than effects.

---

# 30. Implementation Order

Motion should be implemented in this order:

```text
1. Micro interactions
        ↓
2. Basic editorial reveals
        ↓
3. Hero choreography
        ↓
4. Featured project transition
        ↓
5. Visakram Way
        ↓
6. Process storytelling
        ↓
7. Project archive interactions
        ↓
8. Testimonial interactions
        ↓
9. Signature 3D
        ↓
10. Cross-section cinematic choreography
        ↓
11. Performance optimization
        ↓
12. Reduced-motion verification
        ↓
13. Mobile refinement
```

Do not build all motion simultaneously.

Each major chapter should be tested before moving to the next.

---

## 31. Next Design Documents

After this document:

1. `TECHNICAL-ARCHITECTURE.md`
2. `PERFORMANCE-BUDGET.md`
3. `SEO-SPEC.md`
4. `SECURITY-SPEC.md`
5. `QA-CHECKLIST.md`
6. `CLAUDE.md`

Only after these foundations are sufficiently defined should the actual implementation begin.

---

# 31. Home Tour (Scroll-Controlled Photorealistic Footage)

The Home Tour is a media presentation, not a 3D scene (the procedural Three.js
villa was retired in favour of photorealistic footage; its dusk version is
archived in `docs/milestones/`). Footage, chapter text, journey line and the
chapter timeline all read **one** normalized progress value, produced by **one**
scrubbed GSAP timeline on **one** ScrollTrigger (`useHomeTourScrub`). No second
trigger, no second scroll listener, no React state while scrolling.

```text
scroll → ScrollTrigger (scrub, pin) → tween of a single number (0 → 1)
       → progressRef  +  --tour-p CSS variable  +  chapter copy
       → timeline.frameAt(p) → active clip(s), clip time, opacity
       → video.currentTime (via a "latest wins" seeker)
```

- **Data, not JSX.** `src/data/homeTour.ts` holds the nine editorial chapters;
  `src/media/home-tour/manifest.ts` holds each chapter's clip, poster, `start`,
  `end` and `scrollVh` (its share of the pin). The pin length is the sum of the
  `scrollVh` values. Chapters without footage are simply not in the timeline, so
  clips are added or replaced in the manifest only.
- **Timeline** (`timeline.ts`, pure TypeScript): chapters share progress in
  proportion to `scrollVh`. At each boundary a short handoff holds the outgoing
  clip's last frame and the incoming clip's first frame and crossfades between
  them (a quiet crossfade where frames are not matched; never a wipe or zoom).
  Everything is a pure function of progress, so reverse scrolling retraces the
  same frames.
- **Media** (`HomeTourMedia`): a still and a muted, inline, control-free clip per
  chapter, stacked full-bleed; no play button or player chrome. The still is
  always beneath its clip, so there is never a blank frame. Only the previous,
  current and next chapters keep media mounted. A failing clip falls back to its
  still; a failing still falls back to a tinted panel.
- **Seeking** (`seek.ts`): while a seek is in flight only the newest target is
  remembered, then applied when the seek lands. Clips are never played.
- Copy follows the same smoothed value as the footage (the lesson from The
  Visakram Way: never drive text from raw scroll while visuals follow a scrub).
- Pin length is tuned in the browser (the manifest values are a starting point).
- **Fallbacks:** mobile/tablet, reduced motion and data-saver get a static block
  of stills and captions with no clip download; the chapters are always HTML.
- Clips to be scrubbed smoothly must be encoded with short keyframe spacing.
  The placeholder reference reel is not (see `public/assets/home-tour/placeholder`).

---

