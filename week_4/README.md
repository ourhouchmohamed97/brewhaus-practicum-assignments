# Wanderlust Destinations (Week 4)

Week 4 extends Week 3 with a complete Stripe Checkout integration in TEST MODE only:
- Real authentication (signup/login/logout)
- PostgreSQL-backed sessions (survives browser refreshes)
- Public API for tour packages
- **Stripe Checkout** for booking tours with real payment flow
- Checkout success/cancel pages with order lookup

---

## Quick Start (Local Development)

### Prerequisites
- Node.js 18+
- A Neon PostgreSQL database URL
- A secret string for session signing

### 1. Server

```bash
cd week_4/server
cp .env.example .env
# edit .env with your Neon connection string, SESSION_SECRET, and Stripe keys
npm install
npm run dev      # http://localhost:5000
```

### 2. Database schema

Run once:
```bash
psql "$DATABASE_URL" -f server/scripts/001_schema.sql
psql "$DATABASE_URL" -f server/scripts/002_add_orders.sql
```

Then apply the migration that adds the `name` column to `users` (needed when the
database already has a `users` table from Assignment 2):
```bash
psql "$DATABASE_URL" -f server/scripts/003_add_name.sql
```

### 3. Seed the items

```bash
npm run seed
```

### 4. Client

```bash
cd ../client
cp .env.example .env
npm install
npm run dev      # http://localhost:5173
```

The client will call `VITE_API_URL` (default 5000) — make sure it matches your server.

---

## Folder Structure

```
week_4/
├── client/                           # React + Vite frontend
│   ├── src/
│   │   ├── components/              # Header, Footer, TourCard, etc.
│   │   ├── pages/                   # HomePage, LoginPage, SignupPage, CheckoutSuccessPage, CheckoutCancelPage
│   │   ├── context/                 # AuthContext for session state
│   │   ├── services/                # api.js (single place to talk to backend)
│   │   └── data/                    # items.js (copied Week 2 data)
│   └── public/images/               # All tour images
├── server/                           # Express API
│   ├── src/
│   │   ├── routes/                  # /api/items, /api/auth, /api/checkout, /api/orders
│   │   ├── middleware/              # requireAuth, CORS config
│   │   ├── db/                      # session store (PostgreSQL)
│   │   └── config/                  # database pool
│   ├── scripts/
│   │   ├── 001_schema.sql           # base database schema (users, items, session)
│   │   ├── 002_add_orders.sql       # orders and order_items tables
│   │   ├── 003_add_name.sql         # add name column to users (from Week 3)
│   │   └── 002_seed.js              # seed items from Week 2 data
│   └── server.js                    # Express app entry point
├── README.md
└── ASSESSMENT_GUIDE.md
```

---

## Deployment

### Backend (Railway)
1. Create a new project, connect your repo.
2. Set env vars: `DATABASE_URL`, `SESSION_SECRET`, `CLIENT_URL` (your Vercel URL), `STRIPE_SECRET_KEY` (test mode), `STRIPE_WEBHOOK_SECRET`, `STRIPE_SUCCESS_URL`, `STRIPE_CANCEL_URL`, `PORT`, `NODE_ENV=production`.
3. Add a `start` script: `node server.js` (already in package.json).

### Database (Neon)
No changes needed — same database, but you need to run `002_add_orders.sql` for Stripe orders.

### Frontend (Vercel)
1. Set `VITE_API_URL` to your Railway URL (ends in `.railway.app`).
2. Set `NODE_ENV=production`.
3. Stripe.js is loaded dynamically from the CDN (no additional config needed).

---

## Scripts

| Script | What it does |
|---|---|
| `npm run dev` (both client & server) | Start Vite dev server or Express watch mode |
| `npm run build` | Build React for production |
| `npm run seed` | Populate `items` table from `data/items.js` |
| `npm run start` | Run Express in production mode |
| `npm run dev:stripe` | Start Stripe webhook listener in test mode (optional) |