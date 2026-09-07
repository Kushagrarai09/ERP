import React, { createContext, useContext, useState } from 'react';
import { Supplier, PurchaseOrder, GoodsReceipt, POStatus, GoodsReceiptItem } from '../../types/procurement';
import { MOCK_SUPPLIERS, MOCK_PURCHASE_ORDERS, MOCK_GOODS_RECEIPTS } from '../../mock-data/procurement';

interface ProcurementContextType {
  suppliers: Supplier[];
  purchaseOrders: PurchaseOrder[];
  goodsReceipts: GoodsReceipt[];

  // Supplier CRUD
  addSupplier: (supplier: Omit<Supplier, 'id' | 'createdAt' | 'totalPurchases'>) => Supplier;
  updateSupplier: (id: string, fields: Partial<Supplier>) => void;
  deleteSupplier: (id: string) => void;

  // PO CRUD & Actions
  addPO: (po: Omit<PurchaseOrder, 'id' | 'code' | 'poDate'>) => PurchaseOrder;
  updatePO: (id: string, fields: Partial<PurchaseOrder>) => void;
  updatePOStatus: (id: string, status: POStatus) => void;
  deletePO: (id: string) => void;

  // Receiving Goods Workflow Handler
  receiveGoods: (
    po: PurchaseOrder,
    warehouseId: string,
    warehouseName: string,
    receivedItems: GoodsReceiptItem[],
    recordStockMovement: (movement: any) => void
  ) => GoodsReceipt;
}

const ProcurementContext = createContext<ProcurementContextType | undefined>(undefined);

export const ProcurementProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [suppliers, setSuppliers] = useState<Supplier[]>(MOCK_SUPPLIERS);
  const [purchaseOrders, setPurchaseOrders] = useState<PurchaseOrder[]>(MOCK_PURCHASE_ORDERS);
  const [goodsReceipts, setGoodsReceipts] = useState<GoodsReceipt[]>(MOCK_GOODS_RECEIPTS);

  // --- SUPPLIERS ---
  const addSupplier = (sData: Omit<Supplier, 'id' | 'createdAt' | 'totalPurchases'>): Supplier => {
    const newSupplier: Supplier = {
      ...sData,
      id: `sup-${Date.now()}`,
      totalPurchases: 0,
      createdAt: new Date(),
    };
    setSuppliers((prev) => [newSupplier, ...prev]);
    return newSupplier;
  };

  const updateSupplier = (id: string, fields: Partial<Supplier>) => {
    setSuppliers((prev) =>
      prev.map((s) => (s.id === id ? { ...s, ...fields } : s))
    );
  };

  const deleteSupplier = (id: string) => {
    setSuppliers((prev) => prev.filter((s) => s.id !== id));
  };

  // --- PURCHASE ORDERS ---
  const addPO = (poData: Omit<PurchaseOrder, 'id' | 'code' | 'poDate'>): PurchaseOrder => {
    const codeNum = 126 + purchaseOrders.length;
    const newPO: PurchaseOrder = {
      ...poData,
      id: `po-${Date.now()}`,
      code: `PO-00${codeNum}`,
      poDate: new Date(),
    };
    setPurchaseOrders((prev) => [newPO, ...prev]);
    return newPO;
  };

  const updatePO = (id: string, fields: Partial<PurchaseOrder>) => {
    setPurchaseOrders((prev) =>
      prev.map((po) => (po.id === id ? { ...po, ...fields } : po))
    );
  };

  const updatePOStatus = (id: string, status: POStatus) => {
    setPurchaseOrders((prev) =>
      prev.map((po) => (po.id === id ? { ...po, status } : po))
    );
  };

  const deletePO = (id: string) => {
    setPurchaseOrders((prev) => prev.filter((po) => po.id !== id));
  };

  // --- RECEIVE GOODS WORKFLOW ---
  const receiveGoods = (
    po: PurchaseOrder,
    warehouseId: string,
    warehouseName: string,
    receivedItems: GoodsReceiptItem[],
    recordStockMovement: (movement: any) => void
  ): GoodsReceipt => {
    const grCode = `GR-00${125 + goodsReceipts.length}`;

    const newGR: GoodsReceipt = {
      id: `gr-${Date.now()}`,
      code: grCode,
      poCode: po.code,
      poId: po.id,
      supplierName: po.supplierName,
      warehouseId,
      warehouseName,
      status: 'received', // Initial status
      receivedDate: new Date(),
      items: receivedItems,
      receivedBy: po.owner,
      notes: `Received items against ${po.code} from ${po.supplierName}`,
    };

    setGoodsReceipts((prev) => [newGR, ...prev]);

    // 1. Update PO Status to 'received'
    updatePOStatus(po.id, 'received');

    // 2. Trigger Inventory Stock Movement for each received item (+IN)
    receivedItems.forEach((item) => {
      const poItem = po.items.find((i) => i.productName.toLowerCase() === item.productName.toLowerCase());
      const prodId = poItem?.productId || `prod-1`;

      recordStockMovement({
        productId: prodId,
        productName: item.productName,
        sku: 'SKU-RCV',
        warehouseId,
        warehouseName,
        type: 'Purchase',
        quantity: item.receivedQty, // Positive for IN
        referenceCode: grCode,
        notes: `Received via Goods Receipt ${grCode} against ${po.code}`,
      });
    });

    return newGR;
  };

  return (
    <ProcurementContext.Provider
      value={{
        suppliers,
        purchaseOrders,
        goodsReceipts,
        addSupplier,
        updateSupplier,
        deleteSupplier,
        addPO,
        updatePO,
        updatePOStatus,
        deletePO,
        receiveGoods,
      }}
    >
      {children}
    </ProcurementContext.Provider>
  );
};

export const useProcurement = () => {
  const context = useContext(ProcurementContext);
  if (!context) {
    throw new Error('useProcurement must be used within a ProcurementProvider');
  }
  return context;
};
