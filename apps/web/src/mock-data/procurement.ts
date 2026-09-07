// Procurement V1 Mock Data with Indian Supplier Records (₹ Currency)

import { Supplier, PurchaseOrder, GoodsReceipt } from '../types/procurement';

export const MOCK_SUPPLIERS: Supplier[] = [
  {
    id: 'sup-1',
    name: 'ABC Technologies Pvt Ltd',
    contactPerson: 'Sanjay Dutt',
    email: 'sales@abctech.co.in',
    phone: '+91-9820011223',
    category: 'Hardware & IT Equipment',
    status: 'active',
    totalPurchases: 1817200,
    createdAt: new Date('2024-01-05'),
  },
  {
    id: 'sup-2',
    name: 'Apex Electronics Supplier',
    contactPerson: 'Manish Malhotra',
    email: 'contact@apexelectronics.com',
    phone: '+91-9820011224',
    category: 'Sensors & IoT Hubs',
    status: 'active',
    totalPurchases: 650000,
    createdAt: new Date('2024-02-15'),
  },
  {
    id: 'sup-3',
    name: 'Karan Hardware Distributors',
    contactPerson: 'Karan Mehra',
    email: 'karan@karanhardware.in',
    phone: '+91-9820011225',
    category: 'Peripherals & Accessories',
    status: 'active',
    totalPurchases: 450000,
    createdAt: new Date('2024-03-20'),
  },
];

export const MOCK_PURCHASE_ORDERS: PurchaseOrder[] = [
  {
    id: 'po-1',
    code: 'PO-00125',
    supplierName: 'ABC Technologies Pvt Ltd',
    supplierId: 'sup-1',
    items: [
      { id: 'poi-1', productId: 'prod-1', productName: 'Laptop Pro 15"', quantity: 20, unitCost: 65000, total: 1300000 },
      { id: 'poi-2', productId: 'prod-2', productName: '4K Monitor 27"', quantity: 20, unitCost: 12000, total: 240000 },
    ],
    subtotal: 1540000,
    tax: 277200, // 18% GST
    total: 1817200,
    currency: '₹',
    status: 'approved',
    poDate: new Date('2024-08-25'),
    expectedDeliveryDate: new Date('2024-09-05'),
    owner: 'Rajesh Kumar',
    notes: 'Bulk stock procurement for Q3 fulfillment.',
  },
  {
    id: 'po-2',
    code: 'PO-00124',
    supplierName: 'Apex Electronics Supplier',
    supplierId: 'sup-2',
    items: [
      { id: 'poi-3', productId: 'prod-4', productName: 'IoT Gateway Hub', quantity: 5, unitCost: 130000, total: 650000 },
    ],
    subtotal: 650000,
    tax: 117000,
    total: 767000,
    currency: '₹',
    status: 'received',
    poDate: new Date('2024-08-15'),
    expectedDeliveryDate: new Date('2024-08-28'),
    owner: 'Sunil Sharma',
    notes: 'Received and added to Mumbai warehouse.',
  },
  {
    id: 'po-3',
    code: 'PO-00123',
    supplierName: 'Karan Hardware Distributors',
    supplierId: 'sup-3',
    items: [
      { id: 'poi-4', productId: 'prod-3', productName: 'Mechanical Keyboard RGB', quantity: 50, unitCost: 2800, total: 140000 },
    ],
    subtotal: 140000,
    tax: 25200,
    total: 165200,
    currency: '₹',
    status: 'sent',
    poDate: new Date('2024-08-28'),
    expectedDeliveryDate: new Date('2024-09-10'),
    owner: 'Rajesh Kumar',
  },
];

export const MOCK_GOODS_RECEIPTS: GoodsReceipt[] = [
  {
    id: 'gr-1',
    code: 'GR-00124',
    poCode: 'PO-00124',
    poId: 'po-2',
    supplierName: 'Apex Electronics Supplier',
    warehouseId: 'wh-1',
    warehouseName: 'Mumbai Central Logistics Hub',
    status: 'received',
    receivedDate: new Date('2024-08-28'),
    items: [
      { productName: 'IoT Gateway Hub', orderedQty: 5, receivedQty: 5 },
    ],
    receivedBy: 'Rajesh Kumar',
    notes: 'Inspected and verified 5 units in perfect condition.',
  },
];
