# VISAKRAM BUILDERS — SEO SPECIFICATION
## Version 0.1 — Search Foundation

> This document defines the search-engine and discoverability requirements for the Visakram Builders website.
> SEO must work alongside the cinematic visual experience, not be hidden behind it.

---

# 1. SEO North Star

The website should clearly communicate:

- Who Visakram Builders is
- What they build
- Where they operate
- What services they provide
- Which projects they have completed or are working on
- How potential customers can contact them

Primary geographic focus:

- Visakhapatnam
- Vizianagaram
- Andhra Pradesh

Primary business focus:

- Residential construction
- Villa construction
- Apartment construction

---

# 2. SEO Principles

1. Important content must exist as crawlable HTML.
2. Animation must never be the only way to reveal important information.
3. Every indexable page must have a unique purpose.
4. Every indexable page must have a unique title and description.
5. Project information must be based on verified content.
6. Do not keyword-stuff.
7. Local relevance should be natural and evidence-based.
8. Page speed is part of SEO quality.
9. Mobile usability is mandatory.
10. Structured data must represent actual page content.

---

# 3. Search Intent

The site should support users looking for:

### Business discovery

Examples:

- construction company in Visakhapatnam
- builders in Visakhapatnam
- construction company in Vizianagaram

### Service discovery

Examples:

- residential construction Visakhapatnam
- villa construction Visakhapatnam
- apartment construction Visakhapatnam

### Brand discovery

Examples:

- Visakram Builders
- Visakram construction
- Visakram Builders Visakhapatnam

These are target themes, not instructions to repeat phrases unnaturally.

---

# 4. Page Architecture

Initial SEO page map:

| Route | Primary purpose |
|---|---|
| `/` | Brand + construction services + local relevance |
| `/projects` | Project portfolio |
| `/projects/:slug` | Individual project |
| `/services` | Construction services |
| `/about` | Company + founders |
| `/process` | Construction process |
| `/contact` | Project enquiry/contact |

Only create additional indexable pages when there is sufficient unique content.

---

# 5. Title Tag Strategy

Each page must have a unique title.

Initial examples:

### Homepage

```text
Visakram Builders | Construction Company in Visakhapatnam
```

### Projects

```text
Projects | Visakram Builders
```

### Services

```text
Residential, Villa & Apartment Construction | Visakram Builders
```

### About

```text
About Visakram Builders | Visakhapatnam
```

### Process

```text
Our Construction Process | Visakram Builders
```

### Contact

```text
Start a Project | Visakram Builders
```

Project-detail titles should use the verified project name and location.

Final titles should be refined after the complete content and keyword research are available.

---

# 6. Meta Description Strategy

Each indexable page requires a unique description.

Descriptions should:

- Explain the page
- Include the business/service context naturally
- Include geographic relevance where appropriate
- Encourage useful exploration
- Avoid keyword stuffing
- Avoid unsupported claims

Do not create identical descriptions for every page.

---

# 7. Heading Architecture

Each page should have one clear primary heading.

Example homepage:

```text
H1
Primary brand statement
```

Then:

```text
H2
Statement
H2
What We Build
H2
Featured Project
H2
The Visakram Way
H2
How We Build
H2
Founders
H2
Customer Stories
H2
Start a Project
```

Heading levels should represent content hierarchy, not visual font size.

Do not skip levels purely for styling.

---

# 8. Crawlable Content

Important information must remain accessible in HTML.

This includes:

- Company name
- Services
- Locations
- Project names
- Project descriptions
- Founder information
- Process information
- Contact details
- Testimonials where permission exists
- CTA text

Do not place essential content exclusively inside:

- Canvas
- WebGL
- Video
- Images
- Client-only animation states

---

# 9. Project SEO

Every verified project can have its own page.

Recommended structure:

```text
/projects/project-name
```

Each project page should include:

- Project name
- Location
- Category
- Status/year where verified
- Overview
- Scope where verified
- Images
- Video where available
- Relevant testimonial where permitted
- Related projects
- Contact CTA

Do not publish project information until it has been verified.

---

# 10. Project Slugs

Use short, descriptive, lowercase slugs.

Preferred:

```text
/projects/vasudha-enclave
```

Avoid:

```text
/projects/project?id=2938
```

