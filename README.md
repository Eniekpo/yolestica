# Yoletech

A Next.js App Router marketing website, PostgreSQL-backed client portal and owner administration area for **yoletech.work**.

## Run locally

Requirements: Node.js 22.12+ (tested with Node 24), npm and PostgreSQL. The lockfile pins the installed versions.

```sh
npm ci
cp .env.example .env
# Set DATABASE_URL, DIRECT_URL and APP_URL in .env.
npm run db:generate
npm run db:migrate
npm run db:seed
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). `db:seed` adds an **unpublished** editorial draft; the public blog starts empty. Production builds use `npm run build` followed by `npm start`.

For this workspace, an isolated local PostgreSQL cluster was initialized in `.local/postgres`, listening only on `127.0.0.1:55432`. This ignored directory contains development data and is not a deployment artifact. To restart it:

```sh
pg_ctl -D .local/postgres -l .local/postgres.log -o '-p 55432 -h 127.0.0.1 -k /private/tmp' start
```

The local cluster uses trust authentication solely for development and must never be exposed publicly. Production must use database credentials and TLS according to the provider's instructions.

## Configuration

- `DATABASE_URL`: Runtime PostgreSQL URL; use your provider's pooled URL for Vercel.
- `DIRECT_URL`: Direct PostgreSQL URL for Prisma migrations.
- `APP_URL`: Exact trusted public origin, e.g. `https://yoletech.work`. Used for origin validation and reset links.
- `RESEND_API_KEY`: Server-only transactional email credential.
- `EMAIL_FROM`: Verified sender, e.g. `Yoletech <yoletech@yolestica.com>`.
- `EMAIL_TEST_MODE`: `true` only for local reset-email capture. Must be `false` on deployment.

Local email capture writes reset messages under ignored `.local/mail/`. It requires a localhost APP_URL and is disabled on Vercel. No reset tokens are returned by the public API. Real email delivery requires a configured provider and verified sender.

## Client accounts and administration

Clients register at `/signup`, sign in at `/login`, then manage their own profile and requests under `/dashboard`. Registration always creates a CLIENT account. Passwords use Argon2id. Sessions are opaque random tokens stored only as SHA-256 hashes in PostgreSQL, with HttpOnly, SameSite=Lax and production Secure cookies. Sessions expire after seven days and are revoked on logout or password reset.

Create the owner's account through the normal signup form, then promote it with:

```sh
npm run admin:promote -- owner@example.com
```

The owner can use `/admin` to search clients and inspect submitted requests. `/admin/inquiries` includes both guest leads and registered client requests, with statuses and private admin notes. Client pages never receive admin notes. A guest inquiry is not automatically claimed by an account that happens to use the same email.

Rate limits persist in PostgreSQL. On Vercel, IP buckets use the platform-provided `x-vercel-forwarded-for`; on local/unsupported hosts an intentionally conservative shared bucket is used. Add a trusted proxy-specific IP adapter before using a different public hosting platform. Email-specific buckets apply independently. The code never trusts a submitted account ID or role.

Run expired-session/token/rate-limit cleanup daily from a trusted scheduled job:

```sh
npm run db:cleanup
```

This command does not delete customer inquiries or accounts. Set an owner-approved data retention policy before launch.

## Content editing

- The ordered service catalog is `src/content/services.ts` and drives service names, stable anchors, dropdowns, cards and categories.
- Marketing copy lives in the corresponding `src/app/*/page.tsx` files.
- Global color tokens and responsive styles live in `src/app/globals.css`.
- Eight original SVG illustrations are in `public/illustrations/services/`. Their source generator is `scripts/create-illustrations.py`.
- Blog posts are database records. Use `npx prisma studio` locally through a trusted database connection. Never expose Prisma Studio publicly. Review the draft, choose one of the service keys or `TECH_TIPS`, set a unique lowercase hyphenated slug, then set `status=PUBLISHED` and a non-future `publishedAt` to publish.
- Markdown is rendered without raw HTML. For an article hero, use a local `/images/blog/...` path or a trusted HTTPS image URL, and provide descriptive `heroAlt`. Remote images are served directly rather than proxied. The default artwork is decorative and has empty alternative text.
- The site contains no fabricated testimonials, client counts, commercial prices or performance claims.

