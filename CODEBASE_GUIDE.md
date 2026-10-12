# FAMZI codebase guide

This guide maps the maintained source files to the parts of the app they own. Each source, configuration, schema, seed, and migration file also starts with a short purpose comment. Files under `node_modules`, `.next`, `app/generated`, `public`, and `uploads` are dependencies, build output, generated client code, static assets, or runtime files; they are not hand-maintained source files.

## App routes

| File | Responsibility |
| --- | --- |
| `app/layout.tsx` | Wraps all customer routes in the global layout, navigation, and cart state provider. |
| `app/page.tsx` | Composes the homepage sections. |
| `app/about/page.tsx` | About FAMZI and the service. |
| `app/services/page.tsx` | Lists catering and event services. |
| `app/contact/page.tsx` | Customer contact information. |
| `app/menu/page.tsx` | Fetches and filters the live menu. |
| `app/cart/page.tsx` | Reviews cart contents and menu updates. |
| `app/checkout/page.tsx` | Collects delivery or pickup details and submits an order. |
| `app/order-confirmation/page.tsx` | Shows the order reference after successful checkout. |
| `app/globals.css` | Global styles, shared tokens, and homepage animation rules. |
| `app/admin/layout.tsx` | Checks the signed session before rendering any admin page. |
| `app/admin/page.tsx` | Staff dashboard. |
| `app/admin/orders/page.tsx` | Staff order list. |
| `app/admin/orders/[id]/page.tsx` | Staff view and updates for one order. |
| `app/admin/menu/page.tsx` | Menu item editing, image upload, and availability controls. |
| `app/admin/meal-requests/page.tsx` | Staff inbox for customer meal requests. |
| `app/admin/reports/page.tsx` | Order and payment reporting. |
| `app/admin-login/page.tsx` | Admin email and password sign-in. |
| `app/admin-setup/page.tsx` | One-time setup for the first admin account. |
| `app/admin-verify-email/page.tsx` | Confirms an email verification token. |
| `app/admin-resend-verification/page.tsx` | Requests another verification link. |
| `app/admin-forgot-password/page.tsx` | Requests a password reset link. |
| `app/admin-reset-password/page.tsx` | Sets a new password using a reset token. |

## API routes

| File | Responsibility |
| --- | --- |
| `app/api/menu/route.ts` | Public menu response and category normalization. |
| `app/api/menu/images/[filename]/route.ts` | Serves uploaded menu images by validated filename. |
| `app/api/orders/route.ts` | Creates orders using current menu prices; protects staff order reads and updates. |
| `app/api/meal-requests/route.ts` | Accepts public meal requests and protects staff request operations. |
| `app/api/admin/menu/route.ts` | Authenticated menu listing, creation, and editing. |
| `app/api/admin/menu/upload/route.ts` | Authenticated image upload and file validation. |
| `app/api/admin-session/route.ts` | Creates or clears the signed admin session cookie. |
| `app/api/admin-accounts/setup/route.ts` | Creates the first admin and emails a verification link. |
| `app/api/admin-email-verification/confirm/route.ts` | Consumes a verification token once and marks the email verified. |
| `app/api/admin-email-verification/resend/route.ts` | Issues a replacement email verification token. |
| `app/api/admin-password-reset/request/route.ts` | Creates and emails a password reset token. |
| `app/api/admin-password-reset/complete/route.ts` | Consumes a reset token, changes the password, and invalidates old sessions. |

## Shared UI, data, hooks, and server helpers

