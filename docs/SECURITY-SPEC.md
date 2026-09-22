# VISAKRAM BUILDERS — SECURITY SPECIFICATION
## Version 0.1 — Security Foundation

> This document defines the security requirements for the Visakram Builders website.
> The site is primarily a frontend application, so security focuses on safe input handling, dependency hygiene, browser protections, third-party integrations, secrets management, and resilient production behavior.

---

# 1. Security North Star

The website should be:

- Safe for visitors
- Safe for administrators/developers
- Resistant to common web attacks
- Conservative with third-party dependencies
- Free of exposed secrets
- Safe to deploy on the chosen GoDaddy hosting environment

### Core principle

**Minimize attack surface.**

The project does not require a custom backend or database, so do not create backend infrastructure merely to solve problems that can be handled safely with an appropriate hosted form/contact solution.

---

# 2. Security Scope

Security applies to:

- React application
- Contact form
- WhatsApp integration
- External form/email service
- Third-party scripts
- Images/video/3D assets
- Dependencies
- Build pipeline
- Hosting configuration
- Domain/HTTPS configuration
- Source repository
- Environment variables

---

# 3. OWASP-Oriented Threat Areas

The project should review common web risks including:

- Broken access control
- Injection
- Cross-site scripting (XSS)
- Security misconfiguration
- Vulnerable/outdated dependencies
- Identification/authentication weaknesses where applicable
- Software/data integrity failures
- Logging/monitoring weaknesses
- Server-side request risks where applicable
- Unsafe third-party integrations

The exact applicability of each category should be evaluated against the final architecture rather than adding unnecessary systems.

---

# 4. No Secrets in Frontend Code

Never place secrets in:

```text
src/
public/
HTML
CSS
client-side JavaScript
Git repository
```

Never hardcode:

- API secret keys
- Private access tokens
- SMTP passwords
- Service credentials
- Hosting passwords
- GitHub tokens
- Private signing keys

Important:

With Vite, variables beginning with:

```text
VITE_
```

are exposed to client-side code.

Therefore:

**A `VITE_*` variable is not a secret.**

Only public configuration may use client-exposed variables.

---

# 5. Environment Variables

Use:

```text
.env
.env.local
.env.example
```

`.env` and local secret files must be excluded from Git.

Example:

```text
.env
.env.local
.env.*.local
```

Keep `.env.example` free of real secrets.

Example:

```text
VITE_PUBLIC_FORM_ENDPOINT=
VITE_PUBLIC_WHATSAPP_NUMBER=
```

Only values intended to be public may be exposed this way.

---

# 6. Contact Form Security

The contact form is a primary attack surface.

Validate:

- Name
- Phone
- WhatsApp
- Project type
- Location
- Approximate requirement
- Message

Validation should occur before submission.

## Client-side validation

Use it for:

- Required fields
- Reasonable length limits
- Basic format validation
- User feedback

## Server/provider-side validation

The external form service must perform authoritative validation where supported.

Never trust client-side validation alone.

---

# 7. Input Length Limits

Use reasonable limits.

Example starting limits:

```text
Name:             100 characters
Phone:             30 characters
WhatsApp:          30 characters
Project type:     100 characters
Location:         150 characters
Requirement:      500 characters
Message:         3000 characters
```

These are starting values and can be adjusted based on the selected form provider.

The purpose is to prevent accidental or abusive oversized submissions.

---

# 8. XSS Prevention

Do not inject user-controlled content into HTML.

Avoid:

```text
dangerouslySetInnerHTML
```

unless there is a documented, reviewed reason.

If HTML rendering becomes necessary:

1. Sanitize the content.
2. Restrict allowed tags/attributes.
3. Never trust external HTML blindly.

Prefer normal React text rendering.

---

# 9. URL Handling

Do not construct unsafe URLs directly from uncontrolled user input.

For external links:

- Validate the expected destination
- Use explicit trusted domains where appropriate
- Avoid blindly rendering arbitrary URLs

For project slugs, use controlled internal data rather than arbitrary HTML input.

---

# 10. WhatsApp Security

WhatsApp links should use a controlled, verified business number.

Do not construct links from arbitrary user-provided phone numbers.

The production number must be confirmed by the client.

WhatsApp should open through a properly encoded URL.

Do not expose any private WhatsApp credentials because the website does not need them.

---

# 11. Third-Party Services

Before adding any external service:

Evaluate:

1. What data does it receive?
2. Why does it receive it?
3. Does it require a script?
4. Does it add performance cost?
5. Does it create a security dependency?
6. Does it set cookies?
7. Does it require consent?
8. Can the site work if it fails?

Examples may include:

- Form provider
- Analytics
- Video hosting
- Maps
- Fonts
- Social embeds

Prefer the smallest set of external services necessary.

---

# 12. Third-Party Script Policy

Do not add third-party scripts casually.

Every script should have:

- A documented purpose
- A trusted source
- A known owner
- A reason it cannot be implemented more simply
- Performance/security consideration

Remove unused third-party scripts.

Avoid copy-pasting unknown scripts from random websites.

---

# 13. Content Security Policy

A Content Security Policy should be considered for production.

Potential directives include:

```text
default-src
script-src
style-src
img-src
font-src
media-src
connect-src
frame-src
object-src
base-uri
form-action
```

The final policy must be generated from the actual production architecture.

Do not blindly deploy a restrictive CSP that breaks:

- Fonts
- Videos
- Forms
- Analytics
- 3D assets
- Required external connections

Start with reporting/testing where practical, then tighten.

---

# 14. Security Headers

Production should evaluate appropriate security headers, including:

```text
Strict-Transport-Security
Content-Security-Policy
X-Content-Type-Options
Referrer-Policy
Permissions-Policy
```

Other headers should be added when relevant to the actual hosting environment.

Avoid deprecated or unnecessary headers simply because they appear in old security tutorials.

---

# 15. HTTPS

Production must use HTTPS.

Verify:

- Certificate is valid
- HTTP redirects to HTTPS
- No mixed content
- Assets load through secure URLs
- Form submissions use HTTPS
- Third-party endpoints use HTTPS

Do not launch a production contact form over insecure HTTP.

---

# 16. Dependency Security

Before installing a package:

- Check whether it is necessary
- Check maintenance status
- Check known vulnerabilities
- Check package size
- Check license
- Check dependency tree

Regularly run the package manager's audit tooling.

For npm:

```text
npm audit
```

Do not automatically apply every audit fix without reviewing potential breaking changes.

---

# 17. Lockfile

Commit the package manager lockfile.

For npm:

```text
package-lock.json
```

This improves reproducibility and makes dependency changes more visible.

Do not randomly regenerate the lockfile without understanding resulting dependency changes.

---

# 18. Supply Chain Protection

For production dependencies:

- Prefer established packages
- Avoid abandoned packages
- Avoid unnecessary packages
- Review install scripts when appropriate
- Keep versions controlled
- Review dependency updates

A small dependency footprint is a security advantage.

---

# 19. Git Security

Never commit:

```text
.env
private keys
passwords
tokens
credentials
client confidential documents
unreleased private customer data
```

Use `.gitignore`.

Before pushing:

```text
git status
```

and review changed files.

Before major public releases, scan the repository for accidentally committed secrets.

---

# 20. Source Repository Rules

The GitHub repository should contain:

- Application source
- Public-safe assets
- Documentation
- Configuration templates

It should not contain:

- Private client credentials
- Private customer records
- Passwords
- API secrets
- Confidential contracts
- Internal documents that were not approved for repository access

---

# 21. Customer Data

Customer/project information should be treated conservatively.

Before publishing:

- Confirm the information
- Confirm permission where required
- Confirm image/video usage rights
- Confirm testimonial permission
- Avoid unnecessary personal data

Do not publish:

- Personal phone numbers
- Private addresses
- Private documents
- Sensitive customer information

unless there is a legitimate, confirmed reason and permission.

---

# 22. Project Images & Videos

Only use media that Visakram is authorized to publish.

Maintain a simple internal record where practical:

```text
Asset
Source
Project
Permission status
Usage restriction
```

Do not upload confidential construction documents or private customer material to the public `public/` directory.

---

# 23. 3D Assets

3D models should be treated as public assets if delivered to the browser.

Therefore:

- Do not put secrets inside models
- Do not embed private information
- Do not assume GLB/GLTF files are confidential
- Optimize and clean model metadata where appropriate

If an asset must remain private, it should not be shipped to the browser.

---

# 24. Forms & Spam Protection

The final form provider should support appropriate abuse controls where practical.

Potential measures:

- Rate limiting
- CAPTCHA/Turnstile where justified
- Honeypot fields
- Provider-side spam filtering
- Submission limits

Do not add CAPTCHA automatically if it creates a poor user experience and the provider already offers adequate protection.