## Verification

```sh
npm run lint
npm run typecheck
npm run contrast
npm run build
```

Browser tests use a **separate database named `yoletech_test`**; the test suite refuses another database name and creates/removes its own test accounts and article fixture. It clears test rate-limit buckets. Do not point the server or test process at live data.

```sh
# Create yoletech_test in your local PostgreSQL instance first.
DATABASE_URL='postgresql://USER@HOST:PORT/yoletech_test' \
DIRECT_URL='postgresql://USER@HOST:PORT/yoletech_test' npm run db:migrate

# Terminal 1: use the same test database for the server.
DATABASE_URL='postgresql://USER@HOST:PORT/yoletech_test' \
DIRECT_URL='postgresql://USER@HOST:PORT/yoletech_test' \
APP_URL='http://localhost:3000' EMAIL_TEST_MODE=true npm start

# Terminal 2: Google Chrome is used through Playwright's chrome channel.
DATABASE_URL='postgresql://USER@HOST:PORT/yoletech_test' npm test
```

If Chrome is unavailable, install a Playwright browser and update `playwright.config.ts` to use it. Tests cover public routes, automated accessibility, mobile layouts, carousel behavior, real registration/login, account isolation, profile updates, inquiries, admin tracking, reset tokens, CSRF, rate limits and expiry. Screenshots are saved in `artifacts/screenshots/`; the report describes actual results and any limitations. Local email capture verifies the reset flow, not external inbox delivery.

## Vercel deployment

1. Provision PostgreSQL and a verified transactional email sender.
2. Import the repository into Vercel with the Next.js preset and a supported Node version.
3. Set all server environment variables. Set `APP_URL=https://yoletech.work` and `EMAIL_TEST_MODE=false`; keep credentials out of source control. Preview environments require their own exact APP_URL and isolated database.
4. Apply migrations with `npm run db:migrate` in a trusted deployment/CI step. The build command generates Prisma Client but deliberately does not mutate the production database.
5. Run `npm run build`, deploy, and configure domain/DNS and HTTPS.
6. Register and promote the real owner account; verify password reset delivery, the contact form and admin authorization on the deployed origin.
7. Schedule `npm run db:cleanup` in trusted infrastructure with the required database credentials.

The site uses serverless-compatible route handlers and does not require a custom server. Canonical URLs and Open Graph URLs point to yoletech.work; private routes are noindex and excluded from the sitemap.

## Owner launch checklist

- [ ] Personalize and approve the brand story, mission and service boundaries.
- [ ] Confirm contact email, social links and response-time expectations.
- [ ] Supply approved photos/logo if preferred over the original illustrations.
- [ ] Approve final prices/currency or keep Custom Quote.
- [ ] Finalize payment, revision, delivery and support terms.
- [ ] Provide final privacy/terms and data retention policy.
- [ ] Supply genuine testimonials if you want to add social proof.
- [ ] Review and publish real blog content and image rights.
- [ ] Configure production PostgreSQL, email and the owner account.
- [ ] Verify live delivery, backups and deployment monitoring.

## Implementation references

Next.js setup follows the [official installation documentation](https://nextjs.org/docs/app/getting-started/installation). Database configuration uses the [Prisma 6 PostgreSQL documentation](https://www.prisma.io/docs/v6/prisma-orm/quickstart/postgresql). A patched `deepmerge-ts` override addresses the dependency's [published recursion vulnerability](https://github.com/advisories/GHSA-ggr8-5vv4-36mx); Prisma generation, migrations and production build are verified with the override.

The IP handling follows [Vercel's request-header contract](https://vercel.com/docs/headers/request-headers). Public article routes resolve before streaming so missing articles return HTTP 404; the dashboard retains a loading boundary. See [Next.js status-code guidance](https://nextjs.org/docs/app/api-reference/file-conventions/loading#status-codes).
