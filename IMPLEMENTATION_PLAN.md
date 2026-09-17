# Yoletech website — implementation plan for approval

Status: awaiting explicit approval. This document is the planning artifact; no application code has been written.

## 1. Outcome and stack

Build a responsive marketing website at `https://yoletech.work`, a client portal, and an owner-only administration area. Use Next.js App Router with TypeScript, Tailwind CSS, lucide-react, Next.js route handlers, PostgreSQL, and Prisma. Deploy using Vercel-compatible patterns.

Use custom database-backed authentication with cryptographically random session tokens, stored as hashes in PostgreSQL, and Argon2id password hashing. Production sessions use Secure, HttpOnly, SameSite=Lax cookies with expiration and server-side revocation. This is a proposed implementation of the brief's secure-cookie authentication option; no JWT refresh infrastructure is needed. Local HTTP development uses a development-only cookie configuration.

Email password resets require a transactional email provider. Proposed integration: Resend through a server-only adapter, configured with environment variables and a verified sending domain. Persistent database rate limits avoid relying on memory in Vercel functions. Confirm supported package versions and deployment requirements during implementation before installing dependencies.

## 2. Site map and page content

| Route | Audience | Content and behavior |
| --- | --- | --- |
| `/` | Public | Eight-slide service hero; value proposition; eight service cards; four evidence-based trust points; Discover → Plan → Build → Support; latest three published posts or an empty state; closing project CTA. |
| `/about` | Public | Clearly marked draft founder story and mission; skills/tools grid including React, Python, Django, SQL, Power BI, Tableau and AI tools; expanded process; contact CTA. |
| `/services` | Public | All eight services in their required order, each with a stable anchor, icon or illustration, outcome-led description, inclusions and contact CTA with preselected service. |
| `/pricing` | Public | Starter, Professional and Enterprise with Custom Quote pricing; Professional highlighted as Most Popular; custom work/retainers card; six accessible FAQ items with draft terms clearly identified. |
| `/contact` | Public | Name, email, phone, service and message; server validation; persistence; signed-in account association; semantic feedback; WhatsApp, socials and clearly provisional response-time copy. |
| `/blog` | Public | Published article grid, category filter and friendly empty state. Categories: the eight services, in order, followed by Tech Tips. |
| `/blog/[slug]` | Public | Published post title, image, author, date, category, formatted body and related posts; unknown/unpublished slugs return 404. |
| `/signup` | Guests | Name, email, password, confirmation, optional company/phone; links to login and terms. |
| `/login` | Guests | Email/password login and reset link; safe local return URL. |
| `/forgot-password` | Public | Email reset request with the same response whether an account exists or not. |
| `/reset-password?token=…` | Public | Expiring single-use reset token, password confirmation, session revocation and login link. |
| `/dashboard` | Client | Summary and own inquiry history, including status and empty state. |
| `/dashboard/profile` | Client | Edit name, company and phone; display account email as read-only for initial release. |
| `/dashboard/requests/new` | Client | New request form using the authenticated identity. |
| `/admin` | Admin | Registered client table with name, email, sign-up date, pagination and search; overview counts from real data only. |
| `/admin/clients/[id]` | Admin | Client details and submitted requests. |
| `/admin/inquiries` | Admin | Both guest leads and client requests; filter/search; status tracking and private follow-up notes. |
| `/privacy`, `/terms` | Public | Clearly marked draft/stub legal pages awaiting owner-approved copy. |
| `/sitemap.xml`, `/robots.txt` | Crawlers | Public indexable routes and published blog posts; exclude account/admin routes. |

Shared navigation: sticky dark wordmark bar; Home, About, Services, Pricing, Blog, Contact. Under 768px, an accessible mobile menu supports Escape, clear expanded state and sensible focus behavior.