Use the lightest effective protection.

---

# 25. Error Handling

Production errors must not expose:

- Stack traces
- Secrets
- Internal paths
- Environment variables
- Provider credentials
- Debug information

Users should see a useful message.

Example:

```text
Something went wrong. Please try again or contact us on WhatsApp.
```

Detailed debugging information belongs in development tooling, not the public UI.

---

# 26. Console Hygiene

Production builds should not contain:

- Debug logs containing personal data
- Tokens
- Credentials
- Internal URLs
- Sensitive form contents

Remove unnecessary `console.log()` statements before production.

---

# 27. File Uploads

The initial project does not require customer file uploads.

Therefore:

**Do not implement file uploads unless a verified business requirement appears.**

Avoid adding an upload system merely because contact forms sometimes have one.

If uploads are later required, they need a separate security design covering:

- File type validation
- Size limits
- Malware scanning
- Storage isolation
- Access control
- Filename handling
- Content-type validation

---

# 28. Analytics

If analytics are added:

- Use a reputable provider
- Collect only necessary information
- Avoid unnecessary personal data
- Document the integration
- Evaluate cookie/consent requirements
- Avoid loading analytics in a way that blocks the page

Analytics must never contain:

- Passwords
- Form messages
- Private customer information
- Authentication tokens

---

# 29. Maps & Embeds

The initial design prefers a lightweight location section rather than a heavy interactive map.

If an external map/embed is eventually used:

- Verify the provider
- Review privacy implications
- Review performance cost
- Load only when needed
- Avoid exposing private API keys

---

# 30. Clickjacking / Framing

Production should evaluate whether the site should permit framing by other websites.

Where appropriate, use CSP `frame-ancestors` or equivalent hosting controls.

Do not block legitimate required embeds without testing.

---

# 31. Permissions Policy

Limit unnecessary browser capabilities.

The final production policy should disable capabilities the site does not need, such as:

- Camera
- Microphone
- Geolocation

unless a legitimate feature requires them.

Do not request browser permissions unnecessarily.

---

# 32. Security & 3D

Three.js does not automatically make the site secure or insecure.

Security concerns are primarily:

- Asset integrity
- Dependency security
- Third-party code
- Resource consumption
- External URLs
- WebGL failure handling

Do not expose private data through the 3D scene.

---

# 33. Security Testing

Before production:

### Static / dependency

- TypeScript checks
- ESLint
- npm audit
- SonarQube
- Dependency review

### Browser

- XSS-oriented form testing
- Invalid input testing
- URL testing
- Navigation testing
- HTTPS/mixed-content testing
- Security-header review

### Production

- Verify no secrets in built files
- Verify source maps strategy
- Verify HTTPS
- Verify redirects
- Verify CSP
- Verify form endpoint security

---

# 34. Security Review Checklist

Before launch:

- [ ] No secrets in source
- [ ] `.env` ignored
- [ ] `.env.example` contains no secrets
- [ ] Lockfile committed
- [ ] Dependencies audited
- [ ] No unnecessary dependencies
- [ ] Form inputs validated
- [ ] Input length limits applied
- [ ] No unsafe HTML rendering
- [ ] External URLs controlled
- [ ] WhatsApp number verified
- [ ] Form provider verified
- [ ] HTTPS enabled
- [ ] No mixed content
- [ ] Security headers reviewed
- [ ] CSP reviewed/tested
- [ ] Permissions Policy reviewed
- [ ] Production console clean
- [ ] Customer data reviewed
- [ ] Project media permissions confirmed
- [ ] No private documents in public assets
- [ ] Error messages do not expose internals

---

# 35. Security Non-Negotiables

1. Never ship secrets.
2. Never trust client-side validation alone.
3. Never render unsanitized user HTML.
4. Never add unnecessary third-party scripts.
5. Never commit private customer information.
6. Never publish unauthorized project media.
7. Never expose private credentials through `VITE_*`.
8. Never implement file uploads without a dedicated security design.
9. Never ignore dependency vulnerabilities without understanding them.
10. Never expose production stack traces.
11. Use HTTPS in production.
12. Keep the attack surface small.
13. Prefer simple architecture.
14. Security controls must not destroy usability without a justified reason.
15. Security must be verified before production deployment.

---

# 36. Next Documents

After this document:

1. `QA-CHECKLIST.md`
2. `CLAUDE.md`

After those are complete, the documentation foundation will be ready for actual implementation.
