// Sales V1 Type Definitions

export type QuotationStatus = 'draft' | 'sent' | 'accepted' | 'rejected';
export type OrderStatus = 'pending' | 'confirmed' | 'processing' | 'completed';

export interface SalesItem {
  id: string;
  productId?: string; // Link to Product in Inventory
  productName: string;
  quantity: number;
  unitPrice: number;
  total: number;
}

export interface Quotation {
  id: string;
  code: string; // e.g. QT-00124
  customerName: string;
  companyId?: string;
  contactId?: string; // Link to Contact in CRM
  contactName?: string;
  dealId?: string; // Link to Deal in CRM
  items: SalesItem[];
  subtotal: number;
  tax: number; // 18% GST
  total: number;
  currency: string;
  status: QuotationStatus;
  validUntil: Date;
  createdAt: Date;
  owner: string;
  notes?: string;
}

export interface SalesOrder {
  id: string;
  code: string; // e.g. SO-00124
  customerName: string;
  companyId?: string;
  dealId?: string; // Link to Deal in CRM for traceability
  quotationId?: string;
  quotationCode?: string;
  items: SalesItem[];
  subtotal: number;
  tax: number;
  total: number;
  currency: string;
  status: OrderStatus;
  orderDate: Date;
  expectedDeliveryDate?: Date;
  owner: string;
  notes?: string;
}

export interface SalesCustomerView {
  id: string;
  name: string;
  contactPerson: string;
  email: string;
  phone: string;
  industry: string;
  status: 'active' | 'inactive';
  dealsCount: number;
  ordersCount: number;
  totalSpent: number;
  owner: string;
}
