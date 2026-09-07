import React, { createContext, useContext, useState } from 'react';
import {
  Invoice,
  PaymentRecord,
  Expense,
  Account,
  InvoiceStatus,
  PaymentMethod,
  InvoiceItem,
} from '../../types/finance';
import {
  MOCK_INVOICES,
  MOCK_PAYMENTS,
  MOCK_EXPENSES,
  MOCK_ACCOUNTS,
} from '../../mock-data/finance';
import { SalesOrder } from '../../types/sales';

interface FinanceContextType {
  invoices: Invoice[];
  payments: PaymentRecord[];
  expenses: Expense[];
  accounts: Account[];

  // Invoice CRUD & Actions
  addInvoice: (invoice: Omit<Invoice, 'id' | 'code' | 'issueDate' | 'paidAmount' | 'outstandingAmount'>) => Invoice;
  updateInvoice: (id: string, fields: Partial<Invoice>) => void;
  updateInvoiceStatus: (id: string, status: InvoiceStatus) => void;
  deleteInvoice: (id: string) => void;
  convertOrderToInvoice: (order: SalesOrder) => Invoice;

  // Payment Recording
  recordPayment: (
    invoiceCode: string,
    amount: number,
    method: PaymentMethod,
    referenceNumber?: string
  ) => PaymentRecord | null;

  // Expense CRUD
  addExpense: (expense: Omit<Expense, 'id' | 'code' | 'date'>) => Expense;
  updateExpense: (id: string, fields: Partial<Expense>) => void;
  deleteExpense: (id: string) => void;
}

const FinanceContext = createContext<FinanceContextType | undefined>(undefined);

