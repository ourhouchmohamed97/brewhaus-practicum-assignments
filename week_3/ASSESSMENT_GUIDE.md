# Assessment Guide — Week 3 Full-Stack Website

This guide explains how the assignment was implemented in plain language. Use it as a reference to understand your code and be able to explain it during assessment.

---

## 1. What do "frontend" and "backend" mean?

- **Frontend (client)**: The part that users see and interact with in their browser. It shows the tour cards, the navigation bar, the signup form, etc.
- **Backend (server)**: A separate program running on a server that handles data and business logic. It receives requests from the browser, talks to the database, and sends back JSON responses.

You can think of it like a restaurant:
- The **frontend** is the dining room where customers (users) sit.
- The **backend** is the kitchen where food (data) is prepared.

---

## 2. How does React communicate with Express?

The frontend makes **fetch requests** to the backend's API. For example:

```javascript
// in client/src/services/api.js
const items = await fetch('http://localhost:5000/api/items', { credentials: 'include' });
const data = await items.json();
```

The backend is running Express with routes:

```javascript
// in server/src/routes/items.js
router.get('/', async (req, res) => {
  const result = await pool.query('SELECT ... FROM items ORDER BY id');
  res.json(result.rows); // send rows to the client as JSON
});
```

Each request goes:
1. Browser → `fetch()` → Express route handler → PostgreSQL query → back to Express
2. Express → `res.json()` → Browser
3. Browser → `.json()` → JavaScript code → React renders the data

---

## 3. What is an API?

**API = Application Programming Interface**

It's a contract: "If you send me X, I'll give you Y."

Example:
- **URL**: `GET /api/items`
- **Request**: "Give me all items"
- **Response**: `[{id: 1, name: 'Alpine...', ...}, {id: 2, name: 'Historic European...', ...}]`

The browser can't talk directly to PostgreSQL, so the API is the bridge.

---

## 4. How does `GET /api/items` work?

1. **Request arrives**: `GET http://localhost:5000/api/items`
2. **Express receives it** at the route defined in `routes/items.js`.
3. **Pool.query()** runs: `SELECT * FROM items ORDER BY id`.
4. **PostgreSQL returns rows**: an array of objects.
5. **Express sends JSON**: `res.json(result.rows)`.
6. **Browser parses JSON** into JavaScript objects.
7. **React uses the data** to render cards.

The `id` field becomes `id`, `title` becomes `name` (via the seed script), `image` stays `image`, etc.

---

## 5. What is PostgreSQL?

PostgreSQL (often shortened to **Postgres**) is a **relational database**.

- It stores data in **tables** (like spreadsheets).
- Each row is a **record**.
- Each column is an **attribute**.

Example `items` table:

| id | name | destination | price |
|----|------|-------------|-------|
| 1  | Alpine Summit Expedition | Swiss Alps | 1299 |
| 2  | Historic European Charms | Spain & Portugal | 2450 |

---

## 6. What does each database table store?

### `users` table

| Column | Meaning |
|---|---|
| `id` | Auto-incremented primary key — unique number for each user. |
| `name` | Full name, display name shown in the header. |
| `email` | Login email, stored in lowercase. Unique constraint prevents duplicates. |
| `password_hash` | Bcrypt-scrambled password. **Never stored in plain text**. |
| `created_at` | Timestamp of when the account was created. |

### `items` table

| Column | Meaning |
|---|---|
| `id` | Auto-incremented primary key. |
| `name` | Tour title (e.g., "Alpine Summit Expedition"). |
| `destination` | Where it is (e.g., "Swiss Alps"). |
| `category` | Adventure, Cultural, Beach, Luxury — used for filtering. |
| `price` | Numeric(10,2) — 2 decimal places for currency. |
| `features` | Text[] — PostgreSQL array of feature strings. |
| `created_at` | When the item was added. |

### `session` table

| Column | Meaning |
|---|---|
| `sid` | Random session ID from the cookie. |
| `sess` | JSON data like `{user: {id: 3, email: '...'}}`. |
| `expire` | When this session should be deleted. |

The `connect-pg-simple` library writes to and reads from this table automatically.

---

## 7. What is a database schema?

A **schema** is the definition (blueprint) of how tables should look.

- CREATE TABLE statements in `001_schema.sql` define each table.
- It says which columns exist, what type they are, and any rules (NOT NULL, UNIQUE).
- Running it once sets up your database for all future requests.

A second file, `003_add_name.sql`, adds the `name` column to `users` if it is missing (this happens when the database already has a `users` table from Assignment 2). It uses `ADD COLUMN IF NOT EXISTS`, so it is safe to run again on a fresh database.

If you make mistakes, you'd need to fix the schema and recreate rows.

---

## 8. How does the seed script work?

`scripts/002_seed.js`:

1. Reads the array from `data/items.js` (copied from Week 2).
2. TRUNCATE removes everything from `items` and resets the ID counter.
3. INSERTs each item — one row per tour.
4. All done in a single transaction so it never leaves half-seeded data.

It's safe to run multiple times: it always ends with the exact same 6 rows.

---

## 9. How does signup work?

1. User fills form with name, email, password → POST `/api/auth/signup`.
2. Server validates: 8+ character password, valid email format.
3. `bcrypt.hash(password, 10)` scrambles the password with a random salt.
4. INSERT new row in `users` table (password_hash, not plain password).
5. Express session storage writes `{id, email, name}` to `session` table.
6. Browser receives a `connect.sid` cookie (HttpOnly, Secure, SameSite=Lax).
7. React re-renders Header to show "Welcome, Name".

---

