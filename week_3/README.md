# Wanderlust Destinations (Week 3)

A full-stack React + Express + Neon PostgreSQL travel agency website with:
- Real authentication (signup/login/logout)
- PostgreSQL-backed sessions (survives browser refreshes)
- Public API for tour packages

---

## Quick Start (Local Development)

### Prerequisites
- Node.js 18+
- A Neon PostgreSQL database URL
- A secret string for session signing

### 1. Server

```bash
cd week_3/server
cp .env.example .env
# edit .env with your Neon connection string and a random SESSION_SECRET
npm install
npm run dev      # http://localhost:5000
```

### 2. Database schema

Run once:
```bash
psql "$DATABASE_URL" -f server/scripts/001_schema.sql
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
week_3/
├── client/                  # React + Vite frontend
│   ├── src/
│   │   ├── components/     # Header, Footer, TourCard, etc.
│   │   ├── pages/          # HomePage, LoginPage, SignupPage
│   │   ├── context/        # AuthContext for session state
│   │   ├── services/       # api.js (single place to talk to backend)
│   │   └── data/           # items.js (copied Week 2 data)
│   └── public/images/      # All tour images
├── server/                  # Express API
│   ├── src/
│   │   ├── routes/         # /api/items, /api/auth
│   │   ├── middleware/     # requireAuth, CORS config
│   │   ├── db/             # session store (PostgreSQL)
│   │   └── config/         # database pool
│   ├── scripts/
│   │   ├── 001_schema.sql  # database schema
│   │   └── 002_seed.js     # seed items from Week 2
│   └── server.js           # Express app entry point
├── README.md
└── ASSESSMENT_GUIDE.md
```

---

## Deployment

### Backend (Railway)
1. Create a new project, connect your repo.
2. Set env vars: `DATABASE_URL`, `SESSION_SECRET`, `CLIENT_URL` (your Vercel URL), `PORT`, `NODE_ENV=production`.
3. Add a `start` script: `node server.js` (already in package.json).

### Database (Neon)
No changes needed — same database.

### Frontend (Vercel)
1. Set `VITE_API_URL` to your Railway URL (ends in `.railway.app`).
2. Set `NODE_ENV=production`.

---

## Scripts

| Script | What it does |
|---|---|
| `npm run dev` (both client & server) | Start Vite dev server or Express watch mode |
| `npm run build` | Build React for production |
| `npm run seed` | Populate `items` table from `data/items.js` |
| `npm run start` | Run Express in production mode |