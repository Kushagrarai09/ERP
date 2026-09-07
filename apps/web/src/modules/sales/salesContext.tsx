import React, { createContext, useContext, useState } from 'react';
import { Quotation, SalesOrder, QuotationStatus, OrderStatus, SalesItem } from '../../types/sales';
import { MOCK_QUOTATIONS, MOCK_ORDERS } from '../../mock-data/sales';
import { Deal } from '../../types/crm';

interface SalesContextType {
  quotations: Quotation[];
  orders: SalesOrder[];

  // Quotation CRUD & Actions
  addQuotation: (quotation: Omit<Quotation, 'id' | 'code' | 'createdAt'>) => Quotation;
  updateQuotation: (id: string, fields: Partial<Quotation>) => void;
  updateQuotationStatus: (id: string, status: QuotationStatus) => void;
  deleteQuotation: (id: string) => void;
  convertDealToQuotation: (deal: Deal) => Quotation;

  // Order CRUD & Actions
  addOrder: (order: Omit<SalesOrder, 'id' | 'code' | 'orderDate'>) => SalesOrder;
  updateOrder: (id: string, fields: Partial<SalesOrder>) => void;
  updateOrderStatus: (id: string, status: OrderStatus) => void;
  deleteOrder: (id: string) => void;
  convertQuotationToOrder: (quotation: Quotation) => SalesOrder;
}

const SalesContext = createContext<SalesContextType | undefined>(undefined);

export const SalesProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [quotations, setQuotations] = useState<Quotation[]>(MOCK_QUOTATIONS);
  const [orders, setOrders] = useState<SalesOrder[]>(MOCK_ORDERS);

  // --- QUOTATIONS ---
  const addQuotation = (qData: Omit<Quotation, 'id' | 'code' | 'createdAt'>): Quotation => {
    const codeNum = 125 + quotations.length;
    const newQuotation: Quotation = {
      ...qData,
      id: `qt-${Date.now()}`,
      code: `QT-00${codeNum}`,
      createdAt: new Date(),
    };
    setQuotations((prev) => [newQuotation, ...prev]);
    return newQuotation;
  };

  const updateQuotation = (id: string, fields: Partial<Quotation>) => {
    setQuotations((prev) =>
      prev.map((q) => (q.id === id ? { ...q, ...fields } : q))
    );
  };

  const updateQuotationStatus = (id: string, status: QuotationStatus) => {
    setQuotations((prev) =>
      prev.map((q) => (q.id === id ? { ...q, status } : q))
    );
  };

  const deleteQuotation = (id: string) => {
    setQuotations((prev) => prev.filter((q) => q.id !== id));
  };

  // Convert CRM Deal -> Quotation
  const convertDealToQuotation = (deal: Deal): Quotation => {
    const subtotal = deal.value;
    const tax = Math.round(subtotal * 0.18);
    const total = subtotal + tax;

    const defaultItem: SalesItem = {
      id: `item-${Date.now()}`,
      productName: deal.name,
      quantity: 1,
      unitPrice: subtotal,
      total: subtotal,
    };

    const newQuotation: Quotation = {
      id: `qt-${Date.now()}`,
      code: `QT-00${125 + quotations.length}`,
      customerName: deal.company,
      companyId: deal.companyId,
      dealId: deal.id,
      items: [defaultItem],
      subtotal,
      tax,
      total,
      currency: deal.currency || '₹',
      status: 'draft',
      validUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      createdAt: new Date(),
      owner: deal.owner,
      notes: `Generated automatically from CRM Deal: ${deal.name}`,
    };

    setQuotations((prev) => [newQuotation, ...prev]);
    return newQuotation;
  };

  // --- SALES ORDERS ---
  const addOrder = (oData: Omit<SalesOrder, 'id' | 'code' | 'orderDate'>): SalesOrder => {
    const codeNum = 125 + orders.length;
    const newOrder: SalesOrder = {
      ...oData,
      id: `so-${Date.now()}`,
      code: `SO-00${codeNum}`,
      orderDate: new Date(),
    };
    setOrders((prev) => [newOrder, ...prev]);
    return newOrder;
  };

  const updateOrder = (id: string, fields: Partial<SalesOrder>) => {
    setOrders((prev) =>
      prev.map((o) => (o.id === id ? { ...o, ...fields } : o))
    );
  };

  const updateOrderStatus = (id: string, status: OrderStatus) => {
    setOrders((prev) =>
      prev.map((o) => (o.id === id ? { ...o, status } : o))
    );
  };

  const deleteOrder = (id: string) => {
    setOrders((prev) => prev.filter((o) => o.id !== id));
  };

  // Convert Quotation -> Sales Order (preserves Deal linkage)
  const convertQuotationToOrder = (quotation: Quotation): SalesOrder => {
    const newOrder: SalesOrder = {
      id: `so-${Date.now()}`,
      code: `SO-00${125 + orders.length}`,
      customerName: quotation.customerName,
      companyId: quotation.companyId,
      dealId: quotation.dealId, // Preserve Deal linkage for traceability
      quotationId: quotation.id,
      quotationCode: quotation.code,
      items: quotation.items.map((it) => ({ ...it })),
      subtotal: quotation.subtotal,
      tax: quotation.tax,
      total: quotation.total,
      currency: quotation.currency || '₹',
      status: 'confirmed',
      orderDate: new Date(),
      expectedDeliveryDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000), // 14 days
      owner: quotation.owner,
      notes: `Converted from Quotation ${quotation.code}`,
    };

    // Update quotation status to accepted if not already
    updateQuotationStatus(quotation.id, 'accepted');

    setOrders((prev) => [newOrder, ...prev]);
    return newOrder;
  };

  return (
    <SalesContext.Provider
      value={{
        quotations,
        orders,
        addQuotation,
        updateQuotation,
        updateQuotationStatus,
        deleteQuotation,
        convertDealToQuotation,
        addOrder,
        updateOrder,
        updateOrderStatus,
        deleteOrder,
        convertQuotationToOrder,
      }}
    >
      {children}
    </SalesContext.Provider>
  );
};

export const useSales = () => {
  const context = useContext(SalesContext);
  if (!context) {
    throw new Error('useSales must be used within a SalesProvider');
  }
  return context;
};