export const FinanceProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [invoices, setInvoices] = useState<Invoice[]>(MOCK_INVOICES);
  const [payments, setPayments] = useState<PaymentRecord[]>(MOCK_PAYMENTS);
  const [expenses, setExpenses] = useState<Expense[]>(MOCK_EXPENSES);
  const [accounts, setAccounts] = useState<Account[]>(MOCK_ACCOUNTS);

  // --- INVOICES ---
  const addInvoice = (iData: Omit<Invoice, 'id' | 'code' | 'issueDate' | 'paidAmount' | 'outstandingAmount'>): Invoice => {
    const codeNum = 125 + invoices.length;
    const newInv: Invoice = {
      ...iData,
      id: `inv-${Date.now()}`,
      code: `INV-00${codeNum}`,
      paidAmount: 0,
      outstandingAmount: iData.total,
      issueDate: new Date(),
      dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    };
    setInvoices((prev) => [newInv, ...prev]);

    // Update Accounts Receivable
    setAccounts((prev) =>
      prev.map((acc) => (acc.code === '1100' ? { ...acc, balance: acc.balance + newInv.total } : acc))
    );

    return newInv;
  };

  const updateInvoice = (id: string, fields: Partial<Invoice>) => {
    setInvoices((prev) =>
      prev.map((inv) => (inv.id === id ? { ...inv, ...fields } : inv))
    );
  };

  const updateInvoiceStatus = (id: string, status: InvoiceStatus) => {
    setInvoices((prev) =>
      prev.map((inv) => (inv.id === id ? { ...inv, status } : inv))
    );
  };

  const deleteInvoice = (id: string) => {
    setInvoices((prev) => prev.filter((inv) => inv.id !== id));
  };

  // Convert Sales Order -> Invoice
  const convertOrderToInvoice = (order: SalesOrder): Invoice => {
    const invoiceItems: InvoiceItem[] = order.items.map((it, idx) => ({
      id: `ii-${idx}`,
      description: it.productName,
      quantity: it.quantity,
      unitPrice: it.unitPrice,
      total: it.total,
    }));

    const newInvoice: Invoice = {
      id: `inv-${Date.now()}`,
      code: `INV-00${125 + invoices.length}`,
      customerName: order.customerName,
      companyId: order.companyId,
      salesOrderId: order.id, // Link to SalesOrder for traceability
      salesOrderCode: order.code,
      items: invoiceItems,
      subtotal: order.subtotal,
      tax: order.tax,
      total: order.total,
      paidAmount: 0,
      outstandingAmount: order.total,
      currency: order.currency || '₹',
      status: 'sent',
      issueDate: new Date(),
      dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      notes: `Generated automatically from Sales Order ${order.code}`,
    };

    setInvoices((prev) => [newInvoice, ...prev]);

    // Update Receivables & Revenue accounts
    setAccounts((prev) =>
      prev.map((acc) => {
        if (acc.code === '1100') return { ...acc, balance: acc.balance + newInvoice.total };
        if (acc.code === '4000') return { ...acc, balance: acc.balance + newInvoice.subtotal };
        return acc;
      })
    );

    return newInvoice;
  };

  // --- RECORD PAYMENT ---
  const recordPayment = (
    invoiceCode: string,
    amount: number,
    method: PaymentMethod,
    referenceNumber?: string
  ): PaymentRecord | null => {
    const targetInvoice = invoices.find((i) => i.code.toLowerCase() === invoiceCode.toLowerCase());
    if (!targetInvoice) return null;

    const newPayment: PaymentRecord = {
      id: `pay-${Date.now()}`,
      code: `PAY-00${125 + payments.length}`,
      invoiceCode: targetInvoice.code,
      invoiceId: targetInvoice.id,
      customerName: targetInvoice.customerName,
      amount,
      method,
      paymentDate: new Date(),
      status: 'Success',
      referenceNumber: referenceNumber || `${method.toUpperCase()}-${Date.now().toString().slice(-6)}`,
    };

    setPayments((prev) => [newPayment, ...prev]);

    // Update Invoice Paid & Outstanding balances
    const newPaidAmount = targetInvoice.paidAmount + amount;
    const newOutstanding = Math.max(0, targetInvoice.total - newPaidAmount);
    const newStatus: InvoiceStatus = newOutstanding === 0 ? 'paid' : targetInvoice.status;

    updateInvoice(targetInvoice.id, {
      paidAmount: newPaidAmount,
      outstandingAmount: newOutstanding,
      status: newStatus,
    });

    // Update Bank & Accounts Receivable balances
    setAccounts((prev) =>
      prev.map((acc) => {
        if (acc.code === '1020') return { ...acc, balance: acc.balance + amount };
        if (acc.code === '1100') return { ...acc, balance: Math.max(0, acc.balance - amount) };
        return acc;
      })
    );

    return newPayment;
  };

  // --- EXPENSES ---
  const addExpense = (eData: Omit<Expense, 'id' | 'code' | 'date'>): Expense => {
    const newExpense: Expense = {
      ...eData,
      id: `exp-${Date.now()}`,
      code: `EXP-00${expenses.length + 1}`,
      date: new Date(),
    };
    setExpenses((prev) => [newExpense, ...prev]);

    // Update Operating Expenses account
    setAccounts((prev) =>
      prev.map((acc) => (acc.code === '5000' ? { ...acc, balance: acc.balance + eData.amount } : acc))
    );

    return newExpense;
  };

  const updateExpense = (id: string, fields: Partial<Expense>) => {
    setExpenses((prev) =>
      prev.map((e) => (e.id === id ? { ...e, ...fields } : e))
    );
  };

  const deleteExpense = (id: string) => {
    setExpenses((prev) => prev.filter((e) => e.id !== id));
  };

  return (
    <FinanceContext.Provider
      value={{
        invoices,
        payments,
        expenses,
        accounts,
        addInvoice,
        updateInvoice,
        updateInvoiceStatus,
        deleteInvoice,
        convertOrderToInvoice,
        recordPayment,
        addExpense,
        updateExpense,
        deleteExpense,
      }}
    >
      {children}
    </FinanceContext.Provider>
  );
};

export const useFinance = () => {
  const context = useContext(FinanceContext);
  if (!context) {
    throw new Error('useFinance must be used within a FinanceProvider');
  }
  return context;
};