Shared footer: four columns containing mission, six quick links, all eight service anchors, and contact/social links. WhatsApp: `https://wa.me/2348025526389`; email: `yoletech@yolestica.com`. Social destinations exactly match the brief: LinkedIn `/in/yolestica`, X `/yolestica`, Facebook `/Yoletech`, Instagram `/Yoletech12`, TikTok `/@yoletech`, YouTube `/@yole-tech`. Compute the copyright year dynamically. Include Privacy and Terms links.

## 3. Canonical service catalog and hero copy

One shared catalog supplies every ordered list, anchor, dropdown, category mapping and CTA.

| # | Exact service name | Anchor | Hero benefit caption |
| --- | --- | --- | --- |
| 1 | Full-Stack Web Development | `full-stack-web-development` | Turn your business idea into a fast, usable website with the systems behind it built to work together. |
| 2 | Data Analysis & Insights | `data-analysis-insights` | Turn scattered data into clear reports that help you decide what to do next. |
| 3 | Frontend & Backend Development Tutorials | `frontend-backend-development-tutorials` | Build practical development skills through guided lessons and projects you can explain and extend. |
| 4 | AI Automation Solutions | `ai-automation-solutions` | Reduce repetitive work with AI-assisted workflows designed around your team's everyday tasks. |
| 5 | Customer Support Solutions | `customer-support-solutions` | Make it easier to manage customer questions and give consistent, useful responses. |
| 6 | IT Support | `it-support` | Resolve technical obstacles and keep the tools you depend on working reliably. |
| 7 | AI-Powered Content Creation | `ai-powered-content-creation` | Turn your expertise into clear, useful content with AI-assisted production and human review. |
| 8 | AI-Powered Graphic Design | `ai-powered-graphic-design` | Communicate your ideas with coherent visual assets shaped around your brand and message. |

Service names remain exact headings where required; surrounding captions and section headlines communicate benefits. Detail sections will each contain 2–4 substantive sentences plus practical inclusions, without invented results or claims.

## 4. Visual system and components

Use only the supplied color tokens, exposed centrally as semantic Tailwind/CSS tokens. Use Sora for headings and Inter for body text through Next.js font optimization. Page backgrounds stay white; pale backgrounds alternate in sections/cards. Nav and footer use `#17211B`, footer subpanels `#303B34`, and CTA bands `#135026` or `#018069`. Primary buttons have white text on brand teal and rounded-lg corners. Cards use rounded-xl corners and subtle shadows.

Before UI implementation, calculate every intended foreground/background contrast pairing. White text must not be retained on the lime hover state: use the existing dark heading token. Orange Popular badges use dark text if verified compliant. Semantic feedback includes readable text and an icon, never color alone. The muted footer token is used only where its measured contrast passes. Verify focus indicators and meaningful control boundaries at 3:1, normal text at 4.5:1 and large text at 3:1. No extra shades will be introduced to repair contrast.

Create eight original SVG service illustrations in a consistent technical illustration style using only approved palette tokens. Reuse this visual language for service cards and article fallbacks; use lucide-react for interface icons. No gray placeholders, stock testimonials or fabricated metrics. Decorative visuals have empty alt text or are hidden from assistive technology; meaningful article images require descriptive alt text.

Component inventory:

- Layout: SiteHeader, DesktopNavigation, MobileNavigation, SiteFooter, SocialLinks, WhatsAppLink, Container, SectionHeading, Breadcrumbs, SkipLink.
- UI: Button, Card, Badge, FormField, Input, Textarea, Select, Alert, EmptyState, LoadingState, Pagination, AccessibleAccordion.
- Marketing: ServiceHeroCarousel, ServiceIllustration, ServiceCard, ServiceDetail, TrustPoints, ProcessSteps, PricingCard, PricingFAQ, ClosingCTA.
- Blog: BlogFilters, PostCard, PostBody, RelatedPosts.
- Forms/auth: ContactForm, SignupForm, LoginForm, ForgotPasswordForm, ResetPasswordForm, ProfileForm, ClientRequestForm, LogoutButton.
- Portal/admin: PortalNavigation, InquiryList, InquiryStatusBadge, ClientTable, AdminInquiryTable, InquiryFollowUpForm.