## 10. How does login work?

1. User fills in email + password → POST `/api/auth/login`.
2. Server finds user by email: `SELECT password_hash FROM users WHERE email = $1`.
3. `bcrypt.compare(password, stored_hash)` checks if password matches.
4. If correct: session now contains `{user: {id, email, name}}`.
5. Same cookie (`connect.sid`) is sent back to browser.
6. React shows logged-in state.

---

## 11. What does bcrypt do?

**bcrypt** is a password-hashing algorithm.

- It adds a **random salt** (unique string) to every password before scrambling.
- It's **slow by design**: 10 rounds = about 250ms per hash. This makes brute-force attacks impractical.
- It never reveals the original password — only allows "does this match?" comparisons.

---

## 12. What are sessions and cookies?

| Term | Meaning |
|---|---|
| **Session** | Server-side storage of "who is logged in". Stored in PostgreSQL in the `session` table. |
| **Cookie** | Small file in the browser. Contains only `connect.sid` (a random ID). **HttpOnly** means JavaScript can't read it (XSS protection). |

When you visit the site:
1. Server creates a session → writes to DB → sets cookie in response headers.
2. Next request includes the cookie → server looks up the session in DB → knows who you are.
3. Browser refresh → cookie still sent → session still in DB → you stay logged in.

---

## 13. How does login survive page refresh?

Because the session ID is stored in a **cookie** that persists for 7 days, and the actual user data lives in **PostgreSQL**, not in browser memory:

1. You log in once → server creates session in DB → sends `connect.sid` cookie.
2. You refresh the page → browser sends `connect.sid` with the request.
3. Server reads the cookie, looks up the session in DB, returns user info.
4. React re-fetches "who am I?" via `GET /api/auth/me` → updates UI.

---

## 14. How does .env protect secrets?

`.env` files are:
- **Git-ignored** (`.gitignore` excludes `.env` but not `.env.example`).
- Never appear in the public repository.
- Read at server startup via `dotenv` → `process.env.DATABASE_URL`.

This keeps your real database password and session secret out of the code.

For deployment, you manually set the same environment variables in Railway/Vercel settings.

---

## 15. What do Railway, Vercel, and Neon do?

| Service | What it provides |
|---|---|
| **Railway** | Hosts the Express backend. Runs `npm run start`. Provides environment variables. |
| **Neon** | Cloud PostgreSQL database. Scales vertically. Free tier. SSL by default. |
| **Vercel** | Hosts the React static build. CDN edge caching. Auto-deploys on push. |

### How they work together

1. User visits `https://wanderlust.vercel.app` (Vercel).
2. Frontend makes `fetch('https://api.up.railway.app/api/items')`.
3. Backend (Railway) reads `DATABASE_URL` → connects to Neon → returns JSON.
4. Sessions: Railway sets cookie with `SESSION_SECRET`, browser saves it, sends it on each request.

---

## 16. How does the deployed website communicate?

```
Browser (Vercel) <--HTTPS--> Railway (Express) <--SQL--> Neon (Postgres)
```

- **CORS** on Railway allows requests from `https://wanderlust.vercel.app`.
- **Cookie** is set with `secure: true` in production, so HTTPS is required.
- Same `SESSION_SECRET` must match on Railway, otherwise the server can't sign/verify session cookies.

---

## 17. What are the React Router pages?

The application uses `react-router-dom` for client-side routing. There are six pages:

| Route | Component | Purpose |
|---|---|---|
| `/` | `HomePage` | Hero section, featured packages, testimonials, quote section |
| `/packages` | `PackagesPage` | Full tour listing with API-driven grid and category filters |
| `/testimonials` | `TestimonialsPage` | All reviews with average rating stats |
| `/quote` | `PlanTripPage` | Travel inquiry form with 5 fields (name, email, destination, travelers, dates, message) |
| `/login` | `LoginPage` | Email/password sign in form |
| `/signup` | `SignupPage` | Name/email/password account creation form |

Auth pages (`login`, `signup`) render without Header or Footer so the card is centered in a full-page layout.

---

## 18. How is the Header navbar structured?

The header uses a three-section layout:

1. **Logo** (left): Brand icon + "Wanderlust Destinations" text, always visible.
2. **Nav links** (center): Home, Tour Packages, Testimonials, Plan Your Trip — centered in available space on desktop, dropdown panel on mobile.
3. **Auth/Profile** (right): On desktop, either "Sign in" + "Sign up" links (when logged out) or user name + "Sign out" button (when logged in).

---

## 19. How does the Plan Your Trip form work?

The form at `/quote` has six fields:
- **Name**: 2-80 characters
- **Email**: valid email format
- **Destination**: Where they want to go
- **Travelers**: 1-20 people
- **Preferred month**: Dropdown selector
- **Message**: Optional notes

**Important**: When submitted, the form shows a success message with a note that the backend endpoint to save inquiries has not yet been implemented. This prevents false expectations while allowing users to test the form.

---

## 20. What are the design tokens used?

| Token | Value | Usage |
|---|---|---|
| `navy` | `#0f1a3a` | Primary brand color, buttons, icon backgrounds |
| `charcoal` | `#26262b` | Secondary dark, gradient stops |
| `accent` | `#f59e0b` | Gold accent, badges, dividers, links |
| `ink` | `#2d2f36` | Primary text color |
| `ink-soft` | `#2d2f3680` | Subtle text, placeholders |
| `surface` | `#f5f7fa` | Background cards |
| `line` | `#e4e7ec` | Borders, separators |

Fonts: **DM Sans** (body, buttons), **Fraunces** (headings, page titles)