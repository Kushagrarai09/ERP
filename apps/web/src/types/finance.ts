// Finance V1 Type Definitions

export type InvoiceStatus = 'draft' | 'sent' | 'paid' | 'overdue';
export type PaymentMethod = 'Bank Transfer' | 'UPI' | 'Card' | 'Cash';
export type ExpenseCategory = 'Office' | 'Travel' | 'Software' | 'Equipment' | 'Utilities' | 'Other';
export type AccountType = 'Asset' | 'Liability' | 'Revenue' | 'Expense';

export interface InvoiceItem {
  id: string;
  description: string;
  quantity: number;
  unitPrice: number;
  total: number;
}

export interface Invoice {
  id: string;
  code: string; // e.g. INV-00124
  customerName: string;
  companyId?: string;
  salesOrderId?: string; // Link to SalesOrder in Sales module
  salesOrderCode?: string;
  items: InvoiceItem[];
  subtotal: number;
  tax: number; // 18% GST
  total: number;
  paidAmount: number;
  outstandingAmount: number;
  currency: string;
  status: InvoiceStatus;
  issueDate: Date;
  dueDate: Date;
  notes?: string;
}

export interface PaymentRecord {
  id: string;
  code: string; // e.g. PAY-00124
  invoiceCode: string;
  invoiceId: string;
  customerName: string;
  amount: number;
  method: PaymentMethod;
  paymentDate: Date;
  status: 'Success' | 'Pending';
  referenceNumber?: string;
}

export interface Expense {
  id: string;
  code: string;
  title: string;
  category: ExpenseCategory;
  amount: number;
  date: Date;
  vendor: string;
  description?: string;
  status: 'Approved' | 'Pending';
}

export interface Account {
  id: string;
  name: string;
  type: AccountType;
  balance: number;
  code: string;
}