Carousel: eight slides in catalog order; 5.5-second interval; explicit pause/play; pause on hover/focus; no automatic rotation when reduced motion is requested; previous/next buttons, labeled dot controls and touch swiping. Inactive slide links are not focusable. Manual changes are announced without repeatedly interrupting screen readers during autoplay. Keep hero dimensions stable to prevent layout shift.

## 5. Proposed folder and file structure

```text
yolestica/
├── IMPLEMENTATION_PLAN.md
├── README.md
├── .env.example
├── .gitignore
├── package.json
├── next.config.ts
├── tsconfig.json
├── eslint.config.mjs
├── postcss.config.mjs
├── playwright.config.ts
├── prisma/
│   ├── schema.prisma
│   ├── migrations/
│   └── seed.ts
├── public/
│   ├── illustrations/services/   # eight original SVG illustrations
│   └── images/blog/             # article fallback artwork
├── scripts/
│   ├── promote-admin.ts
│   └── check-contrast.ts
├── src/
│   ├── app/
│   │   ├── layout.tsx
│   │   ├── globals.css
│   │   ├── not-found.tsx
│   │   ├── error.tsx
│   │   ├── robots.ts
│   │   ├── sitemap.ts
│   │   ├── opengraph-image.tsx
│   │   ├── (marketing)/
│   │   │   ├── layout.tsx
│   │   │   ├── page.tsx
│   │   │   ├── about/page.tsx
│   │   │   ├── services/page.tsx
│   │   │   ├── pricing/page.tsx
│   │   │   ├── contact/page.tsx
│   │   │   ├── blog/page.tsx
│   │   │   ├── blog/[slug]/page.tsx
│   │   │   ├── privacy/page.tsx
│   │   │   └── terms/page.tsx
│   │   ├── (auth)/{signup,login,forgot-password,reset-password}/page.tsx
│   │   ├── dashboard/
│   │   │   ├── layout.tsx
│   │   │   ├── page.tsx
│   │   │   ├── profile/page.tsx
│   │   │   └── requests/new/page.tsx
│   │   ├── admin/
│   │   │   ├── layout.tsx
│   │   │   ├── page.tsx
│   │   │   ├── clients/[id]/page.tsx
│   │   │   └── inquiries/page.tsx
│   │   └── api/
│   │       ├── auth/{signup,login,logout,forgot-password,reset-password}/route.ts
│   │       ├── inquiries/route.ts
│   │       ├── profile/route.ts
│   │       └── admin/inquiries/[id]/route.ts
│   ├── components/{layout,ui,marketing,blog,forms,portal,admin}/
│   ├── content/{services,pricing,site}.ts
│   └── lib/
│       ├── db.ts
│       ├── auth.ts
│       ├── authorization.ts
│       ├── validation.ts
│       ├── rate-limit.ts
│       ├── csrf.ts
│       ├── email.ts
│       ├── seo.ts
│       └── blog.ts
├── tests/
│   ├── integration/             # auth, ownership, validation, reset, rate limits
│   └── e2e/                     # public routes, carousel, accounts and admin
└── artifacts/
    ├── screenshots/
    └── verification-report.md
```

Brace notation above abbreviates separate folders/files. Route-specific loading and error boundaries will be added where database operations need them.

## 6. Database schema

All IDs are generated UUIDs; timestamps are timezone-aware. Use migrations, explicit indexes and a pooled runtime database connection appropriate for Vercel.

