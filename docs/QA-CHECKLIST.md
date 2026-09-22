# VISAKRAM BUILDERS — QA CHECKLIST
## Version 0.1 — Pre-Launch Quality Assurance

> This checklist defines the verification process for the Visakram Builders website.
> A feature is not considered complete because it looks correct in one browser. It must be verified across functionality, responsiveness, accessibility, animation, performance, SEO, security, and production behavior.

---

# 1. QA Philosophy

The website must be:

- Functionally correct
- Visually consistent
- Responsive
- Accessible
- Fast
- Stable
- Secure
- SEO-ready
- Production-ready

### Core principle

**Do not approve a feature based only on appearance.**

Every major feature must be tested in the environment where users will actually experience it.

---

# 2. Definition of Done

A feature is complete only when:

- [ ] Intended behavior works
- [ ] Desktop behavior works
- [ ] Mobile behavior works
- [ ] Relevant tablet behavior works
- [ ] Keyboard behavior works where applicable
- [ ] Reduced-motion behavior works where applicable
- [ ] No console errors
- [ ] No broken assets
- [ ] No obvious layout shifts
- [ ] Performance is acceptable
- [ ] Relevant tests pass
- [ ] SEO requirements remain intact
- [ ] No security regression introduced
- [ ] Git checkpoint created

---

# 3. Development QA Loop

For each meaningful feature:

```text
Implement
   ↓
Typecheck
   ↓
Lint
   ↓
Unit/component tests
   ↓
Desktop browser test
   ↓
Mobile test
   ↓
Performance check
   ↓
Accessibility check
   ↓
Git checkpoint
```

Do not stack many untested features before checking them.

---

# 4. Browser Matrix

Minimum browser verification:

| Browser | Desktop | Mobile |
|---|---|---|
| Chrome | ✓ | Android Chrome |
| Edge | ✓ | — |
| Safari | — | iPhone Safari |
| Firefox | ✓ | Optional/secondary |

The exact browser versions supported for production should be finalized before launch based on current project requirements and realistic audience usage.

---

# 5. Homepage QA

## Hero

- [ ] Hero loads correctly
- [ ] Poster appears before/if video is unavailable
- [ ] Hero video behaves correctly
- [ ] Video is muted where required
- [ ] `playsinline` behavior works on mobile
- [ ] Hero text remains readable
- [ ] Logo is visible
- [ ] Navigation is usable
- [ ] Primary CTA works
- [ ] Secondary CTA works
- [ ] Scroll indicator works if present
- [ ] Hero does not create layout shift
- [ ] Hero does not block page interaction unnecessarily

## Statement

- [ ] Heading appears correctly
- [ ] Typography is correct
- [ ] Text remains accessible
- [ ] Reveal animation works
- [ ] Reduced-motion state works

## Proof / Metrics

- [ ] Values are correct
- [ ] No invented metrics
- [ ] Layout works on mobile
- [ ] Animation does not delay information

## Services

- [ ] All approved services appear
- [ ] Service links work
- [ ] Images load
- [ ] Hover behavior works on desktop
- [ ] Tap behavior works on mobile
- [ ] No hover-only information

## Featured Project

- [ ] Project data is verified
- [ ] Image/video loads
- [ ] Project link works
- [ ] Expansion animation works
- [ ] Scroll interruption does not break state
- [ ] Mobile fallback works

## Visakram Way

- [ ] QUALITY appears correctly
- [ ] TIMELINESS appears correctly
- [ ] TRANSPARENCY appears correctly
- [ ] Supporting evidence is accurate
- [ ] Scroll/pinned behavior works
- [ ] Rapid scrolling does not break state
- [ ] Reduced-motion fallback works

## 3D Story

- [ ] 3D module loads only when appropriate
- [ ] Loading does not block homepage
- [ ] Model renders correctly
- [ ] Camera behaves correctly
- [ ] Scroll progress maps correctly
- [ ] Timeline stages are understandable
- [ ] Rapid scrolling does not break state
- [ ] Scene pauses when appropriate
- [ ] Mobile fallback works
- [ ] Reduced-motion fallback works
- [ ] 3D failure does not break the page

## Process

- [ ] CONSULT appears
- [ ] PLAN appears
- [ ] BUILD appears
- [ ] QUALITY appears
- [ ] HANDOVER appears
- [ ] Active state works
- [ ] Supporting visuals match content

## Founders

- [ ] Founder names are correct
- [ ] Biographies are verified
- [ ] Images are authorized
- [ ] No resume information is presented as a Visakram project claim
- [ ] Layout works on mobile

## Testimonials

