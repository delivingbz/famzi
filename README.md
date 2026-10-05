# Dfamiliz Online Ordering (FAMZI)

FAMZI is Dfamiliz's online food ordering application. It gives customers a simple way to browse meals, build a cart, place an order, and share custom meal ideas. Staff use a protected admin area to manage menu items, process orders, and review customer requests.

The project is being built as a deployable application, not a tutorial template. The MVP target is **three weeks (21 days) from sprint start**, with a focused scope: get Dfamiliz ready to receive and process real online orders.

## Product goals

- Make ordering straightforward on phones, tablets, and desktop screens.
- Present the menu clearly with useful categories, current prices, and availability.
- Give staff practical tools for day-to-day menu and order management.
- Launch a dependable ordering MVP, then prioritize improvements using real customer and staff feedback.

The visual direction uses warm cream backgrounds, orange accents, clear typography, and appetizing food imagery. Mobile is the primary design target; larger screens should feel intentionally designed rather than like an enlarged phone layout.

## Current features

### Customer experience

- Home page with popular meals, menu category links, Quick Meals, and a Fantasy Meal request form.
- Menu loaded from the database, with category filters and search.
- Cart saved in the customer's browser, with quantity controls and item removal.
- Cart and checkout refresh prices and availability. Customers review changes and confirm a changed total before ordering.
- Checkout supports delivery and customer-specified pickup points. A valid phone number and address or pickup point are required. Delivery costs **NGN 1,000**; pickup has no delivery fee.
- Orders are saved before checkout opens WhatsApp with the order details prefilled. Staff confirm payment in WhatsApp and mark the order Paid in Admin.
- Order confirmation page with the order reference and summary.
- Quick Meals can be added to the cart in these sizes: quarter liter, half liter, 1 liter, and 1 pot.
- Fantasy Meal submissions are saved for staff and can be continued in WhatsApp with the request prefilled.

### Staff experience

- Shared-password admin sign-in at `/admin-login`.
- Dashboard and order list with status updates: Received, Accepted, Preparing, Ready, and Completed.
- Menu management for item names, descriptions, prices, categories, images, popularity, and availability.
- Fantasy Meal Requests page with customer contact details, request status, and automatic refresh.
- Quick Meal size prices are menu item prices, so staff can edit them in **Admin > Menu**.

### Data and API

PostgreSQL stores menu items, orders, order line items, and Fantasy Meal requests. The App Router API serves the customer menu, validates current availability and prices when an order is submitted, and protects staff-only menu and order operations with the admin session.

## Current scope and launch work

The MVP is centered on customer ordering and the staff workflow. **DCI and DCC are outside the first release** and can be integrated later.

Before a public launch:

- Connect the saved image paths to customer-facing meal cards, add approved Dfamiliz food photography, and confirm all menu descriptions, categories, prices, and availability.
- Add the regular menu in Admin > Menu. The database migration creates the four standard Quick Meal sizes; edit their prices there.
- Admin > Menu accepts JPG, PNG, and WebP photo uploads up to 5 MB. Uploaded images are stored in the app's `uploads` folder, so production hosting must preserve that folder across deployments with persistent storage.
- Confirm the pickup coordination process and the delivery service area.
- Payment confirmation is handled by staff in WhatsApp; an online payment gateway is not integrated.
- Confirm the production order notification workflow. Ordinary orders are stored in Admin and handed off to WhatsApp; Fantasy Meal requests also offer a WhatsApp handoff.
- Test the full customer and staff flow on small phones, standard phones, tablets, laptops, and desktop screens.
- Configure the production database, secrets, WhatsApp number, hosting, and domain; then place and process a real end-to-end test order.

## Three-week delivery plan

| Week | Focus | Target outcome |
| --- | --- | --- |
| 1 | Foundation and customer experience | Responsive home and menu, categories, search, food selection, and cart foundation |
| 2 | Ordering system | Cart, checkout, customer details, order creation, confirmation, and order reference |
| 3 | Admin and production | Menu and order operations, responsive and error-state review, production configuration, deployment, and launch |

Responsiveness, touch-friendly controls, loading and empty states, and clear error handling are part of each week rather than a final add-on.

Responsive review targets from the product brief are small phones (320 to 375px), standard phones (390 to 430px), tablets (768px and up), laptops (1024 to 1440px), and large desktop screens (1440px and up).

## Technology

- Next.js 16 App Router and React 19
- TypeScript and Tailwind CSS 4
- PostgreSQL
- Prisma ORM 7 with the PostgreSQL driver adapter

## Run locally

### Requirements

- Node.js compatible with Next.js 16.3.6
- npm
- A PostgreSQL database

### Setup

1. Install dependencies:

   ```bash
   npm install
   ```

2. Create `.env` from the example.

   PowerShell:

   ```powershell
   Copy-Item .env.example .env
   ```

   macOS/Linux:

   ```bash
   cp .env.example .env
   ```

3. Set the environment variables in `.env`:

   | Variable | Purpose |
   | --- | --- |
   | `DATABASE_URL` | PostgreSQL connection string |
   | `ADMIN_PASSWORD` | Shared staff sign-in password |
   | `AUTH_SECRET` | Random secret used to sign admin sessions; use at least 32 characters |
   | `WHATSAPP_BUSINESS_NUMBER` | Business WhatsApp number with country code and digits only, for example `2348012345678` |

   Keep `.env` private. Do not commit real credentials or secrets.

4. Generate Prisma Client and apply database migrations:

   ```bash
   npx prisma generate
   npx prisma migrate deploy
   ```

5. Start the development server:

   ```bash
   npm run dev
   ```

6. Open [http://localhost:3000](http://localhost:3000). Staff can sign in at `/admin-login`.

## Common commands

```bash
npm run dev       # Start the Next.js development server
npm run lint      # Run ESLint
npx prisma generate
npx prisma migrate status
npx prisma migrate deploy
npm run build     # Create a production build
npm run start     # Start the production server after building
```

When adding or changing Prisma models, update the schema, create a migration, apply it, and regenerate Prisma Client as needed. Do not use `migrate reset` on a database containing data you want to keep.

## Routes

| Route | Purpose |
| --- | --- |
| `/` | Customer home page |
| `/about` | About FAMZI and the ordering experience |
| `/contact` | Contact Dfamiliz through WhatsApp |
| `/services` | Cakes, small chops, pastries, catering, event management, and chef enquiries |
| `/menu` | Searchable, filterable menu |
| `/cart` | Cart review |
| `/checkout` | Delivery checkout |
| `/order-confirmation` | Confirmation for the last placed order |
| `/admin-login` | Staff sign-in |
| `/admin` | Staff dashboard |
| `/admin/orders` | Order management |
| `/admin/menu` | Menu and price management |
| `/admin/meal-requests` | Fantasy Meal request management |

## Deployment notes

Deploy to a Node.js-compatible host and provide the production values for all required environment variables. Provision PostgreSQL first, then run `npx prisma migrate deploy` during deployment before serving traffic. Add the production domain, configure WhatsApp with the country code, and confirm that customer ordering and admin access work on the deployed site.

For local device testing, open `http://10.166.191.211:3000` while the computer and device are on the same Wi-Fi network. If the computer's network IP changes, update `allowedDevOrigins` in `next.config.ts` and restart the development server.