| Model | Fields and constraints |
| --- | --- |
| User | `id`, `name`, `email` (normalized, unique), `passwordHash`, `company?`, `phone?`, `role` (CLIENT default / ADMIN), `createdAt`, `updatedAt`. |
| Session | `id`, `tokenHash` (unique), `userId` (FK User), `expiresAt`, `createdAt`. Index userId and expiresAt; cascade on user deletion. |
| PasswordResetToken | `id`, `tokenHash` (unique), `userId` (FK User), `expiresAt`, `usedAt?`, `createdAt`. Index userId and expiresAt; cascade on user deletion. |
| Inquiry | `id`, `userId?` (FK User), `name`, `email`, `phone?`, `service` (enum matching catalog), `message`, `status` (NEW / IN_PROGRESS / WAITING_ON_CLIENT / CLOSED), `createdAt`, `updatedAt`. Index userId+createdAt, status+createdAt, email and createdAt. Retain contact snapshots; set userId null on user deletion. |
| InquiryNote | `id`, `inquiryId` (FK Inquiry), `authorId` (FK User), `body`, `createdAt`. Admin-only notes; index inquiryId+createdAt; cascade when inquiry is deleted; restrict deletion of note author. |
| BlogPost | `id`, `slug` (unique), `title`, `excerpt`, `bodyMarkdown`, `category` (eight services plus TECH_TIPS), `heroImage?`, `heroAlt?`, `authorName`, `status` (DRAFT / PUBLISHED), `publishedAt?`, `createdAt`, `updatedAt`. Index status+publishedAt and category. |
| RateLimitBucket | `key` (primary key; hashed request/account identifier plus action), `count`, `windowEndsAt`, `updatedAt`. Atomic increments; index windowEndsAt; documented expired-row cleanup. |

Relationships: User has many Sessions, PasswordResetTokens and Inquiries. Inquiry has many InquiryNotes. A guest inquiry has no userId. A signed-in inquiry is assigned to the server-resolved session user; submitted user IDs are never trusted. Matching a guest email to an account does not grant access to prior guest inquiries.

Blog authoring is initially through a documented seed/import workflow or Prisma Studio operated by the owner. No blog CMS is requested. Production starts with no fabricated published posts; a test-only article fixture verifies the full post template and category filtering.

## 7. Backend and security behavior

- Validate every form on the server with shared schemas: types, lengths, normalized emails, allowed service/status enums and trimmed plain text. Never render inquiry text as HTML. Render article Markdown without raw HTML execution.
- Hash passwords using Argon2id; do not trim or transform passwords. Confirm passwords server-side, enforce a documented minimum length and cap request sizes.
- Generate session tokens with a secure random source; keep only token hashes in the database. Check expiry and role on every protected read or mutation. Logout revokes the session and clears its cookie.
- Use generic login and reset errors, persistent rate limits for login/signup/reset/contact, and atomic database updates to prevent concurrent limit bypasses. Do not log credentials, cookies or reset tokens.
- Check same-origin/CSRF protections on cookie-authenticated mutations; use POST for logout; validate redirect targets. Keep database and email credentials server-only.
- Reset tokens expire, are single-use and are consumed transactionally; password changes revoke existing sessions. Reset email links use the configured canonical base URL, not the inbound Host header.
- Registration always assigns CLIENT. Promote the owner's existing account with a documented one-off server CLI command; never expose a public admin assignment endpoint or ship default passwords.
- Return consistent form success/error states without reporting success when a database/email operation failed. Use accessible field errors and status announcements.
- Use separate safe projections for client responses: password hashes, tokens and private admin notes are never exposed. Admin status/note mutations check authorization independently of page layouts.

## 8. SEO, responsiveness and performance

Unique titles/descriptions and canonical URLs for public pages; Open Graph metadata and a branded share image; published posts included in sitemap; noindex account/admin pages. Do not put session-dependent data into shared public caches. Category selection uses shareable URL query parameters.

Verify mobile, tablet and desktop layouts, zoom/reflow, keyboard access and adequate touch targets. Use semantic landmarks, heading order, labels, error associations and visible focus styles. Optimize images with fixed dimensions; lazy-load below-fold media, prioritize only the visible hero, and avoid unnecessary client components. Target 90+ Lighthouse performance and SEO in a production build; report actual results and environment constraints rather than promise an unmeasured score.

