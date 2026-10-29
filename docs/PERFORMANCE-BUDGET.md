# VISAKRAM BUILDERS — PERFORMANCE BUDGET
## Version 0.1 — Performance Foundation

> Performance is a design constraint, not a final optimization step.
> The visual experience must remain premium while loading quickly, responding smoothly, and degrading gracefully on slower devices and networks.

---

# 1. Performance North Star

The website should feel:

- Fast
- Immediate
- Smooth
- Stable
- Responsive
- Lightweight beneath the cinematic layer

The visitor should never feel that the website is "waiting for the animation."

### Core principle

**Content first. Enhancement second.**

A cinematic effect must never delay access to important content or navigation.

---

# 2. Primary Performance Targets

Initial production targets:

| Metric | Target |
|---|---:|
| LCP | ≤ 2.5s |
| INP | < 200ms |
| CLS | < 0.10 |
| Initial page usable | As early as practical |
| Animation target | ~60fps where practical |
| Long main-thread tasks | Minimize / investigate |
| Layout shifts | Near zero |
| Critical errors | 0 |

These are engineering targets, not guarantees for every device/network combination.

Testing must include real-world mobile conditions.

---

# 3. Performance Priority Order

When performance conflicts with decoration, use this order:

```text
1. Content availability
        ↓
2. Navigation
        ↓
3. Readability
        ↓
4. Interaction
        ↓
5. Hero media
        ↓
6. Below-fold media
        ↓
7. Cinematic animation
        ↓
8. 3D enhancement
```

Never reverse this order.

---

# 4. Initial Page Load Budget

The initial route should remain intentionally lean.

## JavaScript

Target:

```text
Initial JS: ≤ 200 KB compressed
```

This is a planning target.

Large libraries should not automatically enter the initial bundle.

## CSS

Target:

```text
Initial CSS: ≤ 75 KB compressed
```

Avoid shipping unused component styles.

## Fonts

Target:

```text
Critical font families: 2
```

Primary:

- Playfair Display
- Manrope

DM Mono should be loaded only if the page actually requires it.

Avoid loading unnecessary font weights.

---

# 5. JavaScript Rules

Do:

- Code-split large features
- Lazy-load heavy sections
- Tree-shake dependencies
- Keep components focused
- Avoid unnecessary global state
- Avoid large utility libraries for tiny tasks

Do not:

- Load Three.js on the initial route unnecessarily
- Load every animation module immediately
- Import an entire library when only one small feature is needed
- Create large monolithic components

---

# 6. Three.js / 3D Budget

The 3D experience is the heaviest planned feature.

Therefore:

### Loading

3D must be:

- Lazy-loaded
- Code-split
- Initialized near the relevant section
- Optional for mobile when appropriate

### Asset targets

Initial guideline:

```text
Primary GLB/GLTF: preferably ≤ 5 MB
Compressed production model: target ≤ 3 MB where visual quality permits
```

Texture budgets should be minimized aggressively.

Use compressed textures where the pipeline supports them.

### Rendering

Avoid:

- Excessive polygon counts
- Large texture atlases
- Many dynamic lights
- Expensive real-time shadows
- High device pixel ratios without limits
- Unnecessary post-processing

### Lifecycle

When the 3D section is not visible:

- Pause expensive rendering where possible
- Stop unnecessary animation loops
- Release resources when the scene is permanently removed

---

# 7. Hero Video Budget

The hero is visually important but also part of the critical path.

## Requirements

Provide:

```text
Poster image
Desktop video
Mobile strategy
Fallback image
```

## Guidelines

The hero video should be:

- Compressed
- Short enough to establish atmosphere
- Encoded for web delivery
- Muted
- Autoplay-compatible where appropriate
- `playsinline`
- Served at a resolution appropriate to the viewport

Avoid loading a huge 4K master simply because the source video is 4K.

### Poster

The poster should communicate the hero even when video:

- has not loaded,
- is disabled,
- fails,
- or is replaced on reduced-motion/mobile conditions.

---

# 8. Image Budget

Images are likely to represent a major portion of total page weight.

## Rules

Use:

- AVIF/WebP where practical
- Responsive `srcset`
- Correct image dimensions
- Lazy loading below the fold
- Explicit aspect ratios

Avoid:

- Original camera-resolution files in production
- Loading every project image on the homepage
- Oversized thumbnails
- PNG for photographic content unless required

## Project archive

Initial grid should load only the images required for the visible viewport and nearby content.

Full project galleries should load on project detail pages.

---

# 9. Video Loading Strategy

Not every video should behave like the hero.

## Critical

Hero video:

```text
High priority
```

## Non-critical

Project videos:

```text
Lazy-load
```

Testimonial videos:

```text
Poster first
Load video on interaction or appropriate visibility
```

3D/video alternatives:

```text
Load only when the section becomes relevant
```

---

# 10. Font Performance

Use only required weights.

Initial recommendation:

### Playfair Display

Load only the display weights actually used.

### Manrope

Prioritize:

- Regular
- Medium
- Semibold

### DM Mono

Load only if required by visible metadata.

Do not request many font weights "just in case."

Where practical, use:

