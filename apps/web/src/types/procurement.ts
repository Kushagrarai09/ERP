// Procurement V1 Type Definitions

export type POStatus = 'draft' | 'sent' | 'approved' | 'received';

export interface Supplier {
  id: string;
  name: string;
  contactPerson: string;
  email: string;
  phone: string;
  category: string;
  status: 'active' | 'inactive';
  totalPurchases: number;
  createdAt: Date;
}

export interface POItem {
  id: string;
  productId: string;
  productName: string;
  quantity: number;
  unitCost: number;
  total: number;
}

export interface PurchaseOrder {
  id: string;
  code: string; // e.g. PO-00125
  supplierName: string;
  supplierId: string;
  items: POItem[];
  subtotal: number;
  tax: number; // 18% GST
  total: number;
  currency: string;
  status: POStatus;
  poDate: Date;
  expectedDeliveryDate?: Date;
  owner: string;
  notes?: string;
}

export interface GoodsReceiptItem {
  productName: string;
  orderedQty: number;
  receivedQty: number;
}

export type GRStatus = 'draft' | 'received' | 'verified';

export interface GoodsReceipt {
  id: string;
  code: string; // e.g. GR-00125
  poCode: string;
  poId: string;
  supplierName: string;
  warehouseId: string;
  warehouseName: string;
  status: GRStatus; // Track GR status
  receivedDate: Date;
  items: GoodsReceiptItem[];
  receivedBy: string;
  notes?: string;
}