| File | Responsibility |
| --- | --- |
| `components/Navbar.tsx` | Customer navigation. |
| `components/FoodCard.tsx` | Reusable menu card with availability and cart actions. |
| `components/PopularMeals.tsx` | Homepage list of staff-selected popular menu items. |
| `components/QuickMeals.tsx` | Homepage quick-meal size picker. |
| `components/EventCakesShowcase.tsx` | Wedding invitation, admin-managed cake carousel, and event call to action. |
| `components/HomeHeroImage.tsx` | Homepage hero image loaded from the menu. |
| `components/HomeScrollReveal.tsx` | Scroll entrance animation wrapper. |
| `components/FantasyMealRequest.tsx` | Customer custom-meal request form and WhatsApp handoff. |
| `components/CartProvider.tsx` | Cart state, persistence, and reconciliation with current menu data. |
| `components/CartMenuReviewNotice.tsx` | Displays cart price or availability changes. |
| `components/AdminShell.tsx` | Shared admin shell and navigation. |
| `components/AdminLogoutButton.tsx` | Ends the admin session. |
| `data/menu.ts` | Shared menu item TypeScript type. |
| `data/menu-categories.ts` | Canonical category names and legacy name helpers. |
| `hooks/useCartMenuSync.ts` | Triggers menu synchronization for cart consumers. |
| `lib/admin-auth.ts` | Password hashing, token hashing, session signing, and session validation. |
| `lib/admin-email.ts` | Resend configuration and transactional email sending. |
| `lib/prisma.ts` | Shared Prisma Client instance using the PostgreSQL adapter. |

## Database

| File | Responsibility |
| --- | --- |
| `prisma/schema.prisma` | Database models and generated client destination. |
| `prisma/seed.ts` | Idempotent initial menu seed data. |
| `prisma/migrations/20260927200530_create_orders/migration.sql` | Creates orders and order items. |
| `prisma/migrations/20260928223120_create_menu_items/migration.sql` | Creates menu items. |
| `prisma/migrations/20260929100000_unify_chicken_plantain_category/migration.sql` | Normalizes an older menu category. |
| `prisma/migrations/20260929110000_add_meal_requests/migration.sql` | Creates meal requests. |
| `prisma/migrations/20260929120000_add_quick_meal_size_items/migration.sql` | Seeds quick-meal sizes. |
| `prisma/migrations/20260929130000_add_pickup_and_payment_fields/migration.sql` | Adds fulfillment and payment fields to orders. |
| `prisma/migrations/20261008090000_add_drinks_menu_items/migration.sql` | Seeds drink menu entries. |
| `prisma/migrations/20261009090000_add_pastries_menu_items/migration.sql` | Seeds pastry menu entries. |
| `prisma/migrations/20261009100000_add_soups_menu_items/migration.sql` | Seeds soup menu entries. |
| `prisma/migrations/20261009110000_add_swallow_menu_items/migration.sql` | Seeds swallow menu entries. |
| `prisma/migrations/20261011120000_admin_accounts_password_reset/migration.sql` | Adds admin accounts and password reset tokens. |
| `prisma/migrations/20261011140000_admin_email_verification/migration.sql` | Adds admin email verification state and tokens. |
| `prisma/migrations/migration_lock.toml` | Records the database provider for Prisma migrations. |

## Project configuration and reference files

| File | Responsibility |
| --- | --- |
| `package.json` | Runtime dependencies and npm commands. |
| `package-lock.json` | Exact npm dependency lock; generated by npm. |
| `tsconfig.json` | TypeScript compiler options and path aliases. |
| `next.config.ts` | Next.js development-origin configuration. |
| `prisma7.config.ts` | Prisma CLI configuration currently loaded by this workspace. |
| `eslint.config.mjs` | ESLint presets and ignored build output. |
| `postcss.config.mjs` | Tailwind PostCSS plugin registration. |
| `.gitignore` | Files and folders Git should omit. |
| `.env.example` | Names and example formats for local environment variables. |
| `AGENTS.md` | Repository-specific coding instructions; its Next.js block is generated by Next.js. |
| `CLAUDE.md` | Points Claude tooling to the repository instructions. |
| `README.md` | Product overview, local setup, routes, and deployment notes. |
| `skills-lock.json` | Local tool skill metadata; generated/managed by the installed tooling. |

Keep `.env` private; it contains local credentials and is intentionally not listed here. `public` contains static assets, `uploads` contains runtime menu images, and `app/generated/prisma` is generated from the Prisma schema.
