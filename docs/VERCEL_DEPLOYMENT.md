# Vercel Deployment

Deploy this repository as two Vercel projects backed by one managed PostgreSQL database.

## 1. Prepare PostgreSQL

Use Vercel Postgres, Neon, Supabase, Railway, or another managed PostgreSQL provider. Copy its connection string into `backend/.env` locally and run:

```powershell
cd backend
npm run prisma:generate
npx prisma migrate dev --name init
```

Commit the generated `backend/prisma/migrations` directory. Do not run `db:seed` in production because the seed script deletes existing records first.

For the production database, run once from a trusted machine or CI job:

```powershell
cd backend
npm run prisma:deploy
```

## 2. Deploy the API

Create a Vercel project with the repository root set to `backend`.

The API entrypoint is `backend/api/index.ts`. Vercel uses `backend/vercel.json` to route all requests to it.

Set these Vercel environment variables for Production, Preview, and Development as appropriate:

```env
DATABASE_URL=your-managed-postgresql-url
JWT_SECRET=long-random-production-secret
JWT_EXPIRES_IN=8h
NODE_ENV=production
FRONTEND_URL=https://your-frontend.vercel.app
```

After deployment, verify:

```text
https://your-api.vercel.app/api/health
```

## 3. Deploy the frontend

Create a second Vercel project with the repository root set to `apps/web`.

Set this environment variable:

```env
VITE_API_URL=https://your-api.vercel.app/api
```

The frontend `vercel.json` rewrites SPA routes to `index.html`, so `/dashboard`, `/crm`, and other client routes work after refresh.

## 4. Public account creation

New users can open:

```text
https://your-frontend.vercel.app/signup
```

Signup creates a new organization and makes the first user its `ADMIN`. The user can then create additional users through the future admin user-management module.

## 5. Production checklist

- Use a strong unique `JWT_SECRET`.
- Keep `DATABASE_URL` and secrets only in Vercel environment variables.
- Configure the exact deployed frontend URL in `FRONTEND_URL`.
- Add email verification, password reset, rate limiting, and abuse protection before unrestricted public launch.
- Run database migrations through CI or a trusted deployment job, never `prisma migrate dev` in Vercel.
- Configure database backups and monitoring with the managed PostgreSQL provider.