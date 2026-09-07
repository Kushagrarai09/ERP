# PHASE 2 - QUICK START GUIDE

## ✅ What's Complete

✅ **Prisma Schema** - 24 models, 12 enums, complete ERP database design  
✅ **Seed Data** - Realistic Indian business data with cross-module workflows  
✅ **Package Scripts** - npm run db:setup for automated migration + seed  
✅ **Documentation** - Full reports and setup instructions  

---

## 🚀 Start PostgreSQL (Choose One)

### Option 1: Docker (Recommended)
```powershell
docker run --name erp-postgres `
  -e POSTGRES_PASSWORD=password `
  -e POSTGRES_DB=erp_dev `
  -p 5432:5432 `
  -d postgres:15
```

Wait 5-10 seconds, then proceed.

### Option 2: Native PostgreSQL
```bash
createdb -U postgres erp_dev
psql -U postgres -d erp_dev -c "SELECT 1;"
```

---

## 📦 Run Migration & Seed

```bash
cd backend
npm run db:setup
```

This will:
1. Run `prisma migrate dev` → Creates all 24 tables
2. Run `npm run db:seed` → Loads realistic demo data
3. Setup is complete! ✅

---

## 🔍 Verify Everything

```bash
npm run prisma:studio
```

Opens Prisma Studio at http://localhost:5555  
Browse all tables and records to verify.

---

## 📊 What You Get

**24 Database Tables:**
- 2 SaaS models (Organization, User)
- 5 CRM models (Company, Contact, Lead, Deal, Activity)
- 4 Sales models (Quotation, QuotationItem, SalesOrder, SalesOrderItem)
- 4 Inventory models (Product, Warehouse, Stock, StockMovement)
- 5 Procurement models (Supplier, PurchaseOrder, PurchaseOrderItem, GoodsReceipt, GoodsReceiptItem)
- 5 Finance models (Invoice, InvoiceItem, Payment, Expense, Account)

**Complete Workflows Preserved:**
```
Deal → Quotation → SalesOrder → Invoice → Payment
Supplier → PurchaseOrder → GoodsReceipt → StockMovement
Product + Warehouse → Stock (Inventory Position)
```

**Seed Data Loaded:**
- 1 Organization (TechVision Solutions)
- 3 Users (Admin, Sales, Inventory)
- 3 Companies (Infosys, Reliance, TCS)
- 3 Deals (₹2.5M, ₹1.8M, ₹1.2M)
- 4 Products (ERP License, Services, Support, Training)
- 2 Warehouses
- Complete workflow example (Deal→Quotation→Order→Invoice→Payment)

---

## 🔧 Common Commands

```bash
# View database visually
npm run prisma:studio

# Create migration (if schema changes)
npm run prisma:migrate

# Generate Prisma Client (if schema changes)
npm run prisma:generate

# Reset database (WARNING: deletes all data)
npx prisma migrate reset

# View migration history
npx prisma migrate status
```

---

## ✅ Success Indicators

After `npm run db:setup` completes:
- [ ] No migration errors
- [ ] No seed errors
- [ ] Prisma Studio shows all 24 tables
- [ ] Tables have data (Organizations, Users, Companies, etc.)
- [ ] Stock unique constraint verified
- [ ] All foreign keys present

---

## 🎯 Next: Phase 3 (Backend APIs)

Once database is ready, next phase will implement:
- REST API endpoints for each module
- CRUD operations
- Authentication & authorization
- Cross-module query patterns
- Error handling
- Pagination & filtering

---

## ❓ Troubleshooting

### "Can't reach database server at localhost:5432"
→ PostgreSQL not running. Start it first (see above).

### "Duplicate key violation on organizations"
→ Run `npx prisma migrate reset` to clear and re-seed.

### "relation does not exist"
→ Migration didn't complete. Check errors above.

### Port 5432 already in use
```bash
docker rm -f erp-postgres 2>$null
# Or kill the process on port 5432
lsof -i :5432 | grep LISTEN | awk '{print $2}' | xargs kill -9
```

---

## 📚 Documentation Files

- **PHASE_2_DATABASE_SCHEMA_REPORT.md** - Complete database design (500+ lines)
- **DATABASE_SETUP.md** - Detailed PostgreSQL setup instructions
- **prisma/schema.prisma** - Complete Prisma ORM schema
- **prisma/seed.ts** - Seed data file with 50+ records

---

## 🎯 Database Design Highlights

✅ **24 Core Tables** - All 5 ERP modules covered  
✅ **Multi-Tenant** - Every record linked to Organization  
✅ **Proper Relationships** - 40+ foreign keys with appropriate cascade  
✅ **Decimal for Money** - No floating-point errors (Decimal(15,2))  
✅ **30+ Indexes** - Strategic indexes for performance  
✅ **12 Enums** - Status types aligned with frontend  
✅ **Unique Constraints** - Prevent duplicates where needed  
✅ **Workflow Preservation** - Deal→Quote→Order→Invoice paths intact  
✅ **Realistic Seed Data** - ₹-based Indian business context  
✅ **Production Ready** - No breaking changes expected  

---

**Everything is ready! Start PostgreSQL and run `npm run db:setup` to get the database running. 🚀**
