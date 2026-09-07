# ERP Backend - Phase 1 Foundation

A clean, modular-monolith backend for the ERP SaaS application built with Node.js, Express, TypeScript, Prisma ORM, and PostgreSQL.

## 🎯 Purpose

This backend serves as the foundation for persisting data and providing APIs for the existing React + TypeScript + Vite ERP frontend. It will eventually support five core modules:
- CRM
- Sales
- Inventory
- Procurement
- Finance

## 🛠️ Technology Stack

| Layer | Technology |
|-------|-----------|
| **Runtime** | Node.js |
| **Framework** | Express.js |
| **Language** | TypeScript |
| **ORM** | Prisma |
| **Database** | PostgreSQL |
| **Security** | Helmet |
| **CORS** | cors |

## 📁 Project Structure

```
backend/
├── src/
│   ├── config/
│   │   └── env.ts                 # Environment configuration
│   ├── middleware/
│   │   └── errorHandler.ts        # Global error handling
│   ├── routes/
│   │   └── index.ts               # API routes and health checks
│   ├── app.ts                     # Express app setup
│   └── server.ts                  # Server entry point
├── prisma/
│   └── schema.prisma              # Database schema
├── .env                           # Environment variables (local)
├── .env.example                   # Environment template
├── .gitignore                     # Git ignore rules
├── package.json                   # Dependencies and scripts
├── tsconfig.json                  # TypeScript config
└── README.md                      # This file
```

## 📦 Installation

### Prerequisites
- **Node.js** 18+ (with npm)
- **PostgreSQL** 14+ (local or remote)

### Steps

1. **Clone/navigate to the backend directory**
   ```bash
   cd backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment variables**
   - Copy `.env.example` to `.env`
   ```bash
   cp .env.example .env
   ```
   - Update `.env` with your PostgreSQL credentials and settings

4. **Generate Prisma Client**
   ```bash
   npm run prisma:generate
   ```

5. **Run database migration**
   ```bash
   npm run prisma:migrate
   ```

## 🚀 Getting Started

### Start PostgreSQL (Local Development)

#### Option A: Using Docker
```bash
docker run --name erp-postgres \
  -e POSTGRES_PASSWORD=password \
  -e POSTGRES_DB=erp_dev \
  -p 5432:5432 \
  -d postgres:15
```

#### Option B: Using native PostgreSQL installation
```bash
# Create database
createdb erp_dev

# Verify connection
psql -U postgres -d erp_dev -c "SELECT 1;"
```

### Start the Development Server

```bash
npm run dev
```

Expected output:
```
✅ Connected to PostgreSQL
✅ ERP Backend is running on port 5000
📍 Environment: development
🌐 Frontend URL: http://localhost:5173

📚 API Documentation:
   Health Check: http://localhost:5000/api/health
   Database Check: http://localhost:5000/api/health/db
```

### Production Build

```bash
npm run build
npm run start
```

## 📊 Health Check Endpoints

### Basic Health Check
```bash
GET http://localhost:5000/api/health
```

**Response (200):**
```json
{
  "success": true,
  "message": "ERP API is running",
  "environment": "development",
  "timestamp": "2024-01-15T10:30:00.000Z"
}
```

### Database Health Check
```bash
GET http://localhost:5000/api/health/db
```

**Response (200):**
```json
{
  "success": true,
  "message": "Database connection successful",
  "database": "PostgreSQL",
  "timestamp": "2024-01-15T10:30:00.000Z"
}
```

**Response (503) - Connection failed:**
```json
{
  "success": false,
  "message": "Database connection failed",
  "error": "Connection refused",
  "timestamp": "2024-01-15T10:30:00.000Z"
}
```

## 📜 npm Scripts

| Script | Purpose |
|--------|---------|
| `npm run dev` | Start development server with auto-reload |
| `npm run build` | Compile TypeScript to JavaScript |
| `npm run start` | Run production build |
| `npm run prisma:generate` | Generate Prisma Client |
| `npm run prisma:migrate` | Create and run database migrations |
| `npm run prisma:studio` | Open Prisma Studio (GUI for database) |

## 🌍 Environment Variables

Copy `.env.example` to `.env` and update:

```env
# Server port
PORT=5000

# Environment (development or production)
NODE_ENV=development

# PostgreSQL connection string
DATABASE_URL="postgresql://postgres:password@localhost:5432/erp_dev"

# Frontend URL for CORS
FRONTEND_URL="http://localhost:5173"
```

**PostgreSQL Connection String Format:**
```
postgresql://[username]:[password]@[host]:[port]/[database]
```

## 🗄️ Database

### Initial Schema
- **HealthCheck** table (test model for verification)
- Ready for Phase 2: Authentication, CRM, Sales, Inventory, Procurement, Finance tables

### Prisma Commands

**Generate Client:**
```bash
npm run prisma:generate
```

**Create Migration:**
```bash
npm run prisma:migrate
```

**Open Prisma Studio (GUI):**
```bash
npm run prisma:studio
```
Then visit `http://localhost:5555`

## 🔒 Security Features

- **Helmet**: HTTP security headers
- **CORS**: Cross-origin resource sharing (restricted to frontend URL)
- **Input Validation**: Ready for implementation in Phase 2
- **Environment Variables**: No hardcoded secrets
- **Error Handling**: Global error handler with stack traces in dev mode only

## 🔄 CORS Configuration

The backend only accepts requests from the frontend URL defined in `.env`:

```typescript
origin: config.frontendUrl  // http://localhost:5173 (development)
```

To add additional origins:
1. Update `FRONTEND_URL` in `.env`
2. Or modify the CORS configuration in `src/app.ts`

## ⚠️ Error Handling

All errors return a consistent JSON response:

**Error Response (500):**
```json
{
  "success": false,
  "error": {
    "message": "Internal Server Error",
    "statusCode": 500
  }
}
```

In development mode, stack traces are included for debugging.

## 🛑 Graceful Shutdown

The server handles shutdown signals (SIGTERM, SIGINT) gracefully:
1. Stops accepting new connections
2. Closes existing connections
3. Disconnects from the database
4. Exits cleanly

## 🚧 Phase 2 Plan (Future)

The backend is structured to easily add:
- Authentication module (users, organizations)
- CRM module (companies, contacts, leads, deals)
- Sales module (quotations, orders)
- Inventory module (products, stock, movements)
- Procurement module (suppliers, POs, goods receipts)
- Finance module (invoices, payments, accounts)

Each module will follow the pattern:
```
src/modules/[module]/
├── [module].controller.ts
├── [module].service.ts
└── [module].routes.ts
```

## 📖 Useful Links

- [Express Documentation](https://expressjs.com/)
- [TypeScript Documentation](https://www.typescriptlang.org/)
- [Prisma Documentation](https://www.prisma.io/docs/)
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)

## 🐛 Troubleshooting

### Database connection failed
```
Error: connect ECONNREFUSED
```
- Ensure PostgreSQL is running
- Verify `DATABASE_URL` in `.env` is correct
- Check database credentials

### Port already in use
```
Error: listen EADDRINUSE: address already in use :::5000
```
- Change `PORT` in `.env`
- Or kill the process: `lsof -i :5000 | grep LISTEN | awk '{print $2}' | xargs kill -9`

### TypeScript compilation errors
```bash
npm run build
```
- Verify TypeScript configuration in `tsconfig.json`
- Check for missing type definitions

## 📝 License

MIT

## 👨‍💻 Author

ERP Development Team