## 9. Phased build order after approval

1. **Foundation and design:** scaffold the stack, configure tokens/fonts, verify contrast, create catalog and original illustrations, implement shared navigation/footer and base accessible controls.
2. **Marketing website:** implement Home carousel and sections, About, Services, Pricing, Contact UI and legal stubs; verify responsive navigation and service links.
3. **Database, inquiries and blog:** add Prisma migrations, PostgreSQL integration, validated contact persistence, post queries/templates/filtering and honest empty states.
4. **Client accounts:** implement registration, login/logout, email password reset, persistent rate limits, protected dashboard, profile editing and account-owned requests.
5. **Owner administration:** implement role enforcement, registered-client tracking, all-inquiry tracking, private follow-up notes and admin bootstrap command.
6. **Verification and handoff:** exercise public and authenticated journeys with the running production build, capture screenshots, run security/accessibility checks and Lighthouse, and document setup/deployment and outstanding owner content.

Approval covers this phased build. No additional per-phase approval is proposed. Publishing a live deployment is a separate action; the build will be made deployable and reviewable locally first.

## 10. Verification and acceptance

- Run lint, TypeScript checks, production build and meaningful integration tests against a separate test PostgreSQL database.
- Visit every route, including a test article, legal stubs and appropriate authenticated/admin states; verify 404s and loading/error/empty states.
- Exercise signup → login → dashboard → profile update → request creation → logout, then confirm a second client cannot read or change the first client's data.
- Exercise guest contact and signed-in contact, service preselection, invalid fields and database failure handling.
- Verify reset email generation/delivery through the configured provider or local test mail capture; test expired/used tokens and revoked sessions. Clearly distinguish local email tests from verified production delivery.
- Verify anonymous and non-admin denial of admin pages/endpoints; verify the owner sees registered clients and guest leads, changes status and adds private notes.
- Check login throttling, CSRF denial, session expiration, duplicate registration, authorization bypass attempts and malicious text rendering.
- Verify carousel order, timing, manual controls, swipe, pause/play, hover/focus pause, reduced motion and screen-reader labeling.
- Run automated accessibility checks and token contrast calculations, plus manual keyboard/reflow checks. Capture screenshots for every page, including desktop and mobile Home and client/admin states; save artifacts and a verification report.
- Run Lighthouse against a production build for Home and representative content pages. Fix actionable failures and report measured scores.

Local PostgreSQL, browser automation and email capabilities will be inspected after approval. If an external credential or runtime dependency is unavailable, document the exact limitation and continue all independent implementation and verification; do not substitute mock persistence or claim untested flows passed.

## 11. Owner inputs and assumptions

Approval may accept these defaults without supplying final content immediately:

- Sora + Inter; original palette-based SVG illustrations; Custom Quote prices; Professional as the recommended tier.
- Draft About narrative, FAQs, legal text, response-time note and `yoletech@yolestica.com` visibly identified for review. No invented client statistics or testimonials.
- Admin tracking includes inquiry statuses and private notes; live chat, payments, file uploads, email changes and a blog editing CMS are outside the requested initial scope.

Before public launch, supply or confirm:

- Final founder/brand copy, real service boundaries, skills and support/response commitments.
- Approved logo/photos if desired; rights-cleared article images and article content; genuine testimonials only if available.
- Final prices/currency or approval to keep Custom Quote; payment, revision and delivery terms.
- Privacy and terms copy, data retention expectations, working contact email and social URLs.
- PostgreSQL connection credentials, transactional email credentials/verified sending domain, and the email of the account to promote to admin.
- Vercel project access and domain/DNS configuration when deployment is requested.

## Approval requested

Approve this plan to begin implementation, or identify changes to the proposed structure, authentication choice, email provider or scope. The attached brief explicitly requires this approval before code is written.