```text
font-display: swap;
```

Typography must not cause invisible text during loading.

---

# 11. Layout Stability

CLS must remain below the target.

Every major media element should have:

- Known dimensions
- Aspect ratio
- Reserved layout space

Avoid inserting content above existing content after load.

Examples of risky patterns:

- Images without dimensions
- Late-loading fonts causing major layout changes
- Video containers that suddenly change height
- Dynamic banners injected at the top

---

# 12. Animation Performance

Prefer:

```text
transform
opacity
```

Avoid repeatedly animating:

```text
width
height
top
left
margin
padding
```

when a transform can achieve the same visual result.

Be cautious with:

- `filter`
- blur
- large shadows
- backdrop-filter
- complex clipping
- expensive canvas effects

---

# 13. Scroll Performance

Never implement cinematic scrolling as:

```text
scroll event
↓
React setState
↓
component render
↓
repeat every frame
```

Prefer:

- GSAP ScrollTrigger
- Motion values
- requestAnimationFrame where appropriate
- Browser-native scroll-linked mechanisms when appropriate

Avoid unnecessary work on every scroll tick.

---

# 14. Main Thread Budget

The main thread should remain responsive.

Investigate:

- Long JavaScript tasks
- Heavy synchronous parsing
- Large component renders
- Excessive DOM nodes
- Unoptimized 3D initialization
- Large image decoding at critical moments

Interactions must remain responsive while animation is active.

---

# 15. DOM Budget

There is no single universal maximum DOM size for this project.

However:

- Avoid unnecessary wrappers.
- Avoid deeply nested decorative structures.
- Reuse components.
- Do not generate hundreds of animated elements when a simpler composition works.

A visually complex section should still have a controlled DOM.

---

# 16. Mobile Performance

Mobile is a first-class target.

The mobile experience should not simply be the desktop experience compressed.

Possible mobile simplifications:

- Reduced video resolution
- Static image instead of background video where appropriate
- Simplified 3D
- Reduced particle/visual effects
- Fewer simultaneous animations
- Shorter scroll timelines
- Reduced image resolution
- Less expensive lighting

The mobile version must remain visually intentional.

---

# 17. Network Conditions

Test at minimum:

### Fast connection

Purpose:

- Verify premium experience
- Verify animation quality
- Verify video quality

### Mid-range connection

Purpose:

- Verify realistic loading
- Verify fallback behavior
- Verify content priority

### Slow connection

Purpose:

- Ensure content remains usable
- Ensure media does not block navigation
- Verify poster/fallback behavior

---

# 18. Caching

Production deployment should use appropriate caching for:

- Static assets
- Images
- Fonts
- Videos
- JavaScript
- CSS

Hashed build assets should be cacheable for long periods.

HTML should have an appropriate update strategy so new deployments become visible without problematic stale pages.

Exact GoDaddy caching configuration should be confirmed during deployment.

---

# 19. Compression

Production assets should use compression appropriate to their type.

Potential formats:

```text
HTML → gzip/brotli where supported
CSS → gzip/brotli where supported
JS → gzip/brotli where supported
Images → AVIF/WebP
Video → web-optimized codecs
3D → GLB + compressed textures where appropriate
```

Do not blindly compress already-compressed assets if it provides no benefit.

---

# 20. Lazy Loading Strategy

Lazy-load:

- Below-fold images
- Project galleries
- Testimonial videos
- 3D
- Heavy lightbox modules
- Non-critical animation systems

Do not lazy-load content that is immediately required for the first viewport.

---

# 21. Prefetch / Preload Strategy

Use preload only for genuinely critical assets.

Potential candidates:

- Critical font
- Hero poster
- Critical hero media

Do not preload:

- Every project image
- Every video
- 3D model
- Below-fold assets

Too much preloading defeats the purpose.

---

# 22. 3D Fallback Strategy

If 3D fails to initialize:

```text
3D unavailable
      ↓
Static architectural visual
      ↓
Continue page normally
```

A browser/device that cannot render the 3D experience must still receive the complete story.

---

# 23. Video Fallback Strategy

If video fails:

```text
Video unavailable
      ↓
Poster image remains
      ↓
Content remains readable
```

No blank hero.

---

# 24. Reduced Motion Performance

With:

```css
@media (prefers-reduced-motion: reduce)
```

the site should:

- Remove expensive scroll choreography
- Reduce transition durations
- Disable unnecessary parallax
- Use static 3D fallback where appropriate
- Avoid autoplay video when appropriate
- Preserve content and navigation

Reduced motion should generally also reduce CPU/GPU work.

---

# 25. Performance Monitoring

During development use:

- Chrome DevTools Performance
- Lighthouse
- PageSpeed Insights where appropriate
- Network panel
- Coverage
- Performance monitor
- React profiling when required

For production validation, use real measurements rather than relying only on local development results.

---

# 26. Core Web Vitals Validation

Before production:

### LCP

Investigate:

- Hero video
- Hero image
- Fonts
- Render-blocking CSS/JS

### INP

Investigate:

- Navigation
- Menu interaction
- Heavy JavaScript
- 3D initialization
- Large event handlers

