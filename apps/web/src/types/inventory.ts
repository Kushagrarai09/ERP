// Inventory V1 Type Definitions

export type ProductStatus = 'active' | 'discontinued';
export type StockMovementType = 'Purchase' | 'Sale' | 'Adjustment' | 'Transfer' | 'Return';

export interface Product {
  id: string;
  sku: string;
  name: string;
  category: string;
  unit: string; // e.g. Units, Sets, Boxes, Pcs
  sellingPrice: number;
  costPrice: number;
  stock: number;
  reorderLevel: number;
  status: ProductStatus;
  createdAt: Date;
}

export interface Warehouse {
  id: string;
  code: string;
  name: string;
  location: string;
  manager: string;
  phone: string;
  email: string;
}

export interface WarehouseStock {
  id: string;
  productId: string;
  productName: string;
  sku: string;
  warehouseId: string;
  warehouseName: string;
  available: number;
  reserved: number;
  total: number;
}

export interface StockMovement {
  id: string;
  date: Date;
  productId: string;
  productName: string;
  sku: string;
  warehouseId: string;
  warehouseName: string;
  type: StockMovementType;
  quantity: number; // positive for IN/Purchase/Return, negative for OUT/Sale
  referenceCode?: string; // e.g. SO-00124 or PO-9912
  notes?: string;
}

export interface StockAvailabilityCheck {
  productId: string;
  productName: string;
  requiredQty: number;
  availableQty: number;
  isAvailable: boolean;
  warehouseName: string;
}
