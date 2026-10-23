# Frankman Furniture & Electronics

> **"Where style truly meets comfort."**  
> Premium Furniture & Electronics Retail Platform in Umuahia, Abia State, Nigeria.

A production-ready full-stack retail and business management application built for **Frankman Furniture & Electronics**. Combines luxury showroom elegance with modern electronics e-commerce, persistent catalog management, dynamic variation pricing, discount code calculation, atomic stock validation, customer checkout, and a secure administration portal.

---

## Brand & Business Profile

- **Business Name**: Frankman Furniture & Electronics
- **Primary Showroom**: Umuahia, Abia State, Nigeria
- **Slogan**: *"Where style truly meets comfort."*
- **Homepage Headline**: *"Premium Furniture & Electronics in Umuahia"*
- **Official Facebook Reference**: [facebook.com/profile.php?id=61569349703465](https://www.facebook.com/profile.php?id=61569349703465)
- **Local Target Market**: Umuahia and surrounding Abia State communities shopping for living room sectionals, solid timber dining sets, fluted TV consoles, 4K smart screens, inverter refrigerators, and home entertainment audio.

---

## Architecture & Technology Stack

- **Frontend**: React 19, TypeScript (strict), Tailwind CSS v4, Lucide React icons, Wouter client-side router.
- **Client State**: Zustand with persistent `localStorage` serialization for cart items, variation tracking, and discount codes.
- **Backend**: Express full-stack server mounted with Vite middleware for dev and static SPA routing for production.
- **Database & ORM**: PostgreSQL hosted on **Neon**, with **Prisma ORM** (`prisma/schema.prisma` and `prisma/seed.ts`).
- **Precision Financials**: All prices, variations, discounts, and order totals calculated using integer **kobo** arithmetic (₦1 = 100 kobo).
- **Validation**: Zod server and client validation schemas for checkout, discounts, and administrative entities.
- **Support Channels**: Reusable WhatsApp contact links prefilling product/order details and a floating customer support desk widget.
- **Testing**: Automated unit tests using Vitest.

---

## Seed Data & Default Products

The database seed (`prisma/seed.ts`) populates the initial catalog with 6 products across two primary categories:

### Furniture
1. **Modern Luxury Sofa** (`FMN-FUR-SOF-001`) — Base: ₦450,000
   - Charcoal Grey Weave (+₦0)
   - Mahogany Tan Leather (+₦65,000)
   - Classic Black Velvet (+₦95,000)
2. **Premium Dining Set** (`FMN-FUR-DIN-002`) — Base: ₦620,000
   - 6-Seater Solid Oak (+₦0)
   - 8-Seater Executive Walnut (+₦180,000)
3. **Contemporary TV Console** (`FMN-FUR-CON-003`) — Base: ₦240,000
   - Walnut & Brass 65" (+₦0)
   - Dark Ash & Smoked Glass 75" (+₦60,000)

### Electronics
4. **Smart LED Television** (`FMN-ELE-TV-004`) — Base: ₦285,000
   - 43-Inch 4K UHD (+₦0)
   - 55-Inch 4K Quantum Display (+₦115,000)
   - 65-Inch OLED Cinematic Display (+₦295,000)
5. **Double-Door Refrigerator** (`FMN-ELE-REF-005`) — Base: ₦480,000
   - Inverter Platinum Silver 320L (+₦0)
   - Matte Black Multi-Airflow 450L with Water Dispenser (+₦160,000)
6. **Home Entertainment System** (`FMN-ELE-AUD-006`) — Base: ₦195,000
   - 5.1 Surround Sound 600W (+₦0)
   - 7.1 Dolby Atmos Cinema System 1000W (+₦105,000)

### Active Seed Discount Codes
- `WELCOME10`: 10% discount on orders over ₦50,000.
- `UMUAHIA5`: 5% discount on orders over ₦20,000.

### Administrator Access
- **Portal URL**: `/admin` or `/admin/login`
- Credentials are managed privately by the site administrator and are not displayed in the application.

---

## Local Development Workflow

1. **Install Dependencies**:
   ```bash
   npm install
   ```

2. **Configure Environment Variables**:
   Copy `.env.example` to `.env`:
   ```bash
   cp .env.example .env
   ```

3. **Start Development Server**:
   ```bash
   npm run dev
   ```
   Runs Express + Vite on port 3000 (`http://localhost:3000`).

4. **Run Unit Tests**:
   ```bash
   npm test
   ```

---

## Neon PostgreSQL & Prisma Workflow

When deploying with a live Neon PostgreSQL database:

1. Create a serverless PostgreSQL database on [Neon.tech](https://neon.tech).
2. Retrieve your connection strings from the Neon Console:
   - **Pooled connection string** (for application queries) -> set as `DATABASE_URL`.
   - **Direct connection string** (without pgbouncer, for schema migrations) -> set as `DIRECT_URL`.
3. Generate Prisma client:
   ```bash
   npx prisma generate
   ```
4. Push database schema to Neon:
   ```bash
   npx prisma db push
   ```
5. Seed database with initial catalog, settings, and administrator:
   ```bash
   npx tsx prisma/seed.ts
   ```

---

## Vercel Deployment Instructions

1. Push this repository to GitHub or GitLab.
2. In the [Vercel Dashboard](https://vercel.com), click **Add New Project** and import the repository.
3. Configure the environment variables in Vercel project settings:
   - `DATABASE_URL`: Your pooled Neon PostgreSQL URL
   - `DIRECT_URL`: Your direct Neon PostgreSQL URL
   - `AUTH_SECRET`: A secure random 32-character string
   - `VITE_WHATSAPP_NUMBER`: `+2348031234567` (or owner's actual number)
   - `VITE_FACEBOOK_URL`: `https://www.facebook.com/profile.php?id=61569349703465`
4. Deploy the project.
5. In your production environment, verify:
   - Storefront homepage and collections load without errors.
   - Products and variations calculate dynamic Naira pricing.
   - Adding to cart persists across page refresh.
   - Checkout validates customer delivery address in Umuahia and records orders with `PENDING` status.
   - Admin login works at `/admin/login` and provides real-time order, inventory, and discount controls.

---

## Security & Architectural Notes

- **Client State Distrust**: Prices, discounts, totals, and stock limits are never trusted from browser payloads; all financial values are revalidated server-side before order creation.
- **Atomic Stock Checks**: Checkout performs atomic stock verification and updates inventory movements to prevent overselling.
- **Paystack Payment Architecture**: Orders are placed with `PENDING` payment status; real-time Paystack webhook verification can be enabled by setting `PAYSTACK_SECRET_KEY`.
- **Zero-Broken-Image Policy**: The frontend uses a resilient `SafeImage` component with fallback SVG luxury placeholders ensuring broken image frames are never displayed.