### CLS

Investigate:

- Images
- Videos
- Fonts
- Dynamic content

---

# 27. Performance Test Matrix

Test at minimum:

| Environment | Required |
|---|---|
| Desktop Chrome | Yes |
| Desktop Edge | Yes |
| Android Chrome | Yes |
| iPhone Safari | Yes |
| Mid-range Android | Yes |
| Reduced motion | Yes |
| Slow network | Yes |
| Large desktop display | Yes |

The exact supported browser versions should be finalized in the QA document.

---

# 28. Performance Regression Rules

After every major visual feature:

1. Build production bundle.
2. Inspect bundle size.
3. Test first load.
4. Test scroll performance.
5. Test mobile.
6. Check Core Web Vitals.
7. Compare against previous checkpoint.

If a feature causes a significant regression:

```text
Optimize
   ↓
Simplify
   ↓
Replace
```

Do not simply accept the regression because the feature "looks cool."

---

# 29. Performance Budgets — Working Table

These are starting project budgets.

| Area | Working target |
|---|---:|
| LCP | ≤ 2.5s |
| INP | < 200ms |
| CLS | < 0.10 |
| Initial JS | ≤ 200 KB compressed |
| Initial CSS | ≤ 75 KB compressed |
| Critical font families | ≤ 2 initially |
| Primary 3D asset | Preferably ≤ 5 MB |
| Compressed 3D target | ≤ 3 MB where practical |
| Above-fold image count | Minimal |
| Initial video count | 1 maximum |
| Heavy 3D initialization | Deferred |
| Critical layout shifts | 0 |
| Console errors in production | 0 |

These are engineering budgets, not promises.

Real testing determines whether a specific asset or effect needs further optimization.

---

# 30. Performance Decision Framework

Before adding a heavy feature, ask:

```text
Does it improve the story?
        ↓
Can it be implemented more simply?
        ↓
Can it be lazy-loaded?
        ↓
Can it be reduced on mobile?
        ↓
Can it have a static fallback?
        ↓
What is the measurable performance cost?
        ↓
Is that cost justified?
```

If the answer is unclear, do not add the feature yet.

---

# 31. Performance Non-Negotiables

1. Performance is designed from the beginning.
2. Important content must remain accessible without heavy media.
3. Hero media must have a fallback.
4. 3D must be deferred.
5. Non-critical video must be lazy-loaded.
6. Images must be responsive.
7. Layout dimensions must be reserved.
8. Avoid React state per animation frame.
9. Prefer transform/opacity animation.
10. Avoid unnecessary dependencies.
11. Test mobile continuously.
12. Test slow networks.
13. Respect reduced motion.
14. Measure production builds, not only development builds.
15. A visual effect that causes unacceptable performance regression must be redesigned.

---

# 31B. Home Tour Budget

The Home Tour is footage scrubbed by scroll — no Three.js, no WebGL:

```text
Loading     media loads when the section is near the viewport; nothing in the initial bundle
Footage     one clip per chapter; only previous + current + next are mounted, farther ones released
First view  the first poster (WebP, ~100 KB) paints immediately; clips fade in over it
Encode      short keyframe spacing (about every 4-8 frames), no B-frames, so seeking is cheap
Idle        zero work: clips are never played; seeks happen only when scroll progress changes
Mobile/RM   reduced motion and Save-Data get stills + captions, no clip download
Film files  desktop: home-tour.mp4, 1920x1080, a keyframe every 4 frames, ~15 MB (crf 25; SSIM 0.993 vs the
            34 MB original it replaced). Phones (max-width 767px) and 2G/3G connections: home-tour-mobile.mp4,
            960x540, a keyframe every 3 frames, ~4 MB
In memory   once the section is near, the whole film is fetched as a blob and played from memory (useFilmSource),
            because a browser fetches a paused video only part-way ahead and every skip past that waits on the
            network. Seeks are then local: measured picture lag behind the scroll 0.05-0.16 s at a normal swipe and
            0.02-0.07 s at three times that speed, at a steady 60 fps. Falls back to the plain address if the fetch
            fails. Released (aborted, revoked) when the visitor scrolls far away
Phones      the scrub follows the thumb closely (scrub 0.35 vs 1.2 on desktop), the hero dive skips its blur, and
            ScrollTrigger ignores the address-bar resize so pins are not re-measured mid-scroll
            (see src/animations/gsap.ts)
Stars       14 small gold stars (CSS only) at random places, new places each time scrolling starts; they twinkle only
            while the film is being scrolled (data-moving, ~260 ms after the last scroll tick) and are paused and
            faded out otherwise, so they cost nothing at rest. Hidden in still mode (reduced motion / Save-Data)
Reference stills are development-only: unused in production code and deleted from dist/ (see vite.config.ts; VITE_HOME_TOUR_ALLOW_PLACEHOLDERS=1 keeps them for a local preview)
```

---

# 32. Next Documents

After this document:

1. `SEO-SPEC.md`
2. `SECURITY-SPEC.md`
3. `QA-CHECKLIST.md`
4. `CLAUDE.md`

Once these are complete, the project documentation foundation will be ready for implementation.
