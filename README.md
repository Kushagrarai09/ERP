# 🏢 Complete ERP Suite (Enterprise Resource Planning)

A modern, full-stack, multi-tenant Enterprise Resource Planning (ERP) platform built with **React**, **TypeScript**, **Node.js**, **Express**, **Prisma ORM**, and **PostgreSQL**.

Designed for high reliability, modular scalability, role-based access control, and streamlined enterprise workflows across sales, procurement, inventory, finance, and customer relations.

---

## 📑 Table of Contents

- [✨ Key Features & Modules](#-key-features--modules)
  - [🏢 Multi-Tenant Architecture & Auth](#-multi-tenant-architecture--auth)
  - [👥 CRM (Customer Relationship Management)](#-crm-customer-relationship-management)
  - [📈 Sales Management](#-sales-management)
  - [📦 Inventory & Warehousing](#-inventory--warehousing)
  - [🛒 Procurement & Supply Chain](#-procurement--supply-chain)
  - [💳 Finance & Accounting](#-finance--accounting)
  - [📊 Unified Analytics & Executive Dashboard](#-unified-analytics--executive-dashboard)
- [🛠️ Technology Stack](#️-technology-stack)
- [📁 Project Architecture](#-project-architecture)
- [🚀 Quick Start & Local Setup](#-quick-start--local-setup)
- [🌍 Environment Variables](#-environment-variables)
- [🗄️ Database & Migration Guide](#️-database--migration-guide)
- [🌐 Deployment Guide](#-deployment-guide)
- [📚 API Reference](#-api-reference)
- [🔒 Security & Best Practices](#-security--best-practices)
- [📄 License](#-license)

---

## ✨ Key Features & Modules

### 🏢 Multi-Tenant Architecture & Auth
- **Organization Isolation**: Every company, user, transaction, and audit record is strictly partitioned by `organizationId`.
- **Role-Based Access Control (RBAC)**: Fine-grained permissions for roles:
  - `ADMIN`, `MANAGER`, `SALES`, `INVENTORY`, `PROCUREMENT`, `FINANCE`, `VIEWER`.
- **JWT Authentication**: Secure password hashing with bcrypt, session validation, and protected routes.

---

### 👥 CRM (Customer Relationship Management)
- **Account & Company Directory**: Manage client companies, industries, contact numbers, and corporate metadata.
- **Contact Management**: Associate multiple stakeholders, titles, and departments to client accounts.
- **Lead Pipeline**: Track leads across statuses (`NEW`, `CONTACTED`, `QUALIFIED`, `PROPOSAL`, `NEGOTIATION`, `LOST`, `CONVERTED`).
- **Deals & Opportunities**: Manage sales pipeline stages with automated probability weights and expected close dates.
- **Activity Log**: Schedule and log calls, emails, meetings, and follow-up notes.

---

### 📈 Sales Management
- **Quotations / Estimates**: Generate customizable quotes with line items, tax computations, and automated expiry dates.
- **Sales Orders (SO)**: Convert accepted quotations to sales orders with fulfillment tracking.
- **Customer Lifecycle**: Direct link between deals, quotations, sales orders, and invoices.

---

### 📦 Inventory & Warehousing
- **Product Catalog**: Manage SKUs, barcodes, cost prices, selling prices, and units of measure (UOM).
- **Multi-Warehouse Management**: Track warehouse locations, reserved quantities, and real-time on-hand stock.
- **Stock Movements & Audit Trails**: Comprehensive tracking of `IN` and `OUT` movements (Sales, Purchases, Transfers, Adjustments, Returns, and Damages).

---

### 🛒 Procurement & Supply Chain
- **Vendor & Supplier Registry**: Store supplier payment terms, contact persons, addresses, and transaction histories.
- **Purchase Orders (PO)**: Generate and issue POs with tax breakdown, delivery schedules, and approval statuses.
- **Goods Receipts (GRN)**: Record incoming goods against active purchase orders and automatically update stock levels.

---

### 💳 Finance & Accounting
- **Invoicing & Billing**: Generate customer invoices with automated status tracking (`DRAFT`, `ISSUED`, `PARTIAL_PAID`, `PAID`, `OVERDUE`).
- **Payment Collection**: Record payments across various channels (`BANK_TRANSFER`, `UPI`, `CREDIT_CARD`, `CHEQUE`, `CASH`).
- **Expense Management**: Categorize operational expenses (Travel, Rent, Utilities, Salaries, Supplies) linked to suppliers.
- **Chart of Accounts**: Real-time balances for Assets, Liabilities, Equity, Revenue, and Expense accounts.

---

### 📊 Unified Analytics & Executive Dashboard
- **Real-Time KPIs**: Total revenue, cash flow, outstanding receivables, low stock alerts, and open deals.
- **Interactive Navigation**: Quick module switching, responsive layouts, and modern glassmorphism design.

---

## 🛠️ Technology Stack

| Layer | Technologies |
| :--- | :--- |
| **Frontend** | React 18, TypeScript, Vite, React Router v7, Vanilla CSS Design System |
| **Backend** | Node.js, Express.js (ES Modules), TypeScript, Zod, Tsx |
| **Database & ORM** | PostgreSQL, Prisma ORM |
| **Security & Auth** | JSON Web Tokens (JWT), BcryptJS, Helmet, CORS |
| **Testing & Tooling** | Vitest, Supertest, Prisma Studio |

---

## 📁 Project Architecture

```
Complete-ERP/
├── apps/
│   └── web/                   # Frontend React + Vite Application
│       ├── src/
│       │   ├── auth/          # Login, Signup, Protected Routes & Auth State
│       │   ├── components/    # Reusable UI components & navigation
│       │   ├── layouts/       # Main app layout, sidebar, header
│       │   ├── lib/           # API clients, helpers, utilities
│       │   ├── modules/       # CRM, Sales, Inventory, Procurement, Finance, App
│       │   ├── styles/        # Design system & CSS tokens
│       │   └── types/         # TypeScript interfaces & types
│       ├── package.json
│       ├── vite.config.ts
│       └── vercel.json
│
├── backend/                   # Backend Node.js + Express API
│   ├── src/
│   │   ├── config/            # Environment & database configurations
│   │   ├── middleware/        # Auth, RBAC & error handling middleware
│   │   ├── routes/            # Auth, CRM, Sales, Inventory, Procurement, Finance APIs
│   │   ├── app.ts             # Express application configuration
│   │   └── server.ts          # Server entrypoint
│   ├── prisma/
│   │   ├── schema.prisma      # Multi-tenant PostgreSQL database schema
│   │   └── seed.ts            # Seed script for demo accounts and entities
│   ├── package.json
│   ├── tsconfig.json
│   └── vercel.json
│
├── docs/                      # Architectural & Integration documentation
└── README.md                  # Project overview and documentation
```

---

## 🚀 Quick Start & Local Setup

### 1. Prerequisites
- **Node.js**: v18.0.0 or higher
- **PostgreSQL**: v14 or higher (or Docker)
- **Git**

---

### 2. Clone and Install Dependencies

```bash
# Clone the repository
git clone https://github.com/your-username/complete-erp.git
cd complete-erp

# Install Backend dependencies
cd backend
npm install

# Install Frontend dependencies
cd ../apps/web
npm install
```

---

### 3. Setup Database & Backend

1. Create a `.env` file in `backend/`:
   ```env
   PORT=5001
   NODE_ENV=development
   DATABASE_URL="postgresql://postgres:password@localhost:5432/erp_dev"
   FRONTEND_URL="http://localhost:5173"
   JWT_SECRET="your-super-secret-jwt-key"
   JWT_EXPIRES_IN="8h"
   ```

2. Run Prisma migrations and seed sample data:
   ```bash
   cd backend
   npx prisma migrate dev --name init
   npm run db:seed
   ```

3. Start the backend development server:
   ```bash
   npm run dev
   # Backend runs on http://localhost:5001
   ```

---

### 4. Setup Frontend

1. Create a `.env` file in `apps/web/`:
   ```env
   VITE_API_URL=http://localhost:5001/api
   ```

2. Start the Vite development server:
   ```bash
   cd apps/web
   npm run dev
   # Frontend runs on http://localhost:5173
   ```

3. Open `http://localhost:5173` in your browser.

---

## 🌍 Environment Variables

### Backend (`backend/.env`)
| Variable | Description | Example |
| :--- | :--- | :--- |
| `PORT` | API server listening port | `5001` |
| `NODE_ENV` | Environment mode | `development` / `production` |
| `DATABASE_URL` | PostgreSQL connection string | `postgresql://user:pass@host:5432/dbname` |
| `FRONTEND_URL` | Allowed CORS origin | `http://localhost:5173` |
| `JWT_SECRET` | Secret key for signing JWT tokens | `min-32-chars-random-string` |
| `JWT_EXPIRES_IN` | Token lifespan | `8h` or `7d` |

### Frontend (`apps/web/.env`)
| Variable | Description | Example |
| :--- | :--- | :--- |
| `VITE_API_URL` | Base endpoint for the backend API | `http://localhost:5001/api` |

---

## 🗄️ Database & Migration Guide

The project uses **Prisma ORM** with PostgreSQL.

| Command | Purpose |
| :--- | :--- |
| `npm run prisma:generate` | Generate Prisma Client types |
| `npm run prisma:migrate` | Create and apply migrations during development |
| `npm run prisma:deploy` | Apply pending migrations in production |
| `npm run prisma:studio` | Launch visual browser GUI on `http://localhost:5555` |
| `npm run db:seed` | Seed initial organizations, roles, and test records |

---

## 🌐 Deployment Guide

### Architecture
- **Database**: Cloud PostgreSQL ([Neon.tech](https://neon.tech) / [Supabase](https://supabase.com))
- **Backend API**: [Render.com](https://render.com) or [Railway.app](https://railway.app)
- **Frontend App**: [Vercel](https://vercel.com) or [Netlify](https://netlify.com)

### Steps
1. **Database**: Create a PostgreSQL instance on Neon/Supabase and copy the connection string.
2. **Backend**:
   - Create a Web Service on Render/Railway pointing to the `backend/` root.
   - Build Command: `npm install && npx prisma generate && npm run build`
   - Start Command: `npm start`
   - Set environment variables (`DATABASE_URL`, `JWT_SECRET`, `FRONTEND_URL`, `NODE_ENV=production`).
3. **Frontend**:
   - Create a Project on Vercel pointing to `apps/web`.
   - Set `VITE_API_URL` to `https://your-backend-service.onrender.com/api`.
   - Deploy and link the frontend domain back to `FRONTEND_URL` in backend settings.

---

## 📚 API Reference

All protected endpoints require the header:
`Authorization: Bearer <JWT_TOKEN>`

| Endpoint | Method | Description |
| :--- | :--- | :--- |
| `/api/health` | `GET` | Service & database health check |
| `/api/auth/register` | `POST` | Register new organization & admin account |
| `/api/auth/login` | `POST` | Authenticate user & retrieve JWT token |
| `/api/auth/me` | `GET` | Get current authenticated user profile |
| `/api/crm/companies` | `GET`, `POST` | List & create client companies |
| `/api/crm/contacts` | `GET`, `POST` | List & create contacts |
| `/api/crm/leads` | `GET`, `POST` | List & update lead pipeline |
| `/api/crm/deals` | `GET`, `POST` | List & update sales deals |
| `/api/sales/quotations` | `GET`, `POST` | Create & manage quotations |
| `/api/sales/orders` | `GET`, `POST` | Manage sales orders |
| `/api/inventory/products` | `GET`, `POST` | Catalog product items |
| `/api/inventory/warehouses`| `GET`, `POST` | Manage warehouses & stock |
| `/api/procurement/suppliers`| `GET`, `POST`| Supplier directory |
| `/api/procurement/purchase-orders` | `GET`, `POST` | Manage POs & Goods Receipts |
| `/api/finance/invoices` | `GET`, `POST` | Customer invoices & billing |
| `/api/finance/payments` | `GET`, `POST` | Record payments & receipts |
| `/api/finance/expenses` | `GET`, `POST` | Company expense tracking |

---

## 🔒 Security & Best Practices

- **Password Hashing**: Salted bcrypt password hashing for all user accounts.
- **SQL Injection Prevention**: Strongly-typed parameterized queries powered by Prisma ORM.
- **HTTP Security**: [Helmet](https://helmetjs.github.io/) headers enabled to prevent XSS, clickjacking, and MIME sniffing.
- **CORS Restricted**: Controlled origin access ensuring only authorized frontend origins can query the API.
- **Multi-Tenant Isolation**: Strict DB query scoping ensuring users only access their own organization's data.

---

## 📄 License

This project is licensed under the **MIT License**.