or unnecessarily long slugs.

Do not change a published slug without a redirect strategy.

---

# 11. Image SEO

Every meaningful image should have descriptive alternative text.

Examples:

```text
alt="Completed residential construction project in Visakhapatnam"
```

For decorative images:

```text
alt=""
```

Do not use keyword-stuffed alt text.

Do not describe irrelevant visual details.

Project images should describe the actual verified project where appropriate.

---

# 12. Image Metadata

Where practical:

- Use descriptive filenames
- Use modern formats
- Provide responsive sizes
- Include width/height
- Compress appropriately
- Use meaningful alt text

Preferred:

```text
vasudha-enclave-exterior-visakhapatnam.webp
```

Avoid:

```text
IMG_20260918_001.jpg
```

---

# 13. Internal Linking

Pages should connect logically.

Example:

```text
Home
 ↓
Services
 ↓
Projects
 ↓
Project Detail
 ↓
Contact
```

Project pages should link to:

- Related projects
- Relevant services
- Contact/start-a-project

Services should link to:

- Relevant projects
- Contact

About should link to:

- Projects
- Process
- Contact

Avoid orphan pages.

---

# 14. Canonical URLs

Every indexable page should have a canonical URL.

Example:

```text
https://www.viskaram.com/projects/example-project
```

The exact canonical domain must be confirmed because the current domain information provided for the project should be verified before production.

Do not accidentally expose multiple canonical variants such as:

```text
http://
https://
www.
non-www
```

without an intentional canonical strategy.

---

# 15. Domain Consistency

Before launch, confirm:

- Exact registered domain
- Preferred `www` or non-`www`
- HTTPS
- Redirect behavior
- Canonical domain
- Sitemap domain
- Open Graph URL domain

The brand/company spelling and registered domain should be checked together before final SEO configuration.

---

# 16. Local SEO

The site should naturally establish:

```text
Visakram Builders
Visakhapatnam
Vizianagaram
Andhra Pradesh
```

Relevant location information may appear in:

- Homepage
- About
- Contact
- Footer
- Project pages
- Structured data where appropriate

Do not create thin location pages solely to target keywords unless there is genuinely unique content for each location.

---

# 17. Local Business Information

Maintain one authoritative set of business details:

```text
Business name
Address
Phone
WhatsApp
Email
Website
Service areas
```

These values must remain consistent across:

- Website
- Google Business Profile
- Search Console-related properties
- Social profiles
- Structured data

Do not publish an address or phone number that has not been confirmed.

---

# 18. Structured Data

Where appropriate, implement Schema.org structured data.

Potential types include:

```text
Organization
LocalBusiness
WebSite
BreadcrumbList
ImageObject
```

Project structured data should only be used when the page content genuinely supports the selected schema type.

Do not add structured data simply to create more markup.

Every structured-data property should match visible or otherwise legitimately page-supported information.

---

# 19. Organization / Local Business Schema

Potential information:

```text
name
url
logo
telephone
address
areaServed
sameAs
```

Exact schema type should be finalized based on the actual business information and Google's current supported rich-result guidance.

Do not invent:

- Ratings
- Reviews
- Awards
- Price ranges
- Certifications
- Opening hours

---

# 20. Breadcrumbs

Project and deeper pages should support breadcrumb navigation where useful.

Example:

```text
Home
  /
Projects
  /
Project Name
```

Breadcrumbs should exist as:

- Visible navigation where appropriate
- Structured data where appropriate

---

# 21. Open Graph

Each important page should have social sharing metadata:

```text
og:title
og:description
og:image
og:url
og:type
```

Project pages should ideally use the project's strongest verified image.

Do not use an unrelated stock image as the project's social preview.

---

# 22. Twitter / Social Metadata

Where relevant, provide compatible social-card metadata.

The social preview should remain readable when the page is shared.

---

# 23. Sitemap

Production should expose:

```text
/sitemap.xml
```

Include indexable:

- Homepage
- Main pages
- Published project pages

Do not include:

- Private routes
- Development routes
- Duplicate URLs
- Redirect-only URLs
- Non-indexable utility pages

Update the sitemap when project pages are added or removed.

---

# 24. Robots.txt

Production should expose:

```text
/robots.txt
```

It should:

- Allow appropriate public crawling
- Avoid blocking important assets
- Reference the sitemap
- Avoid accidentally blocking the entire website

Never deploy:

```text
Disallow: /
```

to production unless intentionally required.

---

# 25. Search Console

Before or immediately after launch:

1. Verify the correct website property.
2. Submit the sitemap.
3. Check indexing status.
4. Inspect important URLs.
5. Monitor coverage/indexing issues.
6. Review Core Web Vitals.
7. Review mobile usability where available.

Search Console should be connected only after the production domain is confirmed.

---

# 26. Google Business Profile

The website and Google Business Profile should use consistent:

- Business name
- Phone
- Website
- Address/service area
- Business category where appropriate

The website should provide a clear path for visitors to contact the business.

Do not add fake reviews or manipulate review content.

---

# 27. JavaScript / Animation SEO Rules

The site may use:

- React
- Motion
- GSAP
- Three.js

but search-critical content must still be represented in accessible HTML.

Do not make:

```text
JavaScript animation
```

the only source of:

```text
project name
service name
location
business description
contact information
```

---

# 28. 3D SEO Rules

The 3D experience is enhancement.

Important explanatory text should exist outside the WebGL canvas.

For example:

```text
FROM PLAN TO PLACE
Blueprint → Foundation → Structure → Floors → Facade → Completed Building
```

should remain available as HTML content.

The canvas should visually reinforce the story.

---

# 29. Video SEO Rules

Videos should have:

- Relevant surrounding text
- Descriptive titles where appropriate
- Poster images
- Accessible controls
- Captions/transcripts for meaningful spoken content where applicable

Do not depend on video alone to communicate important business information.

---

# 30. Accessibility + SEO

Semantic accessibility also supports discoverability.

Use:

- Semantic HTML
- Proper headings
- Descriptive links
- Meaningful alt text
- Form labels
- Accessible navigation

Avoid:

```text
Click here
Learn more
View
```

when a more descriptive link is practical.

Prefer:

```text
View residential projects
Explore villa construction
Start a project
```

---

# 31. SEO Content Rules

Copy should be:

- Specific
- Natural
- Useful
- Human
- Fact-based

Avoid repetitive phrases such as:

```text
best construction company in Visakhapatnam
best builders in Visakhapatnam
top builders in Visakhapatnam
```

repeated throughout the page.

Do not make unsupported superlative claims.

---

# 32. Performance + SEO

SEO implementation must respect the performance budget.

Do not add:

- Heavy third-party scripts
- Unnecessary trackers
- Huge web fonts
- Large SEO libraries
- Blocking widgets

without evaluating their cost.

---

# 33. Technical SEO Checklist

Before launch verify:

- [ ] HTTPS works
- [ ] Preferred domain works
- [ ] HTTP redirects to HTTPS
- [ ] www/non-www strategy works
- [ ] Canonicals are correct
- [ ] Titles are unique
- [ ] Meta descriptions are unique
- [ ] H1 exists appropriately
- [ ] Heading hierarchy is logical
- [ ] Images have appropriate alt text
- [ ] Sitemap exists
- [ ] Robots.txt exists
- [ ] Open Graph metadata works
- [ ] Structured data validates
- [ ] Internal links work
- [ ] No important page is orphaned
- [ ] 404 page exists
- [ ] Redirects are intentional
- [ ] Important content is crawlable
- [ ] Mobile layout works
- [ ] Performance targets are tested

---

# 34. SEO Non-Negotiables

1. Do not invent SEO claims.
2. Do not invent reviews or ratings.
3. Do not keyword-stuff.
4. Do not hide important text inside animation.
5. Do not rely on WebGL for essential content.
6. Do not create thin location pages without unique value.
7. Do not publish unverified business details.
8. Keep domain/canonical strategy consistent.
9. Keep project content factual.
10. Performance remains part of SEO.
11. Mobile experience is mandatory.
12. Structured data must match actual content.
13. Search optimization must never compromise accessibility.
14. Search optimization must never compromise the premium visual experience.
15. SEO content must remain useful to humans first.

---

# 35. Next Documents

After this document:

1. `SECURITY-SPEC.md`
2. `QA-CHECKLIST.md`
3. `CLAUDE.md`

After those documents are complete, the documentation foundation will be ready for implementation.