- [ ] Customer information is verified
- [ ] Permission is confirmed
- [ ] Quotes are original/approved
- [ ] Video poster works
- [ ] Video controls work
- [ ] No autoplay-with-sound behavior
- [ ] Mobile behavior works

## Final CTA

- [ ] Start a Project works
- [ ] WhatsApp works
- [ ] Contact details are correct
- [ ] Form link/action works
- [ ] Closing visual loads correctly

---

# 6. Navigation QA

## Desktop

- [ ] Logo links correctly
- [ ] Projects link works
- [ ] Services link works
- [ ] About link works
- [ ] Process link works
- [ ] Contact link works
- [ ] Primary CTA works
- [ ] Active states are clear
- [ ] Keyboard navigation works
- [ ] Focus states are visible

## Mobile

- [ ] Menu opens
- [ ] Menu closes
- [ ] Escape closes where appropriate
- [ ] Links work
- [ ] CTA remains accessible
- [ ] Body scrolling is handled correctly
- [ ] No scroll lock bug
- [ ] No menu overlap
- [ ] No animation deadlock

---

# 7. Projects QA

## Archive

- [ ] Projects load
- [ ] Project names are correct
- [ ] Locations are correct
- [ ] Categories are correct
- [ ] Status/year shown only when verified
- [ ] Filters work
- [ ] Filter transitions do not break layout
- [ ] Images load correctly
- [ ] Lazy loading works
- [ ] Project links work

## Project Detail

- [ ] URL slug is correct
- [ ] Project title is correct
- [ ] Location is correct
- [ ] Category is correct
- [ ] Description is verified
- [ ] Gallery works
- [ ] Video works where present
- [ ] Testimonial works where present
- [ ] Related projects work
- [ ] Contact CTA works
- [ ] Back navigation works

---

# 8. Services QA

- [ ] All approved services appear
- [ ] Service descriptions are accurate
- [ ] Links work
- [ ] Images work
- [ ] Mobile layout works
- [ ] Keyboard navigation works
- [ ] No unsupported claims

---

# 9. About / Founders QA

- [ ] Company information is accurate
- [ ] 20+ years statement is approved
- [ ] Founder information is verified
- [ ] Professional experience is represented accurately
- [ ] Education information is accurate
- [ ] No unsupported project attribution
- [ ] Images are authorized
- [ ] Typography works
- [ ] Mobile layout works

---

# 10. Process QA

- [ ] Process stages are approved
- [ ] Stage order is correct
- [ ] Supporting content is accurate
- [ ] Animation works
- [ ] Static state works
- [ ] Reduced-motion state works
- [ ] Mobile behavior works

---

# 11. Contact Form QA

Test:

- [ ] Empty submission
- [ ] Missing required field
- [ ] Invalid phone
- [ ] Excessively long input
- [ ] Special characters
- [ ] Normal valid submission
- [ ] Duplicate submission
- [ ] Network failure
- [ ] Provider failure
- [ ] Success message
- [ ] Error message
- [ ] Keyboard-only completion
- [ ] Mobile keyboard behavior

Verify:

- [ ] No secrets are exposed
- [ ] User data is not unnecessarily logged
- [ ] Submission endpoint uses HTTPS
- [ ] Spam protection works where configured

---

# 12. WhatsApp QA

- [ ] Correct number is configured
- [ ] Desktop link works
- [ ] Mobile link works
- [ ] Message encoding works if a prefilled message is used
- [ ] Link opens expected WhatsApp destination
- [ ] No private information is embedded
- [ ] CTA is accessible by keyboard

---

# 13. Animation QA

## General

- [ ] Animations start correctly
- [ ] Animations finish correctly
- [ ] No flicker
- [ ] No sudden jumps
- [ ] No overlapping sections
- [ ] No stuck states
- [ ] No animation blocks navigation

## Scroll

- [ ] Normal scrolling works
- [ ] Rapid scrolling works
- [ ] Reverse scrolling works
- [ ] Scroll interruption works
- [ ] Page refresh works at different scroll positions
- [ ] Pinned sections release correctly
- [ ] Horizontal sequences remain controlled

## Hover

- [ ] Hover effects work on desktop
- [ ] Hover is not required for information
- [ ] Touch devices do not depend on hover

---

# 14. Reduced Motion QA

Enable:

```text
prefers-reduced-motion: reduce
```

Verify:

- [ ] Hero remains usable
- [ ] Large parallax is removed/reduced
- [ ] Scroll choreography becomes stable
- [ ] 3D fallback works
- [ ] Content remains visible
- [ ] Navigation remains functional
- [ ] Forms remain functional
- [ ] No critical information disappears

---

# 15. 3D QA

Test:

- [ ] Supported desktop GPU
- [ ] Mid-range laptop
- [ ] Mobile device
- [ ] Reduced-motion mode
- [ ] WebGL failure scenario
- [ ] Slow network
- [ ] Rapid scroll
- [ ] Page navigation away and back

Verify:

- [ ] No memory growth from repeated initialization
- [ ] Renderer stops/pauses appropriately
- [ ] Resources are disposed
- [ ] No severe frame drops
- [ ] Static fallback is correct

---

# 16. Responsive QA

Minimum widths to inspect:

```text
320px
375px
390px
430px
768px
1024px
1280px
1440px
1920px+
```

Check:

- [ ] No horizontal overflow
- [ ] No clipped text
- [ ] No overlapping buttons
- [ ] No broken grids
- [ ] Images crop correctly
- [ ] Videos fit correctly
- [ ] Navigation works
- [ ] Forms remain usable
- [ ] Typography remains readable
- [ ] CTAs remain reachable

---

# 17. Accessibility QA

Verify:

- [ ] Keyboard navigation
- [ ] Visible focus
- [ ] Logical tab order
- [ ] Semantic landmarks
- [ ] Heading hierarchy
- [ ] Button names
- [ ] Link names
- [ ] Form labels
- [ ] Form error messages
- [ ] Image alt text
- [ ] Video controls
- [ ] Reduced motion
- [ ] Color contrast
- [ ] No keyboard trap

Test with:

- Keyboard only
- Browser accessibility tools
- Automated accessibility testing where practical

---

# 18. Performance QA

## Production build

- [ ] Production build succeeds
- [ ] No build warnings requiring action
- [ ] Bundle size inspected
- [ ] Large dependencies identified
- [ ] Images optimized
- [ ] Videos optimized
- [ ] 3D assets optimized

## Runtime

- [ ] LCP target evaluated
- [ ] INP target evaluated
- [ ] CLS target evaluated
- [ ] Scroll performance evaluated
- [ ] Mobile performance evaluated
- [ ] Slow network evaluated

## Loading

- [ ] Hero loads acceptably
- [ ] Below-fold images lazy-load
- [ ] 3D is deferred
- [ ] Project videos are deferred
- [ ] No unnecessary preloads

---

# 19. SEO QA

- [ ] Every indexable page has a unique title
- [ ] Meta descriptions are unique
- [ ] H1 is appropriate
- [ ] Heading hierarchy is logical
- [ ] Canonical is correct
- [ ] Open Graph metadata exists
- [ ] Sitemap works
- [ ] Robots.txt works
- [ ] Structured data matches page content
- [ ] Important content is crawlable
- [ ] Project URLs are descriptive
- [ ] Internal links work
- [ ] No important orphan pages
- [ ] 404 page exists

---

# 20. Security QA

- [ ] No secrets in repository
- [ ] No secrets in production bundle
- [ ] `.env` ignored
- [ ] Dependencies audited
- [ ] HTTPS enabled
- [ ] No mixed content
- [ ] Input validation works
- [ ] XSS-oriented inputs tested
- [ ] Error messages reveal no internals
- [ ] Security headers reviewed
- [ ] CSP reviewed
- [ ] Third-party scripts reviewed
- [ ] Customer data reviewed
- [ ] Media permissions confirmed

---

# 21. Asset QA

Check every production asset:

- [ ] File exists
- [ ] Correct path
- [ ] Correct filename
- [ ] Correct dimensions
- [ ] Appropriate compression
- [ ] Correct crop
- [ ] Correct alt text
- [ ] No accidental duplicates
- [ ] No private files
- [ ] No unused giant assets

Broken images/videos must be treated as release-blocking defects.

---

# 22. Console QA

Production build should have:

- [ ] No uncaught errors
- [ ] No unhandled promise errors
- [ ] No repeated warnings
- [ ] No debug logs containing user data
- [ ] No failed network requests for required assets

Expected optional failures should be handled gracefully.

---

# 23. Routing QA

Test direct navigation to:

```text
/
 /projects
 /projects/project-name
 /services
 /about
 /process
 /contact
```

Verify:

- [ ] Refresh works
- [ ] Browser back works
- [ ] Browser forward works
- [ ] Unknown route shows 404/fallback
- [ ] Deep links work in production hosting
- [ ] Canonical URLs remain correct

---

# 24. Cross-Page QA

Verify consistency:

- [ ] Header
- [ ] Footer
- [ ] Typography
- [ ] Buttons
- [ ] Colors
- [ ] Spacing
- [ ] Page transitions
- [ ] CTA behavior
- [ ] WhatsApp behavior
- [ ] Accessibility
- [ ] SEO metadata

---

# 25. Content QA

Before client review:

- [ ] Company name spelling confirmed
- [ ] Domain spelling confirmed
- [ ] Phone number confirmed
- [ ] WhatsApp number confirmed
- [ ] Email confirmed
- [ ] Address confirmed
- [ ] Service list confirmed
- [ ] Founder names confirmed
- [ ] Project names confirmed
- [ ] Project locations confirmed
- [ ] Project status confirmed
- [ ] Customer testimonials approved
- [ ] Images approved
- [ ] Videos approved
- [ ] Claims verified

No placeholder content should remain unnoticed.

---

# 26. Client Review QA

Provide the client with a review build and ask them to verify:

### Business information

- [ ] Name
- [ ] Address
- [ ] Phone
- [ ] WhatsApp
- [ ] Email
- [ ] Services

### Projects

- [ ] Names
- [ ] Locations
- [ ] Images
- [ ] Descriptions
- [ ] Status
- [ ] Project attribution

### People

- [ ] Founder names
- [ ] Founder photographs
- [ ] Founder biographies

### Testimonials

- [ ] Customer names
- [ ] Quotes
- [ ] Videos
- [ ] Permissions

### Brand

- [ ] Logo
- [ ] Colors
- [ ] Typography
- [ ] Overall visual direction

---

# 27. Production Deployment QA

Before deployment:

- [ ] Production build succeeds
- [ ] Environment variables reviewed
- [ ] Domain confirmed
- [ ] HTTPS confirmed
- [ ] Hosting configuration confirmed
- [ ] SPA routing/fallback confirmed if required
- [ ] Sitemap generated
- [ ] Robots.txt deployed
- [ ] Canonicals verified
- [ ] Forms configured
- [ ] WhatsApp configured
- [ ] Analytics configured only if approved
- [ ] Security headers configured
- [ ] Error handling verified

---

# 28. Post-Deployment Smoke Test

Immediately after deployment:

1. Open homepage.
2. Test navigation.
3. Test hero media.
4. Test project pages.
5. Test services.
6. Test about/founders.
7. Test process.
8. Test contact.
9. Test WhatsApp.
10. Submit a controlled test enquiry if appropriate.
11. Check mobile.
12. Check browser console.
13. Check network failures.
14. Check HTTPS.
15. Check sitemap.
16. Check robots.txt.
17. Check Search Console property/indexing setup.

---

# 29. Release Severity

## P0 — Release blocker

Examples:

- Site does not load
- Navigation broken
- Contact form unusable
- Critical content missing
- Security vulnerability
- Major mobile failure
- Broken production routing

## P1 — Must fix before launch

Examples:

- Major visual defect
- Broken project page
- Severe animation bug
- Significant performance regression
- Accessibility blocker
- Important SEO issue

## P2 — Fix soon

Examples:

- Minor spacing issue
- Minor animation timing
- Non-critical visual inconsistency

## P3 — Future improvement

Examples:

- Optional enhancement
- Small polish item
- Future interaction idea

Do not delay a production release indefinitely for P3 items.

---

# 30. Final Release Gate

The website is ready for production only when:

- [ ] P0 issues = 0
- [ ] P1 issues = 0
- [ ] Major client content approved
- [ ] Performance reviewed
- [ ] Security reviewed
- [ ] SEO reviewed
- [ ] Accessibility reviewed
- [ ] Mobile reviewed
- [ ] Production build verified
- [ ] Deployment smoke test passed

---

# 31. QA Evidence

For important releases, retain:

- Production build result
- Test result summary
- Lighthouse/performance results
- Browser/device notes
- Known limitations
- Client approval
- Git commit/release reference

This creates a traceable release history.

---

# 32. QA Non-Negotiables

1. Never claim a test passed without running it.
2. Never approve only from a desktop screenshot.
3. Always test mobile.
4. Always test production builds.
5. Always test reduced motion.
6. Always test rapid scrolling for cinematic sections.
7. Always verify real business content.
8. Never ship broken assets.
9. Never ignore security issues because the site is mostly frontend.
10. Never sacrifice accessibility for animation.
11. Never sacrifice performance for decoration.
12. Never deploy without a final smoke test.
13. Keep release blockers at zero.
14. Document known limitations rather than hiding them.

---

# 33. Documentation Complete

After this document, create:

```text
CLAUDE.md
```

`CLAUDE.md` will become the operational instruction file for Claude Code.

It will tell Claude:

- What this project is
- What it must never invent
- How to inspect the repository
- How to use the documentation
- How to structure code
- How to use Motion/GSAP/Three.js
- Performance rules
- SEO rules
- Security rules
- Testing rules
- Git rules
- When to stop and ask for clarification
- How to work incrementally instead of rewriting the project

Once `CLAUDE.md` is complete, the documentation phase is finished and we can move into actual project initialization.
