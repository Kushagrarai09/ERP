// Finance V1 Mock Data with Indian Business Accounts (₹ Currency)

import { Invoice, PaymentRecord, Expense, Account } from '../types/finance';

export const MOCK_INVOICES: Invoice[] = [
  {
    id: 'inv-1',
    code: 'INV-00124',
    customerName: 'Acme Corp',
    companyId: 'comp-1',
    salesOrderId: 'so-1',
    salesOrderCode: 'SO-00124',
    items: [
      { id: 'ii-1', description: 'ERP Cloud Enterprise License', quantity: 10, unitPrice: 70000, total: 700000 },
      { id: 'ii-2', description: 'Implementation & Training Support', quantity: 10, unitPrice: 15000, total: 150000 },
    ],
    subtotal: 850000,
    tax: 153000, // 18% GST
    total: 1003000,
    paidAmount: 500000,
    outstandingAmount: 503000,
    currency: '₹',
    status: 'sent',
    issueDate: new Date('2024-08-22'),
    dueDate: new Date('2024-09-22'),
    notes: 'Payment terms: 30 days NET.',
  },
  {
    id: 'inv-2',
    code: 'INV-00123',
    customerName: 'Globex Industries',
    companyId: 'comp-2',
    salesOrderId: 'so-2',
    salesOrderCode: 'SO-00123',
    items: [
      { id: 'ii-3', description: 'Factory Automation Gateway Hub', quantity: 2, unitPrice: 180000, total: 360000 },
      { id: 'ii-4', description: 'IoT Sensors & Cabling Kit', quantity: 10, unitPrice: 6000, total: 60000 },
    ],
    subtotal: 420000,
    tax: 75600,
    total: 495600,
    paidAmount: 495600,
    outstandingAmount: 0,
    currency: '₹',
    status: 'paid',
    issueDate: new Date('2024-08-20'),
    dueDate: new Date('2024-09-20'),
    notes: 'Paid in full via Bank Transfer.',
  },
  {
    id: 'inv-3',
    code: 'INV-00122',
    customerName: 'StartUp Innovations',
    companyId: 'comp-4',
    salesOrderId: 'so-3',
    salesOrderCode: 'SO-00122',
    items: [
      { id: 'ii-5', description: 'Fintech Payment Gateway Connector', quantity: 1, unitPrice: 1000000, total: 1000000 },
    ],
    subtotal: 1000000,
    tax: 180000,
    total: 1180000,
    paidAmount: 0,
    outstandingAmount: 1180000,
    currency: '₹',
    status: 'overdue',
    issueDate: new Date('2024-07-15'),
    dueDate: new Date('2024-08-15'),
    notes: 'Overdue payment reminder sent.',
  },
];

export const MOCK_PAYMENTS: PaymentRecord[] = [
  {
    id: 'pay-1',
    code: 'PAY-00124',
    invoiceCode: 'INV-00124',
    invoiceId: 'inv-1',
    customerName: 'Acme Corp',
    amount: 500000,
    method: 'Bank Transfer',
    paymentDate: new Date('2024-08-28'),
    status: 'Success',
    referenceNumber: 'NEFT-HDFC-99120',
  },
  {
    id: 'pay-2',
    code: 'PAY-00123',
    invoiceCode: 'INV-00123',
    invoiceId: 'inv-2',
    customerName: 'Globex Industries',
    amount: 495600,
    method: 'UPI',
    paymentDate: new Date('2024-08-25'),
    status: 'Success',
    referenceNumber: 'UPI-RAZOR-8812',
  },
];

export const MOCK_EXPENSES: Expense[] = [
  {
    id: 'exp-1',
    code: 'EXP-001',
    title: 'Monthly Cloud Infrastructure & AWS Servers',
    category: 'Software',
    amount: 145000,
    date: new Date('2024-08-28'),
    vendor: 'AWS India Pvt Ltd',
    description: 'Production server cluster hosting fees.',
    status: 'Approved',
  },
  {
    id: 'exp-2',
    code: 'EXP-002',
    title: 'Mumbai Logistics Hub Office Rent',
    category: 'Office',
    amount: 350000,
    date: new Date('2024-08-01'),
    vendor: 'Bhiwandi Realty Trust',
    description: 'Monthly warehouse facility rental.',
    status: 'Approved',
  },
  {
    id: 'exp-3',
    code: 'EXP-003',
    title: 'Client Visit & Executive Flight Travel',
    category: 'Travel',
    amount: 42000,
    date: new Date('2024-08-18'),
    vendor: 'IndiGo Airlines',
    description: 'On-site deployment visit to Delhi RDC.',
    status: 'Approved',
  },
  {
    id: 'exp-4',
    code: 'EXP-004',
    title: 'High-Speed Fiber Commercial Broadband',
    category: 'Utilities',
    amount: 18000,
    date: new Date('2024-08-10'),
    vendor: 'Tata Tele Services',
    description: 'Corporate office internet connection.',
    status: 'Approved',
  },
];

export const MOCK_ACCOUNTS: Account[] = [
  {
    id: 'acc-1',
    code: '1010',
    name: 'Petty Cash Operating Fund',
    type: 'Asset',
    balance: 420000, // ₹4.2L
  },
  {
    id: 'acc-2',
    code: '1020',
    name: 'HDFC Bank Operational Account',
    type: 'Asset',
    balance: 2850000, // ₹28.5L
  },
  {
    id: 'acc-3',
    code: '1100',
    name: 'Accounts Receivable (Trade Debtors)',
    type: 'Asset',
    balance: 1280000, // ₹12.8L
  },
  {
    id: 'acc-4',
    code: '4000',
    name: 'Sales & Service Revenue',
    type: 'Revenue',
    balance: 4250000, // ₹42.5L
  },
  {
    id: 'acc-5',
    code: '5000',
    name: 'Operating & Facility Expenses',
    type: 'Expense',
    balance: 840000, // ₹8.4L
  },
];
