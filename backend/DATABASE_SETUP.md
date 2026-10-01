# DATABASE SETUP INSTRUCTIONS

## Step 1: Start PostgreSQL

### Option A: Using Docker (Recommended)

```bash
docker run --name erp-postgres \
  -e POSTGRES_PASSWORD=password \
  -e POSTGRES_DB=erp_dev \
  -p 5432:5432 \
  -d postgres:15
```

Or if you want to remove old container:
```bash
docker rm -f erp-postgres 2>/dev/null
docker run --name erp-postgres \
  -e POSTGRES_PASSWORD=password \
  -e POSTGRES_DB=erp_dev \
  -p 5432:5432 \
  -d postgres:15
```

Wait 5-10 seconds for PostgreSQL to be ready.

### Option B: Using PostgreSQL CLI (Native Installation)

```bash
# Create the database
createdb -U postgres erp_dev

# Verify connection
psql -U postgres -d erp_dev -c "SELECT 1;"
```

Update `.env` file if your password or username is different. The installed PostgreSQL 18 service in this workspace is configured for port `5000`; the backend therefore runs on port `5001` to avoid a port collision:
```env
DATABASE_URL="postgresql://postgres:your_password@localhost:5000/erp_dev"
PORT=5001
```

## Step 2: Run Migration and Seed

From the backend directory:

```bash
cd backend

# Run migration (creates tables)
npm run prisma:migrate

# When prompted for migration name, enter something like "init"

# Run seed (loads sample data)
npm run db:seed
```

Or combined:
```bash
npm run db:setup
```

## Step 3: Verify Database

```bash
# Open Prisma Studio
npm run prisma:studio
```

Then open browser to http://localhost:5555

## Troubleshooting

### Port already in use
```bash
# Find and kill the process
lsof -i :5432 | grep LISTEN | awk '{print $2}' | xargs kill -9
```

### Connection refused
- Make sure PostgreSQL is running
- Verify DATABASE_URL in .env
- Check username and password

### Migration stuck
Press Ctrl+C and retry

### Need to reset database
```bash
# Delete all data and start fresh
npm run prisma:migrate:reset
```

## Database Connection (from .env)

```
Username: postgres
Password: your configured PostgreSQL password
Host: localhost
Port: 5000 (installed service) or 5432 (Docker)
Database: erp_dev
```

## Next Steps After Setup

1. Verify all tables created (use Prisma Studio)
2. Check seed data loaded
3. Start the backend server: `npm run dev`
4. Test API endpoints:
  - http://localhost:5001/api/health
  - http://localhost:5001/api/health/db
