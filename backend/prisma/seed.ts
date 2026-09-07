import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database with demo data...\n');

  // Clear existing data
  await prisma.payment.deleteMany();
  await prisma.expense.deleteMany();
  await prisma.account.deleteMany();
  await prisma.invoiceItem.deleteMany();
  await prisma.invoice.deleteMany();
  await prisma.goodsReceiptItem.deleteMany();
  await prisma.goodsReceipt.deleteMany();
  await prisma.purchaseOrderItem.deleteMany();
  await prisma.purchaseOrder.deleteMany();
  await prisma.stockMovement.deleteMany();
  await prisma.stock.deleteMany();
  await prisma.warehouse.deleteMany();
  await prisma.product.deleteMany();
  await prisma.supplier.deleteMany();
  await prisma.salesOrderItem.deleteMany();
  await prisma.salesOrder.deleteMany();
  await prisma.quotationItem.deleteMany();
  await prisma.quotation.deleteMany();
  await prisma.activity.deleteMany();
  await prisma.deal.deleteMany();
  await prisma.lead.deleteMany();
  await prisma.contact.deleteMany();
  await prisma.company.deleteMany();
  await prisma.user.deleteMany();
  await prisma.organization.deleteMany();

  // Create Organization
  const org = await prisma.organization.create({
    data: {
      name: 'TechVision Solutions',
      email: 'info@techvision.com',
      phone: '+91-11-1234-5678',
      address: '123 Business Park, MG Road',
      city: 'Bangalore',
      state: 'Karnataka',
      postalCode: '560001',
      country: 'India',
      industry: 'Software & IT Solutions',
      employeeCount: 150,
      website: 'www.techvision.com',
    },
  });

  console.log(`✅ Organization created: ${org.name}`);

  // Create Users
  const adminUser = await prisma.user.create({
    data: {
      email: 'admin@techvision.com',
      name: 'Rajesh Kumar',
      password: 'hashed_password_here',
      role: 'ADMIN',
      organizationId: org.id,
    },
  });

  const salesUser = await prisma.user.create({
    data: {
      email: 'sales@techvision.com',
      name: 'Priya Singh',
      password: 'hashed_password_here',
      role: 'SALES',
      organizationId: org.id,
    },
  });

  const inventoryUser = await prisma.user.create({
    data: {
      email: 'inventory@techvision.com',
      name: 'Vikram Patel',
      password: 'hashed_password_here',
      role: 'INVENTORY',
      organizationId: org.id,
    },
  });

  console.log(`✅ Users created: ${adminUser.name}, ${salesUser.name}, ${inventoryUser.name}`);

  // ============================================
  // CRM DATA
  // ============================================

  // Companies
  const company1 = await prisma.company.create({
    data: {
      name: 'Infosys Limited',
      email: 'procurement@infosys.com',
      phone: '+91-80-1234-5678',
      address: '44 Electronic City Phase-I',
      city: 'Bangalore',
      state: 'Karnataka',
      postalCode: '560100',
      country: 'India',
      industry: 'IT Services',
      employeeCount: 100000,
      revenue: new Prisma.Decimal('15000000000'),
      website: 'www.infosys.com',
      ownerName: 'Narayana Murthy',
      organizationId: org.id,
    },
  });

  const company2 = await prisma.company.create({
    data: {
      name: 'Reliance Industries',
      email: 'sales@reliance.com',
      phone: '+91-22-3555-5555',
      address: '3-A, Maker Chambers IV, Nariman Point',
      city: 'Mumbai',
      state: 'Maharashtra',
      postalCode: '400021',
      country: 'India',
      industry: 'Energy & Petrochemicals',
      employeeCount: 340000,
      revenue: new Prisma.Decimal('78000000000'),
      website: 'www.reliance.com',
      ownerName: 'Mukesh Ambani',
      organizationId: org.id,
    },
  });

  const company3 = await prisma.company.create({
    data: {
      name: 'TCS (Tata Consultancy Services)',
      email: 'business@tcs.com',
      phone: '+91-22-6778-9999',
      address: 'Tata Consultancy Services Building, 25 Park Street',
      city: 'Kolkata',
      state: 'West Bengal',
      postalCode: '700016',
      country: 'India',
      industry: 'IT & Business Services',
      employeeCount: 590000,
      revenue: new Prisma.Decimal('25000000000'),
      website: 'www.tcs.com',
      ownerName: 'N Chandrasekaran',
      organizationId: org.id,
    },
  });

  console.log(`✅ Companies created: ${company1.name}, ${company2.name}, ${company3.name}`);

  // Contacts
  const contact1 = await prisma.contact.create({
    data: {
      firstName: 'Arjun',
      lastName: 'Sharma',
      email: 'arjun.sharma@infosys.com',
      phone: '+91-98765-43210',
      title: 'Head of Procurement',
      department: 'Procurement',
      companyId: company1.id,
      organizationId: org.id,
    },
  });

  const contact2 = await prisma.contact.create({
    data: {
      firstName: 'Meera',
      lastName: 'Kapoor',
      email: 'meera.kapoor@reliance.com',
      phone: '+91-98765-43211',
      title: 'Supply Chain Manager',
      department: 'Supply Chain',
      companyId: company2.id,
      organizationId: org.id,
    },
  });

  const contact3 = await prisma.contact.create({
    data: {
      firstName: 'Amit',
      lastName: 'Verma',
      email: 'amit.verma@tcs.com',
      phone: '+91-98765-43212',
      title: 'Accounts Manager',
      department: 'Accounts',
      companyId: company3.id,
      organizationId: org.id,
    },
  });

  console.log(`✅ Contacts created: ${contact1.firstName}, ${contact2.firstName}, ${contact3.firstName}`);

  // Leads
  const lead1 = await prisma.lead.create({
    data: {
      title: 'Looking for ERP Solution',
      email: 'inquiry@newtech.com',
      phone: '+91-11-5555-9999',
      status: 'QUALIFIED',
      companyId: company1.id,
      contactId: contact1.id,
      organizationId: org.id,
      source: 'Website',
      budget: new Prisma.Decimal('5000000'),
    },
  });

  const lead2 = await prisma.lead.create({
    data: {
      title: 'CRM Implementation Request',
      email: 'rfi@fastgrow.com',
      phone: '+91-22-7777-8888',
      status: 'PROPOSAL',
      companyId: company2.id,
      contactId: contact2.id,
      organizationId: org.id,
      source: 'Email',
      budget: new Prisma.Decimal('3000000'),
    },
  });

  console.log(`✅ Leads created`);

  // Deals
  const deal1 = await prisma.deal.create({
    data: {
      title: 'Infosys ERP Implementation',
      value: new Prisma.Decimal('2500000'),
      probability: 75,
      stage: 'PROPOSAL',
      expectedCloseDate: new Date('2024-03-31'),
      companyId: company1.id,
      contactId: contact1.id,
      organizationId: org.id,
    },
  });

  const deal2 = await prisma.deal.create({
    data: {
      title: 'Reliance CRM Solution',
      value: new Prisma.Decimal('1800000'),
      probability: 60,
      stage: 'NEGOTIATION',
      expectedCloseDate: new Date('2024-02-28'),
      companyId: company2.id,
      contactId: contact2.id,
      organizationId: org.id,
    },
  });

  const deal3 = await prisma.deal.create({
    data: {
      title: 'TCS Inventory Management',
      value: new Prisma.Decimal('1200000'),
      probability: 45,
      stage: 'DISCOVERY',
      expectedCloseDate: new Date('2024-04-30'),
      companyId: company3.id,
      contactId: contact3.id,
      organizationId: org.id,
    },
  });

  console.log(`✅ Deals created: ${deal1.title}, ${deal2.title}, ${deal3.title}`);

  // Activities
  await prisma.activity.create({
    data: {
      title: 'Follow-up Call',
      description: 'Discussed pricing and timeline',
      type: 'CALL',
      dealId: deal1.id,
      organizationId: org.id,
      dueDate: new Date('2024-01-25'),
      completedDate: new Date('2024-01-20'),
    },
  });

  console.log(`✅ Activities created`);

  // ============================================
  // INVENTORY DATA
  // ============================================

  // Products
  const product1 = await prisma.product.create({
    data: {
      code: 'PROD-001',
      name: 'Enterprise License - 100 Users',
      description: 'ERP Software License for 100 concurrent users',
      status: 'ACTIVE',
      cost: new Prisma.Decimal('500000'),
      sellingPrice: new Prisma.Decimal('750000'),
      unit: 'LICENSE',
      organizationId: org.id,
    },
  });

  const product2 = await prisma.product.create({
    data: {
      code: 'PROD-002',
      name: 'Implementation Services',
      description: 'ERP Implementation and Setup Services',
      status: 'ACTIVE',
      cost: new Prisma.Decimal('100000'),
      sellingPrice: new Prisma.Decimal('200000'),
      unit: 'DAYS',
      organizationId: org.id,
    },
  });

  const product3 = await prisma.product.create({
    data: {
      code: 'PROD-003',
      name: 'Support Package - Annual',
      description: '24/7 Technical Support for 1 year',
      status: 'ACTIVE',
      cost: new Prisma.Decimal('150000'),
      sellingPrice: new Prisma.Decimal('250000'),
      unit: 'SUBSCRIPTION',
      organizationId: org.id,
    },
  });

  const product4 = await prisma.product.create({
    data: {
      code: 'PROD-004',
      name: 'Training Workshop - 5 Days',
      description: 'Onsite training for users',
      status: 'ACTIVE',
      cost: new Prisma.Decimal('50000'),
      sellingPrice: new Prisma.Decimal('100000'),
      unit: 'DAYS',
      organizationId: org.id,
    },
  });

  console.log(`✅ Products created: ${product1.name}, ${product2.name}, ${product3.name}, ${product4.name}`);

  // Warehouses
  const warehouse1 = await prisma.warehouse.create({
    data: {
      name: 'Main Warehouse - Bangalore',
      location: 'Whitefield',
      address: 'Tech Park Building A, Whitefield',
      city: 'Bangalore',
      state: 'Karnataka',
      organizationId: org.id,
    },
  });

  const warehouse2 = await prisma.warehouse.create({
    data: {
      name: 'Regional Warehouse - Mumbai',
      location: 'Navi Mumbai',
      address: 'Industrial Park, Navi Mumbai',
      city: 'Mumbai',
      state: 'Maharashtra',
      organizationId: org.id,
    },
  });

  console.log(`✅ Warehouses created: ${warehouse1.name}, ${warehouse2.name}`);

  // Stock
  const stock1 = await prisma.stock.create({
    data: {
      productId: product1.id,
      warehouseId: warehouse1.id,
      quantity: new Prisma.Decimal('50'),
      reservedQuantity: new Prisma.Decimal('10'),
      organizationId: org.id,
    },
  });

  const stock2 = await prisma.stock.create({
    data: {
      productId: product2.id,
      warehouseId: warehouse1.id,
      quantity: new Prisma.Decimal('100'),
      reservedQuantity: new Prisma.Decimal('20'),
      organizationId: org.id,
    },
  });

  const stock3 = await prisma.stock.create({
    data: {
      productId: product3.id,
      warehouseId: warehouse2.id,
      quantity: new Prisma.Decimal('75'),
      reservedQuantity: new Prisma.Decimal('5'),
      organizationId: org.id,
    },
  });

  console.log(`✅ Stock created for products`);

  // ============================================
  // SALES DATA (Deal → Quotation → Order → Invoice)
  // ============================================

  // Quotation from Deal 1
  const quotation1 = await prisma.quotation.create({
    data: {
      code: 'QT-00001',
      companyId: company1.id,
      contactId: contact1.id,
      dealId: deal1.id,
      status: 'ACCEPTED',
      subtotal: new Prisma.Decimal('2300000'),
      tax: new Prisma.Decimal('414000'),
      total: new Prisma.Decimal('2714000'),
      expiryDate: new Date('2024-02-15'),
      organizationId: org.id,
    },
  });

  // Quotation Items
  await prisma.quotationItem.create({
    data: {
      quotationId: quotation1.id,
      productId: product1.id,
      quantity: new Prisma.Decimal('3'),
      unitPrice: new Prisma.Decimal('750000'),
      lineTotal: new Prisma.Decimal('2250000'),
    },
  });

  await prisma.quotationItem.create({
    data: {
      quotationId: quotation1.id,
      productId: product2.id,
      quantity: new Prisma.Decimal('3'),
      unitPrice: new Prisma.Decimal('200000'),
      lineTotal: new Prisma.Decimal('600000'),
    },
  });

  console.log(`✅ Quotation created: ${quotation1.code}`);

  // Sales Order from Quotation
  const salesOrder1 = await prisma.salesOrder.create({
    data: {
      code: 'SO-00001',
      companyId: company1.id,
      contactId: contact1.id,
      dealId: deal1.id,
      quotationId: quotation1.id,
      status: 'CONFIRMED',
      subtotal: new Prisma.Decimal('2300000'),
      tax: new Prisma.Decimal('414000'),
      total: new Prisma.Decimal('2714000'),
      dueDate: new Date('2024-02-28'),
      organizationId: org.id,
    },
  });

  // Sales Order Items
  await prisma.salesOrderItem.create({
    data: {
      salesOrderId: salesOrder1.id,
      productId: product1.id,
      quantity: new Prisma.Decimal('3'),
      unitPrice: new Prisma.Decimal('750000'),
      lineTotal: new Prisma.Decimal('2250000'),
    },
  });

  await prisma.salesOrderItem.create({
    data: {
      salesOrderId: salesOrder1.id,
      productId: product2.id,
      quantity: new Prisma.Decimal('3'),
      unitPrice: new Prisma.Decimal('200000'),
      lineTotal: new Prisma.Decimal('600000'),
    },
  });

  console.log(`✅ Sales Order created: ${salesOrder1.code}`);

  // Stock Movement (Sale OUT)
  await prisma.stockMovement.create({
    data: {
      productId: product1.id,
      warehouseId: warehouse1.id,
      type: 'SALE',
      direction: 'OUT',
      quantity: new Prisma.Decimal('3'),
      reference: salesOrder1.code,
      salesOrderId: salesOrder1.id,
      organizationId: org.id,
    },
  });

  console.log(`✅ Stock movement recorded for sale`);

  // Second Sales Order
  const quotation2 = await prisma.quotation.create({
    data: {
      code: 'QT-00002',
      companyId: company2.id,
      contactId: contact2.id,
      dealId: deal2.id,
      status: 'SENT',
      subtotal: new Prisma.Decimal('1600000'),
      tax: new Prisma.Decimal('288000'),
      total: new Prisma.Decimal('1888000'),
      organizationId: org.id,
    },
  });

  await prisma.quotationItem.create({
    data: {
      quotationId: quotation2.id,
      productId: product1.id,
      quantity: new Prisma.Decimal('2'),
      unitPrice: new Prisma.Decimal('750000'),
      lineTotal: new Prisma.Decimal('1500000'),
    },
  });

  const salesOrder2 = await prisma.salesOrder.create({
    data: {
      code: 'SO-00002',
      companyId: company2.id,
      contactId: contact2.id,
      dealId: deal2.id,
      quotationId: quotation2.id,
      status: 'DRAFT',
      subtotal: new Prisma.Decimal('1600000'),
      tax: new Prisma.Decimal('288000'),
      total: new Prisma.Decimal('1888000'),
      organizationId: org.id,
    },
  });

  await prisma.salesOrderItem.create({
    data: {
      salesOrderId: salesOrder2.id,
      productId: product1.id,
      quantity: new Prisma.Decimal('2'),
      unitPrice: new Prisma.Decimal('750000'),
      lineTotal: new Prisma.Decimal('1500000'),
    },
  });

  console.log(`✅ Second quotation and sales order created`);

  // ============================================
  // FINANCE DATA (Invoice → Payment)
  // ============================================

  // Invoice from Sales Order
  const invoice1 = await prisma.invoice.create({
    data: {
      code: 'INV-00001',
      companyId: company1.id,
      salesOrderId: salesOrder1.id,
      status: 'PARTIAL_PAID',
      subtotal: new Prisma.Decimal('2300000'),
      tax: new Prisma.Decimal('414000'),
      total: new Prisma.Decimal('2714000'),
      paidAmount: new Prisma.Decimal('1357000'),
      outstandingAmount: new Prisma.Decimal('1357000'),
      dueDate: new Date('2024-03-15'),
      organizationId: org.id,
    },
  });

  // Invoice Items
  await prisma.invoiceItem.create({
    data: {
      invoiceId: invoice1.id,
      productId: product1.id,
      quantity: new Prisma.Decimal('3'),
      unitPrice: new Prisma.Decimal('750000'),
      lineTotal: new Prisma.Decimal('2250000'),
    },
  });

  await prisma.invoiceItem.create({
    data: {
      invoiceId: invoice1.id,
      productId: product2.id,
      quantity: new Prisma.Decimal('3'),
      unitPrice: new Prisma.Decimal('200000'),
      lineTotal: new Prisma.Decimal('600000'),
    },
  });

  console.log(`✅ Invoice created: ${invoice1.code}`);

  // Payment
  const payment1 = await prisma.payment.create({
    data: {
      invoiceId: invoice1.id,
      amount: new Prisma.Decimal('1357000'),
      method: 'BANK_TRANSFER',
      transactionRef: 'TXN123456789',
      paymentDate: new Date('2024-02-10'),
      organizationId: org.id,
    },
  });

  console.log(`✅ Payment created: ₹${payment1.amount} received`);

  // Second Invoice
  const invoice2 = await prisma.invoice.create({
    data: {
      code: 'INV-00002',
      companyId: company2.id,
      salesOrderId: salesOrder2.id,
      status: 'ISSUED',
      subtotal: new Prisma.Decimal('1600000'),
      tax: new Prisma.Decimal('288000'),
      total: new Prisma.Decimal('1888000'),
      paidAmount: new Prisma.Decimal('0'),
      outstandingAmount: new Prisma.Decimal('1888000'),
      dueDate: new Date('2024-03-20'),
      organizationId: org.id,
    },
  });

  console.log(`✅ Second invoice created: ${invoice2.code}`);

  // ============================================
  // PROCUREMENT DATA (PO → GR → Stock Movement)
  // ============================================

  // Suppliers
  const supplier1 = await prisma.supplier.create({
    data: {
      name: 'Global Software Services Ltd',
      email: 'sales@globalsoftware.com',
      phone: '+1-415-555-0123',
      address: '123 Tech Boulevard',
      city: 'San Francisco',
      state: 'CA',
      postalCode: '94102',
      country: 'USA',
      contactPerson: 'John Anderson',
      paymentTerms: 'Net 30',
      organizationId: org.id,
    },
  });

  const supplier2 = await prisma.supplier.create({
    data: {
      name: 'Cloud Infrastructure Solutions',
      email: 'business@cloudsol.com',
      phone: '+44-20-7946-0958',
      address: '456 Enterprise Road',
      city: 'London',
      state: 'England',
      postalCode: 'EC2A 1AB',
      country: 'UK',
      contactPerson: 'Sarah Williams',
      paymentTerms: 'Net 45',
      organizationId: org.id,
    },
  });

  console.log(`✅ Suppliers created: ${supplier1.name}, ${supplier2.name}`);

  // Purchase Order
  const po1 = await prisma.purchaseOrder.create({
    data: {
      code: 'PO-00001',
      supplierId: supplier1.id,
      warehouseId: warehouse1.id,
      status: 'RECEIVED',
      subtotal: new Prisma.Decimal('500000'),
      tax: new Prisma.Decimal('90000'),
      total: new Prisma.Decimal('590000'),
      expectedDelivery: new Date('2024-01-30'),
      organizationId: org.id,
    },
  });

  // PO Items
  await prisma.purchaseOrderItem.create({
    data: {
      purchaseOrderId: po1.id,
      productId: product1.id,
      quantity: new Prisma.Decimal('5'),
      unitPrice: new Prisma.Decimal('100000'),
      lineTotal: new Prisma.Decimal('500000'),
    },
  });

  console.log(`✅ Purchase Order created: ${po1.code}`);

  // Goods Receipt
  const gr1 = await prisma.goodsReceipt.create({
    data: {
      code: 'GR-00001',
      purchaseOrderId: po1.id,
      warehouseId: warehouse1.id,
      status: 'VERIFIED',
      receivedDate: new Date('2024-01-28'),
      organizationId: org.id,
    },
  });

  // GR Items
  await prisma.goodsReceiptItem.create({
    data: {
      goodsReceiptId: gr1.id,
      productId: product1.id,
      receivedQuantity: new Prisma.Decimal('5'),
    },
  });

  console.log(`✅ Goods Receipt created: ${gr1.code}`);

  // Stock Movement (Purchase IN)
  await prisma.stockMovement.create({
    data: {
      productId: product1.id,
      warehouseId: warehouse1.id,
      type: 'PURCHASE',
      direction: 'IN',
      quantity: new Prisma.Decimal('5'),
      reference: gr1.code,
      purchaseOrderId: po1.id,
      goodsReceiptId: gr1.id,
      organizationId: org.id,
    },
  });

  console.log(`✅ Stock movement recorded for purchase`);

  // ============================================
  // FINANCE - ACCOUNTS & EXPENSES
  // ============================================

  // Accounts
  const arAccount = await prisma.account.create({
    data: {
      name: 'Accounts Receivable',
      accountType: 'ACCOUNTS_RECEIVABLE',
      balance: new Prisma.Decimal('2714000'),
      organizationId: org.id,
    },
  });

  const apAccount = await prisma.account.create({
    data: {
      name: 'Accounts Payable',
      accountType: 'ACCOUNTS_PAYABLE',
      balance: new Prisma.Decimal('590000'),
      organizationId: org.id,
    },
  });

  const revenueAccount = await prisma.account.create({
    data: {
      name: 'Software License Revenue',
      accountType: 'REVENUE',
      balance: new Prisma.Decimal('2714000'),
      organizationId: org.id,
    },
  });

  console.log(`✅ Accounts created: AR, AP, Revenue`);

  // Expenses
  await prisma.expense.create({
    data: {
      category: 'SALARIES',
      amount: new Prisma.Decimal('500000'),
      description: 'January Payroll',
      expenseDate: new Date('2024-01-31'),
      organizationId: org.id,
    },
  });

  await prisma.expense.create({
    data: {
      category: 'UTILITIES',
      amount: new Prisma.Decimal('50000'),
      description: 'Office utilities and internet',
      expenseDate: new Date('2024-01-25'),
      organizationId: org.id,
    },
  });

  await prisma.expense.create({
    data: {
      category: 'SUPPLIES',
      amount: new Prisma.Decimal('25000'),
      description: 'Office supplies',
      supplierId: supplier2.id,
      expenseDate: new Date('2024-01-20'),
      organizationId: org.id,
    },
  });

  console.log(`✅ Expenses created`);

  // ============================================
  // SUMMARY
  // ============================================

  console.log('\n✅ Database seeded successfully!\n');
  console.log('📊 Seed Summary:');
  console.log(`   Organizations: 1`);
  console.log(`   Users: 3`);
  console.log(`   Companies: 3`);
  console.log(`   Contacts: 3`);
  console.log(`   Leads: 2`);
  console.log(`   Deals: 3`);
  console.log(`   Products: 4`);
  console.log(`   Warehouses: 2`);
  console.log(`   Stock Records: 3`);
  console.log(`   Quotations: 2`);
  console.log(`   Sales Orders: 2`);
  console.log(`   Invoices: 2`);
  console.log(`   Payments: 1`);
  console.log(`   Suppliers: 2`);
  console.log(`   Purchase Orders: 1`);
  console.log(`   Goods Receipts: 1`);
  console.log(`   Stock Movements: 2`);
  console.log(`   Accounts: 3`);
  console.log(`   Expenses: 3`);
  console.log('\n💰 Sample Financial Data:');
  console.log(`   Deal 1 Value: ₹2,500,000`);
  console.log(`   Deal 2 Value: ₹1,800,000`);
  console.log(`   Sales Order Total: ₹2,714,000`);
  console.log(`   Invoice 1 (Partial Paid): ₹1,357,000 / ₹2,714,000`);
  console.log(`   PO Total: ₹590,000\n`);
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error('❌ Seed Error:', e);
    await prisma.$disconnect();
    process.exit(1);
  });
