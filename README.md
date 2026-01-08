# SPECIFIC.egWebsite

Monorepo: Next.js 14 (App Router) storefront + Express/Mongo API.

## Prereqs
- Node.js (LTS recommended)
- A MongoDB connection string (local MongoDB or MongoDB Atlas)

## Setup
1) Install dependencies (repo root):

```bash
npm install
```

2) Configure env
- API env: edit `apps/api/.env` and set `MONGO_URI=`
- Web env: `apps/web/.env.local` already points to the API on `http://localhost:5000`

3) (Optional) Seed data

```bash
npm -w apps/api run seed
```

## Run locally
From the repo root:

```bash
npm run dev
```

- Web: http://localhost:3000
- API: http://localhost:5000

## Admin login (after seed)
- Email: `admin@cases.com`
- Password: `Admin12345!`

## Notes
- Product images are served by the API at `/uploads/*`.
- Orders default to `pending`. Admin can update to `accepted` / `declined`.
